import express from "express"; //створення серверу
const app = express(); //зміна це вебсервер
import "dotenv/config";//це для порту і щоб одразу ініціалізувати
import cors from 'cors';
import { connectMongoDB } from "./db/connectMongoDB.js";
import "dotenv/config";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import notesRoutes from './routes/notesRoutes.js';


app.use(logger);
app.use(express.json()); //це мідлвар/розпаковка запиту в боді
app.use(cors()); //можна робити запити з будь яких джерел

const PORT = process.env.PORT ?? 3000;

app.use(notesRoutes);//маршрути з get i getbyid

app.use(notFoundHandler);//404

app.use(errorHandler);//для помилок

await connectMongoDB();//MongoDB

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`)); //лістен це метод, можна колбек з текстом що показеє що сервер запустився


