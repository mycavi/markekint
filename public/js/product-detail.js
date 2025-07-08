import {Theme} from '/js/components/theme.js';
const raw = document.getElementById('data-product');
const { viewed_products } = JSON.parse(raw.textContent);

document.addEventListener("DOMContentLoaded", function () {
    let gallery = document.querySelector("#gallery");
    if (gallery) {
        gallery.addEventListener("slid.bs.carousel", function () {
            let images = gallery.querySelectorAll(".carousel-item img");
            images.forEach(img => {
                if (img.closest(".carousel-item").classList.contains("active")) {
                    img.setAttribute("virtualcavi", "mainImg");
                } else {
                    img.removeAttribute("virtualcavi");
                }
            });
        });
    }

    const render = new Theme();
    const loader_products = render.previewLoaderCarrusel();
    document.querySelector('#related_products').innerHTML = loader_products;
    initProductsCarrusel('#slide_related');
});

document.addEventListener("SecondaryLoad", async function (event) {
    Fancybox.bind("[data-fancybox]", {});
    const dataPost = { "token": theme.site.token  };
    if(theme.user.active && theme.user?.token) dataPost['customer_token'] = theme.user.token
    const render = new Theme();

    if(!theme.showByModel){
        const post_parent = dataPost;
        post_parent['parent']= parent;
        const response = await axios.post(`${theme.site.request}/products/parent`, post_parent);
        const parent_rq = response.data;
        if (parent_rq.status && parent_rq.products.length > 0) {
            $('#parent').fadeIn('slow');
           
            document.querySelector('#parent_products').innerHTML = render.parentProducts(parent_rq.products);
            $(function () { $('[data-bs-toggle="tooltip"]').tooltip() });
        }
    }
    
   
    try {
        const post_related = dataPost;
        post_related['code_product']= code_product;
        const response = await axios.post(`${theme.site.request}/products/related`, post_related);
        const related = response.data;

        if (related.status && related.products.length > 0) {
            document.querySelector('#related_products').innerHTML = render.products(related.products, '', true);
            initProductsCarrusel('#slide_related');
            tooltipInit()
        } else {
            $('#related').fadeOut(100);
        }
    } catch (error) {
        console.error('Error al cargar productos relacionados:', error);
        $('#related').fadeOut(100);
    }


    if (document.querySelector('#view')) {
        try {
            const post_viewed = dataPost;
            post_viewed['current']= code_product;
            post_viewed['products']= viewed_products.join(',');
            const viewed_response = await axios.post(theme.site.request + '/products/viewed', post_viewed);
            const viewed = viewed_response.data;
            if (viewed.result && viewed.products.length > 0) {
                $('#view').fadeIn('slow');
                document.querySelector('#view_products').innerHTML = render.products(viewed.products, '', true);
                initProductsCarrusel('#slide_view');
                tooltipInit()
            }
        } catch (error) {
            $('#view').fadeOut(100);
        }
    }
});