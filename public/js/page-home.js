import { Theme } from '/js/components/theme.js';

try {
    new Splide('#slide_home', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 5000,
        arrows: false,
        resetProgress: false
    }).mount();
} catch (error) {
    console.error("Splide Load:", error);
}

const render = new Theme();
const loader_products = render.previewLoaderCarrusel();

const featured_products = document.querySelector('#featured_products');
featured_products.innerHTML = loader_products;
$('#featured').fadeIn('slow');
initProductsCarrusel('#slide_featured');

const month_products = document.querySelector('#month_products');
month_products.innerHTML = loader_products;
$('#month').fadeIn('slow');
initProductsCarrusel('#slide_month');

document.addEventListener("SecondaryLoad", async function (event) {
    const dataPost = { "token": theme.site.token  };
    if(theme.user.active && theme.user?.token) dataPost['customer_token'] = theme.user.token
    try {
        const response = await axios.post(`${theme.site.request}/products/featured`, dataPost);
        const featured = response.data;

        if (featured.status && featured.products.length > 0) {
            featured_products.innerHTML = render.products(featured.products, '', true);
            initProductsCarrusel('#slide_featured');
            tooltipInit()
        } else {
            $('#featured').fadeOut(100);
        }
    } catch (error) {
        console.error('Error al cargar productos destacados:', error);
        $('#featured').fadeOut(100);
    }

    try {
        const response = await axios.post(`${theme.site.request}/products/most-visited`, dataPost);
        const most_visited = response.data;

        if (most_visited.status && most_visited.result.length > 0) {
            month_products.innerHTML = render.products(most_visited.result, '', true);
            initProductsCarrusel('#slide_month');
            tooltipInit()
        } else {
            $('#month').fadeOut(100);
        }
    } catch (error) {
        console.error('Error al cargar productos más visitados:', error);
        $('#month').fadeOut(100);
    }
});