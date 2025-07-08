import axios from 'axios';
import { config } from '../server/js/config.js';
import { requestWithCache, clearCache, customEncrypt } from '../server/js/helpers.js';

export const siteControl = async ({ request, locals, cookies }, next) => {
    let dynamicKey = cookies.get('dinamic_key')?.value;
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:4321';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    if (!dynamicKey) {
        const get_authentic = await authenticator();
        if (!get_authentic){
            return Response.redirect(new URL('/fuera-de-servicio', origin), 302);
        }
        cookies.set('dinamic_key', get_authentic, { path: '/', maxAge: 30 * 60 }); //minutos × segundos
        dynamicKey = get_authentic;
    }

    const getSiteData = await siteData(dynamicKey, cookies);
    if (!getSiteData){
        cookies.delete('dinamic_key', { path: '/' });
        clearCache();
        return Response.redirect(new URL('/404', origin), 302);
    }
    locals.site = getSiteData;

    try {
        const settings = await requestWithCache(`${config.api_url}/site/settings`, 'cachedSiteSettings', dynamicKey);
        if (settings.result === 'success') locals.site.settings = settings.data;
    } catch (err) {
        console.warn('No se pudieron cargar settings del sitio:', err.message);
    }

    locals.categories = [];
    try {
        const get_categories = await requestWithCache(`${config.api_url}/catalogue/categories`, 'cachedCategories', dynamicKey);
        if (get_categories.status && get_categories.categories) locals.categories = get_categories.categories;
    } catch (error) {
        console.warn('No se pudieron cargar las categorías:', error);
    }

    const url = new URL(request.url);
    locals.email_config = customEncrypt(JSON.stringify({
        'code': getSiteData.code_site,
        'logotype': getSiteData.logo_site,
        'color': getSiteData.settings.design.main_color,
        'notifications': getSiteData.notifications,
        'show_price': getSiteData.settings.config.show_price,
        'show_by_model': getSiteData.settings.config.show_by_model,
        'url': url.origin,
        'name': config.app_name
    }));    

    /* Check Admin access */
    const adminAccess = url.searchParams.get('admin_access');
    if (adminAccess) {
        try {
            const { data } = await axios.post(`${config.api_url}/admin/validate-access`, { 'token': dynamicKey,  'access': adminAccess });
            if (data.result === true && data.adminitrator) {
                locals.admin_user = data.adminitrator;
                cookies.set('admin_access', '1', { path: '/', maxAge: 60 * 60 * 24, }); // 1 día
            } else {
                delete locals.admin_user;
                cookies.delete('admin_access', { path: '/' });
            }
        } catch (error) {
            console.error('Error validando admin access:', error.message);
        }
    }
    locals.admin_access = cookies.has('admin_access');

    /* Check on construct*/
    if (getSiteData?.settings?.config?.on_construction === 1 && !cookies.has('admin_access')) {
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
};

const authenticator = async () => {
    try {
        const { data: authData } = await axios.post(`${config.api_url}/authenticator`, { "token_api": config.api_key });
        if (!authData.result) return false;
        return authData.token;
    } catch (error) {
        console.error('Error al autenticar:', error.message);
        return false;
    }
};

const siteData = async (token, cookies) => {
    try {
        const response = await axios.post(`${config.api_url}/site/data`, { token });

        if (!response.data.result) return false;
        return response.data.data;
    } catch (err) {
        console.error('Error cargando site/data:', err.message);
        return false;
    }
};