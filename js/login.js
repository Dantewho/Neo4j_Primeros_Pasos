const usernameInput = document.getElementById("username");
const loginBtn = document.getElementById("loginBtn");
const mensaje = document.getElementById("mensaje");

permitirSoloLetrasYNumeros(usernameInput);

function login() {

  const username = usernameInput.value.trim();

  if(!username){
    mostrarMensaje("Ingresa un usuario");
    return;
  }

  const ws = new WebSocket(`wss://api.fudge-bit.me/ws/${username}`);

  ws.onopen = () => {
    console.log("WebSocket abierto");

    // guardamos usuario
    localStorage.setItem("mini_social_username", username);

    // cerramos conexión temporal
    ws.close();

    // redirigimos
    window.location.href = "Views/Index.html";
  };

  ws.onmessage = (event) => {

    const data = JSON.parse(event.data);

    if(data.error){
      mostrarMensaje("Ese usuario ya está en uso");
      ws.close();
    }

  };

  ws.onerror = () => {
    mostrarMensaje("Error conectando con el servidor");
  };

}

function mostrarMensaje(texto){
  if(mensaje){
    mensaje.innerText = texto;
  }else{
    alert(texto);
  }
}

loginBtn.addEventListener("click", login);

usernameInput.addEventListener("keydown", (e)=>{
  if(e.key === "Enter"){
    login();
  }
});