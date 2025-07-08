import { Renders, Theme, Search } from '/js/components/theme.js';
import { Cart } from '/js/components/cart.js';
import { deleteNotification, UserNotifications } from '/js/components/notifications.js';
import { showPreview } from '/js/components/product.js';

totop.onclick = function () { window.scroll({ top: 0, left: 0, behavior: 'smooth' }); };
document.addEventListener("DOMContentLoaded", async function (event) {
    try {
        $('#alert-cart').hide();
      
        await getCategoryColors();
        await dynamicWith();
        // AOS.init({ duration: 600 });
        
        document.dispatchEvent(new Event('SecondaryLoad'));
        if (theme.user.active===0) document.querySelector("#modaLogin").addEventListener("hidden.bs.modal", ()=> document.querySelector("#login-go-checkout").value = "0");
    } catch (error) {
        console.error("Load Error:", error);
    }
});
document.addEventListener("SecondaryLoad", async function (event) {
    const cart = new Cart();
    cart.setHeaderCount();
    if (theme.user.active===1) await UserNotifications();
});
window.onresize = function () {
    // AOS.refresh();
    dynamicWith();
};
window.onscroll = function () {
    // AOS.refresh();
    let windowHeight = (window.innerHeight) - 250;
    (window.pageYOffset > fixed) ? app_header.classList.add("scroll") : app_header.classList.remove("scroll");
    (window.pageYOffset > windowHeight) ? totop.classList.add("active") : totop.classList.remove("active");
};
$('html').on("click", ".has_child a, .sidebar_btn_open", function (e) {
    e.preventDefault();
    $('#cart').removeClass('open');
    if (window.innerWidth <= 992 || theme.header.style ==="header-style-2" ) menu_container.classList.remove('open');
    let $submenu = $(this).attr('attr');
    if ($(this).hasClass("open")) {
        $('#' + $submenu).removeClass('open');
        $(this).removeClass('open');
    } else {
        $('.sidebar,.submenu__container').removeClass('open');
        $('#' + $submenu).toggleClass('open');
        $(this).toggleClass('open');
    }
});
$(".submenu_close").click(function () {
    $('.submenu__container,.sidebar').removeClass('open');
    $('.has_child a').removeClass('open');
    body.style.overflow = "initial";
});
$(".close-session").click(function () {
    closeSession();
});
$(".btn-menu-close, .btn-menu-open").click(function () {  
    toggleMenu();
});
$('html').on("change", "#category", function (e) {
    e.preventDefault();
    getCategoryColors($(this).val());
});
document.getElementById('search').addEventListener('submit', function (e) {
    e.preventDefault();
    let word = document.getElementById('word').value;
    let word_search;
    if (word != "") {
        word = word.trim();
        word = divCadena(word, '+');
        word_search = decodeURIComponent(word);
    } else {
        word_search = 'nan';
    }
    let category = $('#category').val();
    if (category == "" || category == null) { category = "todo" }
    let price_from = document.getElementById('price_min').value;
    let price_to = document.getElementById('price_max').value;

    let color = null;
    let colors = document.querySelectorAll('.color_input--search');
    colors.forEach(item => {
        if (item.checked) { color = item.value; }
    });
    if (color == null || color == ' ' || color == '') {
        color = 'todo';
    }
    if (price_from == 0 && price_to == 0) {
        window.location.href = theme.site.url + '/busqueda/' + category + '/' + color + '/' + word_search;
    } else {
        window.location.href = theme.site.url + '/busqueda/' + category + '/' + color + '/' + word_search + '/' + price_from + '/' + price_to;
    }
});
// SEND WHATSAPP ORDER
if (theme.user.active===0){
    window.addEventListener("DOMContentLoaded", function () {
        let contact_validation = false;
        const formOrderWhats = document.querySelector("#formOrderWhats");
        const alert_box = formOrderWhats.querySelector('#orderWhatsNameAlert');
        const app_name = formOrderWhats.querySelector('#app_name').value;
        const whats_app = formOrderWhats.querySelector('#whats_app').value;
        new Validator(formOrderWhats, function (err, res) {
            if (res) contact_validation = true;
        }, {
            locale: "es",
            errorClassName: "validation-error",
            messages: {
                es: {
                    name: {
                        empty: 'Nombre necesario'
                    },
                    phone: {
                        empty: 'Teléfono necesario',
                        incorrect: 'Teléfono incorrecto'
                    },
                    email: {
                        empty: 'Correo necesario',
                        incorrect: 'Correo incorrecto'
                    },
                    required: {
                        empty: 'Campo necesario'
                    }
                }
            }
        });
        formOrderWhats.addEventListener('submit', (e) => {
            e.preventDefault();
            if (contact_validation) {
                saveFormDataToCookie();
                alert_box.innerHTML = '<div class="text-center"><div class="spinner-border color-mycavi" role="status"><span class="visually-hidden">Loading...</span></div></div>';
                let newWindow = window.open('', '_blank');
                const dataPost = new FormData(formOrderWhats);
                const cart = cartCookie();
                dataPost.append('token', theme.site.token);
                dataPost.append('ui_order', cart.get());
                axios.post(theme.site.request + "/cart/send-whats-app", dataPost).then(response => {
                    response = response.data;
                    if (response.status) {
                        alert_box.innerHTML = '<div class="my-3 alert alert-success" role="alert"><p class="mb-0"><strong>¡ÉXITO!</strong></p><p class="mb-0">' + response.message + '</p> </div>';
                        axios.get(`${theme.site.url}/request/cart-whatsapp`).then(response => {
                            const urlOrder = `${theme.site.url}/download/order-pdf/${cart.get()}?accessPdfOrder=${response.data.token}`;
                            const urlWhatsApp = `https://wa.me/${whats_app}?text=${encodeURIComponent(`Hola ${app_name}, quiero cotizar este carrito: `)}${urlOrder}`;
                            setTimeout(() => {
                                location.reload();
                                newWindow.location.href = urlWhatsApp;
                                cart.delete();
                            }, 1500);
                        });
                    } else {
                        let box_type = '<div class="my-3 alert alert-warning" role="alert"><p class="mb-0"><strong>ERROR</strong></p><p class="mb-0">' + response.message + '</p> </div>';
                        if (response.message) {
                            box_type = '<div class="my-3 alert alert-info" role="alert"><p class="mb-0"><strong>¡Atención!</strong></p><p class="mb-0">' + response.message + ' Vuelva a intentar.</p></div>';
                        }
                        alert_box.innerHTML = box_type;
                        newWindow.close();
                    }
                }).catch(function (error) {
                    console.error(error);
                    alert_box.innerHTML = '<div class="my-3 alert alert-warning" role="alert"><p class="mb-0"><strong>ERROR</strong></p><p class="mb-0">' + error.message + '</p> </div>';
                    newWindow.close();
                });
            }
        });
        const saveFormDataToCookie =()=> {
            const formData = new FormData(formOrderWhats);
            formData.forEach((value, key) => {
                document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000`; // Expira en 1 año
            });
        }
        const loadFormDataFromCookie = () => {
            const cookies = document.cookie.split('; ');
            cookies.forEach(cookie => {
                const [name, value] = cookie.split('=');
                const decodedValue = decodeURIComponent(value);
                const formField = formOrderWhats.querySelector(`[name=${name}]`);
                if (formField) {
                    if (formField.type === 'radio') {
                        const radioToSelect = formOrderWhats.querySelector(`[name=${name}][value="${decodedValue}"]`);
                        if (radioToSelect) {
                            radioToSelect.checked = true;
                        }
                    } else {
                        formField.value = decodedValue;
                    }
                }
            });
        };
        loadFormDataFromCookie();
    });
}