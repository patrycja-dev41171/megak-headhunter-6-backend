import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import cors from 'cors';
import { handleError } from './utils/handleErrors';
import { uploadRouter } from './routers/upload-file';
import fileUpload = require('express-fileupload');
import { loginRouter } from './routers/login.router';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({ path: '.env' });

app.use(express.json());

app.use(helmet());

app.use(cookieParser());
// app.use(fileUpload());

app.use(
  cors({
    origin: 'http//:localhost/3000',
  })
);

app.use(
  rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(morgan('common'));

//routers
app.use('/', uploadRouter);
app.use('/login', loginRouter);

app.use(handleError);

app.listen(8080, 'localhost', () => {
  console.log(`server is running: http//:localhost:8080`);
});
