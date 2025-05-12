const Router = require('express');
const usermiddleware = require('../middlewares/user');
const { courseModel, purchaseModel } = require('../db');
const courseRouter = Router();

courseRouter.get('/preview'  ,  async function(req , res){
    const courses = await  courseModel.find({});
    res.json({
        message:"done",
        courses:courses
    });
});

courseRouter.post('/purchase' ,usermiddleware, async function(req , res){
    const userId = req.userId;
    const courseId = req.body.courseId;
    await purchaseModel.create({
        userId , courseId
    });
    res.json({
        message:"created"
    });
});

module.exports = courseRouter;