const Router = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel, courseModel, purchaseModel } = require("../db");
const usermiddleware = require("../middlewares/user.js");
const userRouter = Router();

userRouter.post("/signup", function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  const requiredSchema = z.object({
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

  const result = requiredSchema.safeParse({
    email,
    password,
    firstName,
    lastName,
  });

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  bcrypt.genSalt(4, function (err, salt) {
    if (err) throw err;
    bcrypt.hash(password, salt, function (err, hashpassword) {
      if (err) throw err;
      const newUser = new userModel({
        email,
        password: hashpassword,
        firstName,
        lastName,
      });
      newUser
        .save()
        .then(() => {
          res.json({
            message: "Registration Successful",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "Not Successful",
          });
        });
    });
  });
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_USER_SECRET);

  res.json({
    message: "Login successful",
    token,
  });
});

userRouter.get("/purchases", usermiddleware, async function (req, res) {
  const userId = req.userId;
  const purchases = await purchaseModel.find({ userId: userId });
  const allcourse = await courseModel.find({
    _id: purchases.map((x) => x.courseId),
  });
  if (newuser) {
    res.json({
      allcourse,
    });
  } else {
    res.json({
      message: "not done",
    });
  }
});

module.exports = userRouter;
