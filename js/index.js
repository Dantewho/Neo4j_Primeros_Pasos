document.querySelectorAll(".friend--amigo").forEach((friend) => {
        const dropdownBtn = friend.querySelector(".dropdown-btn");
        const dropdownMenu = friend.querySelector(".dropdown-menu");
        const dropdownItems = friend.querySelectorAll(".dropdown-item");

        const editBtn = friend.querySelector(".edit-btn");
        const editPanel = friend.querySelector(".edit-panel");
        const closeBtn = friend.querySelector(".panel-btn--close");
        const sendBtn = friend.querySelector(".panel-btn--send");

        dropdownBtn.addEventListener("click", () => {
          const isOpen = dropdownMenu.classList.contains("show");
          document.querySelectorAll(".dropdown-menu").forEach((menu) => {
            menu.classList.remove("show");
          });

          if (!isOpen) {
            dropdownMenu.classList.add("show");
          }
        });

        dropdownItems.forEach((item) => {
          item.addEventListener("click", () => {
            dropdownBtn.textContent = item.textContent;
            dropdownMenu.classList.remove("show");
          });
        });

        editBtn.addEventListener("click", () => {
          const isVisible = editPanel.classList.contains("show");

          document.querySelectorAll(".edit-panel").forEach((panel) => {
            panel.classList.remove("show");
          });

          if (!isVisible) {
            editPanel.classList.add("show");
          }
        });

        closeBtn.addEventListener("click", () => {
          editPanel.classList.remove("show");
        });

        sendBtn.addEventListener("click", () => {
          editPanel.classList.remove("show");
        });
      });

      document.addEventListener("click", (event) => {
        if (!event.target.closest(".dropdown")) {
          document.querySelectorAll(".dropdown-menu").forEach((menu) => {
            menu.classList.remove("show");
          });
        }
      });