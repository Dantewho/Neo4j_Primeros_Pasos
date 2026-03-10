export function permitirSoloLetrasYNumeros(input: HTMLInputElement) {
    const MAX_LENGTH = 20;

    input.addEventListener("input", () => {
        let valor = input.value.replace(/[^a-zA-Z0-9]/g, "");

        if (valor.length > MAX_LENGTH) {
            valor = valor.substring(0, MAX_LENGTH);
        }

        input.value = valor;
    });
}
