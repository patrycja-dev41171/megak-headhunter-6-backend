import { Router } from 'express';
import { StudentRecord } from '../records/student.record';
import { portfolioUrlMapEntity, projectUrlMapEntity, Status, StudentEntity } from '../types';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';

const fetch = require('node-fetch');

export const studentBackRouter = Router();

studentBackRouter.post('/:userId', async (req, res) => {
  console.log(req.body)
  const {
    email,
    tel,
    firstName,
    lastName,
    githubUserName,
    portfolioUrls,
    projectUrls,
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
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !githubUserName ||
    !projectUrls ||
    !expectedTypeWork ||
    !expectedContractType ||
    !canTakeApprenticeship ||
    !monthsOfCommercialExp
  ) {
    throw new ValidationError('Nie wprowadzono wszystkich wymaganych informacji!');
  }

  const portfolioMap = portfolioUrls.map((e: portfolioUrlMapEntity) => e.value);
  const projectMap = projectUrls.map((e: projectUrlMapEntity) => e.value);

  let studentData: StudentEntity;
  if (!email) {
    studentData = {
      tel: !tel? null : tel,
      firstName: firstName,
      lastName: lastName,
      githubUserName: githubUserName,
      portfolioUrls: JSON.stringify(portfolioMap),
      projectUrls: JSON.stringify(projectMap),
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
      status: Status.Available,
    };
  } else {
    await UserRecord.updateEmail(email, req.params.userId);

    studentData = {
      email: email,
      tel: !tel? null : tel,
      firstName: firstName,
      lastName: lastName,
      githubUserName: githubUserName,
      portfolioUrls: JSON.stringify(portfolioMap),
      projectUrls: JSON.stringify(projectMap),
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
      status: Status.Available,
    };
  }

  const studentDb = await StudentRecord.getOneById(req.params.userId);

  if (!studentDb) {
    throw new ValidationError('Nie możesz zaktualizować swoich danych ponieważ twoje konto jest nieaktywne lub nie istnieję !');
  }

  const response = await fetch(`https://api.github.com/users/${githubUserName}`);
  const data = await response.json();

  const studentFront = new StudentRecord({
    ...studentDb,
    ...studentData,
  });

  if (!data.message) {
    await studentFront.updateUserId();
    studentData = {};
    res.status(200).json('Zaktualizowano dane.');
  } else {
    studentData = {};
    throw new ValidationError(
      `Użytkownik o takim  loginie:  ${studentFront.githubUserName} nie posiada konta na github! Sprawdź login i spróbuj ponownie.`
    );
  }
});
