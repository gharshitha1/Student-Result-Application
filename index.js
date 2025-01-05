const express=require('express');
const mongoose=require('mongoose');
const fileupload=require('express-fileupload');
const pug=require('pug');
const fs=require('fs');

const app=express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(fileupload());
app.set('view engine','pug');
app.listen(3009,()=>{
    console.log("Server is Running at 3009 Successfully!!")
})
let b=mongoose.connect('mongodb://127.0.0.1:27017/project');
b.then((info)=>{
    console.log("Connection Success!");
})
b.catch((info)=>{
    console.log("Connection Failed!");
})
let cseschema=new mongoose.Schema({
    user:String,
    pass:String
})
let modelcse=new mongoose.model('csedata',cseschema,'logindata');
let cseschema1=new mongoose.Schema({
    name:String,
    python:Number,
    andriod:Number,
    mst:Number,
    devops:Number,
    ml:Number
})
let modelcse1=new mongoose.model('csedata1',cseschema1,'marks');
app.get('/home',(req,res)=>{//http://localhost:3000/home
    res.sendFile(__dirname+'/public/index.html');
})
app.post('/register',async(req,res)=>{
    var data={
        user:req.body.user,
        pass:req.body.pass
    }
    const m=new modelcse(data);//m is promise
    await m.save().then((info)=>{
        //res.send("Inserted Successfully");
        res.sendFile(__dirname+'/public/login.html')
        let pic=req.files.file;
        uploadpath=__dirname+'/public/images/'+pic.name;
        pic.mv(uploadpath,err=>{
            if(err){
                return res.send(err);
            }
            fs.rename(uploadpath,__dirname+'/public/images/'+req.body.user+'.jpeg',err=>{
                console.log("Renamed Successfull!");
            })
        })
    })
})
app.post('/check',async(req,res)=>{
    const user=await modelcse.findOne({user:req.body.luser})
    if(user){
        const result=req.body.lpass===user.pass;
        if(result){
                modelcse1.findOne({name:req.body.luser}).then((data)=>{
                file='/images/'+req.body.luser+'.jpeg';
                res.render('output.pug',{data,file});
                })
        }
        else{
            res.sendFile(__dirname+'/public/login.html');
        }
    }
    else{
        res.sendFile(__dirname+'/public/login.html');
    }
})

