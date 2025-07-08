let form_contact = document.getElementById("contact-form");
let alert_box = document.querySelector('.alert-contact');

window.addEventListener("DOMContentLoaded", function () {
    let contact_validation = false;

    new Validator(form_contact, function (err, res) {
        if (res) contact_validation = true;
    }, {
        locale: "es",
        errorClassName: "validation-error",
        messages: {
            es: {
                name: { empty: 'Nombre necesario' },
                phone: { empty: 'Teléfono necesario', incorrect: 'Teléfono incorrecto' },
                email: { empty: 'Correo necesario', incorrect: 'Correo incorrecto' },
                required: { empty: 'Campo necesario' }
            }
        }
    });

    form_contact.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contact_validation) return;
		alert_box.innerHTML = `<div class="text-center"><div class="spinner-border color-mycavi" role="status"><span class="visually-hidden">Loading...</span></div></div>`;

		const captchaToken = await grecaptcha.execute(theme.site.captcha, { action: "submit" });

		const data = Object.fromEntries(new FormData(form_contact));
		data["captcha"] = captchaToken;

		try {
			const response = await axios.post(form_contact.action, data, { headers: { "Content-Type": "application/json" } });
			const result = response.data;
			alert_box.innerHTML = `<div class="alert alert-success text-center">${result.message ?? "Formulario enviado con éxito"}</div>`;
		} catch (error) {
			alert_box.innerHTML = `<div class="alert alert-danger text-center">Hubo un error al enviar el formulario.</div>`;
			console.error("Error en la solicitud:", error);
		}
    });
});