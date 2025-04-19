const express = require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/posts.js")
const session = require("express-session");
const flash = require("connect-flash")
const path = require("path");


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));


const sessionOptions = {
  secret:"mysupersecretstriung",
  resave:false,
  saveUninitialized:true
}


app.use(
  session(sessionOptions)
);
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="Anonymous"}=req.query
    req.session.name=name;
    console.log(req.session)
    req.flash("msg","user registerd successfully");
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>
{
  res.render("public.ejs",{name:req.session.name,msg:req.flash("msg")})
})


// app.get("/reqcount",(req,res)=>{
//     if( req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You Sent A Req ${req.session.count} times`)
    
// })

// app.get("/test",(req,res)=>{
//     res.send("test successful")
// })

// const cookieParser = require("cookie-parser")

// app.use(cookieParser());

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greek","hello")
//     res.send("send you some cookies!");
// })

app.get("/test",(req,res)=>{
    console.log(req.cookies)
   res.send("Hi i  am root and test successful")
})

// app.use("/users",users)
// app.use("/posts",posts)

app.listen(3000, () => {
  console.log(`Server is Listing on ${3000}`);
});


// app.get(" ",(req,res)=>{console.log("akshay subhash ghule")})

// const express = require("express");
// const session = require("express-session");

// const app = express();

// // Session middleware
// app.use(
//   session({
//     secret: "mysupersecretstriung",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // Test route
// app.get("/test", (req, res) => {
//   console.log(req.cookies); // Note: This will be undefined unless cookie-parser is used
//   res.send("Hi I am root and test successful");
// });

// // Root route (fixed from app.get(" ") to app.get("/"))
// app.get("/", (req, res) => {
//   console.log("Akshay Subhash Ghule");
//   res.send("Welcome to the homepage!");
// });

// // Start server
// app.listen(3000, () => {
//   console.log(`Server is listening on port 3000`);
// });
