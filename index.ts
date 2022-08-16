import express, { Router } from 'express';
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

const app = express();
const router = Router();

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

router.use('/admin', adminRouter);
router.use('/hr', hrRouter);
router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/refresh-token', refreshTokenRouter);
router.use('/forgot-password', forgotPasswordRouter);
router.use('/change-password', changePasswordRouter);
router.use('/studentBack', studentBackRouter);
router.use('/student', studentRouter);
router.use('/env', envRouter);
router.use('/student/data', studentBackRouter); // zapisywanie  dokładnych danych o studencie w bazie danych !
router.use('/student/import', getStudentRouter); // wyświetlanie jedynie danych z importu dla studenta.
router.use('/oneStudent/', getStudentData); // wysyłanie wszystkich danych o jednym studencie na FE.

app.use('/api', router);

app.use(handleError);

app.listen(8080, 'localhost', () => {
  console.log(`server is running: http://localhost:8080`);
});
