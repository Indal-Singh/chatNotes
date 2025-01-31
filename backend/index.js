const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { connectDB } = require('./src/config/db');
connectDB();
app.use(cors());
app.use(express.json());
const apiRouter = require('./src/routes/api');

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);