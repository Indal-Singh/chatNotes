const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const config = require('./src/config/config');
const cors = require('cors');
const PORT = config.PORT;
const { connectDB } = require('./src/config/db');
connectDB();
app.use(cors());
app.use(express.json());
const apiRouter = require('./src/routes/api');

app.use('/api/', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);