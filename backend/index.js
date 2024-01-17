require("dotenv").config();
require("./config/sanitizeEnv");

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

// Swagger options
const options = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info: {
            title: 'Library API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js', './controllers/*.js'], // Specify the path to your route files or use inline annotations
};

const specs = swaggerJsdoc(options);

//routes
app.use("/auth", authRoutes);
app.use("/books", booksRoutes);


// error handling
app.use(errorHandler);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



const PORT = process.env.PORT || 4134;
app.listen(PORT, async () => {
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