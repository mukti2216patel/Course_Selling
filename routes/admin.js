const { Router } = require("express");
const adminmiddleware = require("../middlewares/admin");
const adminRouter = Router();
const { adminModel } = require("../db");
adminRouter.post("/signup", function (req, res) {
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
      const newAdmin = new adminModel({
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
adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_ADMIN_SECRET);

  res.json({
    message: "Login successful",
    token,
  });
});
adminRouter.get("/course/bulk", adminmiddleware, function (req, res) {

});
adminRouter.put("/course", adminmiddleware, function (req, res) {
  res.json({
    message: "done",
  });
});
adminRouter.post("/course", adminmiddleware, function (req, res) {
  res.json({
    message: "done",
  });
});
module.exports = adminRouter;
