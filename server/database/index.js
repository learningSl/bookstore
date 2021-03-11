const MongoClient = require('mongodb').MongoClient


function getConnect(tableName){
    return new Promise((resolve,reject)=>{
        MongoClient.connect('mongodb://localhost:27017/bookstore',(err,db)=>{
            if(err){
                reject(err)
            }else{
                resolve(db.db('bookstore').collection(tableName))
            }
        })
    })
}

function connect(){
    return new Promise((resolve,reject)=>{
        MongoClient.connect('mongodb://localhost:27017/bookstore',(err,db)=>{
            if(err){
                reject(err)
            }else{
                let dbs = db.db('bookstore')
                resolve(dbs)
            }
        })
    })
}

function insertOne(collection, params){
    return new Promise((resolve,reject)=>{
        collection.insertOne(params,(err,res)=>{
            if(err){
                reject(err)
            }else{
                resolve(res)
            }
        })
    })
}

function find(collection, params={},limit=0){
    return new Promise((resolve,reject)=>{
        collection.find(params).toArray((err,res)=>{
            if(err){
                reject(err)
            }else{
                resolve(res)
            }
        })
    })
}


module.exports = {
    getConnect,insertOne,find,connect
}