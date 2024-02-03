import express from "express";
import db from "../db/conn.mjs";
import {ObjectId} from "mongodb";

const router = express.Router();

//get the "list" of all the records
router.get("/", async (req, res) =>{
    let collection = await db.collection("announcements");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

//create a new record
router.post("/", async (req,res)=>{
    let newDocument = {
        title:req.body.title,
        content:req.body.content,
    };

    let collection = await db.collection("announcements");
    let result= await collection.insertOne(newDocument);
    res.send(result).status(204);
});


//delete a new record
router.delete("/:id", async (req,res)=>{

    const query = {_id: new ObjectId(req.params.id)};

    const collection = db.collection("announcements")
    let result= await collection.deleteOne(query);
    res.send(result).status(200);
});

export default router;


//if any error, check the names 