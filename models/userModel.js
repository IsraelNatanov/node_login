const mongoose = require('mongoose');
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// role - נכניס ידנית ברואט
// date_Creaded- המסד נתונים מייצר לבד עם התאריך של השרת
let userSchema = new mongoose.Schema({
  email:String,
  password:String,
  name:String,
  role:String,
  date_created:{
    type:Date,  default:Date.now()
  }
})

exports.UserModel = mongoose.model("users",userSchema);

// פונקציה שמייצרת טוקן שמכיל בתוכו 
// את איי די של המשתמש ורול שלו 
// מילה סודית כדי לאבטח את הטוקן שלא כל אחד יוכל לייצר אותו
// ואת התוקף של הטוקן מהרגע שהוא נוצר
exports.genToken = (user_id,role) => {
  let token = jwt.sign({_id:user_id,role:role},"MonkeysSecret", {expiresIn:"60mins"});
  return token;
}

exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    email:Joi.string().max(999).email().required(),
    password:Joi.string().min(3).max(999).required(),
    name:Joi.string().min(2).max(999).required()
  })
  return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email:Joi.string().max(999).email().required(),
    password:Joi.string().min(3).max(999).required(),
  })
  return joiSchema.validate(_reqBody);
}
