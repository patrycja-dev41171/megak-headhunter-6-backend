import nodemailer from 'nodemailer';

export const sendEmail = (to: string, subject: string, html: string, attachments: any[]) => {
  const config = {
    from: 'HeadHunter.group6@gmail.com',
    to,
    subject,
    html,
    attachments,
  };

  nodemailer
    .createTransport({
      service: 'gmail',
      auth: {
        user: 'HeadHunter.group6@gmail.com',
        pass: 'oqzbpmdqdwetpmlv',
      },
      port: 465,
      host: 'smtp.gmail.com',
    })
    .sendMail(config, (err: Error) => {
      if (err) {
        return console.log('Error', err);
      } else {
        return console.log('Email sent');
      }
    });
};

//Przykład attachment :
//
// const obrazek = [{
//     filename:'unique@kreata.jpg',
//     path:'./utils/unique@kreata.jpg',
//     cid: 'unique@kreata.jpg'
// }]
