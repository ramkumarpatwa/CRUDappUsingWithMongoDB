const express =require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json())
const path = require('path')
const Joi = require('joi');

const db = require("./db")
const collection ="todo"; //name of collection

const schema =Joi.object().keys({
    todo:Joi.string().required()
})
app.get('/',(req,res) => {  //get route used to send static html file to the user
    res.sendFile(path.join(__dirname,'index.html'));
});


//find vs findOne in mongodb find is used to return all database while findOne is used to return very first one 
//getDB is for db connection and collection for the particular collection of db then find({}) means all tables of coll
//then toArray because find() returns cursor and we don't want into cursor we want actual document so toArray return document

//read
app.get('/getTodos', (req,res) => {  //request and response object
    db.getDB().collection(collection).find({}).toArray((err,documents) => {
        if(err)
            console.log(err);
        else{ 
            console.log(documents);
            res.json(documents);            
        }
    });
});


//server side update portion of our crud application
app.put('/:id', (req,res) => {
    const todoID = req.params.id;  //get todoid
    const userInput = req.body;  //get user input
    // findOneAndUpdate(filter, update, options, callback)
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)}, {$set : {todo : userInput.todo} }, {returnOriginal : false}, (err,result) => {
        if(err)                                         //id where you want to update    $set to update the new userInput
            console.log(err);
        else
            res.json(result);
    });
});
//server side create portion of our crud application
app.post('/',(req,res,next)=>{
    const userInput =req.body;
    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status =400;
            next(error);
        }
        else{
            db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error(" Failed to insert Todo Document");
                    error.status =400;
                    next(error);
                }
                    
                else
                    res.json({result:result,document:result.ops[0],msg:"Successfully inserted Todo",error:null});
            });

        }
    })

   
   
});

app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error:{
            message: err.message
        }
    })
})
//delete
app.delete('/:id',(req,res)=>{
    const todoID =req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id :db.getPrimaryKey(todoID)},(err,result)=>{
        if(err)
        console.log(err);
        else
        res.json(result)
        
  })
})


db.connect((err)=>{     //connect to db
    if(err){
    console.log('unable to connect to database');
    process.exit(1);  //terminate the applicaiton

}
else{
    app.listen(3000,()=>{   //else use port number
        console.log('connected to database,app listening on port 3000')
    })
}
})