import axios from 'axios';
import { config } from "../../server/js/config.js";

export async function POST({ request, locals, cookies }) {
    let dynamicKey = cookies.get('dinamic_key')?.value;
    let customer = cookies.get('customer')?.value;

    if(!customer){
        return new Response(JSON.stringify({ result: false, message: 'unauthorized.' }), { headers: { 'Content-Type': 'application/json' }, status: 401 });
    }

    try {
        const { data: apiResponse } = await axios.post(`${config.api_url}/user/logout`, {"customer_token":customer, "token": dynamicKey});
        if (apiResponse.result) { 
            const headers_axios = { headers: { 'Content-Type': 'application/json' }, status: 200 };
            let response = { "result": true }
            cookies.delete('customer', { path: '/' });
            delete locals.user;
            locals.active_user = 0;
            return new Response(JSON.stringify(response), headers_axios);
        }
        return new Response(JSON.stringify({ result: false, message: apiResponse.message, errors: apiResponse.errors || null, api_response: apiResponse }), headers_axios);
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ result: false, message: 'No se pudo conectar con el servidor.', error: error.message }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
    }
}