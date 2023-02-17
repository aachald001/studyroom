//console.log("om sai ram");
const express = require('express');
const path=require("path");
const app=express();
const hbs=require("hbs");
const bcrypt = require("bcryptjs"); 
require('./db/db');

const Register = require("./models/registers");
const Create = require("./models/creates");
let port = 3000;

const static_path =path.join(__dirname,"../public");
const template_path =path.join(__dirname,"../templates/views");
const partials_path =path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


app.get('/', (req,res)=>{
    res.render("index");
    // res.send("hello");
}); 


app.get("/register",(req,res)=>{
    res.render("register")
});

app.post("/register",async(req,res)=>{
   try{
    const password=req.body.password;
    const cpassword= req.body.confirmpassword;
    if(password===cpassword){
        const registeruser = new Register({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        })
          
        //password hash


        const registered = await registeruser.save();
        res.status(201).render("signin")
    }
    else{
        res.send("password are not matching");
    }
   } catch(error){
    res.status(400).send(error);
   }
});
app.get("/signin",(req,res)=>{
    res.render("signin")
});
// app.get('')

app.post("/signin",async(req,res)=>{
   try{
       const email1 = req.body.email;
       const password = req.body.password;
      
       const useremail =  await Register.findOne({email:email1});
       const isMatch =  await bcrypt.compare(password,useremail.password);

       if(isMatch){
         console.log(useremail.ledeargrp);
         console.log(useremail);
         const arr=useremail.participentgrp
         console.log(arr);
        res.status(201).render("home",{arr});
       }
       else{
        res.send("invalid password login");
       }
   } catch(error) {
    res.status(400).send("Invalid email login");
   }
});




app.get("/join",(req,res)=>{
     res.render("join")
})

app.post("/join",async(req,res)=>{
    try{
      const groupid=req.body.grpid;
      const email=req.body.emailid;
      const useremail =  await Register.findOne({email:email});
      await Create.findOneAndUpdate({grpid:groupid},{$addToSet:{participent:useremail.name},})
      await Register.findOneAndUpdate({email:email},{$addToSet:{participentgrp:groupid},})
      const arr=useremail.participentgrp;
      res.status(201).render("home",{arr});
    }catch(error){
        res.status(400).send("error");
    }
});


app.get("/home",(req,res)=>{

    res.render("home")
});

app.get("/create",(req,res)=>{
    res.render("create")
});

app.post("/create",async(req,res)=>{
    try{
     const email2=req.body.groupleaderid;
     const name= req.body.groupleadername;
     const useremail =  await Register.findOne({email:email2});
     const groupid=req.body.grpid;

     if(name===useremail.name)
     {
        console.log(name);
         const grpinfo = new Create({
            grpname:req.body.grpname,       
            grpid:req.body.grpid,
            subject:req.body.subject,
            startdate:req.body.startdate,
            enddate:req.body.enddate,
            groupleadername:req.body.groupleadername,
            groupleaderid:req.body.groupleaderid
         })
        
         const grpinfoed = await grpinfo.save();
         await Register.findOneAndUpdate({email:email2},{$addToSet:{participentgrp:groupid},})
         const arr=useremail.participentgrp;
         res.status(201).render("home",{arr})
     }
     else
     {
         res.send("not name matching ");
     }
    } catch(error){
     res.status(400).send(error);
    }
 });
 app.get("/page",(req,res)=>{
    res.render("page")
});

app.post("/home",async(req,res)=>{
    try{
     const grpid= req.body.grpid;
     const groupdetails=await Create.findOne({grpid:grpid});
      res.status(201).render("page",{groupdetails});
    }catch(error){
        res.status(400).send("error");
    }
})

//by default this is index page
app.listen(port,()=>{
    console.log(`listen to the ${port}`);
})