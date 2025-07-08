import { z } from 'zod';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { config } from "../../server/js/config.js";
import { customEncrypt,customDecrypt, getImage } from "../../server/js/helpers.js";
import { getMailUser } from '../../lib/emails/NewOrder.js';
import { getMailAdmin } from '../../lib/emails/NewOrderAdmin.js';

export async function POST({ request, cookies }) {
    try {
        const body = await request.json();

        const schema = z.object({
            token_data: z.string(),
            id_address: z.number().optional()
        });

        const result = schema.safeParse(body);
        if (!result.success) {
            return new Response(JSON.stringify({ status: false, message: 'Datos inválidos', errors: result.error.format() }), { status: 203 });
        }

        const dynamicKey = cookies.get('dinamic_key')?.value;
        const customer_token = cookies.get('customer')?.value;
        const ui_order = cookies.get('cart')?.value;

        if (!dynamicKey || !customer_token || !ui_order) {
            return new Response(JSON.stringify({ status: false, message: 'Sesión caducada o datos faltantes' }), { status: 401 });
        }

        const {id_address,token_data } = result.data;
        const dataSite =  JSON.parse(customDecrypt(token_data));        

        const postData = { token: dynamicKey, customer_token, ui_order };
        if (id_address) postData.id_address = id_address;

        const { data: response } = await axios.post(`${config.api_url}/cart/send`, postData);
        if (!response.status) {
            return new Response(JSON.stringify({ status: false, message: response.message || 'Error al enviar cotización.', errors: response || null }), { status: 200 });
        }
        cookies.delete('cart', { path: '/' });
        const cart = response.cart;

        const details = await Promise.all(
            response.details.map(async (product) => ({
                ...product,
                imagen: await getImage(product.imagen),
            }))
        );

        const accessPdfKey = customEncrypt(cart.ui_order);
        const subject = `Nueva Cotización - ${config.app_name}`;
        const mail_from = `"${config.app_name}" <${config.mail_user}>`;
        const mailData = { title: subject, cart, details, site: dataSite, accessPdfKey: encodeURIComponent(accessPdfKey) };

        const transporter = nodemailer.createTransport({
            host: config.mail_host,
            port: config.mail_port,
            secure: false,
            auth: {
                user: config.mail_user,
                pass: config.mail_pass,
            },
        });

        //Order to user
        const htmlUser = await getMailUser(mailData);
        if (dataSite.show_price === 0 || dataSite.show_price === 1) {
            await transporter.sendMail({ from: mail_from, to: cart.user_email, subject: mailData.title, html: htmlUser });
        }
        //Order to administrator
        const htmlAdmin = await getMailAdmin(mailData);
        const recipients = dataSite.notifications?.split(',').filter(email => email.trim() !== '') || [];
        const adminEmail = config.mail_receiver;
        
        if (recipients.length > 0) {
            const isAdminIncluded = recipients.includes(adminEmail);
            await transporter.sendMail({ from: mail_from, to: recipients, ...(isAdminIncluded ? {} : { bcc: adminEmail }), subject: subject, html: htmlAdmin });
        } else {
            await transporter.sendMail({ from: mail_from, to: adminEmail, subject: subject, html: htmlAdmin });
        }

        // Crear catálogo en VirtualCavi
        const vcidList = details.map(product => cookies.get(`VirtualCaviCatalog-${product.code}`)?.value).filter(Boolean);

        if (vcidList.length > 0) {
            const catalogueData = { name: cart.id, images: vcidList.join(',') };

            try {
              await axios.post('https://virtualcavi.mycavi.com/api/catalog/create', catalogueData, { headers: { Authorization: `Bearer ${config.virtualcavi_key}` } });
            } catch (vcError) {
              console.warn('Error al crear catálogo en VirtualCavi:', vcError.message);
            }
        }
        // Limpiar cookies VirtualCaviCatalog
        for (const [name] of Array.from(cookies).filter(([n]) => n.startsWith('VirtualCaviCatalog-'))) {
            cookies.delete(name, { path: '/' });
        }

        return new Response(JSON.stringify({ status: true, message: 'Se ha enviado la cotización' }), { status: 200 });
    } catch (error) {
        console.error('Error interno del servidor:', error);
        return new Response(JSON.stringify({ status: false, message: 'Error al enviar cotización', error: error.message }), { status: 500 });
    }
}