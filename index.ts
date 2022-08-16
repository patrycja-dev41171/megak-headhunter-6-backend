import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { handleError } from './utils/handleErrors';
import { adminRouter } from './routers/admin.router';
import { loginRouter } from './routers/login.router';
import { refreshTokenRouter } from './routers/refreshToken.router';
import { hrRouter } from './routers/hr.router';
import { forgotPasswordRouter } from './routers/forgotPassword.router';
import { changePasswordRouter } from './routers/changePassword.router';
import { registerRouter } from './routers/register.router';
import { studentBackRouter } from './routers/studentBackData';
import { getStudentRouter } from './routers/getStudentImport';
import { getStudentData } from './routers/getStudentData';
import { envRouter } from './routers/env.router';
import { studentRouter } from './routers/student.router';
import fileUpload = require('express-fileupload');
import { auth } from './utils/auth';

const app = express();

dotenv.config({ path: '.env' });

app.use(express.json());

app.use(helmet());

app.use(cookieParser());
app.use(fileUpload());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
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
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/refresh-token', refreshTokenRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/change-password', changePasswordRouter);

app.use(auth)
app.use('/admin', adminRouter);
app.use('/hr', hrRouter);
app.use('/studentBack', studentBackRouter);
app.use('/student', studentRouter);
app.use('/env', envRouter);
app.use('/student/data', studentBackRouter); // zapisywanie  dokładnych danych o studencie w bazie danych !
app.use('/student/import', getStudentRouter); // wyświetlanie jedynie danych z importu dla studenta.
app.use('/oneStudent/', getStudentData); // wysyłanie wszystkich danych o jednym studencie na FE.

app.use(handleError);

app.listen(8080, 'localhost', () => {
  console.log(`server is running: http://localhost:8080`);
});
