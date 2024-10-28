"use strict";

// Load event to execute code after the page has fully loaded
window.addEventListener("load", () => {
  loadInitialSetup(); // Load initial setup
});

/* ----------> Initial Setup <---------- */

const loadInitialSetup = () => {
  // Events
  setupClickEvents();
  setupScrollEvents();
  setupResizeEvents();

  // Funcitons
  closeModal();
  currentYear();
  toggleInput();
  tabInputs();
  startCounter();
  tabs();
  textareaExpansible();
  counter();
  restrictNumberInput();
  expandables();

  // Plugins
  accordion();
  carrousel();
  rater();
  priceRange();
  filtering();
  parallax();
  emailJs();
};

/* ----------> Event Setup <---------- */

const setupClickEvents = () => {
  window.addEventListener("click", ({ target }) => {
    showModal(target); // Show modal if clicked on an element with 'data-target' attribute
    btnWishlist(target);
    clickOverlay(target); // Close modal if clicked on modal overlay
  });
};

const setupScrollEvents = () => {
  window.addEventListener("scroll", () => {
    floatingHeader();
  });
};

const setupResizeEvents = () => {
  window.addEventListener("resize", ({ target }) => {
    resizeModal(target);
  });
};

/* ----------> Functions <---------- */

// Show modal corresponding to clicked element
const showModal = (target) => {
  const dataTarget = target.getAttribute("data-target");

  if (dataTarget) {
    const modal = `${dataTarget}.modal-container`;
    const modalContainer = document.querySelector(modal);

    if (modalContainer) {
      const modalContent = modalContainer.querySelector(".modal-content");

      const modalClasses = [
        "modal-top",
        "modal-right",
        "modal-left",
        "modal-center",
        "modal-center-top",
      ];

      modalClasses.forEach((modalClass) => {
        modalContent.classList.toggle(
          `${modalClass}_active`,
          modalContent.classList.contains(modalClass)
        );
      });

      modalContainer.classList.toggle("modal-overlay_active");
      document.body.classList.toggle("overflow-hidden");
    }
  }
};

// Function to close modal
const closeModal = () => {
  const modalCloseButtons = document.querySelectorAll(".close-modal");
  modalCloseButtons.forEach((btn) => {
    btn.addEventListener("click", ({ target }) => {
      const modalContainer = target.closest(".modal-container");
      const modalContent = modalContainer.querySelector(".modal-content");

      modalContent.classList.remove(
        "modal-top_active",
        "modal-right_active",
        "modal-left_active",
        "modal-center_active",
        "modal-center-top_active"
      );
      modalContainer.classList.remove("modal-overlay_active");
      document.body.classList.remove("overflow-hidden");
    });
  });
};

// Close modal if clicked on modal overlay
const clickOverlay = (target) => {
  const overlay = target.classList.contains("modal-overlay");
  const modal = target.querySelector(".modal-content");

  if (overlay && modal) {
    const closeButton = modal.querySelector(".close-modal");
    closeButton && closeButton.click();
  }
};

// Functionality for toggling the wishlist button
const btnWishlist = (target) => {
  const button = target.classList.contains("btn-wishlist");

  if (button) {
    const icon = target.querySelector("svg");
    const text = target.querySelector("span");

    if (icon.classList.contains("fill-none")) {
      icon.classList.replace("fill-none", "fill-current");
      icon.classList.add("animate-heart");

      if (text) {
        text.textContent = "Remove to wishlist";
      }
    } else {
      icon.classList.replace("fill-current", "fill-none");
      icon.classList.remove("animate-heart");

      if (text) {
        text.textContent = "Add to wishlist";
      }
    }
  }
};

// Functionality to resize modal based on window width
const resizeModal = (target) => {
  if (target.innerWidth > 1023) {
    const buttons = document.querySelectorAll(
      ".resize-close.modal-overlay_active .close-modal"
    );

    buttons.forEach((button) => {
      if (button) {
        button.click();
      }
    });
  }
};

// Functionality for floating header based on scroll position
const floatingHeader = () => {
  const scroll = document.documentElement.scrollTop;
  const header = document.querySelector("header");
  const div = document.querySelector(".header");
  const btn_gotop = document.querySelector(".scroll-up");

  if (scroll > 100) {
    div.style.cssText = `height: ${header.offsetHeight}px;`;
    header.classList.replace("relative", "header-fixed");
  } else {
    div.style.cssText = `height: 0px;`;
    header.classList.replace("header-fixed", "relative");
  }
};

// Functionality for toggling input type between 'password' and 'text'
const toggleInput = () => {
  const containers = document.querySelectorAll(".toggle-input-container");

  containers.forEach((container) => {
    const toggleInputs = container.querySelectorAll(".toggle-input");

    toggleInputs.forEach((input) => {
      const buttonToggle = container.querySelector(".button-toggle");

      buttonToggle &&
        buttonToggle.addEventListener("click", () => {
          const type =
            input.getAttribute("type") === "password" ? "text" : "password";
          input.setAttribute("type", type);

          buttonToggle.querySelector("svg").innerHTML =
            type === "password"
              ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
              : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        });
    });
  });
};

// Functionality to update elements with the current year
const currentYear = () => {
  const currentYear = document.querySelectorAll(".current-year");
  currentYear.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
};

// Functionality to handle tabbing through input fields
const tabInputs = () => {
  const containers = document.querySelectorAll(".container-tab-inputs");

  containers.forEach((container) => {
    const inputs = container.querySelectorAll(".tab-input");

    if (inputs.length <= 0) return;

    if (containers.length === 1) {
      inputs[0].focus(); // Establece el foco en el primer input solo si hay un solo contenedor
    }

    inputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        if (input.value.length === 1) {
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          } else {
            input.blur();
          }
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value.length === 0) {
          if (index > 0) {
            inputs[index - 1].focus();
          }
        }
      });
    });
  });
};

// Functionality to start a countdown timer
const startCounter = () => {
  const element = document.querySelector(".time-left");

  if (!element) return;

  let timeLeft = 180;

  const interval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    element.textContent = formattedTime;

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(interval);
      iniciarContador();
    }
  }, 1000);
};

// Functionality for tabbed navigation
const tabs = () => {
  const tabsContainers = document.querySelectorAll(".tab-container");

  tabsContainers.forEach((container) => {
    const tabItems = container.querySelectorAll(".tab-item");
    const tabsContent = container.querySelectorAll(".tab-content-item");

    tabItems &&
      tabItems.forEach((tabButton, index) => {
        tabButton.addEventListener("click", () => {
          tabItems.forEach((button, i) => {
            tabsContent[i].classList.remove("active");
            button.classList.remove("active");
          });

          tabsContent[index].classList.add("active");
          tabButton.classList.add("active");
        });
      });
  });
};

// Functionality for expanding textarea as user types
const textareaExpansible = () => {
  const textAreas = document.querySelectorAll(".form-content");

  textAreas.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
};

// Configure quantity counter
const counter = () => {
  const counter = document.querySelectorAll(".counter");

  counter.forEach((element) => {
    const value = element.querySelector(".counter-value");

    element.addEventListener("click", ({ target }) => {
      if (target.classList.contains("increment")) {
        value.value++;
      } else if (target.classList.contains("decrement") && value.value > 0) {
        value.value--;
      }
    });
  });
};

// Restrict number input in number type input fields
const restrictNumberInput = () => {
  const inputNumber = document.querySelectorAll('input[type="number"]');
  inputNumber.forEach((element) => {
    element.addEventListener("onpaste", (e) => e.preventDefault());

    element.addEventListener("keydown", (e) => {
      if (isNaN(parseInt(e.key)) && e.keyCode != 8) {
        return e.preventDefault();
      }
    });
  });
};

// Expandable functionality
const expandables = () => {
  const containers = document.querySelectorAll(".expandable-container");

  containers.forEach((container) => {
    const toggle = container.querySelector(".expandable-toggle");
    const content = container.querySelector(".expandable-content");
    const subcontent = container.querySelector(".expandable-subcontent");

    if (!toggle || !content) return;

    if (subcontent.offsetHeight <= content.clientHeight) {
      toggle.style.display = "none";
      content.classList.toggle("expanded");
    }

    toggle.addEventListener("click", () => {
      const icon = toggle.querySelector("svg");
      content.classList.toggle("expanded");

      if (content.classList.contains("expanded")) {
        icon.classList.add("rotate-180");
        content.style.maxHeight = `${subcontent.offsetHeight}px`;
      } else {
        icon.classList.remove("rotate-180");
        content.style.maxHeight = "";
      }
    });
  });
};

/* ----------> Function Libraries <---------- */

/* -> Swiper Slider <- */
const carrousel = () => {
  const carousel = document.querySelector(".swiper");

  /* Slider Banner */
  carousel &&
    new Swiper(".swiper-hero", {
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      // effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      // autoplay: {
      //   delay: 3500,
      //   disableOnInteraction: false,
      // },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".button-next",
        prevEl: ".button-prev",
      },
    });

  /* Slider Cards */
  carousel &&
    new Swiper(".swiper-cards", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      breakpoints: {
        560: {
          slidesPerView: 2,
        },
        760: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
      },
      navigation: {
        nextEl: ".button-next",
        prevEl: ".button-prev",
      },
    });

  /* Slider Categories */
  carousel &&
    new Swiper(".swiper-categories", {
      slidesPerView: 1,
      spaceBetween: 2,
      breakpoints: {
        400: {
          slidesPerView: 2,
        },
        640: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 5,
        },
        1280: {
          slidesPerView: 7,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

  /* Slider Testimoials */
  carousel &&
    new Swiper(".swiper-testimonials", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

  /* Slider Grid */
  carousel &&
    new Swiper(".swiper-gridcard", {
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
      navigation: {
        nextEl: ".button-next",
        prevEl: ".button-prev",
      },
    });

  /* Slider Brands */
  carousel &&
    new Swiper(".swiper-brands", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        340: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        440: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        540: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 7,
          spaceBetween: 20,
        },
      },
    });

  /* Slider Product */
  const thumbs = document.querySelectorAll(".swiper-thumbs");
  const swipper_top = document.querySelectorAll(".swiper-product");

  thumbs &&
    thumbs.forEach((thumbs, index) => {
      if (!thumbs) {
        return;
      }
      const miniatures = new Swiper(thumbs, {
        slidesPerView: "auto",
        spaceBetween: 10,
        slideToClickedSlide: true,
        breakpoints: {
          0: {
            direction: "horizontal",
          },
          1024: {
            direction: "vertical",
          },
        },
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
      });

      new Swiper(swipper_top[index], {
        spaceBetween: 10,
        loop: true,
        effect: "fade",
        allowTouchMove: false,
        fadeEffect: {
          crossFade: true,
        },
        navigation: {
          nextEl: ".button-next",
          prevEl: ".button-prev",
        },
        thumbs: {
          swiper: miniatures,
        },
      });
    });
};

/* -> Metis Menu <- */
const accordion = () => {
  const elements = document.querySelectorAll(".metismenu");

  elements.forEach((element) => {
    if (!element) return;

    new MetisMenu(element, {
      triggerElement: ".sub-metismenu",
      subMenu: ".metismenu-content",
    });

    document.addEventListener("click", (event) => {
      const isClickInsideMenu = element.contains(event.target);

      if (!isClickInsideMenu) {
        const actives = element.querySelectorAll('[aria-expanded="true"]');

        actives.forEach((active) => {
          active.click();
        });
      }
    });
  });
};

// Rater Js
const rater = () => {
  const elements = document.querySelectorAll("[data-rater]");

  elements.forEach((e) => {
    const value = parseInt(e.getAttribute("data-rater"));

    const rating = new raterJs({
      element: e,
      showToolTip: false,
      max: 5,
      starSize: 14,
      readOnly: true,
    });

    rating.setRating(value);
  });

  const element = document.querySelector("#rater");
  if (!element) {
    return;
  }

  let myRating = raterJs({
    element: element,
    rateCallback: function rateCallback(rating, done) {
      this.setRating(rating);
      done();
    },
    starSize: 20,
    step: 0.5,
  });

  /* Get the result */
  const form_review = document.querySelector(".form-review");
  form_review &&
    form_review.addEventListener("submit", (e) => {
      document.querySelector(".rating-value").value = myRating.getRating();
    });
};

/* -> noUiSlider <- */
const priceRange = () => {
  const snapSlider = document.querySelector(".slider-handles");

  if (!snapSlider) {
    return;
  }

  noUiSlider.create(snapSlider, {
    start: [200, 700],
    connect: true,
    step: 100,
    range: {
      min: [0],
      max: [2000],
    },
  });

  const snapValues = [
    document.querySelector(".min-price"),
    document.querySelector(".max-price"),
  ];

  const snapValuesSpan = [
    document.querySelector(".span-min-price"),
    document.querySelector(".span-max-price"),
  ];

  snapSlider.noUiSlider.on("update", function (values, handle) {
    snapValues[handle].value = parseInt(values[handle]);
    snapValuesSpan[handle].innerHTML = `$${parseInt(values[handle])}`;
  });
};

/* -> Mixitup <- */
const filtering = () => {
  const element = document.querySelector(".mix-container");
  if (!element) {
    return;
  }

  const mixer = mixitup(".mix-container", {
    selectors: {
      target: ".mix",
    },
    animation: {
      duration: 300,
    },
  });

  const gridContainer = document.querySelector(".mix-shop");

  if (gridContainer) {
    mixer.filter(".mix-grid");
  } else {
    mixer.filter(".mix-all");
  }
};

/* -> SimpleParallax <- */
const parallax = () => {
  const element = document.querySelector(".parallax");

  element &&
    new simpleParallax(element, {
      orientation: "up",
      delay: 0.4,
      transition: "cubic-bezier(0,0,0,1)",
    });
};

// Izi Toast
const notifyMessage = () => {
  iziToast.show({
    message: "Message sent successfully!",
    position: "topRight",
    backgroundColor: "white",
    icon: "bi-check-circle-fill",
    iconColor: "#3F5EDF",
    titleColor: "inherit",
    messageColor: "inherit",
  });
};

/* -> Email Js <- */
const emailJs = () => {
  const btn = document.querySelector("#submit-button");
  const element = document.querySelector("#contact-form");

  element &&
    element.addEventListener("submit", (e) => {
      e.preventDefault();

      btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg> Sending`;

      const serviceID = "service_b54cns6";
      const templateID = "template_4symnru";

      emailjs.init("nKXc5K2Gk8KCBUaPJ");

      emailjs.sendForm(serviceID, templateID, element).then(
        () => {
          btn.textContent = "Send message";
          element.reset();
          alert("Message sent successfully!");
        },
        (err) => {
          btn.textContent = "Send message";
          alert(JSON.stringify(err));
        }
      );
    });
};
