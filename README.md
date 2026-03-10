# Mini Social (Neo4j_Primeros_Pasos)

Una **Single Page Application (SPA)** interactiva para la gestión de amigos y el estado de tus relaciones en tiempo real, desarrollada originalmente como proyecto escolar.

---

## ✨ Características

- **Autenticación Simple**: Acceso rápido mediante nombre de usuario (solo letras y números) sin contraseñas.
- **Tiempo Real**: Sincronización instantánea del estado de los usuarios mediante **WebSockets**.
- **Gestión de Relaciones**:
  - Envía y acepta solicitudes de amistad.
  - Clasifica a tus contactos por estado: *Conocido, Amigo, Mejor Amigo, Me cae mal*.
- **Notas Privadas**: Escribe, edita y elimina notas personales sobre tus amigos.
- **Interfaz Moderna**: Diseño atractivo con fondos degradados, tarjetas con borde animado y diseño adaptable a múltiples pantallas.

## 🚀 Tecnologías Utilizadas

- **Interfaz**: HTML5 y CSS3 nativo.
- **Lógica**: TypeScript puro (Vanilla TS) sin frameworks.
- **Tiempo Real**: [WebSockets](https://developer.mozilla.org/es/docs/Web/API/WebSocket) conectados al backend `wss://api.fudge-bit.me`.
- **Compilador / Bundler**: [Vite](https://vitejs.dev/) para un servidor de desarrollo ultra rápido y empaquetado optimizado.
- **Gestor de Paquetes**: [Bun](https://bun.sh/) (también soportado por `npm`).

## 📦 Instalación y Ejecución Local

Para ejecutar este proyecto en tu entorno local, asegúrate de tener [Bun](https://bun.sh/) o [Node.js](https://nodejs.org/) instalado.

1. **Abre una terminal** en el directorio del proyecto.

2. **Instala las dependencias**:
   ```bash
   bun install
   ```
   *(Si prefieres usar npm, ejecuta `npm install`)*

3. **Inicia el servidor de desarrollo**:
   ```bash
   bun dev
   ```
   *(Con npm: `npm run dev`)*

4. **Abre tu navegador**:
   Por defecto, Vite abrirá el entorno local en `http://localhost:5173/`. 

## 🏗️ Estructura del Código

El proyecto fue refactorizado para mantener las responsabilidades separadas de forma limpia:

```text
├── index.html                 # Punto de entrada (host de la SPA)
├── src/
│   ├── main.ts                # Orquestador principal (controla transición de vistas)
│   ├── styles.css             # Todos los estilos de la aplicación
│   ├── features/
│   │   ├── auth/login.ts      # Manejador del formulario de inicio de sesión
│   │   └── friends/friends.ts # Manejador de la lista de amigos e interacción
│   └── utils/
│       └── validaciones.ts    # Pequeñas utilidades (ej. limpiar inputs)
└── bun.lock / package.json    # Configuración del proyecto
```

## 📝 Notas de Desarrollo

- Se utiliza `localStorage` con la clave `mini_social_username` para persistir la sesión. Si deseas forzar un cierre de sesión manual, puedes limpiar esta clave desde la consola del navegador: `localStorage.removeItem("mini_social_username")`.
- Si estás probando la app, puedes abrir dos pestañas de incógnito distintas para poder interactuar en tiempo real entre tus dos usuarios.
