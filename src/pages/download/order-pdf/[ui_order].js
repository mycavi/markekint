import axios from 'axios';
import { config } from '../../../server/js/config.js';
import { imageToBase64, getImage } from '../../../server/js/helpers.js';
import { generatePdf } from '../../../lib/pdf/generate.js';
import { renderOrder } from '../../../lib/pdf/templates/renderOrder.js';
import { renderOrderByProduct } from '../../../lib/pdf/templates/renderOrderByProduct.js';
import { renderOrderCustom } from '../../../lib/pdf/templates/renderOrderCustom.js';

export async function GET({ params, cookies, locals }) {
	const { ui_order } = params;
	const dynamicKey = cookies.get('dinamic_key')?.value;
	const customerToken = cookies.get('customer')?.value;
        
    if (!(locals.active_user || locals.admin_access || locals.accessOrder) && !customerToken) {
        return new Response(null, { status: 302, headers: { Location: '/' }, });
    }

	const postData = { token: dynamicKey, ui_order };
	if (customerToken) postData.customer_token = customerToken;

	try {
		const { data: response } = await axios.post(`${config.api_url}/order/detail`, postData);
        
		if (!response.status || !response.detail) {
            return new Response(null, { status: 302, headers: { Location: '/pdf-order-not-found/' + code, }, });
        }
        const details = await Promise.all(
            response.detail.map(async (product) => ({
                ...product,
                imagen: await getImage(product.imagen),
            }))
        );        
		const order = response.order;
		order['details'] = details;
        const site = locals.site;
        let html;

        const logoBase64 = await imageToBase64(site.favicon_site); 
        const footerHtml = `
        <footer>
            <div style="font-size:12px; width:100%; padding:0 15px;">
                <img src="${logoBase64}" style="padding-right:10px" width="15px"/> 
                <span style="color: gray; font-family: Arial, sans-serif;">Página <span class="pageNumber"></span> de <span class="totalPages"></span> </span>
            </div>
        </footer>`;
        
        let dataPDF = { footerHtml, margins: { top: '0', bottom: '20px' } };
        switch (order.code_order_style) {
            case 'product-horizontal':
                html = renderOrderByProduct({ order, site, config });
                dataPDF = { footerHtml, landscape: true, margins: { top: '0px', bottom: '20px' }, };
                break;
            case 'custom':
                html = renderOrderCustom({ order, site, config });
                break;
            default:
                html = renderOrder({ order, site, config });
                break;
        }
		
        const pdfBuffer = await generatePdf(html, null, dataPDF);

		return new Response(pdfBuffer, {
			status: 200,
			headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="Cotización ${order.id}.pdf"`, },
		});
	} catch (error) {
		console.error('Error al generar PDF:', error);
		// return new Response(null, { status: 302, headers: { Location: '/pdf-error/' + ui_order, }, });
	}
}