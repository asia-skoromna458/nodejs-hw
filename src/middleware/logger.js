import pino from "pino-http";//для логування запитів

export const logger = pino({});//слідкування що за запити, що з відповіді ітдб час витрачений на обробку
