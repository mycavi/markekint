import { Search } from '/js/components/theme.js';

const raw = document.getElementById('filters-data');
const { dataPost, filters } = JSON.parse(raw.textContent);

const render = new Search();
let resultBox= document.querySelector('#products_box');
resultBox.innerHTML = render.preloader('categoria',filters);

document.addEventListener("SecondaryLoad", async function (event) {
    try {
        const response = await axios.post(`${theme.site.request}/advanced-search`, dataPost);
        const search = response.data;
        if (search.result && search.total > 0) {
            resultBox.innerHTML = render.render('categoria',search,filters);
        } else {
            render.handleEmpty("categoria",search.message, filters);
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        render.handleEmpty("categoria","Ocurrió un error", filters);
    }
});