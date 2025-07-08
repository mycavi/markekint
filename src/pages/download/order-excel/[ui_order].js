import axios from 'axios';
import ExcelJS from 'exceljs';
import { config } from '../../../server/js/config.js';

function cleanHtml(input) {
  const stripped = input.replace(/<\/?[^>]+(>|$)/g, "");
  return stripped;
}
export async function GET({ params, cookies, locals }) {
	const { ui_order } = params;
	const dynamicKey = cookies.get('dinamic_key')?.value;
	const customerToken = cookies.get('customer')?.value;
    const site = locals.site;

	if (!customerToken && !locals.active_user) {
		return new Response(null, { status: 302, headers: { Location: '/' } });
	}

	const postData = { token: dynamicKey, ui_order };
	if (customerToken) postData.customer_token = customerToken;

	try {
		const { data: response } = await axios.post(`${config.api_url}/order/excel-data`, postData);
		if (!response.status || !response.order) {
			return new Response(null, { status: 302, headers: { Location: '/excel-order-not-found/' + ui_order } });
		}
             
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(`Cotización ${ui_order}`);

		const showByModel = site.settings?.config?.show_by_model || false;
		const headers = [
			'Cotización', 'Nombre', 'Fecha', 'Status', 'Total de cotización',
			'Dirección', 'Teléfono', 'Código', 'Producto'
		];

		if (showByModel) headers.push('Color');

		headers.push(
			'Descripción', 'Precio', 'Técnica de impresión', 'Precio de impresión',
			'Cantidad', 'Subtotal', 'Imagen', 'Nota de producto', 'Nota de cotización'
		);

		worksheet.addRow(headers);

		// Styles
		worksheet.getRow(1).eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E3E3E3' } }; });

		(response.order).forEach(order => {
			const row = [
				order.ui_order,
				order.name_user || '',
				order.created_date || '',
				order.status_order,
				`$${Number(order.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
				order.direction || '',
				order.phone_contact || '',
				order.code_product || '',
				order.name || ''
			];

			if (showByModel) row.push(order.color_provider || '');

			row.push(
				order.description,
				`$${Number(order.price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
				order.name_printing || '',
				order.printing_price != null ? `$${Number(order.printing_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '',
				order.qty || '',
				`$${Number(order.subtotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
				order.imagen || '',
                cleanHtml((order.note_by_product || '')),
                cleanHtml((order.note || ''))
			);

			worksheet.addRow(row);
		});


		const buffer = await workbook.xlsx.writeBuffer();

		return new Response(buffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="Cotización ${ui_order}.xlsx"`
			}
		});

	} catch (error) {
		console.error('Error al generar Excel:', error.message);
		return new Response(null, { status: 302, headers: { Location: '/excel-error/' + ui_order } });
	}
}