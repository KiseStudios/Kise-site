const WHATSAPP_NUMBER = "+5527997327212";
const WHATSAPP_MESSAGE = "Olá! Vim pelo site da Kise Studios e gostaria de conversar sobre um projeto.";

function buildWhatsAppUrl() {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  const base = `https://wa.me/${number}`;
  return `${base}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = buildWhatsAppUrl();
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
}

if (header) {
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });

    projectCards.forEach((card) => {
      card.hidden = selectedFilter !== "all" && card.dataset.category !== selectedFilter;
    });
  });
});

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitText = submitButton.querySelector(".form-submit-text");
  const successMessage = document.querySelector("#form-success");
  const errorMessage = document.querySelector("#form-error");
  const retryButton = document.querySelector("#form-retry");
  const defaultSubmitText = submitText.textContent;
  let isSubmitting = false;

  function setLoading(isLoading) {
    isSubmitting = isLoading;
    submitButton.disabled = isLoading;
    submitButton.setAttribute("aria-busy", String(isLoading));
    submitText.textContent = isLoading ? "Enviando..." : defaultSubmitText;
    contactForm.classList.toggle("is-submitting", isLoading);
  }

  function showFeedback(element) {
    element.hidden = false;
    requestAnimationFrame(() => element.classList.add("is-visible"));
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function hideFeedback(element) {
    element.classList.remove("is-visible");
    element.hidden = true;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    hideFeedback(errorMessage);
    setLoading(true);

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Formspree returned ${response.status}`);
      }

      contactForm.reset();
      contactForm.hidden = true;
      showFeedback(successMessage);
    } catch (error) {
      console.error("Não foi possível enviar o formulário:", error);
      showFeedback(errorMessage);
    } finally {
      setLoading(false);
    }
  });

  retryButton.addEventListener("click", () => {
    hideFeedback(errorMessage);
    contactForm.querySelector("input:not([type='hidden']), select, textarea")?.focus();
  });
}
