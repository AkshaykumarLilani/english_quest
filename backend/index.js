require("dotenv").config();
require("./config/sanitizeEnv");

const express = require('express');
const logger = require("./config/winston.logger");
const cors = require('cors');
const { mongodbConnection } = require("./config/dbConfig");
const errorHandler = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const booksRoutes = require("./routes/book.routes");

const app = express();

// middlewares
app.use(express.json());
app.use(cors({
    origin: "*"
}));

//routes
app.use("/auth", authRoutes);
app.use("/books", booksRoutes);


// error handling
app.use(errorHandler);


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