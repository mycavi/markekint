import { getMail }  from './Mail.js';

export function getHtml({ title, site, user, url }) {
    const mail = getMail(title, site);
    const content = `
        <tr>
            <td align="center" class="main_container" style=" text-align: center;">
                <strong class="title_1 color_primary">Hola, ${user}</strong><br>
                <strong class="title_2">${title}</strong>
            </td>
        </tr>
        <tr> <td height="15"></td> </tr>
        <tr>
            <td align="center" class="main_container" style="text-align: center;">
                <img src="https://mycavi.com/public/mail/password-generic.gif" width="300" height="300" alt="MyCavi Recovery">
            </td>
        </tr>
        <tr>
            <td class="" align="center" class="main_container">
                <p class="title_3" style="text-align: center;"><strong>Para actualizar su contraseña, dar clic</strong></p>
            </td>
        </tr>
        <tr> <td height="10"></td> </tr>
        <tr>
            <td align="center" class="main_container" style="text-align: center;">
                <table width="170" align="center" bgcolor="${site.color}" style="border-radius:30px;">
                    <tr> <td height="35" align="center"><a href="${url}" style="color:#FFFFFF; width:100%;">aquí</a></td> </tr>
                </table>
            </td>
        </tr>
        <tr> <td height="20"></td> </tr>
        <tr>
            <td align="center" class="main_container">
                <p class="footer_small color_primary" style="text-align: center;">
                    Si el botón no funciona, copia y pega este enlace en tu navegador <br>
                    ${url}
                </p>
            </td>
        </tr>
        <tr> <td height="10"></td> </tr>
        <tr>
            <td align="center" class="main_container">
            <p class="footer_small color_primary" style="text-align: center;"><strong>En caso de desconocer este correo, favor de ignorarlo</strong></p>
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