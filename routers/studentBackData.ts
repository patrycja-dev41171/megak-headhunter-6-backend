import { Router } from 'express';
import { StudentRecord } from '../records/student.record';
import { StudentEntity } from '../types';
import { ValidationError } from '../utils/handleErrors';

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
    !tel ||
    !firstname ||
    !lastname ||
    !githubUserName ||
    !projectUrlsBack ||
    !bio ||
    !expectedTypeWork ||
    !targetWorkCity ||
    !expectedContractType ||
    !expectedSalary ||
    !canTakeApprenticeship ||
    !monthsOfCommercialExp ||
    !education ||
    !workExperience ||
    !courses ||
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

  try {
    const studentDb = await StudentRecord.getOneByEmail(email);
    // if(studentDb.firstName)
    if (!studentDb) {
      throw new ValidationError(
        'Nie możesz zaktualizować danych ponieważ twoje konto z twoim emailem nie jest wpisane do naszej bazy danych, skontaktuj się z administracją w celu dalszej pomocy.'
      );
    }

    const studentFront = new StudentRecord({
      ...studentDb,
      ...studentData,
    });

    await studentFront.update();
    res.json('Zaktualizowano dane ');
  } catch (err) {
    console.log(err);
  }
});
