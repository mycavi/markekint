const alert_cart = document.getElementById('alert-cart');
const countCartBtn = document.getElementById("count_cart");
const count_prod = document.getElementById('count_prod');
const cartBox = document.getElementById("cart");
const closeCart = document.getElementById("close_cart");

const CART_INTRO = window.location.origin + '/shopping-intro.gif';
const CART_HOVER = window.location.origin + '/shopping-hover.gif';
const CART_STATIC = window.location.origin + '/shopping-static.png';
const ICON_CHECK = window.location.origin + '/check-outline.gif';
const ICON_ERROR = window.location.origin + '/error-outline.gif';

export class Cart {
    constructor() {
        const render = new Theme();
        this.cookie = cartCookie();
        this.itemStyle = {
            'cart-style-1': render.itemCartOne.bind(render),
            'cart-style-2': render.itemCartTwo.bind(render),
            'cart-style-3': render.itemCartThree.bind(render),
            'cart-style-4': render.itemCartFour.bind(render),
        };
    }
    async get() {
        try {
            let data_post = { token: theme.site.token, ui_order: this.cookie.get() }
            if (theme.user?.active) data_post['customer_token'] = theme.user.token;

            const { data: response } = await axios.post(`${theme.site.request}/cart/details`,data_post);
            return response?.status ? response : false;
        } catch (error) {
            alert_cart.innerHTML = `<img src="${ICON_ERROR}" width="80px"><br><h4>Ocurrió un error al cargar tu carrito</h4>`;
            alert_cart.style.display = 'block';
            toggleAlertCart();
            return false;
        }
    }
    async add(context = 'detail', button) {
        const container = document.querySelector(`[data-source="${context}"]`) || document;
        const alertBtnCartBox = container.querySelector('.alert-btn-cart-box');
        const virtualCavi = container.querySelector('.add-img-virtualcavi');
        const noteProduct = container.querySelector('.add-note-product');
        const printTech = container.querySelector('.add-print-tech');
        const input_qty = container.querySelector('.qty');
        const qty = parseInt(input_qty?.value);
        const code_product = input_qty?.getAttribute('code_product');

        if (!input_qty || !qty || qty < parseInt(input_qty.min) || qty > parseInt(input_qty.max)) {
            alert_cart.innerHTML = `<img src="${ICON_ERROR}" width="100px"><br><h3>Cantidad no válida</h3>`;
            toggleAlertCart();
            return;
        }

        $("#count_cart").off("click");
        button.style.display = 'none';
        alertBtnCartBox.innerHTML = `<div class="text-center mt-3"><div class="spinner-border color-mycavi" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
        const get_cookie = this.cookie.get();
        let data = { qty, code_product, token: theme.site.token }
        if (theme.user?.active) data['customer_token'] = theme.user.token;
        if(get_cookie) data['ui_order'] = get_cookie;
        const virtualCaviId = document.querySelector('[virtualcavi="savedInput"]').getAttribute('data-vcid');
        if (virtualCavi.value){
            data['img_virtualcavi'] = virtualCavi.value;
            data['virtualCaviId'] = virtualCaviId;
        }
        if (noteProduct.value) data['note'] = noteProduct.value;
        if (printTech.value !== '') data['printing_type'] = printTech.value;

        try {
            const { data: response } = await axios.post(`${theme.site.request}/cart/add`, data);
            alert_cart.innerHTML = '';

            if (response.status) {
                this.cookie.set(response.ui_order);
                alert_cart.innerHTML = `<img src="${ICON_CHECK}" width="100px"><br><h3>${response.message}</h3>`;
                count_prod.textContent = String(parseInt(response.count_products)).padStart(2, '0');
                alertBtnCartBox.innerHTML = `<div class="alert alert-success py-2 mb-0 mt-3" style="border-left: 4px solid #198754;text-align: center;color: #198754;" role="alert"><img src="${ICON_CHECK}" class="me-2" width="20px">Agregado correctamente.</div>`;
                if(virtualCavi.value){
                    const cookieName = `VirtualCaviCatalog-${code_product}`;
                    const expires = new Date();
                    expires.setDate(expires.getDate() + 2);
                    document.cookie = `${cookieName}=${virtualCaviId}; path=/; expires=${expires.toUTCString()}`;

                    document.querySelector('[virtualcavi="savedInput"]').setAttribute('data-vcid','');
                    document.querySelector('[virtualcavi="savedInput"]').value = '';
                    document.querySelector('[virtualcavi="savedInputMessage"]').innerHTML = '';
                }
                
                if ($('#cart').hasClass('open')) {
                    await this.template();
                }
            } else {
                alert_cart.innerHTML = `<img src="${ICON_ERROR}" width="100px"><br><h3>${response.message}</h3>`;
            }

            toggleAlertCart();

        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        } finally {
            setTimeout(() => {
                alertBtnCartBox.innerHTML = '';
                button.style.display = '';
            }, 2000);
        }
    }
    async deleteItem(id, id_order_detail) {
        try {
            let data_post = { id_detail: id_order_detail, ui_order: this.cookie.get(), token: theme.site.token }
            if (theme.user?.active) data_post['customer_token'] = theme.user.token;
            const { data: response } = await axios.post(`${theme.site.request}/cart/delete-detail`, data_post);

            if (response.status) {
                const detailEl = document.getElementById(`detail_${id}`);
                if (detailEl) detailEl.remove();

                const totalFormatted = formatNumber(response.total);

                document.getElementById('total_cart').textContent = totalFormatted;

                const paddedTotal = String(parseInt(response.details_total)).padStart(2, '0');
                document.getElementById('total_detail').textContent = paddedTotal;
                count_prod.textContent = paddedTotal;

                alert_cart.innerHTML = `<img src="${ICON_CHECK}" width="100px"><br><h3>${response.message}</h3>`;
                toggleAlertCart();

                if (parseInt(response.details_total) === 0) {
                    cartBox.classList.remove('open');
                }
            } else {
                alert_cart.innerHTML = `<img src="${ICON_ERROR}" width="100px"><br><h3>${response.message}</h3>`;
                toggleAlertCart();
            }

        } catch (error) {
            console.error('Error al eliminar detalle del carrito:', error);
            alert_cart.innerHTML = `<img src="${ICON_ERROR}" width="100px"><br><h3>Ocurrió un error inesperado.</h3>`;
            toggleAlertCart();
        }
    }
    async validate(button) {
        if (!button) return;
        button.innerHTML = `<div class="text-center"> <div class="spinner-border" style="width:1.3rem;height:1.3rem" role="status"> <span class="visually-hidden">Loading...</span> </div> </div>`;

        try {
            let data_post = { token: theme.site.token, customer_token: theme.user.token, ui_order: this.cookie.get() }
            const { data: response } = await axios.post(`${theme.site.request}/cart/validate`,data_post);

            if (response.status && (theme.user.active && theme.user.token)) {
                setTimeout(() => { location.href = `${theme.site.url}/cotizacion`; }, 500);
            } else {
                button.innerHTML = `<strong>COTIZAR</strong>`;

                const modalTarget = theme.whatsAppOrders !== "" ? '#modalOrderWhatsOrSession' : '#modaLogin';
                const modal = new bootstrap.Modal(document.querySelector(modalTarget));
                modal.show();

                cartBox?.classList.remove('open');
                const inputCheckout = document.querySelector("#login-go-checkout");
                if (inputCheckout) inputCheckout.value = "1";
            }
        } catch (error) {
            console.error('Error al validar el carrito:', error);
            button.innerHTML = `<strong>COTIZAR</strong>`;
        }
    }
    async setHeaderCount() {
        const data = await this.get();
        const total = data ? data.total : 0;
        const count = parseInt(total) || 0;
        const padded = String(count).padStart(2, '0');
        if (count_prod) count_prod.textContent = padded;
        setTimeout(() => { $('.header__cart_icon').attr('src', CART_STATIC) }, 2000);
    }
    async template() {
        const response = await this.get();

        if (!response) {
            alert_cart.innerHTML = `<img src="${ICON_ERROR}" width="100px"><br><h3>Carrito vacío</h3>`;
            toggleAlertCart();
            this.cookie.get();
            return false;
        }

        const container = cartBox.querySelector('#details');
        container.innerHTML = '';

        const themeFunction = this.itemStyle[theme.product.cart]; // método del estilo del carrito seleccionado en la clase Theme
        let rows = '';
        
        response.details.forEach((detail, index) => {
            rows += themeFunction(detail, index, UNAVAILABLE);
        });
        container.innerHTML = rows;

        if (theme.product.prices == 1 || (theme.product.prices == 0 && theme.user.active)) {
            const total = response.order?.total ?? 0;
            const total_cart = cartBox.querySelector('#total_cart');
            if (total_cart) {
                total_cart.textContent = formatNumber(total);
            }
        }

        const total_detail = cartBox.querySelector('#total_detail');
        if (total_detail) {
            total_detail.textContent = String(parseInt(response.total)).padStart(2, '0');
        }

        return true;
    }
    async send(token='') {
        const msgBox = document.getElementById('msg-send');
        const id_address = parseInt($('input[name=user_addr]:checked').val());
        const postData = { token_data: token};
        if (id_address) postData.id_address = id_address;

        msgBox.innerHTML = `<div class="text-center"> <div class="spinner-border color-mycavi" role="status"> <span class="visually-hidden">Loading...</span> </div> </div>`;

        try {
            const { data: response } = await axios.post(`${theme.site.url}/request/cart-sent`, postData);

            if (response.status) {
                msgBox.innerHTML = `<div class="alert alert-info"> <strong>¡Éxito!</strong><br>${response.message} </div>`;
                window.location.href = `${theme.site.url}/gracias-por-cotizar`;
            } else {
                const message = response.message || 'Ocurrió un error, verifique sus datos';
                msgBox.innerHTML = `<div class="alert alert-warning"> <strong>¡Atención!</strong><br>${message} </div>`;
            }
        } catch (error) {
            msgBox.innerHTML = `<div class="alert alert-danger"><strong>Error:</strong><br>Ocurrió un error inesperado al procesar su pedido.</div>`;
        }
    }
}
function closeAlertCart() {
    $('#alert-cart').fadeOut('slow');
    $('#overlay-alert').fadeOut('slow');
    $('.header__cart_icon').attr('src', CART_STATIC);
    $('#overlay-alert').off('click', closeAlertCart);
}
function toggleAlertCart() {
    $('.header__cart_icon').attr('src', CART_HOVER);
    $('#overlay-alert').fadeIn('slow');
    $('#alert-cart').fadeIn('slow');
    $('#overlay-alert').on('click', closeAlertCart);
    $('#alert-cart').on('click', (e) => e.stopPropagation());
    setTimeout(closeAlertCart, 4000);
}
export function quantityDown(index) {
    const id = parseInt(index);
    let oldValue = parseFloat($('#qty_' + id).val());
    const min = $('#qty_' + id).attr('min');
    let newVal = oldValue <= min ? oldValue : oldValue - 1;
    $('#qty_' + id).val(newVal).trigger("change");
}
export function quantityUp(index) {
    const id = parseInt(index);
    let oldValue = parseFloat($('#qty_' + id).val());
    $('#qty_' + id).val(oldValue + 1).trigger("change");
}
export function SelectAddress(id) {
    $("#validate_address .user_address").each(function () {
        $('#' + $(this).attr('id')).removeClass('address-active');
    });
    $('#add_' + id).prop('checked', true);
    $('#address_' + id).addClass('address-active');
}
export async function updateItemCartTable(origin,qtyChange) {
    const row = origin.closest('tr');
    const qtyInput = row.querySelector('.quantity-action');
    const codeProduct = qtyInput.dataset.code_product;
    const idDetail = qtyInput.dataset.id_detail;
    const qty = parseInt(qtyInput.value);
    const printingType = row.querySelector('.printing').value;
    const note = row.querySelector('.note').value;

    const formData = new FormData();
    const cookie = cartCookie();
    formData.append("code_product", codeProduct);
    formData.append("id_detail", idDetail);
    formData.append("qty", qty);
    formData.append("printing_type", printingType);
    formData.append("note", note);
    formData.append("ui_order", cookie.get());
    formData.append("token",theme.site.token);
    if (theme.user?.active) formData.append("customer_token",theme.user.token); 

    const minusBtn = row.querySelector('.minusBtn');
    const plusBtn = row.querySelector('.plusBtn');
    if(qtyChange){
        minusBtn.disabled = true;
        plusBtn.disabled = true;
    }

    try {
        const { data: response } = await axios.post(`${theme.site.request}/cart/edit-detail`, formData);

        if (response.status) {
            document.querySelector('#total_cart').innerHTML=response.total;
        }
    } catch (error) {
        console.error('Error al actualizar cantidad del carrito:', error);
        document.querySelector('$total_cart').innerHTML=``;
    } finally {
        if(qtyChange){
            minusBtn.disabled = false;
            plusBtn.disabled = false;
        }
    }
}

window.quantityDown = quantityDown;
window.quantityUp = quantityUp;
window.SelectAddress = SelectAddress;
if(document.querySelector('.sidebar-cart--full')) window.updateItemCartTable = updateItemCartTable;

const cartInstance = new Cart();
window.AddCart = (context, button) => cartInstance.add(context, button);
window.DeleteDetail = (id, id_order_detail) => cartInstance.deleteItem(id, id_order_detail);
window.CheckCart = (button) => cartInstance.validate(button);
window.SendOrder = (token) => cartInstance.send(token);

if (countCartBtn){
    countCartBtn.addEventListener("click", async () => {
        if (cartBox.classList.contains("open")) {
            cartBox.classList.remove("open");
            return;
        }
    
        alert_cart.innerHTML = `<img src="${CART_INTRO}" alt="Cargando..." width="50px"><p class="mt-2">Cargando tu carrito...</p>`;
        alert_cart.style.display = "block";
    
        const cart = await cartInstance.template();
    
        if (cart) {
            cartBox.classList.add("open");
            alert_cart.style.display = "none";
        } else {
            cartBox.classList.remove("open");
        }
    });
}
if (closeCart && cartBox){
    closeCart.addEventListener("click", function () {
        cartBox.classList.toggle("open");
    });
}

$('html').on("click", ".update-action", async function (e) {
    e.preventDefault();
    const updateButton = $(this);
    const id = updateButton.data('id');
    const code_product = String(updateButton.data('code_product'));
    const id_detail = updateButton.data('id_detail');
    const form = document.getElementById(updateButton.data('form'));
    const formData = new FormData(form);
    
    formData.append("code_product", code_product);
    formData.append("id_detail", id_detail);
    
    try {
        const { data: response } = await axios.post(`${theme.site.request}/cart/edit-detail`, formData);

        if (response.status) {
            $('#total_cart').text(response.total);
            $('#price_' + id).text(`$${response.price}`);
            alert_cart.innerHTML = `<img src="${ICON_CHECK}" width="100px"><br><h3>${response.message}</h3>`;
            toggleAlertCart();
        }

    } catch (error) {
        console.error('Error al actualizar cantidad del carrito:', error);
    }
});

