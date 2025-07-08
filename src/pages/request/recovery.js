import { z } from 'zod';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { config } from "../../server/js/config.js";
import { customDecrypt } from "../../server/js/helpers.js";
import { getHtml } from '../../lib/emails/AccountRecovery.js';

export async function POST({ request, cookies }) {
    try {
        const body = await request.json();

        const schema = z.object({
            email: z.string().email(),
            token_data: z.string()
        });

        const result = schema.safeParse(body);
        if (!result.success) {
            return new Response(JSON.stringify({ result: false, message: 'Datos inválidos', errors: result.error.format() }), { status: 203 });
        }

        const dynamicKey = cookies.get('dinamic_key')?.value;
        if (!dynamicKey) {
            return new Response(JSON.stringify({ result: false, message: 'Datos faltantes' }), { status: 401 });
        }

        const {email,token_data } = result.data;
        const dataSite =  JSON.parse(customDecrypt(token_data));        ;

        const { data: response } = await axios.post(`${config.api_url}/user/recovery-account`, { token: dynamicKey, email });
        if (!response.result) {
            return new Response(JSON.stringify({ result: false, message: response.message || 'Error al enviar solicitud de recuperación.', errors: response || null }), { status: 200 });
        }

        const transporter = nodemailer.createTransport({
            host: config.mail_host,
            port: config.mail_port,
            secure: false,
            auth: {
                user: config.mail_user,
                pass: config.mail_pass,
            },
        });

        const subject = `Recuperación de contraseña - ${config.app_name}`;
        const mail_from = `"${config.app_name}" <${config.mail_user}>`;
        const URLtoken = `${dataSite.url}/cambiar-contrasena/${response.token_recovery}`;

        const mailData = { title: subject, site: dataSite, user: response.user.name, url:URLtoken };
        const htmlBody = await getHtml(mailData);
        await transporter.sendMail({ from: mail_from, to: email, subject: mailData.title, html: htmlBody });

        return new Response(JSON.stringify({ result: true, message: 'Se ha enviado el correo para recuperar la cuenta.' }), { status: 200 });
    } catch (error) {
        console.error('Error interno del servidor:', error);
        return new Response(JSON.stringify({ result: false, message: 'Error al enviar solicitud.', error: error.message }), { status: 500 });
    }
}