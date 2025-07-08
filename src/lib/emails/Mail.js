export function getMail(title, site ) {
  const year = new Date().getFullYear();

  const init = () => { 
    return `
    <!DOCTYPE html
      PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${site}</title>
      </head>
      <style type="text/css">
            @font-face {
              font-family: 'Roboto';
              font-style: normal;
              font-weight: 400;
              src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; 
            }
            @font-face {
              font-family: 'Roboto';
              font-style: normal;
              font-weight: 400;
              src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; 
            }
            @font-face {
              font-family: 'Roboto';
              font-style: normal;
              font-weight: 700;
              src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; 
            }
            @font-face {
              font-family: 'Roboto';
              font-style: normal;
              font-weight: 700;
              src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; 
            }
            a { text-decoration: none; outline: none; color: inherit;}
            body{font-family: Helvetica, Arial, sans-serif;}
            .title_1{ font-size: 30px; font-weight: 700; }
            .title_2{ font-size: 24px; font-weight: 700; }
            .title_3{ font-size: 18px; font-weight: 700; }
            .color_primary{color: #a5a1a1; }
            .footer_small{ font-size: 14px; }
            .footer__txt{ font-size: 14px; color: #747474; }
            .main_container{ padding-left: 25px;padding-right: 25px; }
            .color_secondary{ color: ${site.color}; }
        </style>
      
        <body style="background: #fcfcfc;">
        <table width="771" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">`;
  };

  const end = () => {
    return `</table>  
      </body>
      </html>`
  };

  const headerAdmin =() => {
    return `<tr>
      <td class="main_container" style="padding-top: 15px; padding-bottom: 15px;">
          <a  href="${site.url}" class="">
              <img src="${site.logotype}" alt="${site.name}" width="180" height="auto" style="max-width: 180px;" class="header__logo">
          </a>
      </td>
    </tr> 
    <tr>
      <td height="30"></td>
    </tr>`;
  }
  const headerCustomer =() => {
    return `<tr>
      <td class="main_container" style="padding-top: 15px; padding-bottom: 15px;text-align: center;">
          <a  href="${site.url}" class="">
              <img src="${site.logotype}" alt="${site.name}" width="180" height="auto" style="max-width: 180px;" class="header__logo">
          </a>
      </td>
    </tr>
    <tr>
        <td height="30"></td>
    </tr>`;
  }
  const footerAdmin = () => {
    return `<tr><td>
      <table align="center" width="771" border="0" cellspacing="0" cellpadding="0" bgcolor="#F6F6F6">
          <tr>
              <td height="20"></td>
          </tr>
          <tr>
              <td class="main_container">
                  <table width="200" border="0" align="left" cellpadding="0" cellspacing="0">
                      <tr>
                          <td>
                              <a href="https://telaio.com.mx?referer=${site.code}">
                                  <img alt="MyCavi" src="https://mycavi.com/public/mycavi_logo.png" width="120" height="auto" style="max-width: 120px;" class="footer__logo">
                              </a>
                          </td>
                      </tr>
                  </table>
                  <table width="450" border="0" align="right" cellpadding="0" cellspacing="0">
                      <tr>
                          <td>
                              <p class="footer__txt" style="margin-bottom: 0px; margin-top: 0; text-align: right;">
                                  ©${year} Todos los derechos reservados ${site.name}.<br>
                                  <a class="footer__txt" href="https://mycavi.com?referer=${site.code}">Powered by MyCavi</a>
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>

          <tr>
              <td height="20"></td>
          </tr>
      </table>
    </td></tr>`;
  }
  const footerCustomer =() => {
    return `<table align="center" width="771" border="0" cellspacing="0" cellpadding="0" bgcolor="#F6F6F6">
        <tr>
            <td height="20"></td>
        </tr>
        <tr>
            <td align="center" class="main_container">
                <p class="footer__txt" style="margin-bottom: 0px; margin-top: 0; text-align: center;">
                    ©${year} Todos los derechos reservados ${site.name}.<br>
                    <a class="footer__txt" href="https://mycavi.com?referer=${site.code}">Powered by MyCavi</a>
                </p>
            </td>
        </tr>
        <tr>
            <td height="20"></td>
        </tr>
    </table>`;
  }

  return {init, end, headerAdmin, headerCustomer, footerAdmin, footerCustomer}
}

