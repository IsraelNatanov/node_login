const express = require("express");
const { EmployeeModel, validateEmployee } = require("../models/employeeModel");
const router = express.Router();
const {auth} = require("../middlewares/auth");

router.get("/", async (req, res) => {
  // SELECT * FROM employee
  // ?perpage
  let perPage = Number(req.query.perPage) || 5;
  let page = req.query.page || 1;
  try{
    let data = await EmployeeModel
    .find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    // 1 = ASC , -1 = DESC
    .sort({_id:-1})
    res.json(data);

  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"There is problem, try again later"})
  }
 
})

router.post("/", auth, async (req, res) => {
  // בדיקה שהמידע שמגיע מצד לקוח בבאדי
  // תקין אם לא נחזיר שגיאה
  let validBody = validateEmployee(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // שמירה בקלוקשן את הרשומה החדשה שנשלחה
    let item = new EmployeeModel(req.body);
    // מוסיף מאפיין של האיי די של היוזר
    // שהוסיף את המשתמש
    // ורק יוזר עם טוקן יוכל להוסיף
    // האיי די מגיע מהטוקן
    item.user_id = req.tokenData._id;
    await item.save();
    // יחזיר את כל המאפיינים פלוס
    // מאפיין איי די שנוצר לו בקולקשן
    // ו __V
    res.status(201).json(item);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"There is problem, try again later"})
  }
})

// edit
router.put("/:id", async(req,res) => {
  let validBody = validateEmployee(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let data = await EmployeeModel.updateOne({_id:req.params.id}, req.body);
    // modfiedCount:1 - אם נקבל את המאפיין זה אומר שהצלחנו
    // nModified : 1
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"There is problem, try again later"})
  }
})

// delete
router.delete("/:id", async(req,res) => {
  try {
    let data = await EmployeeModel.deleteOne({_id:req.params.id});
    // deletedCount:1 אם הצליח
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"There is problem, try again later"})
  }
})

module.exports = router;