function formatDate(dateStr) {
  const [day, month, year] = dateStr.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  const formatted = date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  return formatted.replace(/\sde\s/g, ' ').toUpperCase();
}
export function renderOrderCustom({ order, site, config }) {
    const mainColor = site.settings.design.main_color;
    
    const title = `Detalle Cotización ${order.id} | ${config.app_name}`;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        footer, .header_top {
            position: fixed;
            width: 100%;
            left: 0;
            right: 0;
            font-size: 12px;
        }
        header {
            margin: 50px 5px 30px 35px; 
        }
        footer {
            bottom: 0;
        }
        .header_top{top: 0px; height:10px; background-color: ${mainColor}; width:100%;}
        body { font-size: 14px; font-family: Arial, sans-serif; }
        .main_container { margin: 90px 5px; 30px 35px }
        .color_mycavi { color: ${mainColor}; }
        table { border-collapse: collapse; vertical-align: top; }
        .color_gris{color: #B3B2B2;}
        .tbl__data{ margin-top: 5px; }
        .tbl__data td {padding: 10px 30px; border-bottom: 2px solid #F6F6F6; vertical-align: middle;}
        .tbl__header_td{background-color: #F6F6F6; color:#8b8b8b; text-transform: uppercase;vertical-align: middle;}
        .tbl__data_td{background-color: #FFFFFF;}
        .footer__note{font-size: 12px;color:#3e3e3e;}
        .footer__note-general{font-size: 10px;color:#3e3e3e;}

        .row { display: flex; flex-wrap: wrap; }
        .col-6 { width: calc(50% - 40px);}
        .col-6--left{padding-right: 20px}
        .col-6--right{padding-left: 20px}

        //This file
        
    </style>
    </head>
    <body>
        <div class="header_top"></div>
        <header>
            <div class="row" style="align-items: center;">
                <div class="col-6 col-6--left">
                    <img src="${site.logo_site}" height="75px"/>
                </div>
                <div class="col-6 col-6--right" style="text-align: right;">
                    <h5 class="color_mycavi"  style="font-size: 30px; margin: 0 0 3px 0; font-weight: 800; line-height: 30px;">Cotización #${order.id}</h5>

                    ${order?.name ? `<p style="color: #000;margin: 0 0 3px 0;"> Cliente: <strong class="color_mycavi">${order.name}</strong> </p>` : ''}

                    ${order?.street && order?.state ? `
                    <p style="font-size: 13px;margin: 0 0 3px 0;">
                        Dirección: Calle ${order.street} No.${order.num_ext},
                        ${order.num_int ? `Num. Interior: ${order.num_int},` : ''}
                        Colonia ${order.col}, ${order.state} C.P. ${order.cp}
                    </p>` : ''}

                    ${order?.phone_contact ? `<p style="font-size: 13px;margin: 0 0 3px 0;">Teléfono: ${order.phone_contact}</p>` : ''}
                    
                    <p style="margin: 0 0 3px 0;">Fecha: <strong class="color_mycavi">
                        ${formatDate(order.created_date)}
                    </strong>
                    </p>

                </div>
            </div> 
        </header>

        <div class="main_container">
            <div class="row">
                <div class="col-6 col-6--left">

                </div>

                <div class="col-6 col-6--right">

                </div>
            </div> 
        </div>
    </body>
</html>`;
}