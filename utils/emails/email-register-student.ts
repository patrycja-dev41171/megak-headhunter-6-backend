import { emailsStyle } from './emails-style';
import xss from 'xss';

export const emailToStudentRegister = (email: string, link: string) => {
  const style = emailsStyle();
  const html = `
<html xmlns="http://www.w3.org/1999/xhtml" lang="pl">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MegaK - HeadHunter#6</title>
    ${style}
  </head>
  <body>
  <table class="body">
<!--  -->
    <tr>
      <td class="left_container"></td>
      <td class="main_container">
        <div class="content">
          <table class="main">
                  <tbody>
                  <tr><td><h1>Cześć użytkowniku ${xss(email)}</h1></td></tr>
                  <tr><td><p>Zostałeś dodany do systemu MegaK-HeadHunter przez admina.</p></td></tr>
                  <tr><td><p>Aby móc w pełni korzystać ze strony dokończ rejestrację dodając hasło w linku poniżej.</p></td></tr>
                  <tr><td><a href=${xss(link)} target="_blank">Dodaj hasło</a></td></tr>
                  <tr class="tr_img"><img src="cid:logo&background.png" alt="Logo MegaK"></tr>
                  <tr><td><p>Zignoruj tę wiadomość jeśli nie wiesz dlaczego zostałeś dodany do systemu przez admina.</p></td></tr>
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
