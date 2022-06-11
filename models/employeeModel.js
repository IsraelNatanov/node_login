const mongoose = require('mongoose');
const Joi = require("joi");

// בשביל בקשות  הוספת ועריכה, חובה לכתוב
// איזה מאפיינים הקולקשן יכול לקבל ומאיזה טיפוס
let employeeSchema = new mongoose.Schema({
  name:String,
  company:String,
  position:String,
  comment:String,
  img:String,
  salary:Number,
  date_created:{
    type:Date,  default:Date.now()
  },
  user_id:String
})

// מייצר את המודל שמורכב משם הקולקשן ושם הסכמה 
exports.EmployeeModel = mongoose.model("employees",employeeSchema)

// ולדזציה למידע שמגיע מהצד לקוח שהוא תקין
// כולל פירוט על אורך תווים ועוד...
exports.validateEmployee = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    company:Joi.string().min(2).max(99).required(),
    position:Joi.string().min(2).max(99).required(),
    comment:Joi.string().min(1).max(500).allow(null,""),
    // allow - מאפשר שליחת מידע של סטרינג ריק
    img:Joi.string().min(2).max(200).allow(null,""),
    salary:Joi.number().min(1).max(999999).required(),
  })
  return joiSchema.validate(_reqBody);
}