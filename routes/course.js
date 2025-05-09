const Router = require('express');
const courseRouter = Router();

courseRouter.get('/preview' , function(req , res){
    res.json({
        message:"done"
    });
});

courseRouter.post('/purchase' , function(req , res){
    res.json({
        message:"done"
    });
});

module.exports = courseRouter;