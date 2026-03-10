import { permitirSoloLetrasYNumeros } from "../../utils/validaciones";
import { WS_BASE } from "../../data";

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
        const username = usernameInput.value.trim();

        if (!username) {
            mostrarMensaje("Ingresa un usuario");
            return;
        }

        const ws = new WebSocket(`${WS_BASE}/ws/${username}`);

        ws.onopen = () => {
            console.log("WebSocket abierto");
            localStorage.setItem("mini_social_username", username);
            ws.close();
            onSuccess(username);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.error) {
                mostrarMensaje("Ese usuario ya está en uso");
                ws.close();
            }
        };

        ws.onerror = () => {
            mostrarMensaje("Error conectando con el servidor");
        };
    }

    loginBtn.addEventListener("click", login);

    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            login();
        }
    });
}
