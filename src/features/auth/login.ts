import { permitirSoloLetrasYNumeros } from "../../utils/validaciones";
import { WS_BASE } from "../../lib/env";

// eslint-disable-next-line no-unused-vars
export function initializeLogin(onSuccess: (username: string) => void) {
    const loginView = document.getElementById("login-view");
    if (!loginView) return;

    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
    const mensaje = document.getElementById("mensaje") as HTMLDivElement;

    if (!usernameInput || !loginBtn) return;

    permitirSoloLetrasYNumeros(usernameInput);

    function mostrarMensaje(texto: string) {
        if (mensaje) {
            mensaje.innerText = texto;
        } else {
            alert(texto);
        }
    }

    function login() {
        if (loginBtn.disabled) return;

        const username = usernameInput.value.trim();

        if (!username) {
            mostrarMensaje("Ingresa un usuario");
            return;
        }

        loginBtn.disabled = true;
        loginBtn.classList.add("loading");

        const ws = new WebSocket(`${WS_BASE}/ws/${username}`);

        ws.onopen = () => {
            console.log("WebSocket abierto");
            localStorage.setItem("mini_social_username", username);
            ws.close();
            loginBtn.disabled = false;
            loginBtn.classList.remove("loading");
            onSuccess(username);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.error) {
                mostrarMensaje("Ese usuario ya está en uso");
                ws.close();
                loginBtn.disabled = false;
                loginBtn.classList.remove("loading");
            }
        };

        ws.onerror = () => {
            mostrarMensaje("Error conectando con el servidor");
            loginBtn.disabled = false;
            loginBtn.classList.remove("loading");
        };
    }

    loginBtn.addEventListener("click", login);

    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            login();
        }
    });
}
