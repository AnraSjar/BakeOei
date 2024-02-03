import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

//get members 
router.get("/members", async (req, res) => {
    let collection = await db.collection("users");
    let result = await collection.find({}).toArray();
    res.status(200).send(result);
})

//get a single user account
router.get("/:id", async (req, res) => {
    let collection = await db.collection("users");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not Found".status(404));
    else res.send(result).status(200);
});


//User Authentication

//post register
router.post("/register", async (req, res) => {
    try {

        let collection = await db.collection("users");
        // Check if the email is already in use
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("Email is already in use");
        }

        // Check if the username is already in use
        const existingUsername = await collection.findOne({ username: req.body.username });
        if (existingUsername) {
            return res.status(400).send("Username is already in use");
        }

        let newUser = {

            username: req.body.username,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            bio: req.body.bio,
            image: req.body.image,
        }


        await collection.insertOne(newUser);
        res.status(201).send("User Registered"); //may cause error
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})

//post login
router.post("/login", async (req, res) => {
    try {

        let collection = await db.collection('users');
        let userCredentials = {

            email: req.body.email,
            password: req.body.password,
        }

        let existingUser = await collection.findOne({ email: userCredentials.email });
        if (!existingUser) {
            res.status(401).send("Invalid credentials");
            return;
        }

        if (existingUser.password !== userCredentials.password) {
            res.status(401).send("Invalid credentials");
            return;
        }
        //Password is correct
        res.status(200).json({
            userId: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            mobile: existingUser.mobile,
            password: existingUser.password,
            bio: existingUser.bio,
            image: existingUser.image,
            // include other user details as needed
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

//update user
router.patch("/:id", async (req, res) => {
    try {

        let collection = await db.collection('users');
        let query = { _id: new ObjectId(req.params.id) };

        const requiredFields = ["mobile", "password", "bio", "image"];
        const missingFields = requiredFields.filter(field => req.body[field] === undefined)

        if (missingFields.length > 0) {
            return res.status(400).send(`Missing required fields: ${missingFields.join(", ")}`);
        }

        let update = {
            $set: {

                mobile: req.body.mobile,
                password: req.body.password,
                bio: req.body.bio,
                image: req.body.image,

            }

        }

        let result = await collection.updateOne(query, update);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})

//delete user
router.delete("/:id", async (req, res) => {
    try {
        let collection = await db.collection('users');
        let query = { _id: new ObjectId(req.params.id) };
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

export default router;

