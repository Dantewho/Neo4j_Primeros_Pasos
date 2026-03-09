function permitirSoloLetrasYNumeros(input) {
  const MAX_LENGTH = 20;

  input.addEventListener("input", () => {

    // eliminar caracteres especiales
    let valor = input.value.replace(/[^a-zA-Z0-9]/g, "");

    // limitar longitud
    if (valor.length > MAX_LENGTH) {
      valor = valor.substring(0, MAX_LENGTH);
    }

    input.value = valor;

  });
}
