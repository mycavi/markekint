const addCartColorSelector = '.add-cart-color';

export const selectCircleColor = (color, context = 'detail') => {
    const container = document.querySelector(`[data-source="${context}"]`) || document;
    const addCartColor = container.querySelector(addCartColorSelector);
    const options = addCartColor.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].text.toLowerCase() === color.toLowerCase()) {
            addCartColor.selectedIndex = i;
            selectedColorActions(context);
            goSlideColor(color, context);
            break;
        }
    }
};
export const goSlideColor = (color, context = 'detail') => {
    try {
        const container = document.querySelector(`[data-source="${context}"]`) || document;
        const $container = $(container);
        const slideIndex = $container.find(`img[color="${color}"]`).closest('.carousel-item').index();
        const $gallery = $container.find('#gallery');
        const carousel = bootstrap.Carousel.getOrCreateInstance($gallery);
        carousel.to(slideIndex);
    } catch (error) {
        console.error('goSlideColor error:', error);
    }
};
export const selectedColorActions = (context = 'detail') => {
    const container = document.querySelector(`[data-source="${context}"]`) || document;
    const addCartColor = container.querySelector('.add-cart-color');
    const btnStockAlert = container.querySelector('.btn-stock-notification');
    const btnAddCartBox = container.querySelector('.btn-add-cart-box');
    const qty = container.querySelector('.qty');

    qty.max = addCartColor.value.replace(/,/g, '');
    let selectedCode = addCartColor.options[addCartColor.selectedIndex].getAttribute('code_product');
    qty.setAttribute('code_product', selectedCode);

    if (addCartColor.value == 0 || addCartColor.value == 'No Disponible') {
        qty.value = 0;
        qty.min = 0;
        if (btnStockAlert) {
            btnStockAlert.classList.remove('d-none');
            btnStockAlert.innerHTML = `<i class="bi bi-bell"></i> Notificarme cuando haya stock`;
            btnAddCartBox.innerHTML = ``;
            btnStockAlert.replaceWith(btnStockAlert.cloneNode(true));
            const newBtnStockAlert = container.querySelector('.btn-stock-notification');
            newBtnStockAlert.addEventListener('click', (event) => {
                stockNotification(event, `${selectedCode}`);
            });
        } else {
            btnAddCartBox.innerHTML = `<div class="alert alert-secondary mt-3 text-center" role="alert"> Sin stock disponible en este color, para recibir notificaciones <span class="pointer text-decoration-underline" data-bs-toggle="modal" data-bs-target="#modaLogin">Inicie Sesión</span> </div>`;
        }
    } else {
        qty.value = 1;
        qty.min = 1;
        btnAddCartBox.innerHTML = `<button class="btn btn-sm btn-secondary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#noteProduct" aria-expanded="false" aria-controls="noteProduct">Agregar nota</button>
        <div class="collapse mt-1" id="noteProduct">
            <textarea class="add-note-product card card-body form-control" placeholder="Escribe tu nota aquí."></textarea>
        </div>
        <button type="button" class="btn btn-sm btn-mycavi w-100 mt-3" onclick="AddCart('${context}', this);"> Agregar a mi cotización </button>`;
        if (btnStockAlert) btnStockAlert.classList.add('d-none');
    }
};
export function initGrouped(context = 'detail') {    
    const container = document.querySelector(`[data-source="${context}"]`) || document;
    const addCartColor = container.querySelector('.add-cart-color');

    selectedColorActions(context);

    addCartColor.addEventListener('change', () => {
        selectedColorActions(context);
        goSlideColor(addCartColor.options[addCartColor.selectedIndex].innerText.toLowerCase(), context);
    });
}

if (document.querySelector(`[data-source="detail"] ${addCartColorSelector}`)) initGrouped();