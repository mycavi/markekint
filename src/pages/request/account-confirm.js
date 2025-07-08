import { z } from 'zod';
import axios from 'axios';
import { config } from "../../server/js/config.js";

export async function POST({ request, cookies }) {
    try {
        const body = await request.json();

        const schema = z.object({
            password: z.string().min(3),
            confirm_password: z.string().min(3),
            token: z.string().min(8),
        });

        const result = schema.safeParse(body);
        if (!result.success) {
            return new Response(JSON.stringify({ result: false, message: 'Datos inválidos', errors: result.error.format() }), { status: 203 });
        }

        const dynamicKey = cookies.get('dinamic_key')?.value;
        if (!dynamicKey) {
            return new Response(JSON.stringify({ result: false, message: 'Datos faltantes' }), { status: 401 });
        }
        
        const {password,confirm_password, token } = result.data;
        const { data: response } = await axios.post(`${config.api_url}/user/confirm-account`, { "token": dynamicKey, password, confirm_password, "customer_token": token});
        if (!response.result) {
            return new Response(JSON.stringify({ result: false, message: response.message || 'Error al enviar solicitud de cambio de contraseña.', errors: response || null }), { status: 200 });
        }
        cookies.set('customer', response.session_token, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 2 }); // 2 days
        
        return new Response(JSON.stringify({ result: true, message: 'Se ha iniciado su sesión.' }), { status: 200 });
    } catch (error) {
        console.error('Error interno del servidor:', error);
        return new Response(JSON.stringify({ result: false, message: 'Error al enviar solicitud.', error: error.message }), { status: 500 });
    }
}