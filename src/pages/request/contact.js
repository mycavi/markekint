import { z } from 'zod';
import nodemailer from 'nodemailer';
import { config } from "../../server/js/config.js";
import { verifyCaptcha, customDecrypt } from "../../server/js/helpers.js";
import { getHtml } from '../../lib/emails/NewContact.js';

export async function POST({ request }) {
    const body = await request.json();

    const schema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        phone: z.string().min(8),
        comment: z.string().optional(),
        token_data: z.string(),
    }).passthrough();

    const result = schema.safeParse(body);

    const captchaResponse = await verifyCaptcha(body.captcha);
    if (!captchaResponse.success || captchaResponse.score < 0.5) {
        return new Response(JSON.stringify({ message: "Fallo en la validación del reCAPTCHA" }), 
            { status: 403, headers: { "Content-Type": "application/json" }, }
        );
    }

    if (!result.success) {
        return new Response(JSON.stringify({ message: 'Ingrese todos los datos obligatorios', errors: result.error.format() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { name, email, phone, comment = '', token_data } = result.data;
    const dataSite =  JSON.parse(customDecrypt(token_data));

    const transporter = nodemailer.createTransport({
        host: config.mail_host,
        port: config.mail_port,
        secure: false,
        auth: {
            user: config.mail_user,
            pass: config.mail_pass,
        },
    });

    const htmlBody = getHtml({ title: 'Nuevo Contacto', name, email, phone, message: comment, site: dataSite });

    try {
        await transporter.sendMail({
            from: `"${config.app_name}" <${config.mail_user}>`,
            to: dataSite.notifications,
            bcc: config.mail_receiver,
            subject: 'Mensaje de contacto',
            html: htmlBody,
        });

        return new Response(JSON.stringify({ message: 'Formulario enviado con éxito.'}), 
            { status: 200, headers: { 'Content-Type': 'application/json' }, }
        );
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return new Response( JSON.stringify({ message: 'Error al enviar el correo' }), 
            { status: 500, headers: { 'Content-Type': 'application/json' }, }
        );
    }
}