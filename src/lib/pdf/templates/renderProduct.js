export function renderProduct({ product, site, config }) {
    const mainColor = site.settings.design.main_color;
    const imageUrl = product.imagen || 'https://mycavi.com/public/no-disponible.jpg';
    const title = `Ficha Técnica ${product.name_product} | ${config.app_name}`;
    const categories = product.categories || [];
    const printings = product.printing || [];

    const color_box = {
        "amarillo": "background-color:#F9F50C;",
        "azul": "background-color:#006CBA;",
        "beige": "background-color:#ECE4B0;",
        "blanco": "background-color:#FFFFFF;",
        "cafe": "background-color:#9B4A04;",
        "dorado": "background-color:#C8A22F;",
        "gris": "background-color:#B0AFAD;",
        "gris-obscuro": "background-color:#808080;",
        "plata": "background-color:#A6A9AA;",
        "madera": "background-color:#CB914A;",
        "morado": "background-color:#A148A0;",
        "naranja": "background-color:#F88323;",
        "negro": "background-color:#000000;",
        "rojo": "background-color:#F21823;",
        "rosa": "background-color:#FCAEC9;",
        "verde": "background-color:#24B900;",
        "vino": "background-color:#900404;",
        "coral": "background-color:#FF7062;",
        "multicolor": `background: linear-gradient(90deg, rgba(180, 58, 58, 1) 0%, rgba(255, 231, 0, 1) 20%, rgba(10, 248, 28, 1) 40%, rgba(0, 243, 249, 1) 60%, rgba(51, 52, 252, 1) 80%, rgba(228, 69, 252, 1) 100%);`
    };
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        header, footer, .header_top {
            position: fixed;
            width: 100%;
            left: 0;
            right: 0;
            font-size: 12px;
        }
        header {
            top: 25px;
            margin: 0px 35px; 
        }
        footer {
            bottom: 0;
        }
        .header_top{top: 0px; height:10px; background-color: ${mainColor}; width:100%;}
        body { font-size: 14px; font-family: Arial, sans-serif; }
        .main_container { margin: 120px 35px; 30px 35px }
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
        .ttl_product{ font-size: 75px; margin-bottom:0: font-weight: bolder; }
        .ttl_code{ text-transform: uppercase; color:#8b8b8b;}
        .color_box {
            border-radius: 50%; 
            border: 2px solid #ebebeb; 
            width: 30px;
            height: 30px;
        }        
    </style>
    </head>
    <body>
        <div class="header_top"></div>
        <header>
            <img src="${site.logo_site}" height="75px"/>
        </header>

        <div class="main_container">
            <div class="row">
                <div class="col-6 col-6--left">
                    <img src="${imageUrl}" alt="${product.name_product}" width="300" style="margin-bottom: 20px;" />

                    <table class="tbl__data" width="100%">
                        <thead>
                            <tr>
                            <td class="tbl__header_td" colspan="2" align="center" style="background:#F6F6F6; font-weight:bold; text-transform:uppercase; color:#8b8b8b;">Información del producto</td>
                            </tr>
                        </thead>
                        <tbody>
                            ${product.size_printing ? `<tr><td>Área impresión</td><td>${product.size_printing}</td></tr>` : ''}
                            ${product.material ? `<tr><td>Material</td><td>${product.material}</td></tr>` : ''}
                            ${product.width_p ? `<tr><td>Ancho producto</td><td>${product.width_p}</td></tr>` : ''}
                            ${product.height_p ? `<tr><td>Alto producto</td><td>${product.height_p}</td></tr>` : ''}
                            ${product.qty_package ? `<tr><td>Cantidad empaque</td><td>${product.qty_package.toLocaleString()}</td></tr>` : ''}
                            ${product.height_package ? `<tr><td>Alto empaque</td><td>${product.height_package}</td></tr>` : ''}
                            ${product.width_package ? `<tr><td>Ancho empaque</td><td>${product.width_package}</td></tr>` : ''}
                            ${product.package_weight ? `<tr><td>Peso empaque</td><td>${product.package_weight}</td></tr>` : ''}
                        </tbody>
                    </table>
                    
                    ${product.note ? `
                    <table class="tbl__data" width="100%" style="margin-top: 20px;">
                        <thead>
                            <tr>
                                <td class="tbl__header_td" colspan="2" align="center" style="background:#F6F6F6; font-weight:bold; text-transform:uppercase; color:#8b8b8b;"> Nota </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="2">${product.note}</td>
                            </tr>
                        </tbody>
                    </table>` : ''}
                </div>

                <div class="col-6 col-6--right">
                    <h1 class="color_mycavi" style="font-size: 55px; margin: 0 0 5px 0; font-weight: 800; line-height: 55px;">${product.name_product}</h1>
                    <h2 class="ttl_code" style="font-size: 25px; margin: 0 0 10px 0; font-weight: 800;">${product.code_product}</h2>
                    <p>${product.description}</p>
                   
                    <br>

                    ${site.settings.config.show_by_model === 1 && product.colores?.length > 0 ? `
                        <table class="tbl__data" width="100%">
                            <tbody>
                            <tr class="tbl__data_header" width="100%">
                                <th colspan="2" class="tbl__header_td" style="padding:15px 35px" align="left">
                                    <img width="28" style="margin-right:20px;" src="https://mycavi.com/public/pdf/icon-colors.png">Colores
                                </th>
                            </tr>
                            ${product.colores.map(color => `
                                <tr>
                                    <td align=""><div class="color_box" style="${color_box[color.code_color]}"></div></td>
                                    <td class="tbl__data_td" align="left">${color.name_color}</td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                        <br>
                    `: product.name_color ? `
                        <p>Color: <strong>${product.name_color}</strong></p>
                        <table> 
                            <tr><td height="10"></td></tr>
                            <tr><td><div class="color_box" style="${color_box[product.code_color]}"></div></td></tr>
                        </table>
                    ` : ''}

                    ${product.categories?.length > 0 ? `
                    <table class="tbl__data" width="100%">
                        <tbody>
                        <tr class="tbl__data_header" width="100%">
                            <td class="tbl__header_td">
                            <img width="28" style="margin-right:20px;" src="https://mycavi.com/public/pdf/icon-categories.png">Categorías
                            </td>
                        </tr>
                        ${product.categories.map(category => `
                            <tr><td class="tbl__data_td" align="center">${category.name_category}</td></tr>`).join('')}
                        </tbody>
                    </table>
                    <br>
                    ` : ''}

                    ${product.printing?.length > 0 ? `
                    <table class="tbl__data" width="100%">
                        <tbody>
                        <tr class="tbl__data_header" width="100%">
                            <td class="tbl__header_td">
                            <img width="28" style="margin-right:20px;" src="https://mycavi.com/public/pdf/icon-tecnicas.png">Técnicas de impresión
                            </td>
                        </tr>
                        ${product.printing.map(tech => `
                            <tr><td class="tbl__data_td" align="center">${tech.name_printing}</td></tr>`).join('')}
                        </tbody>
                    </table>
                    ` : ''}

                </div>
            </div> 
        </div>
    </body>
</html>`;
}