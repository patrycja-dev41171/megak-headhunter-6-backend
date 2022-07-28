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
      throw new ValidationError(`Dane z pliku są nieprawidłowe, email: ${el.email} musi zawierać @, popraw dane i spróbuj ponownie`);
    } else {
      return el;
    }
  });

  const countPeoples: number[] = [0];

  for (const importStudent of validateData) {
    const { email, courseCompletion, courseEngagement, projectDegree, teamProjectDegree, bonusProjectUrls } = importStudent;

    if (!email || !courseCompletion || !courseEngagement || !projectDegree || !teamProjectDegree || !bonusProjectUrls) {
      throw new ValidationError('Wystąpił błąd sprawdz strukture pliku i spróbuj ponownie !');
    }

    const addUser = async () => {
      if (!(await UserRecord.getOneByEmail(email))) {
        const user = {
          email,
          role: 'student',
        };

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
          countPeoples.push(1);
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
    .json(
      `${
        info
          ? `Dodano  łącznie:  ${peoplesCount} studentów`
          : `Dodano ${peoplesCount} uzytkowników ponieważ dani uzytkownicy znajdują się już w bazie`
      }`
    );
  countPeoples.length = 0;

  // pozostało dodanie emaila !;
});
