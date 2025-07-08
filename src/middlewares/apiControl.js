import axios from 'axios';
import { config } from '../server/js/config.js';

export async function apiControl({ request, locals, cookies, url }, next) {
    console.log('init apiControl');

    const dynamicKey = cookies.get('dinamic_key')?.value;
    const adminAccess = url.searchParams.get('admin_access');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:4321';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;


    /* Check on construct*/
    if (adminAccess) {
        try {
            const { data } = await axios.post(`${config.api_url}/admin/validate-access`, { 'token': dynamicKey,  'access': adminAccess });
            if (data.result === true && data.adminitrator) {
                locals.admin_user = data.adminitrator;
                cookies.set('admin_access', data.adminitrator, { path: '/', maxAge: 60 * 60 * 24, }); // 1 día
            } else {
                delete locals.admin_user;
                cookies.delete('admin_access', { path: '/' });
            }
        } catch (error) {
            console.error('Error validando admin_access:', error.message);
        }
    }
    
    const siteData = locals.site; 
    if (siteData?.settings?.config?.on_construction === 1 && !cookies.has('admin_access')) {
        return Response.redirect(new URL('/en-construccion', origin), 302);
    }

    /* Customer data */
    locals.active_user = 0;
    if (cookies.has('customer')) {
        const customerToken = cookies.get('customer')?.value;
        try {
            const { data } = await axios.post(`${config.api_url}/user/data`, { 'token': dynamicKey, 'token_session': customerToken });

            if (data.result && data.user) {
                locals.active_user = 1;
                locals.user = data.user;                
            } else {
                cookies.delete('customer', { path: '/' });
                if(locals.user) delete locals.user;  
            }
        } catch (error) {
            console.error('Error cargando ', error.message);
        }
    }

    return await next();
}