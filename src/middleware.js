import { siteControl } from './middlewares/siteControl.js';
import { apiControl } from './middlewares/apiControl.js';
import { customerControl } from './middlewares/customerControl.js';

const withMiddlewares = async (context, middlewares, next) => {
    if (!middlewares.length) return next();
    const [first, ...rest] = middlewares;
    return await first(context, () => withMiddlewares(context, rest, next));
};

export const onRequest = async (context, next) => {
    const { request } = context;
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Solo siteControl
    const siteControlled = await withMiddlewares(context, [siteControl], next);

    // siteControl +  customerControl
    const customerPaths = [
        '/request/cart-sent', 
        '/perfil', '/ficha-tecnica', '/cotizacion', '/gracias-por-cotizar',
        '/mis-cotizaciones', '/download',
    ];
    if (customerPaths.some(p => pathname.startsWith(p)) || /^\/cotizacion\/[^/]+$/.test(pathname) ) {
        return await withMiddlewares(context, [siteControl, customerControl], next);
    }

    return siteControlled;
};