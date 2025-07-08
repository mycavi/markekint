function formatDate(dateStr) {
  const [day, month, year] = dateStr.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  const formatted = date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  return formatted.replace(/\sde\s/g, ' ').toUpperCase();
}
export function renderOrderByProduct({ order, site, config }) {
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
            margin: 50px 5px 30px 20px; 
        }
        footer {
            bottom: 0;
            margin: 50px 0px 0px 0px;
        }
        .header_top{top: 0px; height:10px; background-color: ${mainColor}; width:100%;}
        body { font-size: 15px; font-family: Arial, sans-serif; margin: 40px 0px 0px 0px; }
        .main_container { margin: 20px 25px; 30px 15px; }
        .main_container_product{margin: 10px 25px 20px 5px; }
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
            padding: 10px 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
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
                    <h5 class="color_mycavi"  style="font-size: 25px; margin: 0 0 3px 0; font-weight: 800; line-height: 30px;">Cotización #${order.id}</h5>

                    ${order?.name ? `<p style="font-size: 14px;color: #000;margin: 0 0 3px 0;"> Cliente: <strong class="color_mycavi">${order.name}</strong> </p>` : ''}

                    ${order?.street && order?.state ? `
                    <p style="font-size: 14px;margin: 0 0 3px 0;">
                        Dirección: Calle ${order.street} No.${order.num_ext},
                        ${order.num_int ? `Num. Interior: ${order.num_int},` : ''}
                        Colonia ${order.col}, ${order.state} C.P. ${order.cp}
                    </p>` : ''}

                    ${order?.phone_contact ? `<p style="font-size: 14px;margin: 0 0 3px 0;">Teléfono: ${order.phone_contact}</p>` : ''}
                    <p style="font-size: 14px;margin: 0;">Fecha: <strong class="color_mycavi"> ${formatDate(order.created_date)} </strong> </p>
                </div>
            </div> 
        </header>

        <div class="main_container_product">
        ${order.details.map((product, index) => `
            ${index >= 1 ? '<div style="page-break-before: always;"></div>' : ''}
            <div class="row" style="align-items: center;">
                <div class="col-6 col-6--left">
                    <img src="${product.imagen}" width="550px" height="auto"><br>
                </div>
                <div class="col-6 col-6--right">
                    <p style="font-size: 30px; margin: 0 0 8px 0; font-weight: 800; line-height: 33px;"><strong class="color_mycavi">${product.name}</strong></p>
                    <strong class="color_gris" style="font-size: 25px; margin: 0 0 5px 0; font-weight: 800; line-height: 25px;text-transform: uppercase">${product.code_product}</strong><br><br>

                    <div class="product_description ">${product.description}</div><br>

                    ${site.settings.config.show_by_model === 1 && product.name_color ? `
                        <p style="margin: 0 0 10px 0;">
                            <strong class="">Color:</strong> <span class="">${product.name_color}</span>
                        </p>` : ''}

                    <p style="margin: 0 0 10px 0;" class=""><strong class="">Cantidad:</strong> ${Number(product.qty).toLocaleString()}</p>

                    ${product.price !== undefined ? `
                        <p class="" style="margin:0 5px 0 0"><strong>Precio por pieza:</strong></p>
                        <p class="" style="margin:0 3px 0 0">Producto: $${Number(product.price).toFixed(2)}</p>

                        ${(product.name_printing || product.printing_price !== undefined) ? `
                            <p class="" style="margin:0 3px 0 0"> ${product.name_printing ?? 'Impresión'}: ${product.printing_price !== undefined ? `$${Number(product.printing_price).toFixed(2)} c/u` : ''} </p>
                        ` : ''}

                        ${product.printing_price !== undefined ? ` <p class="" style="margin:0 3px 0 0"> P. Unitario: $${Number(product.price + product.printing_price).toFixed(2)} </p> ` : ''}
                    ` : ''}

                    ${product.subtotal !== undefined ? ` <p style="margin:30px 0 10px 0"><strong class="">Total: $${Number(product.subtotal).toFixed(2)}</strong></p> ` : ''}

                    ${product.note ? `<div class="note-box"><strong>Nota:</strong> ${product.note}</div> ` : ''}
                </div>
            </div>
        `).join('')}
        </div>

        <div class="main_container">
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