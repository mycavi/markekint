import { Theme } from '/js/components/theme.js';

const form_data = {
    'form-add-address': { 'validation': false, "process": "/address/add", "action": "modal_hide" },
    'form-edit-address': { 'validation': false, "process": "/address/edit", "action": "modal_hide" },
    'form-edit-user': { 'validation': false, "process": "/user/edit-data-profile", "action": "reload" },
}

export function fillFormEditAddress(id_address) {
    axios.post(theme.site.request + '/address/search', { 'id_address': id_address, 'token': theme.site.token, "customer_token": theme.user.token }).then(response => {
        const data = response.data;
        document.getElementById("form-edit-street").value = data.address.street;
        document.getElementById("form-edit-col").value = data.address.col;
        document.getElementById("form-edit-num").value = data.address.num_ext;
        if (data.address.num_int) document.getElementById("form-edit-num-int").value = data.address.num_int;
        document.getElementById("form-edit-state").value = data.address.state;
        document.getElementById("form-edit-cp").value = data.address.cp;
        document.getElementById("form-edit-tel").value = data.address.phone;
        document.getElementById("form-edit-id").value = data.address.id_address;
        const modalEl = document.getElementById('modal-edit-address-profile');
        const modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();
    }).catch(function (error) {
        console.error(error);
    });
}
export function getAddress(){
    let addressBox = document.getElementById("view-addresses");
    addressBox.innerHTML = '<div class="text-center"><div class="spinner-border color-mycavi" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    axios.post(theme.site.request + '/address/list', { 'token': theme.site.token, "customer_token": theme.user.token }).then(response => {
        const data = response.data;
        addressBox.innerHTML = '';
        const render = new Theme();
        if (data.status){
            addressBox.innerHTML += render.addressBox(data);
        }
        addressBox.innerHTML += render.addressBottom();
        tooltipInit() 
    }).catch(function (error) {
        console.error(error);
    });
}
export function deleteAddress(id_address) {
    axios.post(theme.site.request + '/address/delete', { 'id_address': id_address, 'token': theme.site.token, "customer_token": theme.user.token }).then(response => {
        const data = response.data;
        if (data.status == true) {
            document.getElementById(id_address).classList.add("fade-out");
            setTimeout(() => {
                document.getElementById(id_address).remove();
            }, 1000);
        }
    }).catch(function (error) {
        console.error(error);
    });
} 
export function closeSession(token) {
    axios.post(theme.site.request + '/user/close-session', { 'token_session': token, 'token': theme.site.token, "customer_token": theme.user.token }).then(response => {
        const data = response.data;
        if (data.status) {
            document.getElementById(token).classList.add("fade-out");
            setTimeout(() => { document.getElementById(token).remove(); }, 500);
            if (theme.user.token == token) setTimeout(() => { location.href = theme.site.url; }, 500); 
        }
    }).catch(function (error) {
        console.error(error);
    });
}
export function getSessions(){
    let sessionBox = document.getElementById("view-sessions");
    sessionBox.innerHTML = '<div class="text-center"><div class="spinner-border color-mycavi" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    axios.post(theme.site.request + '/user/sessions', { 'token': theme.site.token, "customer_token": theme.user.token }).then(response => {
        sessionBox.innerHTML = '';
        const render = new Theme();
        sessionBox.innerHTML = render.sessionBox(response.data);
        tooltipInit() 
    }).catch(function (error) {
        console.error(error);
    });
}
window.addEventListener("DOMContentLoaded", () => {
  getAddress();
  getSessions();

  document.querySelectorAll('.form-control').forEach(input => {
    input.disabled = false;
  });

  document.querySelectorAll('.customer-form').forEach(form => {
    const formId = form.getAttribute("id");

    new Validator(form, (err, valid) => {
      if (valid) form_data[formId].validation = true;
    }, {
      locale: "es",
      errorClassName: "validation-error",
      messages: {
        es: {
          tel: {
            empty: 'Teléfono necesario',
            incorrect: 'Teléfono incorrecto'
          },
          required: {
            empty: 'Campo necesario'
          }
        }
      }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const alertBox = form.querySelector('.alert-form');
        const formConfig = form_data[formId];
        if (!formConfig?.validation) return;

        const data = new FormData(form);
        data.append('token', theme.site.token);
        data.append('customer_token', theme.user.token);

        axios.post(theme.site.request + formConfig.process, data).then(response => {
            const res = response.data;
            alertBox.innerHTML = ` <div class="my-3 alert alert-${res.status ? 'success' : 'warning'}" role="alert"> <p class="mb-0"><strong>${res.status ? 'ÉXITO' : 'ERROR'}</strong></p> <p class="mb-0">${res.message}</p> </div> `;

            if (res.status) {
                switch (formConfig.action) {
                    case "modal_hide":
                        setTimeout(() => { document.querySelectorAll('.modal.show').forEach(modalEl => { bootstrap.Modal.getInstance(modalEl)?.hide(); });
                            alertBox.innerHTML = "";
                        }, 3000);
                        break;
                    case "reload":
                        setTimeout(() => location.reload(), 1500);
                        break;
                    case "redirect":
                        setTimeout(() => window.location.href = theme.site.url, 1500);
                        break;
                }

                form.reset();

                if (["form-add-address", "form-edit-address"].includes(formId)) getAddress();
            } else if (formId === "form-edit-user") {
                setTimeout(() => location.reload(), 1500);
            }
        }).catch(error => {
          alertBox.innerHTML = ` <div class="my-3 alert alert-warning" role="alert"> <p class="mb-0"><strong>ERROR</strong></p> <p class="mb-0">${error.message}</p> </div> `;
          console.error(error);
        });
    });
  });
});

window.fillFormEditAddress = fillFormEditAddress;
window.getAddress = getAddress;
window.deleteAddress = deleteAddress;
window.closeSession = closeSession;
window.getSessions = getSessions;