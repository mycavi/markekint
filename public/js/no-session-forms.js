const form_data = {
    'login': { 'validation': false, "process":`${theme.site.url}/request/login`, "action":"login"},
    'recovery': { 'validation': false, "process": `${theme.site.url}/request/recovery`, "action":"modal_hide" },
    'register': { 'validation': false, "process": `${theme.site.url}/request/register`, "action":"modal_hide" },
    'change_password': { 'validation': false, "process": `${theme.site.url}/request/account-confirm`, "action": "redirect", "location": theme.site.url  }
}
window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.customer-form').forEach(form => {
        new Validator(form, function (err, res) {
            if (res) {
                form_data[form.getAttribute("id")]["validation"] = true;
            }
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
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let alert_box = form.querySelector('.alert-form');
            alert_box.innerHTML = `<div class="text-center"><div class="spinner-border color-mycavi" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
            if (form_data[form.getAttribute("id")]["validation"]) {
                const data = Object.fromEntries(new FormData(form));
                const cart = cartCookie();
                if(form_data[form.getAttribute("id")]["action"] === "login" && cart.get()){
                    data["cart"] = cart.get();
                }
                
                axios.post(form_data[form.getAttribute("id")]["process"], data, {headers: { "Content-Type": "application/json" }}).then(response => {
                    response = response.data;
                    if (response.result || response.status) {
                        alert_box.innerHTML = '<div class="my-3 alert alert-success" role="alert"><p class="mb-0"><strong>ÉXITO</strong></p><p class="mb-0">' + response.message + '</p> </div>';
                        form.reset();
                        if (form_data[form.getAttribute("id")]["action"] === "modal_hide"){
                            setTimeout(() => { 
                                document.querySelectorAll('.modal.show').forEach(modalEl => {
                                    const modalInstance = bootstrap.Modal.getInstance(modalEl);
                                    if (modalInstance) {
                                        modalInstance.hide();
                                    }
                                });
                                alert_box.innerHTML = ""; 
                            }, 3000);
                        }
                        if (form_data[form.getAttribute("id")]["action"] === "login"){
                            if(response.cart){
                                cart.set(response.cart)
                            }
                            setTimeout(() => { response.go_checkout ? window.location.href = `${theme.site.url}/cotizacion` : location.reload(); }, 1500);
                        } 
                        if (form_data[form.getAttribute("id")]["action"] === "redirect") setTimeout(() => { window.location.href = form_data[form.getAttribute("id")]["location"]; }, 1500);
                    } else {
                        alert_box.innerHTML = '<div class="my-3 alert alert-warning" role="alert"><p class="mb-0"><strong>ERROR</strong></p><p class="mb-0">' + response.message + '</p> </div>';
                    }
                }).catch(function (error) {
                    alert_box.innerHTML = '<div class="my-3 alert alert-warning" role="alert"><p class="mb-0"><strong>ERROR</strong></p><p class="mb-0">' + error.message + '</p> </div>';
                    console.error(error);
                });
            }
        });
    });
});