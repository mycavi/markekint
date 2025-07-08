import { getMail }  from './Mail.js';

export function getMailUser({ title, name, urlAccess, site }) {
    const mail = getMail(title, site);
    const content = `
     <tr>
        <td align="center" class="main_container" style=" text-align: center;">
            <strong class="title_1 color_primary">Hola, ${name}</strong><br>
            <strong class="title_2">${title}</strong>
        </td>
    </tr>
    <tr> <td height="15"></td> </tr>
    <tr>
        <td align="center" class="main_container" style="text-align: center;">
            <img src="https://mycavi.com/public/mail/Account-generic.gif" width="300" height="300" alt="MyCavi Register">
        </td>
    </tr>
    <tr>
        <td class="" align="center" class="main_container">
            <p class="title_3" style="text-align: center;"><strong>Para continuar, verifica tu cuenta dando clic</strong></p>
        </td>
    </tr>

    <tr>
        <td align="center" class="main_container" style="text-align: center;">
            <table width="170" align="center" bgcolor="${site.color}" style="border-radius:30px;">
                <tr>
                    <td height="35" align="center"><a href="${urlAccess}" style="color:#fff">aquí</a></td>
                </tr>
            </table>
        </td>
    </tr>
    <tr> <td height="20"></td> </tr>
    <tr>
        <td align="center" class="main_container">
            <p class="footer_small color_primary" style="text-align: center;">
                Si el botón no funciona copie y pege este link en su navegador <br>
                ${urlAccess}
            </p>
        </td>
    </tr>
    <tr> <td height="10"></td> </tr>
    <tr>
        <td align="center" class="main_container">
            <p class="footer_small color_primary" style="text-align: center;"><strong>En caso de desconocer este mail, hacer caso omiso.</strong></p>
        </td>
    </tr>
    <tr> <td height="30"></td> </tr>
   `;

    return `${mail.init()}
    ${mail.headerCustomer()}
    ${content}
    ${mail.footerCustomer()}
    ${mail.end()}`;
}