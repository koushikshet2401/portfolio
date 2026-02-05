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




// Initialize EmailJS
(function(){
  emailjs.init("5CuD7K8DVxPtGN4Va"); // 🔴 Replace this
})();

const form = document.getElementById("contact-form");
const button = form.querySelector("button");

// ✅ Show single message only
const showFormMessage = (text, color) => {

  let msg = form.querySelector(".form-msg");

  if (!msg) {
    msg = document.createElement("p");
    msg.className = "form-msg";
    msg.style.marginTop = "10px";
    msg.style.fontWeight = "500";
    form.appendChild(msg);
  }

  msg.innerText = text;
  msg.style.color = color;
};

// ✅ Remove old validation errors
const clearErrors = () => {
  document.querySelectorAll(".error").forEach(el => el.remove());
};

// ✅ Show validation error
const showError = (input, message) => {

  let errorSpan = input.parentNode.querySelector(".error");

  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.className = "error";
    errorSpan.style.color = "red";
    errorSpan.style.fontSize = "13px";
    input.parentNode.appendChild(errorSpan);
  }

  errorSpan.textContent = message;
};

form.addEventListener("submit", function(e){

  e.preventDefault();
  clearErrors();

  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const message = form.querySelector('[name="message"]');

  let isValid = true;

  if (!name.value.trim()) {
    showError(name, "Name is required.");
    isValid = false;
  }

  if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
    showError(email, "Enter a valid email.");
    isValid = false;
  }

  if (!message.value.trim()) {
    showError(message, "Message cannot be empty.");
    isValid = false;
  }

  if (!isValid) return;

  // ✅ Disable button to prevent spam clicks
  button.disabled = true;
  button.innerText = "Sending...";

  emailjs.sendForm(
    "service_dhlqq6e",
    "template_8ri1x28",
    form
  )
  .then(() => {

    showFormMessage(
      "✅ Message sent successfully! I will get back to you soon.",
      "limegreen"
    );

    form.reset();

    button.disabled = false;
    button.innerText = "Send Message 🚀";

  })
  .catch((error) => {

    showFormMessage(
      "❌ Something went wrong. Please email me directly at koushikshet2401@gmail.com",
      "red"
    );

    button.disabled = false;
    button.innerText = "Send Message 🚀";

    console.log("EmailJS Error:", error);
  });

});





  // ===== 4. WHATSAPP REDIRECT =====
  const phoneSection = document.querySelector(".phone-number"); 
  if (phoneSection) {
    const phoneNumber = phoneSection.dataset.phone || "9141177245"; // fallback number
    phoneSection.addEventListener("click", () => {
      const url = `https://wa.me/${9141177245}`;
      try {
        window.open(url, "_blank");
      } catch {
        alert("Unable to open WhatsApp. Please check your browser settings.");
      }
    });
  }

});
