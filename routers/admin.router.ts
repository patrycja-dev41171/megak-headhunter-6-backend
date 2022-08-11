import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { StudentRecord } from '../records/student.record';
import { StudentImport } from '../types';
import { sendEmail } from '../utils/sendEmail';
import { emailToStudentRegister } from '../utils/emails/email-register-student';
import { emailAttachment } from '../utils/emails/email-attachment';
import { HrRecord } from '../records/hr.record';
import { emailToHrRegister } from '../utils/emails/email-register-hr';

export const adminRouter = Router();

adminRouter
  .post('/upload/students', async (req, res) => {
    if (req.files === undefined || req.files === null) {
      throw new ValidationError(' Nie przesłano żadnego pliku!');
    }
    const [data] = Object.entries(req.files);
    const primaryData: any = data[1];

    if (primaryData.mimetype !== 'application/json') {
      throw new ValidationError('Plik musi być w formacie JSON!');
    }

    const parseData = JSON.parse(primaryData.data);
    const emailValidate = new RegExp('@');

    const validateData = parseData.map((el: StudentImport) => {
      if (!emailValidate.test(el.email)) {
        throw new ValidationError(`Dane z pliku są nieprawidłowe, email: ${el.email} musi zawierać @, popraw dane i spróbuj ponownie.`);
      } else {
        return el;
      }
    });

    const countPeoples: number[] = [0];

    for (const importStudent of validateData) {
      const { email, courseCompletion, courseEngagement, projectDegree, teamProjectDegree, bonusProjectUrls } = importStudent;

      if (!email || !courseCompletion || !courseEngagement || !projectDegree || !teamProjectDegree || !bonusProjectUrls) {
        throw new ValidationError('Wystąpił błąd. Sprawdź strukturę pliku i spróbuj ponownie!');
      }

      const addUser = async () => {
        if (!(await UserRecord.getOneByEmail(email))) {
          const user = {
            email,
            role: 'student',
          };

          const userTable = new UserRecord(user);
          const registerToken = await userTable.insert();

          const userId = await UserRecord.getOneByEmail(user.email);
          const bonusArray = bonusProjectUrls.map((el: any) => el);
          const correctBonus = JSON.stringify(bonusArray);

          const studentImp: StudentImport = {
            user_id: userId.id,
            email: user.email,
            courseCompletion,
            courseEngagement,
            projectDegree,
            teamProjectDegree,
            bonusProjectUrls: correctBonus,
          };

          try {
            const studentAdd = new StudentRecord(studentImp);
            await studentAdd.insert();
            countPeoples.push(1);
            const link = `http://localhost:3000/register/${userId.id}/${registerToken}`;
            const html = emailToStudentRegister(email, link);
            const attachment = emailAttachment();
            sendEmail(email, 'MegaK - HeadHunter#6', html, attachment);
          } catch (err) {
            console.log(err);
          }
        }
      };
      await addUser();
    }

    const peoplesCount = countPeoples.reduce((prev, curr) => (prev += curr), 0);

    const info = peoplesCount > 0;
    res
      .status(200)
      .json(`${info ? `Dodano ${peoplesCount} studentów.` : `Dodano ${peoplesCount} użytkowników. Reszta znajduje się już w bazie.`}`);
    countPeoples.length = 0;
  })

  .post('/add-hr', async (req, res) => {
    const user = {
      email: req.body.email,
      role: 'hr',
    };

    if (!user.email) {
      throw new ValidationError('Email jest wymagany!');
    }
    if (await UserRecord.getOneByEmail(req.body.email)) {
      throw new ValidationError('Użytkownik o takim emailu juz istnieje!');
    }
    const addUser = new UserRecord(user);
    const tokenRegister = await addUser.insert();

    if (!req.body.fullName || !req.body.company || !req.body.maxReservedStudents) {
      throw new ValidationError('Nie podano wszystkich informacji!');
    }

    const hr = {
      ...req.body,
      user_id: addUser.id,
    };

    const attachment = emailAttachment();

    const addHr = new HrRecord(hr);

    try {
      await addHr.insert();
      const link = `http://localhost:3000/register/${addUser.id}/${tokenRegister}`;
      const html = emailToHrRegister(addHr, link);
      sendEmail(addHr.email, 'MegaK - HeadHunter#6', html, attachment);
    } catch (err) {
      console.log(err);
    }
    res.json('Dodano HR do bazy danych.');
  });
