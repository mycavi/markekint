import axios from 'axios';
import { config } from '../server/js/config.js';
import { customDecrypt } from '../server/js/helpers.js';

export async function customerControl({ request, cookies, url, params, locals }, next) {
    let accessAdmin = locals.admin_access;
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:4321';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;
    
    const accessPdfOrder = url.searchParams.get('accessPdfOrder');
    const ui_order = params?.ui_order;
    if (accessPdfOrder && ui_order) {
        try {
            const accessPdfKey = customDecrypt(decodeURIComponent(accessPdfOrder));
            if (accessPdfKey === ui_order) {
                accessAdmin=true;
                cookies.set('accessOrder', '1', { path: '/', maxAge:  15 * 60 * 1000 }); // 15 minutos
            }else{
                cookies.delete('accessOrder', { path: '/' });
            }
        } catch (error) {
            console.error('Error validando accessPdfOrder:', error.message);
        }
    }
    locals.accessOrder = cookies.has('accessOrder');

    if (!cookies.has('customer') && !accessAdmin) {                
        if (request.method === 'POST') {
            return new Response( JSON.stringify({ status: false, message: 'Inicie sesión.' }), { status: 206, headers: { 'Content-Type': 'application/json' } } );
        }
        if (request.method === 'GET') { return Response.redirect(new URL('/', origin), 302); }
        return new Response(JSON.stringify({ result: 'unauthorized', status: false, message: 'Inicie sesión.' }), { status: 401 });
    }
    return await next();
}