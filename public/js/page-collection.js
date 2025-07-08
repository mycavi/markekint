import { Search } from '/js/components/theme.js';

const raw = document.getElementById('filters-data');
const { data, filters } = JSON.parse(raw.textContent);

const render = new Search();
let resultBox= document.querySelector('#products_box');
resultBox.innerHTML = render.preloader('coleccion',filters);

document.addEventListener("SecondaryLoad", async function (event) {
    try {
        if (data.result && data.total > 0) {
            resultBox.innerHTML = render.render('coleccion',data,filters);
        } else {
            render.handleEmpty("coleccion",data.message, filters);
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        render.handleEmpty("coleccion","Sin resultados", filters);
    }
});