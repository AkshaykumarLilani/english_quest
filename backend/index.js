require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { mongodbConnection } = require("./config/dbConfig");
const app = express();

// middlewares
app.use(express.json());
app.use(cors({
    origin: "*"
}));


const PORT = process.env.PORT || 4134;
app.listen(PORT, async ()=>{
    try {
        console.log("Server is live at PORT:", PORT);
        console.log("Connecting to MongoDB ... ")
        await mongodbConnection;
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Error while connecting to MONGODB");
        throw err
    }
});