import express from "express";
import cors from "cors";
import recipes from "./routes/recipes.mjs"
import announcements from "./routes/announcements.mjs"
import users from "./routes/users.mjs"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/recipes", recipes)
app.use("/announcements", announcements)
app.use("/users", users)

app.get("/", async (req,res)=>{
    res.send("Hello World").status(200);
});

//start the Express server
app.listen(PORT, ()=>{
    console.log('Server is running on port: http://localhost:${PORT}');
});