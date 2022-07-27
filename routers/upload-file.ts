import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { StudentRecord } from '../records/student.record';
import { StudentImport } from '../types';

export const uploadRouter = Router();

uploadRouter.post('/', async (req, res) => {
  if (!req.files) {
    throw new ValidationError('Nie przesłano pliku !');
  }

  const [data] = Object.entries(req.files);
  const primaryData: any = data[1];

  if (primaryData.mimetype !== 'application/json') {
    throw new ValidationError('Plik musi być w formacie JSON !');
  }

  const parseData = JSON.parse(primaryData.data);
  const emailValidate = new RegExp('@');

  const validateData = parseData.map((el: StudentImport) => {
    if (!emailValidate.test(el.email)) {
      throw new ValidationError('Dane z pliku są nieprawidłowe, email musi zawierać @');
    } else {
      return el;
    }
  });

  for (const importStudent of validateData) {
    const { email, courseCompletion, courseEngagement, projectDegree, teamProjectDegree, bonusProjectUrls } = importStudent;
    if (!email) {
      throw new ValidationError('Struktura pliku musi posiadać email !');
    }
    const user = {
      email,
      role: 'student',
    };
    const addUser = async () => {
      if (user) {
        const userTable = new UserRecord(user);
        await userTable.insert();

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
        } catch (err) {
          console.log(err);
        }
      }
    };

    await addUser();
  }

  // Do zrobienia: dodawanie do bazy danych oraz walidacja uzytkownikow podczas dodawania.

  res.status(200).json('the files has been uploading Success');
});
