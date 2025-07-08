import { customEncrypt } from "../../server/js/helpers.js";

export async function GET({ cookies }) {
    const cartKey = cookies.get("cart")?.value;
    
    try {
        let accessPdfKey;
        if(cartKey) accessPdfKey = customEncrypt(cartKey); 
    
        return new Response(JSON.stringify({ token: accessPdfKey}), 
            { status: 200, headers: { 'Content-Type': 'application/json' }, }
        );
    } catch (error) {
        return new Response( JSON.stringify({ message: 'Error al enviar el correo' }), 
            { status: 500, headers: { 'Content-Type': 'application/json' }, }
        );
    }
}