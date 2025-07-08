export class Renders {
    constructor(site) {        
        const snippet = site?.settings?.snippet || {};
        this.footerStyle = snippet.footer;
        this.networkStyle = snippet.footer_network;
    }
    menu(menu, class_extra, class_link) {
        if (!Array.isArray(menu) || menu.length === 0) {
            return "";
        }
        return menu.map((data) => {
            const liClass = [class_extra, data.class].filter(Boolean).join(' ');
            const linkAttributes = `href="${data.link || '#'}" target="${data.target || '_self'}" ${data.attr ? `attr="${data.attr}"` : ''}`;

            return ` <li class="${liClass}"> <a class="${class_link}" ${linkAttributes}> ${data.title || "Sin título"} </a> </li>`;
        }).join('');
    }
    submenu(section, data, site_url) {
        if (!Array.isArray(data) || data.length === 0) {
            return '';
        }
        return data.map((c) => {
            let slug, description;
            if (section === "coleccion") {
                slug = c.slug_collection;
                description = c.description;
            }
            if (section === "categoria") {
                slug = c.code_category;
                description = c.name_category;
            }
            return `<li class="submenu_item"> <a class="submenu_link" href="${site_url}/${section}/${slug}">${description} </a></li>`;
        }).join('');
    }
    footerNetwork(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return '';
        }
        let t = '';
        let whatsApp = '';
        if (this.footerStyle === "footer-style-1") { t += `<li><p class="footer_ttl secondary-font h5">Síguenos en:</p></li>`; }

        data.forEach(item => {
            if (item.code_network === 'whatsapp') {
                whatsApp =`<a href="${item.link_network}" target="_blank" rel="noopener" class="footer_btn-whats"> <i class="bi bi-whatsapp"></i> </a>`;
                return;
            }

            if (this.networkStyle === "footer-network-1") {
                t += `
                <li class="footer__network_li ${this.networkStyle}--li">
                    <a href="${item.link_network}" class="footer_color social_network ${this.networkStyle}" target="_blank" rel="noopener">
                        <i class="bi bi-${item.code_network}"></i>
                        <span>${item.name_network}</span>
                    </a>
                </li>`;
            }
            if (this.networkStyle === "footer-network-2") {
                t += `<li class="footer__network_li ${this.networkStyle}--li">
                    <a href="${item.link_network}" class="social_network ${this.networkStyle} ${item.code_network}" target="_blank" rel="noopener">
                        <i class="bi bi-${item.code_network}"></i>
                    </a>
                </li>`;
            }
        });

        return {
            "items":t, 
            "whatsApp": whatsApp
        }
    }
    searchSelect(categories) {
        let opt = '<option value="todo" selected disabled>Seleccione una categoría</option>';
        opt += '<option value="todo">Todo</option>';
        categories.forEach(function (cat) {
            opt += `<option value="${cat.code_category}">${cat.name_category}</option>`;
        });
        return opt;
    }
}