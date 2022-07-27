import { HrUserEntity } from '../../types';
import { emailsStyle } from './emails-style';

export const emailToHr = (hr: HrUserEntity, link: string) => {
  const style = emailsStyle();
  const html = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Email to hr with link to change password.</title>
    ${style}
  </head>
  <body>
    <table role="presentation" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <table role="presentation" class="main">
              <tr>
                <td class="wrapper">
                  <table role="presentation">
                    <tr>
                      <td>
                        <h2>Cześć ${hr.fullName}</h2>
                        <p>Odebraliśmy od Ciebie prośbę o przypomnienie hasła. Aby móc ponownie korzystać z systemu wpisz nowe hasło w poniższym linku.</p>
                        <table role="presentation" class="btn btn-primary">
                          <tbody>
                            <tr>
                              <td >
                                <table role="presentation">
                                  <tbody>
                                    <tr>
                                      <td> <a href="http://localhost:3000/change-password/${hr.id}" target="_blank">Zmiana hasła</a> </td>
                                    </tr>
                                    <tr class="tr_img"><img src="cid:logo&background.png" alt="Logo MegaK"></tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p>Jeśli to nie ty wysyłałeś prośbę o przypomnienie hasła zignoruj tę wiadomość.</p>
                        <p>Pozdrawia zespół MegaK-HeadHunter#6.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <div class="footer">
              <table role="presentation">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">MegaK, HeadHunter#6 Poland.</span>
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by">
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;
  return html;
};
