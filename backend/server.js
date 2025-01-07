import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/userRoutes.js';
dotenv.config();
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('helloopsfiodjoieo');
});

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');
    } catch (error) {
        console.log(error);
    }
};
ConnectDB();
app.use('/api/user', userRouter);
app.listen(3000, () => {
    console.log(`The port is running correctly ${process.env.PORT}`);
});
