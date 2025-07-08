import axios from 'axios';
import { config } from '../../server/js/config.js';
import { imageToBase64,getImage } from '../../server/js/helpers.js';
import { generatePdf } from '../../lib/pdf/generate.js';
import { renderProduct } from '../../lib/pdf/templates/renderProduct.js';

export async function GET({ params, cookies, locals }) {
	const { code } = params;
	const dynamicKey = cookies.get('dinamic_key')?.value;
	const customerToken = cookies.get('customer')?.value;

    if (!(locals.active_user || locals.admin_access) && !customerToken) {
        return new Response(null, { status: 302, headers: { Location: '/' }, });
    }

	const postData = { token: dynamicKey, code_product: code, };
	if (customerToken) postData.customer_token = customerToken;

	try {
		const { data: response } = await axios.post(`${config.api_url}/product/detail`, postData);

		if (!response.result || !response.detail) {
            return new Response(null, { status: 302, headers: { Location: '/pdf-product-not-found/' + code, }, });
        }
		const product = response.detail;
        const site = locals.site;

		product.imagen = await getImage(product.imagen);

        const html = renderProduct({ product, site, config });
        const logoBase64 = await imageToBase64(site.favicon_site); 

        const footerHtml = `
        <footer>
            <div style="font-size:12px; width:100%; padding:0 15px;">
                <img src="${logoBase64}" style="padding-right:10px" width="15px"/> 
                <span style="color: gray; font-family: Arial, sans-serif;">Página <span class="pageNumber"></span> de <span class="totalPages"></span> </span>
            </div>
        </footer>`;       
		
        const pdfBuffer = await generatePdf(html, null, { footerHtml, margins: { top: '0px', bottom: '20px' } });
                
		return new Response(pdfBuffer, {
			status: 200,
			headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${code}.pdf"`, },
		});
	} catch (error) {
		console.error('Error al generar PDF:', error);
		return new Response(null, { status: 302, headers: { Location: '/pdf-error/' + code, }, });
	}
}