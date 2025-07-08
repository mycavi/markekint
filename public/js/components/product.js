
const modalPreview = document.getElementById('previewProduct');
if (theme.showByModel) {
    import('./product-grouped.js').then(module => {
        window.initGrouped = module.initGrouped;
        window.selectCircleColor = module.selectCircleColor;
    });
}
if (theme.user.active) {
    import('./notifications.js').then(module => {
        window.stockNotification = module.stockNotification;
    });
}

class Product {
    constructor() { }
    async detail(code_product){
        try {
            let data = { 'code_product': code_product, 'token': theme.site.token }
            if (theme.user?.active) data['customer_token'] = theme.user.token;
            const { data: response } = await axios.post(`${theme.site.request}/product/detail`, data);
            return response?.result ? response : false;
        } catch (error) {
            console.error('Error al obtener detalle del producto:', error);
            return false;
        }
    }
    async setView(code_product) {
        try {
            let data = { 'code_product': code_product, 'token': theme.site.token }
            const { data: response } = await axios.post(`${theme.site.request}/product/view-set`, data);
            return response?.result ? response : false;
        } catch (error) {
            console.error('Error al registrar vista:', error);
            return false;
        }
    }
    shareOptions(code_product) {
        const url = `${theme.site.url}/producto/${code_product}`;
        return `<div class="dropdown d-inline">
            <button class="btn btn-sm btn-mycavi btn-mycavi-breadcrumb dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-share-fill me-2"></i> Compartir</button>
            <ul class="dropdown-menu">
                <li><button class="dropdown-item" onclick="shareProduct('whatsapp', '${url}')"><i class="bi bi-whatsapp me-2"></i>WhatsApp</button></li>
                <li><button class="dropdown-item" onclick="shareProduct('facebook', '${url}')"><i class="bi bi-facebook me-2"></i>Facebook</button></li>
                <li><button class="dropdown-item" onclick="shareProduct('twitter', '${url}')"><i class="bi bi-twitter me-2"></i>Twitter</button></li>
                <li><a class="dropdown-item" onclick="shareProduct('email', '${url}')"><i class="bi bi-envelope me-2"></i>Email</a></li>
                <li><button class="dropdown-item" onclick="shareProduct('copy', '${url}', this)"><i class="bi bi-clipboard me-2"></i>Copiar enlace</button></li>
            </ul>
        </div>`;
    }
    virtualCaviScript() {
        try {
            if (!document.getElementById('virtualCavi')) {
                const script = document.createElement('script');
                script.type = "text/javascript";
                script.src = `https://mycavi.com/virtualCavi-bundle/virtualCavi.min.js?key=${theme.site.virtualcavi}`;
                script.id = "virtualCavi";
                script.onload = function () {
                    window.VCsnippetConfig = window.VCsnippetConfig || {};
                    VCsnippetConfig.saveToInput = `Cotizar`;
                    VCsnippetConfig.mainBtn = `¡Prueba o cotiza con tu logo o texto!`;
                    VCinitMount();
                    const productModal = document.querySelector('#previewProduct');
                    document.addEventListener("VCopenProductLogoCalled", () => bootstrap.Modal.getInstance(productModal).hide());   
                    document.addEventListener("VCcloseModal", () => bootstrap.Modal.getInstance(productModal).show());                
                };
                document.body.appendChild(script);
            }else{
                VCrefreshImg();
            }
            document.querySelector("#gallery").addEventListener("slid.bs.carousel", function () {
                let images = gallery.querySelectorAll(".carousel-item img");
                images.forEach(img => {
                    if (img.closest(".carousel-item").classList.contains("active")) {
                        img.setAttribute("virtualcavi", "mainImg");
                    } else {
                        img.removeAttribute("virtualcavi");
                    }
                });
            });                                                                                                                                                                                                                                                                            
        } catch (error) {
            console.error('virtualCaviScript:', error);
        }
    }
}

class Preview extends Product {
    constructor() {
        super();
    }
    modalLoader(modalBox) {
        const template = `
        <div class="row">
            <div class="col-12 col-lg-5 placeholder-glow">
                <div class="ratio ratio-1x1">
                    <img src="${UNAVAILABLE}" class="img-fluid placeholder w-100 h-100" style="object-fit: contain;">
                </div>
            </div>
            <div class="col-12 col-lg-7 placeholder-glow">
                <h1 class="placeholder col-8 mb-2" style="height: 2rem;"></h1>
                <p class="placeholder col-10 mb-3" style="height: 1rem;"></p>

                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
                <div class="row mb-5">
                    <div class="placeholder btn btn-outline-dark w-100" style="height: 29px;"></div>
                </div>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-12 placeholder-glow">
                <h1 class="placeholder col-8 mb-2" style="height: 2rem;"></h1>
            </div>
            <div class="col-12 col-lg-6 placeholder-glow">
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
            </div>
            <div class="col-12 col-lg-6 placeholder-glow">
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
                <div class="row mb-3">
                    <div class="placeholder col-3" style="height: 2rem;"></div>
                    <div class="placeholder col-8 ms-2" style="height: 2rem;"></div>
                </div>
            </div>
        </div>`;

        modalBox.querySelector('.modal-body').innerHTML = template;
        modalBox.querySelector('#preview-title').innerText = 'Cargando producto...';
    }
    modalGrouped(modalBox, product) {
        const data = product.detail;
        const stock = (product.stock === "No disponible" || !product.stock) ? [] : product.stock;
        const hasStock = Array.isArray(stock) && stock.length > 0;
        const showStock = data.colores?.length > 0 && ( (theme.product.stock == 1 && hasStock) || (theme.user.active && theme.product.stock == 0 && hasStock) );
        const showPrice = theme.product.prices == 1 || (theme.user.active && theme.product.prices == 0);
        
        let galleryIndicators = '';
        let galleryItems = '';
        let slideIndex = 0;

        const breadcrumb = [];
        if (Array.isArray(data.categories)) {            
            data.categories.forEach(cat => {
                breadcrumb.push(`<a href="${theme.site.url}/categoria/${cat.code_category}" class="category-link">${cat.name_category.toUpperCase()}</a>`);
            });
        }

        const addImage = (img, type, index) => {            
            const colorAttr = (type == "color" && img.color_provider) ? `color="${img.color_provider}"` : '';
            galleryIndicators += `<button type="button" image-type="${type}" data-bs-target="#gallery" class="product__gallery_bg ${index === 0 ? 'active' : ''}" style="background-image:url(${img.imagen})" data-bs-slide-to="${index}"></button>`;

            galleryItems += `<div class="carousel-item ${index === 0 ? 'active' : ''}">
                <a class="product__img">
                    <img src="${img.imagen}" ${colorAttr} virtualcavi="mainImg" image-type="${type}" class="d-block w-100" alt="${data.name_product}-${type}-${index}">
                </a>
            </div>`;
        };

        // Imagen principal
        addImage({ imagen: data.imagen }, 'main', slideIndex++);

        // Otras imágenes
        ['aditionals', 'model', 'color'].forEach(type => {
            if (product.images?.[type]) {
                product.images[type].forEach(img => addImage(img, type, slideIndex++));
            }
        });

        const galleryHTML = `
        <div id="gallery" class="product__img product__gallery carousel slide" data-bs-ride="false">
            <div class="product__gallery_list carousel-indicators">${galleryIndicators}</div>
            <div class="carousel-inner">${galleryItems}</div>
        </div>`;

        // Mostrar stock por color
        let colorOptions = '';
        if (showStock) {
            colorOptions = data.colores?.map(color => {
                const stockItem = stock.find(s => s.code === color.code);
                const stockQty = stockItem?.stock ?? 0;
                return `
                <div class="col-4 d-inline-flex align-items-center mb-3 pointer" style="min-width:130px" onclick="selectCircleColor('${color.color_provider}', 'modal')" data-bs-toggle="tooltip" data-bs-title="${color.color_provider}">
                    <label class="color_box color_box--detail ${color.code_color} mb-0 pointer"></label>
                    <span class="ms-2">${stockQty}</span>
                </div>`;
            }).join('');
        } else {
            colorOptions = data.colores?.map(color => `<label class="color_box color_box--detail ${color.code_color} mb-0 pointer me-2" onclick="selectCircleColor('${color.color_provider}', 'modal')" data-bs-toggle="tooltip" data-bs-title="${color.color_provider}"></label>`).join('');
        }

        // Colores para el select
        let colorSelect = '';
        if (showStock) {
            colorSelect = stock.map(s => `<option code_product="${s.code}" value="${s.stock}">${s.color}</option>`).join('');
        } else if (data.colores?.length > 0 ) {
            colorSelect = data.colores.map(color => `<option code_product="${color.code}" value="99999">${color.color_provider}</option>`).join('');
        }

        const decoradoOptions = data.printing?.map(printing => `<option value="${printing.code_printing}">${printing.name_printing}</option>`).join('') || '';

        const alertMessage = (!theme.user.active && (theme.product.stock == 0 || theme.product.prices == 0)) ? `
            <div class="alert alert-secondary mt-3" role="alert">
                ${theme.product.stock == 0 && theme.product.prices == 0 ? 'Para ver stock y precios disponibles, ' : theme.product.stock == 0 ? 'Para ver stock disponible, ' : 'Para ver precios disponibles, ' }
                favor de <a data-bs-toggle="modal" data-bs-target="#modaLogin" class="alert-link text-decoration-underline" style="cursor: pointer;">Iniciar Sesión.</a>
            </div>` : '';

        const productInfo = [];
        if (Array.isArray(data.printing) && data.printing.length > 0) {
            const prints = data.printing.map(p => p.name_printing).join(', ');
            productInfo.push(`<div class="col-5 col-lg-4 product_info"><p><strong>IMPRESIÓN:</strong></p></div> <div class="col-7 col-lg-8 product_info"><p>${prints}</p></div>`); 
        }
        if (data.size_printing) productInfo.push(`<div class="col-5 col-lg-4 product_info"><p><strong>ÁREA IMPRESIÓN:</strong></p></div> <div class="col-7 col-lg-8 product_info"><p>${data.size_printing}</p></div>`);
    	if (data.material) productInfo.push(`<div class="col-5 col-lg-4 product_info"><p><strong>MATERIAL:</strong></p></div> <div class="col-7 col-lg-8 product_info"><p>${data.material}</p></div>`);
        if (data.width_p) productInfo.push(`<div class="col-5 col-lg-4 product_info"><p><strong>ANCHO PRODUCTO:</strong></p></div> <div class="col-7 col-lg-8 product_info"><p>${data.width_p}</p></div>`);
        if (data.height_p) productInfo.push(`<div class="col-5 col-lg-4 product_info"><p><strong>ALTO PRODUCTO:</strong></p></div> <div class="col-7 col-lg-8 product_info"><p>${data.height_p}</p></div>`);
        

        const packagingInfo = [];
        if (data.qty_package) packagingInfo.push(` <div class="col-5 col-lg-5 product_info"><p><strong>CANTIDAD EMPAQUE:</strong></p></div> <div class="col-7 col-lg-7 product_info"><p>${parseInt(data.qty_package).toLocaleString('es-MX')}</p></div>`);
        if (data.height_package) packagingInfo.push(` <div class="col-5 col-lg-5 product_info"><p><strong>ALTO EMPAQUE:</strong></p></div> <div class="col-7 col-lg-7 product_info"><p>${data.height_package}</p></div>`);
        if (data.width_package) packagingInfo.push(` <div class="col-5 col-lg-5 product_info"><p><strong>ANCHO EMPAQUE:</strong></p></div> <div class="col-7 col-lg-7 product_info"><p>${data.width_package}</p></div>`); 
        if (data.package_weight) packagingInfo.push(` <div class="col-5 col-lg-5 product_info"><p><strong>PESO EMPAQUE:</strong></p></div> <div class="col-7 col-lg-7 product_info"><p>${data.package_weight}</p></div>`);

        const additionalInfo = `<div class="row mt-5">
            <div class="col-12 mb-2">
                <h5 class="secondary-font" style="font-weight: 700; color: #979797;">INFORMACIÓN DEL PRODUCTO</h5>
            </div>
            <div class="col-lg-6 mb-3 mb-lg-0">
                <div class="row">${productInfo.join('')}</div>
            </div>
            <div class="col-lg-6">
                <div class="row">${packagingInfo.join('')}</div>
            </div>
        </div>`;


        const template = `
        <div class="product__breadcrumb row align-items-center mb-3">
            <div class="col-7 col-md-6">${breadcrumb.join('')}</div>
            <div class="col-5 col-md-6 text-end">
                ${this.shareOptions(data.code_product)}
                ${theme.user.active ? `<a href="${theme.site.url}/ficha-tecnica/${data.code_product}" target="_blank" class="btn btn-sm btn-mycavi btn-mycavi-breadcrumb ms-2"><i class="bi bi-file-earmark-pdf-fill"></i> Descarga ficha técnica</a>` : ''}
            </div>
        </div>
        <div class="row" data-source="modal">
            <div class="col-md-6">
                ${galleryHTML}
                <div virtualcavi="codeProduct" style="display:none">${data.code_product}</div>
                <div virtualcavi="mainBtn" class="mt-2 py-2"></div>
            </div>
            <div class="col-md-6 product__details">
                <h3 class="product__name secondary-font color-mycavi">${data.name_product}</h3>
                <p class="product__code_detail text-uppercase mb-1" style="font-size: 25px;">${data.code_product}</p>
                <p>${data.description}</p>

                ${colorOptions ? `<div class="row"><strong class="d-block mb-1">${showStock ? 'Existencias por color:' : 'Colores:'}</strong>${colorOptions}</div>` : ''}
                ${showPrice ? `<p class="mb-0"><span class="product__prices secondary-font">$${formatNumber(data.sale_price)}</span></p><p class="font-small text-secondary">*Los precios son de carácter informativo por lo que están sujetos a cambios sin previo aviso y <strong>son más IVA.</strong></p>` : ''}

                <div class="mt-3 w-100">
                    <div class="mb-3 row">
                        <label for="qty" class="col-3 col-form-label">Cantidad</label>
                        <div class="col-9">
                            <input _id="qty" type="number" class="qty form-control w-40 text-center" placeholder="Cantidad" name="qty" value="1" min="1">
                        </div>
                    </div>

                    <div class="mb-3 row">
                        <label for="addCartColorModal" class="col-3 col-form-label">Color</label>
                        <div class="col-9">
                            <select id="addCartColorModal" class="add-cart-color form-select me-3">${colorSelect}</select>
                        </div>
                    </div>

                    <div class="mb-3 row">
                        <label class="col-3 col-form-label">Decorado</label>
                        <div class="col-9">
                            <select class="add-print-tech form-select">
                                <option value="">Ninguno</option>
                                ${decoradoOptions}
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>
                </div>
                <input virtualcavi="savedInput" type="hidden" class="add-img-virtualcavi"></input>
            	<div virtualcavi="savedInputMessage" style="text-align: center;margin: 10px auto;"></div>
                <div class="btn-add-cart-box"></div>
                <div class="alert-btn-cart-box"></div>
                ${theme.user.active ? `<button class="btn-stock-notification btn btn-outline-dark mt-2 d-none" _id="btnStockNotification"><i class="bi bi-bell"></i> Avisarme cuando esté disponible</button>` : ''}
                ${data.note ? `<div class="alert alert-secondary mt-3 pt-2 pb-0 mb-0" role="alert" style="font-size: 14px;"><strong>NOTA:</strong>${data.note}</div>` : ''}

                ${alertMessage}
            </div>
        </div> ${additionalInfo}`;

        modalBox.querySelector('#preview-title').innerText = '';
        modalBox.querySelector('.modal-body').innerHTML = template;

        initGrouped('modal');
    }
    modalSingle(modalBox, product) {
        const data = product.detail;
        const stock = product.stock ?? null;

        const hasStock = stock && stock !== 'No disponible';
        const showStock = (theme.product.stock == 1 && hasStock) || (theme.user.active && theme.product.stock == 0 && hasStock);
        const showPrice = theme.product.prices == 1 || (theme.user.active && theme.product.prices == 0);

        let galleryIndicators = '', galleryItems = '';
        let index = 0;

        const breadcrumb = [];
        if (Array.isArray(data.categories)) {
            data.categories.forEach(cat => {
                breadcrumb.push(`<a href="${theme.site.url}/categoria/${cat.code_category}" class="category-link">${cat.name_category.toUpperCase()}</a>`);
            });
        }

        const addImage = (img, type, idx) => {
            galleryIndicators += `<button type="button" image-type="${type}" data-bs-target="#gallery" class="product__gallery_bg ${idx === 0 ? 'active' : ''}" style="background-image:url(${img.imagen})" data-bs-slide-to="${idx}"></button>`;
            galleryItems += `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <a class="product__img" href="${img.imagen}" onerror=this.src="${UNAVAILABLE}" data-fancybox="${data.code_product}">
                    <img loading="lazy" src="${img.imagen}" virtualcavi="mainImg" image-type="${type}" class="d-block w-100" alt="${data.name_product}-${type}-${idx}">
                </a>
            </div>`;
        };

        // Imagen principal
        addImage({ imagen: data.imagen }, 'main', index++);

        ['aditionals', 'model'].forEach(type => {
            if (product.images?.[type]) {
                product.images[type].forEach(img => addImage(img, type, index++));
            }
        });

        const galleryHTML = data.images? `<div id="gallery" class="product__img product__gallery carousel slide" data-bs-ride="false">
                <div class="product__gallery_list carousel-indicators">${galleryIndicators}</div>
                <div class="carousel-inner">${galleryItems}</div>
                <span class="product__icon_zoom"><i class="bi bi-zoom-in"></i></span>
            </div>`
            : `<div id="gallery">
                <div class="active">
                    <a class="product__img" href="${data.imagen}" data-fancybox="${data.code_product}">
                        <span class="product__icon_zoom"><i class="bi bi-zoom-in"></i></span>
                        <img loading="lazy" src="${data.imagen}" class="w-100" onerror="this.src='${UNAVAILABLE}'" alt="${data.name_product}" virtualcavi="mainImg">
                    </a>
                </div>
            </div>`;

        const colorHTML = data.name_color ? `<p class="mb-0"><strong class="d-block mb-1">Color:</strong> <label id="color_${data.code_color}" class="color_box color_box--detail ${data.code_color}" data-bs-toggle="tooltip" data-bs-title="${data.name_color}"></label> </p>` : '';
        const priceHTML = showPrice ? `<p class="mb-0"><span class="product__prices secondary-font">$${formatNumber(data.sale_price)}</span></p> <p class="font-small text-secondary">*Los precios son informativos, están sujetos a cambios y <strong>son más IVA.</strong></p>` : '';
        const stockHTML = hasStock ? `<p class="mb-0"><strong>Existencias:</strong> <span>${stock.stock}</span></p> ${stock.stock == 0 && theme.user.active ? `<button class="btn btn-outline-dark mt-2" onclick="stockNotification(event,'${data.code_product.trim()}')"><i class="bi bi-bell"></i> Avisarme cuando esté disponible</button>` : ''}` : '';

        const cartBox = showStock && stock?.stock > 0 ? `<div class="alert-btn-cart-box"></div>
           <div class="product__cart_box mt-4">
               <input type="number" class="form-control w-50 text-center" placeholder="Cantidad" code_product="${data.code_product.trim()}" name="qty" value="1" min="1" max="${stock ? stock.stock : 9999999}">
               <button type="button" class="btn btn-sm btn-mycavi w-50 ms-2" onclick="AddCart('modal', this);">Agregar</button>
           </div>`
            : (!theme.user.active ? `<div class="alert alert-secondary mt-3" role="alert"> Para poder cotizar. Favor de <a data-bs-toggle="modal" data-bs-target="#modaLogin" class="alert-link" style="cursor: pointer;">Iniciar Sesión.</a> </div>` : '');

        const noteHTML = data.note ? `<div class="alert alert-secondary mt-3 pt-2 pb-0 mb-0" role="alert" style="font-size: 14px;"><strong>NOTA:</strong>${data.note}</div>` : '';

        const template = `<div class="product__breadcrumb row align-items-center mb-3">
            <div class="col-7 col-md-6">${breadcrumb.join('')}</div>
            <div class="col-5 col-md-6 text-end">
                ${this.shareOptions(data.code_product)}
                ${theme.user.active ? `<a href="${theme.site.url}/ficha-tecnica/${data.code_product}" target="_blank" class="btn btn-sm btn-mycavi btn-mycavi-breadcrumb ms-2">Descarga ficha técnica</a>` : ''}
            </div>
        </div>
        <div class="row" data-source="modal">
            <div class="col-md-6">
                ${galleryHTML}
                <div virtualcavi="codeProduct" style="display:none">${data.code_product}</div>
                <div virtualcavi="mainBtn" class="mt-2 py-2"></div>
            </div>
            <div class="col-md-6 product__details">
                <h3 class="product__name secondary-font color-mycavi">${data.name_product}</h3>
                <p class="product__code_detail text-uppercase">${data.code_product}</p>
                <p>${data.description}</p>
                ${colorHTML}
                ${priceHTML}
                ${stockHTML}
                ${cartBox}
                <input virtualcavi="savedInput" type="hidden" class="add-img-virtualcavi"></input>
            	<div virtualcavi="savedInputMessage" style="text-align: center;margin: 10px auto;"></div>
                <div id="parent" style="display:none">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="secondary-font mt-3" data-aos="flip-up">También disponible en:</h5>
                        </div>
                    </div>
                    <div id="parent_products" class="row"></div>
                </div>
                ${noteHTML}
            </div>
        </div>`;

        modalBox.querySelector('.modal-body').innerHTML = template;
        modalBox.querySelector('#preview-title').innerText = '';
    }
    modalNoResults(modalBox, code_product) {
        const template = `<div class="row"> <div class="col-12 py-5 text-center"> <h5>NO SE ENCONTRARON RESULTADOS</h5> </div> </div>`;
        modalBox.querySelector('.modal-body').innerHTML = template;
        modalBox.querySelector('#preview-title').innerText = code_product;
    }
    modalError(modalBox,error){
        let message = "Ocurrió un error desconocido.";
        if (error.response) {
            message = (error.response.status === 419) ? 'Página inactiva demasiado tiempo. Recarga e inténtalo nuevamente.' : `Error ${error.response.status}: ${error.response.statusText}`;
        }
        const template = `<div class="row"><div class="col-12 py-5 text-center"><h5>${message}</h5></div></div>`;
        modalBox.querySelector('.modal-body').innerHTML = template;
        modalBox.querySelector('#preview-title').innerText = "Error";
    }
}

export async function showPreview(code_product) {
    const product = new Preview();
    const modal = new bootstrap.Modal(modalPreview, {});
    product.modalLoader(modalPreview);
    modal.show();

    try {
        const request = await product.detail(code_product);
        if (request) {
            (theme.showByModel) ? product.modalGrouped(modalPreview, request) : product.modalSingle(modalPreview, request);
            product.setView(code_product);
            if (theme.site.virtualcavi) product.virtualCaviScript();
        } else {
            product.modalNoResults(modalPreview, code_product);
        }
    } catch (error) {
        product.modalError(modalPreview, error);
        console.error(error)
    }
}
export function shareProduct(type, url, el = null) {
    switch (type) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=¡Mira este producto!`, '_blank');
            break;
        case 'email':
            window.location.href = `mailto:?subject=Producto interesante&body=${encodeURIComponent(url)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                if (el) {                    
                    const btn = el.closest('.dropdown')?.querySelector('button') || el;
                    const originalText = btn.innerHTML;
                    let text_copy = `<i class="bi bi-check2-circle me-2"></i>¡Copiado!`;
                    if (theme.product.preview == "pvw-product-2") text_copy = `<i class="bi bi-check2-circle"></i>`;
                    btn.innerHTML = text_copy;
                    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
                }
            }).catch((error) => {
                console.error("Copy error",error);
            });
            break;
        default:
            console.warn("Método de compartido no soportado:", type);
    }
}

window.showPreview = showPreview;
window.shareProduct = shareProduct;