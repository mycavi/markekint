const UNAVAILABLE = window.location.origin + '/no-disponible.jpg';
const LOADING = window.location.origin + '/loading.png';
const body = document.body;
const app_header = document.querySelector('#header');
const menu_container = document.getElementById('menu_container');
const footer = document.querySelector('footer');
const totop = document.getElementById('totop');
let fixed = app_header.offsetTop;

async function dynamicWith() {
    document.cookie = `screen_width=${window.innerWidth}; path=/`;
    return new Promise((resolve, reject) => {
        const app_container = document.querySelector('#app');
        app_container.style.marginTop = app_header.clientHeight + 'px';
        if (window.innerWidth > 992) {
            $('.sidebar,.submenu__container').removeClass('responsive open');
            menu_container.classList.remove('responsive', 'open');
            if (theme.header.style == "header-style-1") menu_container.classList.remove('transition-ease');
            body.style.overflow = "initial";
        } else {
            $('.sidebar,.submenu__container').addClass('responsive');
            menu_container.classList.add('responsive');
            if (theme.header.style == "header-style-1") menu_container.classList.add('transition-ease');
        }
        let min_height = app_header.clientHeight + footer.clientHeight;
        document.querySelector('.page_container').style.minHeight = 'calc(100vh - ' + min_height + 'px)';
        resolve();
    });
}
async function getCategoryColors(category = "todo") {
  try {
    const response = await axios.post(`${theme.site.request}/catalogue/colors`, { category, token: theme.site.token });

    if (!response.data.status) { return false; }
    if (response.data.colors) {
      const render = new Theme();
      render.colorInput(response.data.colors, '#category_colors', document.querySelector('.sidebar__colors_box'));
    }
  } catch (error) {
    console.error('Error al obtener colores de categoría:', error);
    return false;
  }
}
async function closeSession() {
  try {
    const response = await axios.post(`${theme.site.url}/request/logout`);
    if (!response.data.result) { return false; }
    const cart = cartCookie();
    cart.delete();
    window.location.href = theme.site.url;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
}
function toggleMenu() {
    if (menu_container.classList.contains("open")) {
        menu_container.classList.remove("open");
        if (window.innerWidth <= 992) body.style.overflow = "initial";
    } else {
        menu_container.classList.add("open");
        if (window.innerWidth <= 992) body.style.overflow = "hidden";
    }
    $('.submenu__container').removeClass('open');
}
function Recovery() {
  const modalLogin = document.getElementById('modaLogin');
  const modalRecovery = document.getElementById('Recovery');
  bootstrap.Modal.getInstance(modalLogin)?.hide();
  new bootstrap.Modal(modalRecovery).show();
}
function ShowNewUser() {
  const modalLogin = document.getElementById('modaLogin');
  const modalRegister = document.getElementById('modalRegister');
  bootstrap.Modal.getInstance(modalLogin)?.hide();
  new bootstrap.Modal(modalRegister).show();
}
function ShowLogin() {
  const modalRegister = document.getElementById('modalRegister');
  const modalLogin = document.getElementById('modaLogin');
  bootstrap.Modal.getInstance(modalRegister)?.hide();
  new bootstrap.Modal(modalLogin).show();
}
function divCadena(cadena, simbol) {
    let arrayDeCadenas = cadena.split(' ');
    final = arrayDeCadenas.join(simbol);
    return final;
}
function tooltipInit() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
        new bootstrap.Tooltip(el);
    });
}
function cartCookie() {
  const cookieName = 'cart';

  const set = (value) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 2); // 2 days
    document.cookie = `${cookieName}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}`;
  };

  const get = () => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const remove = () => {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  return { set, get, delete: remove };
}
const carruseles = {};
function initProductsCarrusel(selector) {
    if (carruseles[selector]) {
        carruseles[selector].destroy();
    }

    carruseles[selector] = new Splide(selector, {
        type: 'loop',
        perPage: theme.carrusel.desktop,
        pagination: false,
        autoplay: true,
        interval: 3000,
        arrows: theme.carrusel.arrows,
        gap: '30px',
        padding: { left: '0rem', right: '100px' },
        breakpoints: {
            2000: {
                perPage: theme.carrusel.desktop,
                padding: { left: '0rem', right: '100px' },
            },
            992: {
                perPage: theme.carrusel.tablet,
                padding: { left: '0rem', right: '80px' },
            },
            680: {
                perPage: theme.carrusel.phone,
                padding: { left: '0rem', right: '30px' },
                gap: '10px',
            }
        }
    });
    carruseles[selector].mount();
    return carruseles[selector];
}
function formatNumber(value,current="es-MX") {
    const number = parseFloat(value);
    return new Intl.NumberFormat(current, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}