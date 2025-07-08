function formatDate(dateStr) {
  const [day, month, year] = dateStr.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  const formatted = date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  return formatted.replace(/\sde\s/g, ' ').toUpperCase();
}
export function renderOrder({ order, site, config }) {
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
        header { margin: 50px 5px 30px 35px; }
        footer { bottom: 0; margin: 50px 0px 0px 0px;}
        .header_top{top: 0px; height:10px; background-color: ${mainColor}; width:100%;}
        body { font-size: 10px; font-family: Arial, sans-serif; margin: 40px 0px 0px 0px; }
        .main_container { margin: 40px 25px; 30px 35px }
        .color_mycavi { color: ${mainColor}; }
        table { border-collapse: collapse; vertical-align: top; }
        .color_gris{color: #B3B2B2;}
        .tbl__data{ margin-top: 5px; }
        .tbl__data td {padding: 10px 30px; border-bottom: 2px solid #F6F6F6; vertical-align: middle;}
        .tbl__header_td{background-color: #F6F6F6; color:#8b8b8b; text-transform: uppercase;vertical-align: middle;}
        .tbl__data_td{background-color: #FFFFFF;}
        .note-box {
            background-color: #fff8dc; /* color tipo amarillo claro */
            border-left: 5px solid #ffc107; /* amarillo tipo Bootstrap */
            padding: 8px 10px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            font-family: Arial, sans-serif;
            color: #333;
            margin: 5px 0 0 0;
        }

        .row { display: flex; flex-wrap: wrap; }
        .col-6 { width: calc(50% - 40px);}
        .col-6--left, .col-4--left, .col-8--left{padding-right: 20px}
        .col-6--right,.col-4--right,.col-8--right{padding-left: 20px}
        .col-4 { width: calc(40% - 40px);}
        .col-8 { width: calc(60% - 40px);}

        //This file
        .product_description{font-size:12px;}
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

                    ${order?.name ? `<p style="font-size: 15px;color: #000;margin: 0 0 3px 0;"> Cliente: <strong class="color_mycavi">${order.name}</strong> </p>` : ''}

                    ${order?.street && order?.state ? `
                    <p style="font-size: 15px;margin: 0 0 3px 0;">
                        Dirección: Calle ${order.street} No.${order.num_ext},
                        ${order.num_int ? `Num. Interior: ${order.num_int},` : ''}
                        Colonia ${order.col}, ${order.state} C.P. ${order.cp}
                    </p>` : ''}

                    ${order?.phone_contact ? `<p style="font-size: 15px;margin: 0 0 3px 0;">Teléfono: ${order.phone_contact}</p>` : ''}
                    
                    <p style="font-size: 15px;margin: 0 0 3px 0;">Fecha: <strong class="color_mycavi">
                        ${formatDate(order.created_date)}
                    </strong>
                    </p>

                </div>
            </div> 
        </header>

        <div class="main_container">
            <table class="tbl__data">
                <tr class="tbl__data_header">
                    <td class="tbl__header_td" style="padding: 10px 10px;" align="center">Producto</td>
                    <td class="tbl__header_td" style="padding: 10px 10px;" align="center">Descripción</td>
                    ${order.total ? `<td class="tbl__header_td" style="padding: 10px 10px;" align="center">Precio</td>` : ''}
                    <td class="tbl__header_td" style="padding: 10px 10px;" align="center">Impresión</td>
                    ${order.details?.[0]?.printing_price !== undefined ? `<td class="tbl__header_td" style="padding: 10px 10px;" align="center">P. Unitario</td>` : ''}
                    <td class="tbl__header_td" style="padding: 10px 10px;" align="center">Cant.</td>
                    ${order.total ? `<td class="tbl__header_td" style="padding: 10px 10px;" width="15%" align="center">Subtotal</td>` : ''}
                </tr>

                ${order.details.map(product => `
                    <tr>
                    <td class="tbl__data_td" style="padding: 15px 10px;" align="center">
                        <a href="${config.app_url}/producto/${product.code_product}" target="_blank" style="text-decoration:none;color:inherit;">
                        <strong class="font-medium color_mycavi">${product.name}</strong><br>
                        <img src="${product.imagen}" width="100px" height="auto"><br>
                        <strong class="color_gris" style="text-transform: uppercase;">${product.code_product}</strong><br>
                        ${site.settings.config.show_by_model === 1 ? `<span style="text-transform: uppercase;">Color ${product.color_provider}</span>` : ''}
                        </a>
                    </td>

                    <td class="tbl__data_td" style="padding: 15px 10px; width:30%">
                        <div class="product_description">${product.description}</div>
                        ${product.note ? `<div class="note-box"><strong>Nota:</strong> ${product.note}</div>` : ''}
                    </td>

                    ${product.price !== undefined ? `
                        <td class="tbl__data_td" align="center">
                        $${Number(product.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })} <br>
                        </td>` : ''
                    }

                    <td class="tbl__data_td">
                        ${product.name_printing ? `${product.name_printing}<br>` : ''}
                        ${product.printing_price !== undefined ? `$${Number(product.printing_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })} c/u` : ''}
                    </td>

                    ${(product.price !== undefined && product.printing_price !== undefined) ? `
                        <td class="tbl__data_td" align="center">
                        $${(Number(product.price) + Number(product.printing_price)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>` : ''
                    }

                    <td class="tbl__data_td" align="center">
                        <div class="">${Number(product.qty).toLocaleString('es-MX')}</div>
                    </td>

                    ${product.subtotal !== undefined ? `
                        <td class="tbl__data_td" width="15%" align="right">
                        <strong class="">$${Number(product.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
                        </td>` : ''
                    }
                    </tr>
                `).join('')}
            </table>

            <div class="row" style="margin: 20px 0 0 0">
                <div class="col-8 col-8--left" style="font-size: 15px;">
                    ${order.note ? `<p class=""><strong>Nota:</strong></p> ${order.note} ` : ''}
                </div>

                <div class="col-4 col-4--right">
                    ${order.total !== undefined ? (() => {
                    const iva = site.settings.config.show_taxes === 1 ? order.total * 0.16 : 0;
                    const subtotalHTML = site.settings.config.show_taxes === 1 ? 
                        `<p class="" style="margin:0;">Subtotal: $${Number(order.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        <p class="" style="margin:0;">IVA: $${Number(iva).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>`
                        : '';
                    const total = order.total + iva;
                    return `
                        <div style="text-align: right;font-size: 15px;">
                            ${subtotalHTML}
                            <p class="" style="margin:0;"><strong>TOTAL: $${Number(total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></p>
                        </div>
                    `;
                    })() : ''}
                </div>
            </div> 
        </div>
        <div class="main_container">
            ${order.general_note ? ` <div class="footer__note-general" style="font-size: 15px;border-top: 2px solid #F6F6F6; padding:10px 0px;"> ${order.general_note} </div> ` : ''}
        </div>
    </body>
</html>`;
}