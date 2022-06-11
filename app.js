const express = require("express");
const path = require("path");
const http = require("http");

require("./db/mongoConnect")
const indexR = require("./routes/index");
const employeesR = require("./routes/employees");
const usersR = require("./routes/users");
const foodsR = require("./routes/foods");

const app = express();
// דואג שכל מידע משתקבל או יוצא בברירת מחדל יהיה בפורמט ג'ייסון
app.use(express.json());
// להגדיר את תקיית פאבליק כתקייה של צד לקוח בשביל שנוכל לשים שם תמונות, ודברים של צד לקוח
app.use(express.static(path.join(__dirname,"public")));

// שניתן לבצע בקשה מדפדפן מכל דומיין ולא דווקא הדומיין של השרת שלנו
app.all('*', function (req, res, next) {
  if (!req.get('Origin')) return next();
  // * - הרשאה לכל הדומיינים לעשות בקשה
  res.set('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-api-key');
  next();
});


app.use("/",indexR);
app.use("/employees", employeesR);

app.use("/foods",foodsR);


// מייצר סרבר שמשתמש באפ של האקספרס
const server = http.createServer(app);
let port = process.env.PORT || "3011";
// מאזין או לפורט של השרת שאנחנו נמצאים בו או 3000
server.listen(port);
