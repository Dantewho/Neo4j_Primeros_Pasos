const API_BASE = "https://api.fudge-bit.me";
const WS_BASE = "wss://api.fudge-bit.me/ws";

const username = localStorage.getItem("mini_social_username");

const welcomeText = document.getElementById("welcomeText");
const friendsList = document.getElementById("friendsList");

let ws = null;

const ACTIVE_RELATION_STATES = [
  "Conocido",
  "Amigo",
  "Mejor Amigo",
  "Me cae mal"
];

if (!username) {
  window.location.href = "../index.html";
}

if (welcomeText) {
  welcomeText.textContent = `Welcome Back, ${username}!`;
}

function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[char];
  });
}

function isActiveRelationship(status) {
  return ACTIVE_RELATION_STATES.includes(status);
}

function createAvatar() {
  return `
    <div class="avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24" class="avatar-icn">
        <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5Zm0 2c-4.4 0-8 2.4-8 5.4V21h16v-1.6c0-3-3.6-5.4-8-5.4Z"/>
      </svg>
    </div>
  `;
}

function getButtonConfig(status) {
  switch (status) {
    case "INCOMING_REQUEST":
      return {
        text: "Aceptar",
        className: "pill pill--aceptar",
        action: "accept"
      };

    case "OUTGOING_REQUEST":
      return {
        text: "Pendiente",
        className: "pill pill--pending",
        action: "pending"
      };

    case "UNKNOWN":
    default:
      return {
        text: "Agregar",
        className: "pill pill--agregar",
        action: "add"
      };
  }
}

function createRelationshipDropdown(currentStatus) {
  const options = ["Conocido", "Amigo", "Mejor Amigo", "Me cae mal"];

  return `
    <div class="dropdown">
      <button class="pill pill--amigo dropdown-btn" type="button">
        ${escapeHtml(currentStatus)}
      </button>

      <div class="dropdown-menu">
        ${options
          .map(
            (option) => `
              <button
                class="dropdown-item"
                type="button"
                data-relation="${escapeHtml(option)}"
              >
                ${escapeHtml(option)}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function createFriendCard(user) {
  const otherUser = user.username;
  const status = user.status;
  const note = user.note ?? "";

  const safeName = escapeHtml(otherUser);
  const safeNote = escapeHtml(note);

  if (isActiveRelationship(status)) {
    return `
      <div class="friend friend--amigo" data-username="${safeName}">
        <div class="friend-main">
          ${createAvatar()}
          <div class="name">${safeName}</div>

          <div class="friend-actions">
            <button class="edit-btn" type="button" aria-label="Editar nota">✏️</button>
            ${createRelationshipDropdown(status)}
          </div>
        </div>

        <div class="edit-panel">
          <input
            class="edit-input"
            type="text"
            placeholder="Escribe una nota privada..."
            value="${safeNote}"
          />

          <div class="edit-panel-actions">
            <button class="panel-btn panel-btn--close" type="button">Cerrar</button>
            <button class="panel-btn panel-btn--clear" type="button">Borrar</button>
            <button class="panel-btn panel-btn--send" type="button">Guardar</button>
          </div>
        </div>
      </div>
    `;
  }

  const button = getButtonConfig(status);

  return `
    <div class="friend" data-username="${safeName}">
      ${createAvatar()}
      <div class="name">${safeName}</div>
      <button class="${button.className}" type="button" data-action="${button.action}">
        ${button.text}
      </button>
    </div>
  `;
}

function renderUsers(users) {
  if (!friendsList) return;

  if (!Array.isArray(users)) {
    friendsList.innerHTML = `<div>No se recibieron usuarios</div>`;
    return;
  }

  if (users.length === 0) {
    friendsList.innerHTML = `<div>No hay otros usuarios</div>`;
    return;
  }

  friendsList.innerHTML = users.map(createFriendCard).join("");
  bindDynamicEvents();
}

async function sendFriendRequest(targetUsername) {
  try {
    const response = await fetch(`${API_BASE}/friend-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from_user: username,
        to_user: targetUsername
      })
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar/aceptar la solicitud.");
    }
  } catch (error) {
    console.error("Error en /friend-request:", error);
    alert("Hubo un problema con la solicitud.");
  }
}

async function updateRelationship(targetUsername, relationType) {
  try {
    const response = await fetch(`${API_BASE}/update-relationship`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from_user: username,
        to_user: targetUsername,
        relation_type: relationType
      })
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar la relación.");
    }
  } catch (error) {
    console.error("Error en /update-relationship:", error);
    alert("No se pudo actualizar la relación.");
  }
}

async function updateNote(targetUsername, note) {
  try {
    const response = await fetch(`${API_BASE}/update-note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from_user: username,
        to_user: targetUsername,
        note: note
      })
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar la nota.");
    }
  } catch (error) {
    console.error("Error en /update-note:", error);
    alert("No se pudo guardar la nota.");
  }
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.classList.remove("show");
  });
}

function closeAllEditPanels() {
  document.querySelectorAll(".edit-panel").forEach((panel) => {
    panel.classList.remove("show");
  });
}

function bindDynamicEvents() {
  document.querySelectorAll("[data-action='add']").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".friend");
      if (!card) return;

      const target = card.dataset.username;
      await sendFriendRequest(target);
    });
  });

  document.querySelectorAll("[data-action='accept']").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".friend");
      if (!card) return;

      const target = card.dataset.username;
      await sendFriendRequest(target);
    });
  });

  document.querySelectorAll("[data-action='pending']").forEach((button) => {
    button.addEventListener("click", () => {
      alert("Ya enviaste una solicitud a este usuario.");
    });
  });

  document.querySelectorAll(".friend--amigo").forEach((card) => {
    const target = card.dataset.username;

    const editBtn = card.querySelector(".edit-btn");
    const editPanel = card.querySelector(".edit-panel");
    const closeBtn = card.querySelector(".panel-btn--close");
    const clearBtn = card.querySelector(".panel-btn--clear");
    const saveBtn = card.querySelector(".panel-btn--send");
    const input = card.querySelector(".edit-input");

    const dropdownBtn = card.querySelector(".dropdown-btn");
    const dropdownMenu = card.querySelector(".dropdown-menu");
    const dropdownItems = card.querySelectorAll(".dropdown-item");

    if (editBtn && editPanel) {
      editBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = editPanel.classList.contains("show");
        closeAllEditPanels();

        if (!isOpen) {
          editPanel.classList.add("show");
          if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }
      });
    }

    if (closeBtn && editPanel) {
      closeBtn.addEventListener("click", () => {
        editPanel.classList.remove("show");
      });
    }

    if (clearBtn && input && editPanel) {
      clearBtn.addEventListener("click", async () => {
        input.value = "";
        await updateNote(target, "");
        editPanel.classList.remove("show");
      });
    }

    if (saveBtn && input && editPanel) {
      saveBtn.addEventListener("click", async () => {
        await updateNote(target, input.value.trim());
        editPanel.classList.remove("show");
      });
    }

    if (input) {
      input.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
          await updateNote(target, input.value.trim());
          editPanel.classList.remove("show");
        }
      });
    }

    if (dropdownBtn && dropdownMenu) {
      dropdownBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = dropdownMenu.classList.contains("show");
        closeAllDropdowns();

        if (!isOpen) {
          dropdownMenu.classList.add("show");
        }
      });
    }

    dropdownItems.forEach((item) => {
      item.addEventListener("click", async () => {
        const relation = item.dataset.relation;
        await updateRelationship(target, relation);

        dropdownBtn.textContent = relation;
        dropdownMenu.classList.remove("show");
      });
    });
  });
}

function connectWebSocket() {
  ws = new WebSocket(`${WS_BASE}/${encodeURIComponent(username)}`);

  ws.onopen = () => {
    console.log("WebSocket conectado como:", username);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.error) {
        alert("Ese usuario ya está en uso.");
        localStorage.removeItem("mini_social_username");
        window.location.href = "../Index.html";
        return;
      }

      if (data.type === "user_list_update") {
        renderUsers(data.users);
      }
    } catch (error) {
      console.error("Error al leer mensaje WS:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("Error WebSocket:", error);
  };

  ws.onclose = (event) => {
    console.warn("WebSocket cerrado:", event);
  };
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown")) {
    closeAllDropdowns();
  }

  if (!event.target.closest(".friend--amigo")) {
    closeAllEditPanels();
  }
});

connectWebSocket();

