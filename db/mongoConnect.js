// db connect
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/idf',{useNewUrlParser: true , useUnifiedTopology: true });
  console.log("mongo connected idf")
}