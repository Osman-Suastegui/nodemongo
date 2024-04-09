
const {MongoClient} = require("mongodb")

let dbConnection;
module.exports = {
    connecToDb: (cb) => {
        
        MongoClient.connect('mongodb://127.0.0.1:27017/bookStore')
        .then((client) =>{
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err.message)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}