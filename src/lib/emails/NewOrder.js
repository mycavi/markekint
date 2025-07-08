import { getMail }  from './Mail.js';

export function getMailUser({ title, cart, details, site }) {
    const mail = getMail(title, site);
    const content = `
    <tr>
        <td align="center" class="main_container" style="text-align: center;">
            <img src="https://mycavi.com/public/mail/order.jpg" width="300" height="200" alt="MyCavi Order">
        </td>
    </tr>
    <tr>
        <td align="center" class="main_container" style="text-align: center;">
            <strong class="title_1 color_secondary">¡Gracias por cotizar con nosotros!</strong><br>
            <strong class="color_primary">Pronto uno de nuestros asesores se pondrá en contacto contigo</strong>
        </td>
    </tr>
    <tr><td height="35"></td></tr>
    <tr>
        <td align="center" class="main_container" style="text-align: center;">
            <strong class="color_primary">Detalles de tu cotización</strong>
        </td>
    </tr>
    <tr><td height="15"></td></tr>
    <tr>
        <td align="center" class="main_container">
            <p style="text-align: center;">${cart.name}<br>${cart.user_email}</p>
            <p style="text-align: center;">
              Cotización Número: ${cart.id}<br>
              Referencia: ${cart.ui_order}<br>
              Puedes descargar el PDF dando clic <a style="font-weight:bold" class="color_secondary" href="${site.url}/download/order-pdf/${cart.ui_order}?accessPdfOrder=${site.accessPdfKey}">aquí</a>
            </p>
        </td>
    </tr>
    <tr><td height="20"></td></tr>
    <table align="center" width="771" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
        <tr>
            <td class="main_container">
                <p class="color_primary" style="margin-top: 0px;margin-bottom: 0px;">Producto</p>
            </td>
            ${(site.show_price === 0 || site.show_price === 1) ? `
                <td class="main_container">
                <p class="color_primary" style="margin-top: 0px;margin-bottom: 0px; text-align: right;">Subtotal</p>
                </td>` 
            : '' }
        </tr>
    </table>
    <table align="center" width="771" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
        <tr>
            <td style="font-size: 9px;line-height: 9px;height: 9px;vertical-align: top;border-bottom: 1px solid #d3dce0;"></td>
        </tr>
        <tr><td height="20"></td></tr>
    </table>
    <table align="center" width="771" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
        ${details.map(detail => `
            <tr>
                <td class="main_container">
                    <a href="${site.url}/producto/${detail.code_product}"> <img src="${detail.imagen}" width="100" height="100" alt="${detail.code_product}"> </a>
                </td>
                <td>
                    <p style="margin-top: 0px;margin-bottom: 0px; font-size:18px"><strong>${detail.code_product}</strong></p>
                    <p class="color_primary" style="margin-top: 0px;margin-bottom: 0px;">${detail.name}</p>
                    <p>
                      ${site.show_grouped ? `Color: ${detail.color_provider}<br>` : ''}
                      Cantidad: ${detail.qty}
                      ${(site.show_price === 0 || site.show_price === 1) ? `<br>Precio Unitario: $${Number(detail.price).toFixed(2)}` : ''}
                    </p>
                </td>
                ${(site.show_price === 0 || site.show_price === 1) ? `
                    <td class="main_container">
                      <p class="color_primary" style="margin-top: 0px;margin-bottom: 0px; text-align: right;">$${(detail.price * detail.qty).toFixed(2)}</p>
                    </td>` 
                : '' }
            </tr>
            <tr><td height="20"></td></tr>
        `).join('')}
    </table>
    <tr><td height="20"></td></tr>
    ${(site.show_price === 0 || site.show_price === 1) ? `
        <table align="center" width="771" border="0" cellspacing="0" cellpadding="0">
            <tr bgcolor="#F6F6F6">
                <td align="right" class="main_container">
                  <p class="color_primary" style="font-size: 15px;margin-bottom: 0px; margin-top: 20px; text-align: right;">
                    Total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong class="color_secondary" style="font-size: 15px;">$${Number(cart.total).toFixed(2)}</strong>
                  </p>
                  <p class="color_primary" style="font-size: 13px;margin-bottom: 20px;text-align: right;">Los precios no incluyen IVA</p>
                </td>
            </tr>
        </table>
        <tr><td height="20"></td></tr>
    ` : '' }
    <tr><td height="30"></td></tr>`;

    return `${mail.init()}
    ${mail.headerCustomer()}
    ${content}
    ${mail.footerCustomer()}
    ${mail.end()}`;
}