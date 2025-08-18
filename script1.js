// ===== 1. NAV HAMBURGER TOGGLE =====
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".list-top");

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
  form.addEventListener("submit", (e) => {
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const message = form.querySelector('textarea[name="message"]');

    let errors = [];

    if (!name.value.trim()) errors.push("Name is required.");
    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value))
      errors.push("Valid email is required.");
    if (!message.value.trim()) errors.push("Message cannot be empty.");

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });
}

// ===== 4. WHATSAPP REDIRECT =====
const phoneSection = document.querySelector(".phone-number"); // Change to your phone div ID
if (phoneSection) {
  phoneSection.addEventListener("click", () => {
    const phoneNumber = "9141177245"; // Your WhatsApp number without +
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  });
}
