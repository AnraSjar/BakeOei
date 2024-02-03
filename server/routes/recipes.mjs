import express from "express";
import db from "../db/conn.mjs";
import {ObjectId} from "mongodb";

const router = express.Router();

//get the "list" of all the records
router.get("/", async (req, res) =>{
    let collection = await db.collection("recipes");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// //get a single record by id
// router.get("/:id", async(req,res) =>{
//     let collection = await db.collection("recipes");
//     let query = {_id: new ObjectId(req.params.id)};
//     let result = await collection.findOne(query);

//     if (!result) res.send("Not Found".status(404));
//     else res.send(result).status(200);
// });

// Search for recipes by name
router.get("/search", async (req, res) => {
    try {
        // Check if the search query is present in the request body
        if (!req.body.query || req.body.query.trim() === "") {
            return res.status(400).send("Search query is missing or empty");
        }

        
        const searchQuery = req.body.query.trim();

        // Use a case-insensitive regex for the search
        const regex = new RegExp(searchQuery, "i");

        // Search for recipes by name
        let collection = await db.collection("recipes");
        let searchResults = await collection.find({ dish: regex }).toArray();

        res.status(200).json(searchResults);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


//delete a new record
router.delete("/:id", async (req,res)=>{

    const query = {_id:new ObjectId(req.params.id)};

    const collection = db.collection ("recipes")
    let result= await collection.deleteOne(query);
    res.send(result).status(200);
});

export default router;

