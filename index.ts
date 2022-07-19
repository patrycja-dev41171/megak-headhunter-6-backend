import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import cors from 'cors';
import {handleError} from "./utils/handleErrors";


const app = express();

dotenv.config({path: '.env'});

app.use(express.json());

app.use(helmet());

app.use(cors({
    origin: "http//:localhost/3000",
}));

app.use(rateLimiter({

    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(morgan('common'));


//routes


app.use(handleError);


app.listen(8080, 'localhost', () => {

    console.log(`server is running: http//:localhost:8080`);

});