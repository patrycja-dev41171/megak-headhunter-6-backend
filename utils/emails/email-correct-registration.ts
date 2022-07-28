import { emailsStyle } from './emails-style';

export const emailCorrectRegistration = (email:string) => {
    const style = emailsStyle();
    const html = `
<html xmlns="http://www.w3.org/1999/xhtml" lang="pl">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dla Hr od MegaK - HeadHunter</title>
    ${style}
  </head>
  <body>
  <table class="body">
    <tr>
      <td class="left_container"></td>
      <td class="main_container">
        <div class="content">
          <table class="main">
                  <tbody>
                  <tr><td><h1>Poprawna rejestracja</h1></td></tr>
                  <tr><td><p>Użytkowniku o emailu: ${email}</p></td></tr>
                  <tr><td><p>Zostałeś prawidłowo zarejestrowany w systemie: MegaK-HeadHunter.</p></td></tr>
                  <tr><td><p>Możesz zalogować się do strony w linku poniżej.</p></td></tr>
                  <tr><td><a href="http://localhost:3000/login" target="_blank">Zaloguj się</a></td></tr>
                  <tr class="tr_img"><img src="cid:logo&background.png" alt="Logo MegaK"></tr>
                  <tr><td><p>Wiadomość wysyłana automatycznie. Prosimy na nią nie odpowiadać.</p></td></tr>
                  <tr><td><p class="p_strong">Pozdrawia zespół MegaK-HeadHunter#6.</p></td></tr>
                  <tr><td><span>MegaK - HeadHunter#6 Poland 2022.</span></td></tr>
                  </tbody>
          </table>
        </div>
      </td>
      <td class="right_container"></td>
    </tr>
  </table>
  </body>
</html>
</html>`;
    return html;
};