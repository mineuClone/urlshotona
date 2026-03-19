import express from "express";


const app = express()

app.use(express.static("public"))

app.get('/',(req, res)=>{
    console.log("hello world");
    res.send("hello ")
})

app.listen(3000)
