const MongoClient = require("mongodb").MongoClient;
const ObjdectID = require('mongodb').ObjectID

const dbname="crud_mongodb"  //name of database
const url ="mongodb://localhost:27017";
const mongoOptions = {useNewUrlParser:true}

const state={
    db:null   //set state of db for connection btn nodejs and mongodb 
}             //default state is null

const connect =(cb)=>{
    if(state.db)   //if there is db connection
    cb();      //
    else{
        MongoClient.connect(url,mongoOptions,(err,client)=>{  //other wise use mongoclient to connect to db
            if(err)
            cb(err)
            else{
                state.db = client.db(dbname);
                cb()
            }
        })
    }
}


const getPrimaryKey=(_id)=>{
    return ObjdectID(_id)
} 

const getDB=()=>{
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};  //now exprot all methods
 