// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  
  // ===== 1. NAV HAMBURGER TOGGLE =====
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".list-top");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("open");
    });

    // Close menu when clicking a link (mobile UX)
    document.querySelectorAll(".list-top a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("open");
      });
    });

    // Close with ESC key (Accessibility)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navMenu.classList.remove("active");
        hamburger.classList.remove("open");
      }
    });
  }

  // ===== 2. SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // ===== 3. FORM VALIDATION =====
  const form = document.querySelector("form");

  if (form) {
    const showError = (input, message) => {
      let errorSpan = input.nextElementSibling;
      if (!errorSpan || !errorSpan.classList.contains("error")) {
        errorSpan = document.createElement("span");
        errorSpan.className = "error";
        input.parentNode.appendChild(errorSpan);
      }
      errorSpan.textContent = message;
    };

    const clearErrors = () => {
      document.querySelectorAll(".error").forEach(el => el.remove());
    };

    form.addEventListener("submit", (e) => {
      clearErrors();

      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      const message = form.querySelector('textarea[name="message"]');

      let isValid = true;

      if (!name.value.trim()) {
        showError(name, "Name is required.");
        isValid = false;
      }

      if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
        showError(email, "Valid email is required.");
        isValid = false;
      }

      if (!message.value.trim()) {
        showError(message, "Message cannot be empty.");
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
      }
    });
  }

  // ===== 4. WHATSAPP REDIRECT =====
  const phoneSection = document.querySelector(".phone-number"); 
  if (phoneSection) {
    const phoneNumber = phoneSection.dataset.phone || "9141177245"; // fallback number
    phoneSection.addEventListener("click", () => {
      const url = `https://wa.me/${phoneNumber}`;
      try {
        window.open(url, "_blank");
      } catch {
        alert("Unable to open WhatsApp. Please check your browser settings.");
      }
    });
  }

});
