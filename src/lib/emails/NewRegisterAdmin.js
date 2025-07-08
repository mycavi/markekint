import { getMail }  from './Mail.js';

export function getMailAdmin({ title, name, email,phone, company, clte, site }) {
    const mail = getMail(title, site);
    const content = `
    <tr>
        <td align="center" class="main_container" style="text-align: center;">
            <strong class="title_1 color_primary">Nuevo usuario registrado</strong>
        </td>
    </tr>
    <tr> <td height="15"></td> </tr>
    <tr>
        <td align="center" class="main_container" style="text-align: center;">
            <img src="https://mycavi.com/public/mail/Account-mycavi.gif" width="300" height="300" alt="MyCavi Register">
        </td>
    </tr>
    <tr>
        <td class="" align="center" class="main_container">
            <p class="" style="text-align:center;">
                <strong>${name}</strong>
                <br>
                ${clte}<br>
                Correo: ${email}<br>
                Tel: ${phone}<br>
                Empresa: ${company}
            </p>
        </td>
    </tr>
    <tr> <td height="30"></td> </tr>
   `;

    return `${mail.init()}
    ${mail.headerAdmin()}
    ${content}
    ${mail.footerAdmin()}
    ${mail.end()}`;
}