import { z } from 'zod';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { config } from "../../server/js/config.js";
import { customDecrypt } from "../../server/js/helpers.js";
import { getMailUser } from '../../lib/emails/NewRegister.js';
import { getMailAdmin } from '../../lib/emails/NewRegisterAdmin.js';

export async function POST({ request, cookies }) {
    try {
        const body = await request.json();

        const schema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            phone: z.string().min(8),
            company: z.string().optional(),
            token_data: z.string(),
        }).passthrough();

        const result = schema.safeParse(body);
        if (!result.success) {
            return new Response(JSON.stringify({ status: false, message: 'Datos inválidos', errors: result.error.format() }), { status: 203 });
        }

        const dynamicKey = cookies.get('dinamic_key')?.value;

        if (!dynamicKey) {
            return new Response(JSON.stringify({ status: false, message: 'Sesión caducada o datos faltantes' }), { status: 401 });
        }

        const {name,email, phone, company, token_data } = result.data;
        const dataSite =  JSON.parse(customDecrypt(token_data));        

        const postData = { token: dynamicKey, name,email, phone, company };

        const { data: response } = await axios.post(`${config.api_url}/user/register`, postData);
        if (!response.result) {
            return new Response(JSON.stringify({ status: false, message: response.message || 'No se pudo realizar el registro.', errors: response || null }), { status: 200 });
        }

        const urlAccess = `${dataSite.url}/cambiar-contrasena/${response.token}`;

        const mail_from = `"${config.app_name}" <${config.mail_user}>`;
        const mailDataUser = { title: `Confirmación de cuenta - ${config.app_name}`, name, urlAccess, site: dataSite};
        const mailDataAdmin = { title: `Nuevo registro de cuenta - ${config.app_name}`, name, email,phone, company, clte: response.customer , site: dataSite};

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
        const htmlUser = await getMailUser(mailDataUser);
        await transporter.sendMail({ from: mail_from, to: email, subject: mailDataUser.title, html: htmlUser });
        
        //Order to administrator
        const htmlAdmin = await getMailAdmin(mailDataAdmin);
        const recipients = dataSite.notifications?.split(',').filter(email => email.trim() !== '') || [];
        const adminEmail = config.mail_receiver;
        
        if (recipients.length > 0) {
            const isAdminIncluded = recipients.includes(adminEmail);
            await transporter.sendMail({ from: mail_from, to: recipients, ...(isAdminIncluded ? {} : { bcc: adminEmail }), subject: mailDataAdmin.title, html: htmlAdmin });
        } else {
            await transporter.sendMail({ from: mail_from, to: adminEmail, subject: mailDataAdmin.title, html: htmlAdmin });
        }

        return new Response(JSON.stringify({ status: true, message: 'Sus datos han sido registrados, a la brevedad recibirá un correo para confirmar su cuenta.' }), { status: 200 });
    } catch (error) {
        console.error('Error interno del servidor:', error);
        return new Response(JSON.stringify({ status: false, message: 'Error al realizar registro', error: error.message }), { status: 500 });
    }
}