export async function stockNotification(e, code_product) {
    const $this = e.target;

    try {
        const res = await axios.post(`${theme.site.request}/user/notification-stock/register`, { code_product: code_product, token: theme.site.token, customer_token: theme.user.token });
        const response = res.data;

        if (response.status) {
            $this.innerHTML = `<i class="bi bi-check2-circle"></i> ${response.message}`;
            $this.removeAttribute("onclick");
        } else {
            $this.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${response.message}`;
        }

    } catch (error) {
        console.error("Error stock:", error);
        $this.innerHTML = `<i class="bi bi-exclamation-circle"></i> Ocurrió un error. Inténtalo más tarde.`;
    }
}
export function deleteNotification(id_notification) {
    axios.post(theme.site.request + '/user/notification/delete', { 'id_notification': id_notification, 'token': theme.site.token, "token_session": theme.user.token }).then((data) => {
        const response = data.data;
        if (response.result) {
            UserNotifications();
        }
    }).catch(function (error) {
        console.error(error);
    });
}
export function UserNotifications() {
    return new Promise((resolve, reject) => {
        axios.post(theme.site.request + '/user/notification', { 'token': theme.site.token, "token_session": theme.user.token }).then((data) => {
            const response = data.data;
            const box = document.querySelector('.notification__box');
            const btn_icon = document.querySelector(".btn-notification--icon");
            if (response.result && response.notifications.length > 0) {
                btn_icon.classList.add("active");
                const render = new Theme();
                render.notifications(response.notifications, box);
            } else {
                btn_icon.classList.remove("active");
                box.innerHTML = `<div class="notification__box_inactive"><strong class="mb-0">Sin notificaciones</strong></div>`;
            }
            resolve();
        }).catch(function (error) {
            console.error(error);
            reject(error);
        });
    });
}

window.deleteNotification = deleteNotification;