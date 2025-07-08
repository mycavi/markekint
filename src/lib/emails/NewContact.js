import { getMail }  from './Mail.js';

export function getHtml({ title, name, email, phone, message, site }) {
    const mail = getMail(title, site);
    const content = `
        <tr>
            <td align="center" class="main_container" style="text-align: center;">
                <img src="https://mycavi.com/public/mail/contact.gif" width="300" height="300" alt="Contacto">
            </td>
        </tr>
        <tr>
            <td align="center" class="main_container" style="text-align: center;">
                <strong class="title_1 color_secondary">${title}</strong>
            </td>
        </tr>
        <tr>
            <td height="15"></td>
        </tr>
        <tr>
            <td class="" align="center" class="main_container">
                <p class="" style="text-align:center;">
                    Nombre: ${name}<br>
                    Correo: ${email}<br>
                    Teléfono: ${phone}<br>
                    Mensaje: ${message}
                </p>
            </td>
        </tr>
        <tr>
            <td height="30"></td>
        </tr>
    `;

    return `${mail.init()}
    ${mail.headerAdmin()}
    ${content}
    ${mail.footerAdmin()}
    ${mail.end()}`;
}