require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const app =express();

app.use(express.urlencoded({extended:true}))
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(express.json())
app.use(session({
    secret:"keep",
    resave:false,
    saveUninitialized:false
}));
app.use(cookieParser("keep"));

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({usernameField:"userName"},
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }  
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw err;
      if (result === true) {
        return done(null, user);
      } else {
        return done(null, false,{ message: 'Incorrect password.' });
      }
    });
  });
  }
));

mongoose.connect("mongodb+srv://admin-sharguru:Test123@cluster0.k14wv.mongodb.net/keeper_app?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true})

const userSchema = mongoose.Schema({
  userName: String,
    password: String,
    notes: Array
})


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);



const User = new mongoose.model("User", userSchema);


// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


const Note = mongoose.model("Notes",{
    title:String,
    content: String
})



    
//////////////////////////////////            MAIN ROUTE         ////////////////////////////////////
app.get("/home/:userId",(req,res)=>{
    User.find({_id:req.params.userId},(err,foundlist)=>{
        res.send(foundlist)
    })
})


app.post("/home/:userId", (req,res)=>{
  const newNote = new Note(req.body)
  console.log("req:" , newNote);
   User.updateOne({_id: req.params.userId},{ $push: { notes:  newNote} }, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Added with:", docs);
    }
});
})


app.delete("/home/:userId/:noteId",(req,res)=>{
   const {userId, noteId } = req.params 
   console.log({userId , noteId});

  User.findById(userId, (err,docs)=>{
    if(err) throw err;
    if (docs) {
      var deletedNotesArray = docs.notes.filter(doc => doc._id != noteId)
      User.updateOne({_id :userId},{$set : {notes:deletedNotesArray}},(err,success)=> {
      err ? console.log("Delete err:",err) : console.log("deleted with: ", success)
      })
    
    }
    res.send(`Deleted ${noteId}`)
  })
})
///////////////////////////////           LOGIN ROUTE         ////////////////

app.post("/loginUser",(req,res,next) => {
  console.log("login route");
  const user =new User({
    userName:req.body.userName,
    password:req.body.password
  })
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send(info);
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send({user:req.user,message: "Successfully Authenticated"});
        console.log("logged user",);
      });
    }
  })(req, res, next);
});


///////////////////////////////           SIGNIN ROUTE         ////////////////

app.post("/signin",(req,res)=>{
  User.findOne({username : req.body.userName},async(err,docs)=>{
    if (err) throw err
    if(docs) {
      res.send({message:"User Already Exists"})
    }
    if(!docs){
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.userName,
        password: encryptedPassword,
      });
      await newUser.save();
     
      res.send( {message:"User Created"});
        
      }
      
    })
  })
  //////////////////////logout //////////////////////////
  app.get('/logout', function(req, res){
    req.logout()
    res.send("Successfull Logout");
  });

app.listen(4000,(err)=> err ? console.log(err) : console.log("server started AT 4000"))