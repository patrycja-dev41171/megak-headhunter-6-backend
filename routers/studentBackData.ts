import { Router } from 'express';
import { StudentRecord } from '../records/student.record';
import { StudentEntity } from '../types';
import { ValidationError } from '../utils/handleErrors';

const fetch = require('node-fetch');

export const studentBackRouter = Router();

studentBackRouter.post('/', async (req, res) => {
  const {
    email,
    tel,
    firstname,
    lastname,
    githubUserName,
    portfolioUrls,
    projectUrlsFront,
    projectUrlsBack,
    bio,
    expectedTypeWork,
    targetWorkCity,
    expectedContractType,
    expectedSalary,
    canTakeApprenticeship,
    monthsOfCommercialExp,
    education,
    workExperience,
    courses,
    status,
  } = req.body;

  if (
    !email ||
    !firstname ||
    !lastname ||
    !githubUserName ||
    !projectUrlsBack ||
    !expectedTypeWork ||
    !expectedContractType ||
    !canTakeApprenticeship ||
    !monthsOfCommercialExp ||
    !status
  ) {
    throw new ValidationError(' Nie wprowadzono wszystkich wymaganych informacji !');
  }

  // projectUrlsFront nie jest wymagana informacja na frondzie ejsli ja dostane to oznacza to ze ktos podal link do frontu tez do projektu zalcizeniowego a jesli nie to bd tylko link do back-endu poniewaz on  jest wymagany.
  const urlsPortfolio: string | null = portfolioUrls ? JSON.stringify([portfolioUrls]) : null;
  const urlsProject: string[] = projectUrlsFront ? [projectUrlsBack, projectUrlsFront] : [projectUrlsBack];

  const studentData: StudentEntity = {
    email: email,
    tel: tel,
    firstName: firstname,
    lastName: lastname,
    githubUserName: githubUserName,
    portfolioUrls: urlsPortfolio,
    projectUrls: JSON.stringify(urlsProject),
    bio: bio,
    expectedTypeWork: expectedTypeWork,
    targetWorkCity: targetWorkCity,
    expectedContractType: expectedContractType,
    expectedSalary: expectedSalary,
    canTakeApprenticeship: Number(canTakeApprenticeship),
    monthsOfCommercialExp: monthsOfCommercialExp,
    education: education,
    workExperience: workExperience,
    courses: courses,
    status: status,
  };

  const studentDb = await StudentRecord.getOneByEmail(email);
  // if(studentDb.firstName)
  if (!studentDb) {
    throw new ValidationError(
      'Nie możesz zaktualizować danych ponieważ twoje konto z twoim emailem nie jest wpisane do naszej bazy danych, skontaktuj się z administracją w celu dalszej pomocy.'
    );
  }
  const response = await fetch(`https://api.github.com/users/${githubUserName}`);
  const data = await response.json();

  const studentFront = new StudentRecord({
    ...studentDb,
    ...studentData,
  });

  if (!data.message) {
    await studentFront.update();
    res.status(200).json('Zaktualizowano dane ');
  } else {
    throw new ValidationError(
      `Użytkownik o takim  loginie:  ${studentData.githubUserName}  nie istnieje na githubie ! ,sprawdz login i spróbuj ponownie wpisać poprawny login z github. `
    );
  }
});
