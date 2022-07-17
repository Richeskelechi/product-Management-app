const express = require('express');
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
const app = express();
const userRoutes = require('./routes/userRoute')
const connectDB = require('./db/connect')
require('dotenv').config()

app.use(cors(corsOptions))
app.use(express.json());
app.use('/api/v1', userRoutes)

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is listening on ${port}...`))
    } catch (error) {
        console.log(error);
    }
}
start()
