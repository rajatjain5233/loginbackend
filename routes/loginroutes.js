var mysql      = require('mysql');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'user'
});
connection.connect(
  function(err){
      if(!err) {
          console.log("Database is connected ... nn");
      }else {
          console.log("Error connecting database ... nn",err);
      }
});
exports.register = async function(req,res){
  console.log("req",req.body.password);
  console.log("req",req.body.email);
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)  
  var users={
     "email":req.body.email,
     "password":encryptedPassword
   }
  
  connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
    if (error) {
      // console.log("error",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    } else {
      // console.log("registered sucessfully",results,fields);
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
      }
  });
}

exports.login = async function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE email = ?',[email], async function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        const comparision = await bcrypt.compare(password, results[0].password)
        if(comparision){
            res.send({
              "code":200,
              "success":"login sucessfull"
            })
        }
        else{
          res.send({
               "code":204,
               "success":"Email and password does not match"
          })
        }
      }
      else{
        res.send({
          "code":206,
          "success":"Email does not exits"
            });
      }
    }
    });
}