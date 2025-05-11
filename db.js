const mongoose = require('mongoose');   
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: { type: Schema.Types.ObjectId, ref: 'admin' }
});

const purchaseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    courseId: { type: Schema.Types.ObjectId, ref: 'course' }
});

const userModel = model('user', userSchema);
const courseModel = model('course', courseSchema);
const adminModel = model('admin', adminSchema);
const purchaseModel = model('purchase', purchaseSchema);

module.exports = {
    userModel,
    courseModel,
    adminModel,
    purchaseModel
};
