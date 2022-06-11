const express = require("express");
// יודע להצפין סיסמאות
const bcrypt = require("bcrypt");

const { validateUser, UserModel, validateLogin, genToken } = require("../models/userModel");
const {auth} = require("../middlewares/auth")

const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"Users work"});
})



// auth - פונקציית מידל וואר לראוטר שקודם עובר דרכה
router.get("/userInfo", auth , async(req,res) => {
  // res.json({msg:"token is good 33333"})
  // req.tokenData -> מאפיין שיצרנו בפונקציית מידל וואר
  let user = await UserModel.findOne({_id:req.tokenData._id},{password:0})
  res.json(user)
})

router.post("/",async(req,res) => {
  // לבדוק וולדזציה למידע שמגיע מהבאדי
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try{
      // להכין את השמירת מידע
      let user = new UserModel(req.body);
      // להצפין את הסיסמא
      user.password = await bcrypt.hash(user.password, 10);
      
      
  // ולהגדיר את הרול כיוזר רגיל
    user.role = "user";
  // לשמור את הרשומה
      await user.save();
      // מסתיר מהצד לקוח איך הסיסמא הוצפנה
      user.password = "******";
  // להחזיר מידע לצד לקוח
    res.status(201).json(user)
  }
  catch(err){
    if(err.code == 11000){
      // שגיאה אם המייל כבר קיים במסד נתונים
      return res.status(400).json({msg:"Email already in system",code:11000})
    }
    console.log(err);
    res.status(500).json({msg:"There is problem, try again later",err})
  }
 
})


router.post("/login",async(req,res) => { 
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    // בדיקה אם האימייל קיים בכלל בקולקשן
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      // 401 - שגיאת אבטחה
      return res.status(401).json({msg:"Email/user not found"});
    }
    // אם הסיסמא שנשלחה מהבאדי תואמת לסיסמא המוצפנת בקולקשן
    let validPassword = await bcrypt.compare(req.body.password, user.password)
    
    

    if(!validPassword){
      // 401 - שגיאת אבטחה
      return res.status(401).json({msg:"Password worng"});
    }
    // נדווח שהכל בסדר בהמשך נשלח טוקן
    let newToken = genToken(user._id,user.role)
    res.json({token:newToken})
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"There is problem, try again later"})
  }

});

module.exports = router;