window.addEventListener("DOMContentLoaded", () => {
    let tableOrdersProfile = $('#table-orders-profile').DataTable({
        "stateSave": true,
        "ajax": {
            "url": theme.site.request + "/order/list",
            "type": "POST",
            "data": {
                'token': theme.site.token, 
                "customer_token": theme.user.token
            },
            "dataSrc": "orders"
        },
        "order": [[0, 'desc']],
        "columns": [
            {
                "data": 'id',
                "className": 'text-center',
            },
            {
                "data": 'date_create',
                "className": 'text-center',
            },
            {
                "data": "description",
                "className": 'text-center',
            },
            {
                "data": null,
                "className": 'text-center',
                render: function (data) {
                    if (theme.product.prices != 2) return '$' + new Intl.NumberFormat('es-MX',{minimumFractionDigits: 2, maximumFractionDigits: 2}).format(data.total);
                    return "No disponible";
                }
            },
            {
                "data": null,
                "className": 'text-center',
                "orderable": false,
                render: function (data) {
                    btn = '<a href="' + theme.site.url + '/cotizacion/' + data.ui_order + '" target="_blank" class="btn btn-table btn-mycavi">Detalle</a>';
                    return btn;
                }
            }
        ],
        "language": {
            "url": theme.site.url + '/js/lang.json'
        }
    });
});