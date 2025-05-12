const { Router } = require("express");
const adminmiddleware = require("../middlewares/admin");
const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const schema = z.object({
    email: z.string().min(14).max(32).email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^a-zA-Z0-9]/),
    firstName: z.string().min(3),
    lastName: z.string().min(3),
  });

  const result = schema.safeParse({ email, password, firstName, lastName });

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  bcrypt.genSalt(4, (err, salt) => {
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      const newAdmin = new adminModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      newAdmin
        .save()
        .then(() => res.json({ message: "Registration successful" }))
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Registration failed" });
        });
    });
  });
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_ADMIN_SECRET);

  res.json({ message: "Login successful", token });
});

adminRouter.get("/course/bulk", adminmiddleware,async (req, res) => {
    const adminId = req.adminId;
    const allcourse = await courseModel.find({creatorId : adminId});
    res.json({
      course:allcourse
    });
});

adminRouter.put("/course", adminmiddleware, async (req, res) => {
  const { title, description, price, imageUrl, courseId } = req.body;
  const adminId = req.adminId;

  try {
    const result = await courseModel.updateOne(
      { _id: courseId, creatorId: adminId },
      { title, description, price, imageUrl }
    );
    res.json({
      result:result
    })
  } catch (err) {
    res.status(500).json({ message: "Error updating course" });
  }
});

adminRouter.post("/course", adminmiddleware, (req, res) => {
  const { title, description, price, imageUrl } = req.body;
  const adminId = req.adminId;

  const newCourse = new courseModel({
    title,
    description,
    price,
    imageUrl,
    creatorId: adminId,
  });

  newCourse.save().then(() => {
      res.json({
        message: "Course created",
        courseId: newCourse._id,
      });
    }).catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to create course" });
    });
});

module.exports = adminRouter;
