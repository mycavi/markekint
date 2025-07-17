export class Renders {
    constructor() { }
    colorInput(colors, selector, container) {
        container.classList.remove("d-none");
        const cat_box = container.querySelector(selector);
        cat_box.innerHTML = '<div style="min-height: 64px;"><div>';
        cat_box.innerHTML = "";
        [].forEach.call(colors, function (item, index, array) {
            let color = document.createElement("label");
            color.setAttribute('id', 'color_' + item.code_color);
            color.setAttribute('data-bs-toggle', 'tooltip');
            color.setAttribute('data-placement', 'top');
            color.classList.add("color_box", "color_box--sidebar", item.code_color);
            color.innerHTML = '<input type="radio" id="color_' + item.code_color + '" class="color_input color_input--search" name="color" value="' + item.code_color + '">';
            color.setAttribute('title', item.name_color);
            cat_box.appendChild(color);
        });
        tooltipInit()
        return true;
    }
    notifications(notifications, container) {
        container.innerHTML = "";
        let init = document.createElement("div");
        init.classList.add("notification__item");
        init.innerHTML = `<p class="notification__ttl font-small">Notificaciones</p>`;
        container.appendChild(init);
        notifications.reverse();
        [].forEach.call(notifications, function (item, index, array) {
            let notification = document.createElement("div");
            notification.classList.add("notification__item");
            notification.innerHTML = `<div class="notification__header">
                <p class="notification__ttl font-small color-mycavi">${item.notification_title}</p>
                <div class="notification__buttons">
                    <button class="btn btn-notification-delete" onclick="deleteNotification('${item.id_notification}')"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <p class="notification__txt">${item.notification_text}</p>
            <p class="notification__date">${moment(item.notification_date).locale('es-mx').format('MMM d')} | ${moment(item.notification_date).locale('es-mx').fromNow()}</p>
            `;
            container.appendChild(notification);
        });
    }
    sessionBox(data) {
        const renderSession = (session) => {
            const isActive = session.session_token === theme.user.token;
            const icon = session.device.startsWith("Desktop") ? "<i class='bi bi-pc-display'></i>" : "<i class='bi bi-phone'></i>";
            const activeBadge = isActive ? `<a type='button' class='float-end'> <button class='btn p-0 w-100' data-bs-toggle='tooltip' data-placement='top' title='Sesión actual'> <i class='bi bi-circle-fill active_green'></i> </button> </a>` : '';

            return `<div class='col-6 col-md-4 mb-4' id='${session.session_token}'>
                <div class='user_session transition-ease'>
                    <div class='px-3 pt-2'>
                        ${activeBadge}
                        <p class='font-small mb-1'> ${icon} <span class='ms-1'>${session.os_connect}</span><br>${session.device} </p>
                        <p class='mt-3'><i class='bi bi-calendar-week'></i> ${session.date_add_session}</p>
                    </div>
                    <div class='user_exit_session_btn'>
                        <a href='#' class='btn btn-mycavi user_exit_session__btn transition-ease' onclick="closeSession('${session.session_token}')">
                            <span class='user_exit_session_btn_txt'>Cerrar Sesión</span>
                            <span class='user_exit_session_btn_icon'><i class='bi bi-box-arrow-in-right'></i></span>
                        </a>
                    </div>
                </div>
            </div>`;
        };
        return data.sessions.map(renderSession).join('');
    }
    addressBox(data) {
        if (!data || !data.total || !data.address) return "";

        const renderAddress = (address) => `<div class="col-6 col-md-4 mb-3" id="${address.id_address}">
            <div class="user_address transition-ease">
                <div class="px-3">
                    <a href="#" class="close" onclick="deleteAddress(${address.id_address})">
                        <button class="btn p-0 w-100" data-bs-toggle="tooltip" data-placement="right" title="Eliminar dirección"> <h4><strong>&times;</strong></h4> </button>
                    </a>
                    <p>
                        <span><strong class="font-small">Dirección</strong><br></span>
                        ${address.street} ${address.num_ext}, ${address.col}, ${address.state}, C.P. ${address.cp}
                    </p>
                    <p><i class="bi bi-phone me-1"></i> ${address.phone}</p>
                </div>
                <div class="user_edit_address_btn">
                    <button class="btn btn-mycavi user_edit_address__btn transition-ease" onclick="fillFormEditAddress(${address.id_address})">
                        <span class="user_edit_address_btn_txt">Editar</span>
                        <span class="user_edit_address_btn_icon"><i class="bi bi-pencil"></i></span>
                    </button>
                </div>
            </div>
        </div>`;
        return data.address.map(renderAddress).join('');
    }
    addressBottom() {
        return `<div class="col-6 col-md-4 mb-md-3">
            <div class="mb-3 pt-4 add-address transition-ease">
                <a href="#" data-bs-toggle="modal" data-bs-target="#modal-add-addresses-profile">
                    <div class="text-center pt-2">
                        <i class="bi bi-geo-alt-fill"></i>
                        <p class="mt-3">Agregar Dirección</p>
                    </div>
                </a>
            </div>
        </div>`;
    }
    // parentProducts(products) {
    //     let template = '';
    //     [].forEach.call(products, function (product, index, array) {
    //         const url = theme.site.url + '/producto/' + product.code_product;
    //         const img = product.imagen;
    //         template += '<div class="col-2 pr-2 my-2"><a class="pvw_product_parent" href="' + url + '"><img class="w-100" src="' + img + '" onerror=this.src="' + UNAVAILABLE + '" alt="' + product.name_color + '" data-bs-toggle="tooltip" data-placement="top" title="' + product.name_color + '"></a></div>'
    //     });
    //     return template;
    // }
}
export class Theme extends Renders {
    static show_prices = theme.product.prices == 1 || (theme.product.prices == 0 && theme.user.active) ? true : false;
    constructor() {
        super();
        this.previewTemplates = {
            'pvw-product-1': this.previewProductOne,
            'pvw-product-2': this.previewProductTwo,
            'pvw-product-3': this.previewProductThree,
            'pvw-product-4': this.previewProductFour,
            'pvw-product-custom': this.previewProductCustom,
        };
        this.previewLoaderTemplates = {
            'pvw-product-1': this.previewLoaderOne,
            'pvw-product-2': this.previewLoaderTwo,
            'pvw-product-3': this.previewLoaderThree,
            'pvw-product-4': this.previewLoaderFour,
            'pvw-product-custom': this.previewLoaderCustom,
        };
    }
    products(products, extra_class = '', carrusel = false) {
        let init = "", end = "", aos = "";
        if (carrusel) init = '<li class="splide__slide">'; end = '</li>';
        if (carrusel == false) aos = 'data-aos="fade-up"';
        let template = "";
        const previewFunction = this.previewTemplates[theme.product.preview];

        products.forEach(data => {
            let product = typeof previewFunction === "function" ? previewFunction.call(this, data) : '';
            template += init + `<div class="pvw-product--main ${extra_class}" ${aos}>${product}</div>` + end;
        });
        tooltipInit()
        return template;
    }
    previewProductOne(data) {
        // Style: Clásico
        let img = data.imagen || UNAVAILABLE;

        let additional_data = "";
        let categories = "";
        let description = "";
        let class_price = "col-12";

        if (data.description) description = `<p class="pvw-product--descp font-small">${data.description.substring(0, 50)}... <span data-bs-toggle="tooltip" data-bs-title="${data.description}" class="text-decoration-underline" onclick="event.preventDefault();">Ver más</span></p>`;
        if (data.categorias) categories = `<p class="pvw-product-1--categories color-mycavi">${data.categorias.map(e => e.name_category).join(" | ")}</p>`;

        const url = `${window.location.href}/producto/${data.code_product}`;

        if (theme.showByModel) {
            if (data.colores.length > 0 && Theme.show_prices) class_price = "col-5";
            let color_boxes = '';
            if (data.colores.length > 0) {
                data.colores.forEach(color => {
                    if (color.name_color) color_boxes += `<span data-bs-toggle="tooltip" data-bs-title="${color.name_color}" class="color_box ${color.code_color} pvwProduct_color"></span>`;
                });
                additional_data += `<div class="col d-flex flex-wrap pe-0">${color_boxes}</div>`;
            }
        } else {
            if (data.name_color && Theme.show_prices) class_price = "col-4";
            if (data.name_color) additional_data += `<div class="col-8"><p class="pvw-product-1--color">Color ${data.name_color}</p></div>`;
        }
        if (Theme.show_prices && data.sale_price) additional_data += `<div class="${class_price} text-end"><p class="pvw-product-1--price">$${formatNumber(data.sale_price)}</p></div>`;
        return `<div class="pvw-product pvw-product-1 transition-ease">
            <a type="button" onclick="showPreview('${data.code_product}')" class="pvw-product-image">
                <img loading="lazy" class="w-100" load="false" src="${img}" data-src="${data.imagen}" onerror=this.src="${UNAVAILABLE}" alt="${data.name_product}">
            </a>
            <div class="pvw-product-data">
                <a type="button" onclick="showPreview('${data.code_product}')" class="pvw-product--name pvw-product-1--name secondary-font">${data.name_product}</a>
                <p class="pvw-product-1--code m-0">${data.code_product}</p>
                <div class="row my-2 align-items-center">${additional_data}</div>
            </div>
            <div class="pvw-product-1--buttons">
                <a type="button" onclick="shareProduct('copy', '${url}', this)" class="btn btn-mycavi pvw-product-1--btn transition-ease"><span class="pvw-product-1--btn-txt">Compartir</span></a>
                <button onclick="showPreview('${data.code_product}')" class="btn btn-mycavi pvw-product-1--btn pvw-product-1--btn--preview transition-ease"><span class="pvw-product-1--btn-txt">Ver detalle</span></button>
            </div>
            <a type="button" onclick="showPreview('${data.code_product}')" class="pvw-product-1-hover transition-ease">
                <span class="pvw-product--name secondary-font">${data.name_product}</span>
                ${description}
                ${categories}
            </a>
        </div>`;
    }
    previewProductTwo(data) {
        // Style: Minimalista
        let img = data.imagen || UNAVAILABLE;
        let additional_data = "";
        const url = `${window.location.href}/producto/${data.code_product}`;
        if (theme.showByModel) {
            let color_boxes = '';
            if (data.colores.length > 0) {
                data.colores.forEach(color => {
                    if (color.name_color) color_boxes += `<span data-bs-toggle="tooltip" data-bs-title="${color.name_color}" class="color_box ${color.code_color} pvwProduct_color"></span>`;
                });
                additional_data += `<div class="d-flex flex-wrap mb-1">${color_boxes}</div>`;
            }
        } else {
            if (data.name_color) additional_data += `<p class="pvw-product-2--color mb-0">${data.name_color}</p>`;
        }        
        if (Theme.show_prices && data.sale_price) additional_data += `<p class="pvw-product-2--price">$${formatNumber(data.sale_price)}</p>`;
        return `<div class="pvw-product pvw-product-2 transition-ease">
            <a type="button" onclick="showPreview('${data.code_product}')" class="pvw-product-image"> <img loading="lazy" class="w-100" src="${img}" onerror=this.src="${UNAVAILABLE}" alt="${data.name_product}"></a>
            <div class="pvw-product-data">
                <a type="button" onclick="showPreview('${data.code_product}')" class="pvw-product--name pvw-product-2--name secondary-font">${data.name_product}</a>
                <p class="pvw-product-2--code color-mycavi">${data.code_product}</p>
                <div class="row align-items-center my-2">
                    <div class="col-7">${additional_data}</div>
                    <div class="col-5">
                        <div class="d-flex justify-content-end">
                            <button onclick="shareProduct('copy', '${url}', this)" class="btn btn-mycavi pvw-product-2--btn pvw-product-2--btn--preview transition-ease me-1" data-bs-toggle="tooltip" data-placement="top" data-bs-original-title="Compartir"><span class="pvw-product-2--icon"><i class="bi bi-share"></i></span></button>
                            <a type="button" onclick="showPreview('${data.code_product}')" class="btn btn-mycavi pvw-product-2--btn transition-ease"><span class="pvw-product-2--icon" data-bs-toggle="tooltip" data-placement="top" data-bs-original-title="Ver detalle"><i class="bi bi-arrow-right"></i></span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    previewProductThree(data) {
        // Style: Compacto
        let img = data.imagen || UNAVAILABLE;

        let additional_data = "";
        let categories = "";
        let class_price = "col-12";
        const url = `${window.location.href}/producto/${data.code_product}`;

        if (data.categorias) categories = `<div class="col-10"><p class="pvw-product-3--categories font-small color-mycavi mb-1">${categories = data.categorias.map(e => e.name_category).join(" | ")}</p></div>`;

        if (theme.showByModel) {
            let color_boxes = '';
            if (data.colores.length > 0 && Theme.show_prices) class_price = "col-5";
            if (data.colores.length > 0) {
                data.colores.forEach(color => {
                    if (color.name_color) color_boxes += `<span data-bs-toggle="tooltip" data-bs-title="${color.name_color}" class="color_box ${color.code_color} pvwProduct_color"></span>`;
                });
                additional_data += `<div class="col d-flex flex-wrap pe-0">${color_boxes}</div>`;
            }
        } else {
            if (data.name_color && Theme.show_prices) class_price = "col-4";
            if (data.name_color) additional_data += `<div class="col-8"><p class="pvw-product-3--color">Color ${data.name_color}</p></div>`;
        }
        if (Theme.show_prices && data.sale_price) additional_data += `<div class="${class_price} text-end"><p class="pvw-product-3--price">$${formatNumber(data.sale_price)}</p></div>`;
        return `<div class="pvw-product pvw-product-3 transition-ease">
            <div class="pvw-product-image pvw-product-3-image">
                <a type="button" onclick="showPreview('${data.code_product}')">
                    <img loading="lazy" class="w-100" src="${img}" onerror=this.src="${UNAVAILABLE}" alt="${data.name_product}">
                </a>
                <div class="pvw-product-3--btn">
                    <button onclick="shareProduct('copy', '${url}', this)" class="btn btn-mycavi pvw-product-3--btn--preview transition-ease" data-bs-toggle="tooltip" data-placement="top" data-bs-original-title="Compartir">
                        <span class="pvw-product-3--icon"><i class="bi bi-share"></i></span>
                    </button>
                    <a type="button" onclick="showPreview('${data.code_product}')" onclick="shareProduct('copy', '${url}', this)" class="btn btn-mycavi transition-ease" data-bs-toggle="tooltip" data-placement="top" data-bs-original-title="Ver detalle">
                        <span class="pvw-product-3--icon"><i class="bi-arrow-right"></i></span>
                    </a>
                </div>
            </div>
            <div class="pvw-product-data">
                <div class="row">
                    ${categories}
                    <div class="col-12">
                        <a type="button" onclick="showPreview('${data.code_product}')" class="pvw-product--name pvw-product-3--name secondary-font">${data.name_product}</a>
                        <p class="pvw-product-3--code m-0">${data.code_product}</p>
                    </div>
                </div>
                <div class="row align-items-center my-2">${additional_data}</div>
            </div>
        </div>`;
    }
    previewProductFour(data) {
        // Style: Sencillo
        let img = data.imagen || UNAVAILABLE;
        let additional_data = ``;
        const url = `${window.location.href}/producto/${data.code_product}`;

        if (theme.showByModel) {
            let color_boxes = '';
            if (data.colores.length > 0) {
                data.colores.forEach(color => {
                    if (color.name_color) color_boxes += `<span data-bs-toggle="tooltip" data-bs-title="${color.name_color}" class="color_box ${color.code_color} pvwProduct_color"></span>`;
                });
                additional_data += `<div class="col d-flex flex-wrap justify-content-center mb-1 mt-3">${color_boxes}</div>`;
            }
        } else {
            if (data.name_color) additional_data += `<p class="pvw-product-4--color mb-0">Color ${data.name_color}</p>`;
        }
        if (Theme.show_prices && data.sale_price) additional_data += `<p class="pvw-product-4--price">$${formatNumber(data.sale_price)}</p>`;
        return `<a type="button" onclick="showPreview('${data.code_product}')" class="pvw-product pvw-product-4">
            <span class="pvw-product-image pvw-product-4-image">
                <img loading="lazy" class="w-100" src="${img}" onerror=this.src="${UNAVAILABLE}" alt="${data.name_product}">                    
            </span>
            <div class="pvw-product-data text-center mb-3">
                <div class="row">
                    <div class="col-12">
                        <span class="pvw-product--name pvw-product-4--name secondary-font">${data.name_product}</span>
                        <p class="pvw-product-4--code color-mycavi mb-2">${data.code_product}</p>
                        ${additional_data}
                    </div>
                </div>
            </div>
        </a>`;
    }
    previewProductCustom(data) {
        return ``;
    }
    previewLoader(extra_class, items = 8) {
        let template = "";
        const previewFunction = this.previewLoaderTemplates[theme.product.preview];

        for (let index = 0; index < items; index++) {
            let product = typeof previewFunction === "function" ? previewFunction.call(this) : '';
            template += `<div class="pvw-product--main ${extra_class}" data-aos="fade-up">${product}</div>`;
        }
        return template;
    }
    previewLoaderCarrusel(items = 8) {
        let template = "";
        const previewFunction = this.previewLoaderTemplates[theme.product.preview];

        for (let index = 0; index < items; index++) {
            let product = typeof previewFunction === "function" ? previewFunction.call(this) : '';
            template += `<li class="splide__slide"><div class="pvw-product--main">${product}</div></li>`;
        }
        return template;
    }
    previewLoaderOne() {
        let additional_data = "";
        let class_price = "col-12";

        if (theme.showByModel) {
            if (Theme.show_prices) class_price = "col-5";

            additional_data += `<div class="col d-flex flex-wrap pe-0">
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
            </div>`;
        } else {
            if (Theme.show_prices) class_price = "col-4";
            additional_data += `<div class="col-8"><p class="pvw-product-1--color placeholder d-block"></p></div>`;
        }
        if (Theme.show_prices) additional_data += `<div class="${class_price} text-end"><p class="pvw-product-1--price placeholder d-block"></p></div>`;
        return `<div class="pvw-product pvw-product-1 transition-ease">
            <div class="pvw-product-image pvw-product-image--loader"></div>
            <div class="pvw-product-data placeholder-glow">
                <a class="pvw-product--name pvw-product-1--name placeholder d-block my-1"></a>
                <p class="pvw-product-1--code placeholder col-4 m-0"></p>
                <div class="row my-2 align-items-center">${additional_data}</div>
            </div>
            <div class="pvw-product-1--buttons">
                <button class="btn btn-mycavi pvw-product-1--btn pvw-product--btn--loader transition-ease"><span class="pvw-product-1--btn-txt" disabled>CARGANDO</span></button>
                <button class="btn btn-mycavi pvw-product-1--btn pvw-product--btn--loader pvw-product-1-btn--preview transition-ease"><span class="pvw-product-1--btn-txt">...</span></button>
            </div>
        </div>`;
    }
    previewLoaderTwo() {
        let additional_data = "";
        if (theme.showByModel) {
            additional_data += `<div class="d-flex flex-wrap mb-1">
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
            </div>`;
        } else {
            additional_data += `<span class="pvw-product-2--color placeholder col-6"></span>`;
        }
        if (Theme.show_prices) additional_data += `<span class="pvw-product-2--price placeholder col-7"></span>`;
        return `<div class="pvw-product pvw-product-2 transition-ease">
            <div class="pvw-product-image pvw-product-image--loader"></div>
            <div class="pvw-product-data placeholder-glow">
                <span class="placeholder w-100 mb-1"></span>
                <p class="pvw-product-2--code placeholder col-5"></p>
                <div class="row align-items-center my-2">
                    <div class="col-7">${additional_data}</div>
                    <div class="col-5">
                    <div class="d-flex justify-content-end">
                            <button class="btn btn-mycavi pvw-product-2--btn pvw-product--btn--loader pvw-product-2--btn--preview transition-ease me-1"><span class="pvw-product-2--icon"><i class="bi bi-eye"></i></span></button>
                            <span class="btn btn-mycavi pvw-product-2--btn pvw-product--btn--loader transition-ease"><span class="pvw-product-2--icon"><i class="bi bi-arrow-right"></i></span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    previewLoaderThree() {
        let additional_data = "";
        let class_price = "col-12";

        let categories = `<div class="col-10"><p class="placeholder placeholder-sm col-7 mb-1"></p></div>`;

        if (theme.showByModel) {
            if (Theme.show_prices) class_price = "col-5";
            additional_data += `<div class="col d-flex flex-wrap pe-0">
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
            </div>`;
        } else {
            if (Theme.show_prices) class_price = "col-4";
            additional_data += `<div class="col-8"><span class="pvw-product-3--color placeholder col-10"></span></div>`;
        }
        if (Theme.show_prices) additional_data += `<div class="${class_price} text-end"><p class="pvw-product-3--price placeholder col-10"></p></div>`;
        return `<div class="pvw-product pvw-product-3 transition-ease">
            <span class="pvw-product-image pvw-product-3-image pvw-product-image--loader">
                <div class="pvw-product-3--btn">
                    <span class="btn btn-mycavi pvw-product-3--btn--preview pvw-product--btn--loader transition-ease"><span class="pvw-product-3--icon"><i class="bi bi-eye-fill"></i></span> </span>
                    <span class="btn btn-mycavi transition-ease pvw-product-3--icon pvw-product--btn--loader"><i class="bi-arrow-right"></i></span>
                </div>
            </span>
            <div class="pvw-product-data placeholder-glow">
                <div class="row">
                    ${categories}
                    <div class="col-12">
                        <span class="placeholder w-100"></span>
                        <p class="pvw-product-3--code placeholder col-5 mb-0"></p>
                    </div>
                </div>
                <div class="row align-items-center my-2">${additional_data}</div>
            </div>
        </div>`;
    }
    previewLoaderFour() {
        let additional_data = ``;

        if (theme.showByModel) {
            additional_data += `<div class="col d-flex flex-wrap justify-content-center mb-1 mt-3">
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
                <span class="color_box gris pvwProduct_color"></span>
            </div>`;
        } else {
            additional_data += `<p class="pvw-product-4--color placeholder col-7 mb-0 mt-2"></p>`;
        }
        if (Theme.show_prices) additional_data += `<p class="pvw-product-4--price placeholder col-6"></p>`;
        return `<div class="pvw-product pvw-product-4">
            <div class="pvw-product-image pvw-product-4-image pvw-product-image--loader"></div>
            <div class="pvw-product-data text-center mb-3 placeholder-glow">
                <div class="row">
                    <div class="col-12">
                        <span class="pvw-product--name placeholder w-100"></span>
                        <p class="pvw-product-4--code placeholder col-8 mb-0"></p>
                        ${additional_data}
                    </div>
                </div>
            </div>
        </div>`;
    }
    previewLoaderCustom() {
        return ``;
    }
    selectCardPrint(printing_technique, actual_printing) {
        let options = `<option value="">Ninguno</option>`
        options += printing_technique?.map(printing => {
            const isSelected = printing.code_printing === actual_printing ? 'selected' : '';
            return `<option value="${printing.code_printing}" ${isSelected}>${printing.name_printing}</option>`;
        }).join('') || '';
        const otroSelected = actual_printing === 'otro' ? 'selected' : '';
        options += `<option value="otro" ${otroSelected}>Otro</option>`;
        return options;
    }
    itemCartOne(detail, index) {
        const url = window.location.href + '/producto/' + detail['code_product'];
        const img = detail['imagen'];
        let additional_data = ``;
        let priceBox = ``;

        if (detail['name_color']) additional_data += `<p class="cart-1-item--color font-small mb-0">${detail['name_color']}</p>`;
        if (Theme.show_prices) priceBox = `<span class="cart-1-item--price btn btn-sm btn-light font-small py-0 me-1 mb-0" id="price_${index}">$${formatNumber(detail['price'])}</span>`;
        const decoradoOptions = this.selectCardPrint(detail['printing_technique'], detail['printing_type']);

        return `<form class="row" id="detail_${index}">
            <div class="col-5">
                <a href="${url}" class="pvw-product-image">
                    <img class="w-100" src="${img}" onerror=this.src="${UNAVAILABLE}" alt="${detail['name']}">
                </a>
            </div>
            <div class="col-7">
                <div>
                    <p class="cart-item--name cart-1-item--name secondary-font mb-0">${detail['name']}</p>
                    <p class="cart-item--code cart-1-item--code color-mycavi font-small">${detail['code_product']}</p>
                   ${additional_data}
                </div>
                <div class="w-100 d-flex align-items-center">
                    ${priceBox}
                    <button type="button" class="btn btn-sm btn-mycavi" onclick="quantityDown(${index});" style="border-radius: 5px 0 0 5px;padding: 2px 4px;"><i class="bi bi-dash-lg"></i></button>
                    <input type="number" min="1" class="form-control text-center quantity-action cart-1-item--qty py-1" placeholder="Cantidad" id="qty_${index}" name="qty" value="${detail['qty']}" style="border-radius: 0;padding: 2px 0px !important;font-size: 14px;">               
                    <button type="button" class="btn btn-sm btn-mycavi" onclick="quantityUp(${index});" style="border-radius: 0 5px 5px 0;padding: 2px 4px;"><i class="bi bi-plus-lg"></i></button>
                </div>
            </div>
            <div class="col-12">
                <div class="input-group">
                    <span class="input-group-text font-small">Decorado</span>
                    <select name="printing_type" class="cart-1-item--print font-small form-select"> ${decoradoOptions} </select>
                </div>
                <div class="collapse mt-1" id="editNoteProduct_${index}">
                    <textarea class="card card-body form-control" name="note" placeholder="Escribe tu nota aquí.">${detail['note'] || ''}</textarea>
                </div>
                <div class="input-group mt-2">
                    <button type="button" class="btn btn-sm btn-danger cart-1-item--delete" onclick="DeleteDetail(${index},${detail['id_order_detail']});" style="width: 30%;"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-sm btn-mycavi" type="button" data-bs-toggle="collapse" data-bs-target="#editNoteProduct_${index}" aria-expanded="false" aria-controls="editNoteProduct_${index}" style="width: 30%;"><i class="bi bi-sticky"></i> Nota</button>
                    <button type="submit" class="update-action btn btn-sm btn-mycavi cart-1-item--update" data-form="detail_${index}" data-id="${index}" data-code_product="${theme.showByModel ? detail['code'] : detail['code_product']}" data-id_detail="${detail['id_order_detail']}" style="width: 40%;border-radius: 0 5px 5px 0px !important;"><i class="bi bi-arrow-clockwise"></i> Actualizar</button>
                </div>
                <hr>
            </div>
        </form>`;
    }
    itemCartTwo(detail, index) {
        const url = window.location.href + '/producto/' + detail['code_product'];
        const img = detail['imagen'];
        let additional_data = ``;

        if (detail['name_color']) additional_data += `<p class="cart-2-item--color color-mycavi font-small mb-1">${detail['name_color']}</p>`;
        if (Theme.show_prices) additional_data += `<p class="cart-2-item--price font-small mb-1" id="price_${index}">$${formatNumber(detail['price'])}</p>`;
        const decoradoOptions = this.selectCardPrint(detail['printing_technique'], detail['printing_type']);

        return `<form class="cart-2-item-main mb-2" id="detail_${index}">
            <div class="cart-2-item-row row">
                <div class="col-3 pr-2">
                    <div class="cart-2-item--qty-box">
                        <button type="button" class="btn btn-sm px-0 w-100" onclick="quantityUp(${index});" style="border-radius: 5px 5px 0 0;"><i class="bi bi-plus-lg"></i></button>
                        <input type="number" min="1" class="form-control text-center quantity-action cart-2-item--qty" placeholder="0" id="qty_${index}" name="qty" value="${detail['qty']}">               
                        <button type="button" class="btn btn-sm px-0 w-100" onclick="quantityDown(${index});" style="border-radius: 0 5px 5px 0;"><i class="bi bi-dash-lg"></i></button>
                    </div>
                </div>
                <div class="col-4 px-0">
                    <a href="${url}" class="pvw-product-image">
                        <img class="w-100" src="${img}" onerror=this.src="${UNAVAILABLE}" alt="${detail['name']}">
                    </a>
                </div>
                <div class="col-5 ps-2">                
                    <p class="cart-item--name cart-2-item--name secondary-font mb-0">${detail['name']}</p>
                    ${additional_data}               
                </div>
            </div>
            <div class="">
                <div class="input-group">
                    <span class="input-group-text font-small">Decorado</span>
                    <select name="printing_type" class="cart-2-item--print font-small form-select"> ${decoradoOptions} </select>
                </div>
                <div class="collapse mt-1" id="editNoteProduct_${index}">
                    <textarea class="card card-body form-control" name="note" placeholder="Escribe tu nota aquí.">${detail['note'] || ''}</textarea>
                </div>
                <div class="input-group mt-2">
                    <button type="button" class="btn btn-sm btn-danger cart-2-item--delete" onclick="DeleteDetail(${index},${detail['id_order_detail']});" style="width: 30%;"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-sm btn-mycavi" type="button" data-bs-toggle="collapse" data-bs-target="#editNoteProduct_${index}" aria-expanded="false" aria-controls="editNoteProduct_${index}" style="width: 30%;"><i class="bi bi-sticky"></i> Nota</button>
                    <button type="submit" class="update-action btn btn-sm btn-mycavi cart-2-item--update" data-form="detail_${index}" data-id="${index}" data-code_product="${theme.showByModel ? detail['code'] : detail['code_product']}" data-id_detail="${detail['id_order_detail']}" style="width: 40%;border-radius: 0 5px 5px 0px !important;"><i class="bi bi-arrow-clockwise"></i> Actualizar</button>
                </div>
            </div>
        </form>`;
    }
    itemCartThree(detail, index) {
        const url = window.location.href + '/producto/' + detail['code_product'];
        const img = detail['imagen'];
        let additional_data = ``;

        if (Theme.show_prices) additional_data += `<p class="cart-3-item--price font-small" id="price_${index}">$${formatNumber(detail['price'])}</p>`;
        const decoradoOptions = this.selectCardPrint(detail['printing_technique'], detail['printing_type']);

        return `<form class="cart-3-item-main row mb-3" id="detail_${index}">     
            <div class="col-10">  
                <div class="row">  
                    <div class="col-5 pr-0">
                        <a href="${url}" class="pvw-product-image">
                            <img class="w-100" src="${img}" onerror=this.src="${UNAVAILABLE}" alt="${detail['name']}">
                        </a>
                    </div>
                    <div class="col-7 px-2">                
                        <p class="cart-item--name cart-3-item--name secondary-font mb-0">${detail['name']}</p>
                        <p class="cart-item--code cart-3-item--code color-mycavi font-small">${detail['code_product']}</p>
                        ${additional_data}     
                        <div class="w-100 d-flex mt-2">
                            <button type="button" class="cart-3-item--qty-btn btn btn-sm" onclick="quantityDown(${index});"><i class="bi bi-dash-lg"></i></button>
                            <input type="number" min="1" class="form-control text-center quantity-action cart-1-item--qty mx-1 p-1" placeholder="Cantidad" id="qty_${index}" index="${index}" data-code_product="${theme.showByModel ? detail['code'] : detail['code_product']}" data-id="${detail['id_order_detail']}" name="qty" value="${detail['qty']}">               
                            <button type="button" class="cart-3-item--qty-btn btn btn-sm" onclick="quantityUp(${index});"><i class="bi bi-plus-lg"></i></button>
                        </div>
                    </div>
                    <div class="col-12 mt-2">
                        <div class="input-group">
                            <span class="input-group-text font-small">Decorado</span>
                            <select name="printing_type" class="cart-2-item--print font-small form-select"> ${decoradoOptions} </select>
                        </div>
                        <div class="collapse mt-1" id="editNoteProduct_${index}">
                            <textarea class="card card-body form-control" name="note" placeholder="Escribe tu nota aquí.">${detail['note'] || ''}</textarea>
                        </div>
                        <div class="input-group mt-1">
                            <button class="btn btn-sm btn-mycavi" type="button" data-bs-toggle="collapse" data-bs-target="#editNoteProduct_${index}" aria-expanded="false" aria-controls="editNoteProduct_${index}" style="width: 50%;"><i class="bi bi-sticky"></i> Nota</button>
                            <button type="submit" class="update-action btn btn-sm btn-mycavi cart-2-item--update" data-form="detail_${index}" data-id="${index}" data-code_product="${theme.showByModel ? detail['code'] : detail['code_product']}" data-id_detail="${detail['id_order_detail']}" style="width: 50%;"><i class="bi bi-arrow-clockwise"></i> Actualizar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-2 pe-2">                
                <button type="button" class="btn btn-sm btn-danger cart-3-item--delete h-100 w-100" onclick="DeleteDetail(${index},${detail['id_order_detail']});" ><i class="bi bi-trash"></i></button>
            </div>       
        </form>`;
    }
    itemCartFour(detail, index) {
        let additionalData;
        if (detail['name_color']) additionalData = `<p class="font-small mb-1">${detail['name_color']}</p>`;
        return `
            <tr class="border-bottom border-top" id="detail_${index}">
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${detail['imagen']}" onerror="this.src='${UNAVAILABLE}'" alt="${detail['name']}" style="width: 90px; height: auto; margin-right: 10px;">
                        <div>
                            <a href="${window.location.href + '/producto/' + detail['code_product']}" class="text-dark fw-bold">${detail['name']}</a><br>
                            <small class="text-muted">${detail['code_product']}</small>
                            ${additionalData}
                        </div>
                    </div>
                </td>
                <td ${Theme.show_prices ? '' : 'class="d-none"'}>
                    <span id="price_${index}" class="fw-bold">$${formatNumber(detail['price'])}</span>
                </td>
                <td>
                    <div class="w-100 d-flex align-items-center">
                        <button type="button" class="btn btn-sm btn-mycavi minusBtn" onclick="quantityDown(${index});" style="border-radius: 5px 0 0 5px;padding: 2px 4px;"><i class="bi bi-dash-lg"></i></button>
                        <input type="number" min="1" class="form-control text-center quantity-action py-1" placeholder="Cantidad" id="qty_${index}" value="${detail['qty']}" data-code_product="${theme.showByModel ? detail['code'] : detail['code_product']}" data-id_detail="${detail['id_order_detail']}" style="border-radius: 0;padding: 2px 0px !important;font-size: 14px; width:100px" onchange="updateItemCartTable(this,true)">
                        <button type="button" class="btn btn-sm btn-mycavi plusBtn" onclick="quantityUp(${index});" style="border-radius: 0 5px 5px 0;padding: 2px 4px;"><i class="bi bi-plus-lg"></i></button>
                    </div>
                </td>
                <td>
                    <select class="form-select form-select-sm printing" style="min-width:100px" onchange="updateItemCartTable(this,false)">${this.selectCardPrint(detail['printing_technique'], detail['printing_type'])}</select>
                </td>
                <td>
                    <textarea class="form-control form-control-sm note" rows="2" style="min-width:100px" placeholder="Escribe tu nota aquí." id="note_${index}" onchange="updateItemCartTable(this,false)">${detail['note'] || ''}</textarea>
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger w-100 rounded" onclick="DeleteDetail(${index}, ${detail['id_order_detail']});"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`;
    }
}
export class Search extends Renders {
    static class_preview_product = 'col-6 col-lg-4 col-xl-3 my-3';
    static order = [
        { value: 'predeterminado', name: 'Orden Predeterminado' },
        { value: 'orden-alfabetico', name: 'Ordenar por Orden alfabético' }
    ];
    static view = [
        { value: 24, name: 'Mostrar 24' },
        { value: 52, name: 'Mostrar 52' },
        { value: 76, name: 'Mostrar 76' },
        { value: 104, name: 'Mostrar 104' }
    ];

    constructor() {
        super();
        const urlParams = new URLSearchParams(window.location.search);
        this.secretCollection = (urlParams.get('acceso')) ? `?acceso=${urlParams.get('acceso')}` : '';
    }
    static selectOrder(order, prices = 0, pages = 0) {
        if (prices === 1 && pages > 0) {
            this.order.push({ value: 'precio-menor-mayor', name: 'Ordenar por Precio de menor a mayor' }, { value: 'precio-mayor-menor', name: 'Ordenar por Precio de mayor a menor' });
        }
        return this.order.map(item => `<option value="${item.value}" ${item.value == order ? 'selected' : ''}>${item.name}</option>`).join('');
    }
    static selectView(view) {
        return this.view.map(item => `<option value="${item.value}" ${item.value == view ? 'selected' : ''}>${item.name}</option>`).join('');
    }
    filter(section, pages, total, data) {
        let actual_order = data.order;
        let actual_view = data.show;
        let actual_page = parseInt(data.page);

        let opts_order = Search.selectOrder(actual_order, theme.product.prices, pages);
        let opts_view = Search.selectView(actual_view);

        let total_pages = parseInt(pages);
        let prev_page = actual_page - 1;
        let next_page = actual_page + 1;

        let prev_url, next_url, last_url, parameter;

        if (section === "busqueda") {
            let keyword = data.keyword;
            prev_url = `${theme.site.url}/busqueda/${data.category}/${data.color}/${keyword}/${data.price_min}/${data.price_max}/${actual_order}/${actual_view}/${prev_page}`;
            next_url = `${theme.site.url}/busqueda/${data.category}/${data.color}/${keyword}/${data.price_min}/${data.price_max}/${actual_order}/${actual_view}/${next_page}`;
            last_url = `${theme.site.url}/busqueda/${data.category}/${data.color}/${keyword}/${data.price_min}/${data.price_max}/${actual_order}/${actual_view}/${total_pages}`;
        } else {
            parameter = section === "categoria" ? data.category : data.slug;
            prev_url = `${theme.site.url}/${section}/${parameter}/${actual_order}/${actual_view}/${prev_page}${this.secretCollection}`;
            next_url = `${theme.site.url}/${section}/${parameter}/${actual_order}/${actual_view}/${next_page}${this.secretCollection}`;
            last_url = `${theme.site.url}/${section}/${parameter}/${actual_order}/${actual_view}/${total_pages}${this.secretCollection}`;
        }

        let action_prev = prev_page < 1 ? 'disabled' : '';
        let action_next = next_page > total_pages ? 'disabled' : '';

        if (prev_page < 1) prev_url = "#!";
        if (next_page > total_pages) next_url = "#!";

        return `
            <div class="filter_page row align-items-center">
                <div class="col-12 col-md-3 col-lg-4 mb-3 mb-md-0">
                    <select name="order_by" class="form-select filter_input">
                        ${opts_order}
                    </select>
                </div>
                <div class="col-12 col-md-2 mb-3 mb-md-0">
                    <select name="to_show" class="form-select filter_input">
                        ${opts_view}
                    </select>
                </div>
                <div class="col-6 col-md-3 text-center">
                    <strong>${new Intl.NumberFormat('es-MX').format(total)}</strong> Productos<span class="d-none d-sm-inline"> encontrados</span>
                </div>
                <div class="col-6 col-md-4 col-lg-3 text-end">
                    <a href="${prev_url}" class="btn_pagination btn-mycavi" ${action_prev}>
                        <i class="bi bi-chevron-left"></i>
                    </a>
                    <span class="actual_pagination">${actual_page}</span> /
                    <a href="${last_url}" class="total_pagination">${total_pages}</a>
                    <a href="${next_url}" class="btn_pagination btn-mycavi" ${action_next}>
                        <i class="bi bi-chevron-right"></i>
                    </a>
                </div>
            </div>
        `;
    }
    render(section, search = false, filters) {
        const render = new Theme();
        const filter = this.filter(section, search.pages, search.total, filters);
        document.getElementById("filter_box_bottom").innerHTML = filter;
        document.getElementById("filter_box_top").innerHTML = filter;
        this.handleFilters(filters, section);
        return render.products(search.products, Search.class_preview_product);
    }
    handleFilters(filters, section) {
        document.addEventListener("change", (event) => {
            const target = event.target;
            const isOrder = target.name === "order_by";
            const isShow = target.name === "to_show";

             if (isOrder || isShow) {                
                const wrapper = target.closest(".filter_page") || document;

                const order = isOrder ? target.value : wrapper.querySelector('[name="order_by"]')?.value || filters.order;
                const show  = isShow  ? target.value : wrapper.querySelector('[name="to_show"]')?.value || filters.show;
                let url = "";

                switch (section) {
                    case "categoria":
                        url = `${theme.site.url}/categoria/${filters.category}/${order}/${show}/1`;
                        break;
                    case "busqueda":
                        url = `${theme.site.url}/busqueda/${filters.category}/${filters.color}/${filters.keyword}/${filters.price_min}/${filters.price_max}/${order}/${show}/1`;
                        break;
                    case "coleccion":
                        url = `${theme.site.url}/coleccion/${filters.slug}/${order}/${show}/1${this.secretCollection}`;
                        break;
                }
                
                window.location.href = url;
            }
        });
    }
    handleEmpty(section, message, filters) {
        document.getElementById("filter_box_top").innerHTML = this.filter(section, 0, 0, filters);
        document.getElementById("products_box").innerHTML = ` <div class="col-12 my-5 text-center"> <h2>${message}</h2> </div>`;
    }
    preloader(section, filters) {
        const render = new Theme();
        const filter = this.filter(section, 0, 0, filters);
        document.getElementById("filter_box_bottom").innerHTML = filter;
        document.getElementById("filter_box_top").innerHTML = filter;
        return render.previewLoader(Search.class_preview_product);
    }
}
window.Renders = Renders;
window.Search = Search;
window.Theme = Theme;