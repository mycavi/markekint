import axios from 'axios';
import { z } from 'zod';
import { config } from "../../server/js/config.js";

export async function POST({ request, locals, cookies }) {
    let dynamicKey = cookies.get('dinamic_key')?.value;

    const body = await request.json();

    const schema = z.object({
        password: z.string().min(3),
        email: z.string().email(),
        cart: z.string().optional(),
        go_checkout: z.string().optional(),
    }).passthrough();

    const result = schema.safeParse(body);

    if (!result.success) {
        return new Response(JSON.stringify({ message: 'Ingrese todos los datos obligatorios', errors: result.error.format() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { password, email, cart, go_checkout } = result.data;

    try {
        const { data: apiResponse } = await axios.post(`${config.api_url}/user/login`, {password, email, "token": dynamicKey, "ui_order":cart});
        if (apiResponse.result) { 
            const headers_axios = { headers: { 'Content-Type': 'application/json' }, status: 200 };
            let response = { "result": true, "message": 'Se ha iniciado su sesión.', "go_checkout": go_checkout === '1'}
            cookies.set('customer', apiResponse.session_token, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 2 }); // 2 days
            if (apiResponse.ui_order) {
                response['cart'] = apiResponse.ui_order;
            }
            return new Response(JSON.stringify(response), headers_axios);
        }
        return new Response(JSON.stringify({ result: false, message: apiResponse.message, errors: apiResponse.errors || null, api_response: apiResponse }), headers_axios);
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ result: false, message: 'No se pudo conectar con el servidor.', error: error.message }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
    }
}