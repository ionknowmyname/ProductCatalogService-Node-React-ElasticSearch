const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors");
const product = require("../routes/product");

const { connectDB } = require("./dbConnection")


const app = express()

dotenv.config()

connectDB()

if (process.env.NODE_ENV === "development") {
    app.use(
        cors({
            origin: `${process.env.FRONT_URL}`
        })
    );
}


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/v1/products", product);


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})