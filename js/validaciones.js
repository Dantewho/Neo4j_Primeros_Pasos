function permitirSoloLetrasYNumeros(inputElement) {
  if (!inputElement) return;

  inputElement.addEventListener("input", () => {
    inputElement.value = inputElement.value.replace(/[^a-zA-Z0-9]/g, "");
  });

  inputElement.addEventListener("paste", (event) => {
    event.preventDefault();

    const texto = (event.clipboardData || window.clipboardData).getData("text");
    const textoLimpio = texto.replace(/[^a-zA-Z0-9]/g, "");

    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    const valorActual = inputElement.value;

    inputElement.value =
      valorActual.substring(0, start) +
      textoLimpio +
      valorActual.substring(end);

    const nuevaPosicion = start + textoLimpio.length;
    inputElement.setSelectionRange(nuevaPosicion, nuevaPosicion);
  });
}