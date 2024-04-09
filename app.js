const express = require('express')
const cors = require('cors')
const { connecToDb, getDb } = require('./db')
const {ObjectId} = require("mongodb")
const app = express()
app.use(express.json())
app.use(cors())
// db connection
let db;

connecToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000')
        })
    db = getDb()
    
    }
})



// routes

app.get("/books", (req, res) => {
    let books = []
    const page = req.query.p || 0
    const booksPerPage = 3

    db.collection('books').find()   
    .sort({author:1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => {
        books.push(book)
    })
    .then(()=>{
        res.status(200).json(books)
    })
    .catch((err)=>{
        res.status(500).json({error:"could not fetch the documents"})
    })

})

app.get('/books/:id',(req,res)=>{
    const id  = req.params.id
    if(!ObjectId.isValid(id)) res.status(500).json({"error":"not a valid id"})
    
    db.collection("books").findOne({_id: new ObjectId(id)})
    .then(book => {
        if(!book) res.status(404).json({message:"book not found"})
         res.status(200).json(book)
       
    })
    .catch(err => res.status(500).json({error:"could not fetch the book"}))
})

app.post('/books',(req,res) => {
    const book = req.body

    db.collection("books").insertOne(book)
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json({error:"could not create a new book"}))
})

app.delete("/books/:id",(req,res) => {
    const id = req.params.id
    if(!ObjectId.isValid(id)) res.status(500).json({"error":"not a valid id"})
    
    db.collection("books").deleteOne({_id: new ObjectId(id)})
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({error:"could not delete the book"}))
})

app.patch("/books/:id",(req,res) => {
    const updates = req.body
    console.log(updates)
    const id = req.params.id
    if(!ObjectId.isValid(id)) res.status(500).json({"error":"not a valid id"})
    
    db.collection("books").updateOne({_id: new ObjectId(id)},{$set:updates})
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({error:"could not update the book"}))
})