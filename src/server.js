import express from "express"; //створення серверу
const app = express(); //зміна це вебсервер
import "dotenv/config";//це для порту і щоб одразу ініціалізувати
import cors from 'cors';
import pino from "pino-http";//для логування запитів

app.use(express.json()); //це мідлвар/розпаковка запиту в боді
app.use(cors()); //можна робити запити з будь яких джерел
app.use(pino({}));//слідкування що за запити, що з відповіді ітдб час витрачений на обробку

const PORT = process.env.PORT ?? 3000;
app.get('/notes', (req, res) => {
  res.status(200).json({ message: `Retrieved all notes` });
});//повертає всі нотатки


app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({message: `Retrieved note with Id: ${noteId} `});
});//повертає одну нотатку

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});// штучна помилка для перевірки

app.use((req, res) => {
  res.status(404).json({ message: `Route not found` });
});//для неіснуючих


app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });

});//для помилок


app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`)); //лістен це метод, можна колбек з текстом що показеє що сервер запустився
