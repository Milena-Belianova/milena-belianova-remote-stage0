console.log("Все пункты выполнены полностью.\nИтого: 85");

let state = { lang: "en", theme: "dark" };

// Hamburger
const hamburger = document.querySelector(".hamburger");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");

const toggleMenu = () => {
  hamburger.classList.toggle("open");
  navList.classList.toggle("open");
};

const closeMenu = () => {
  hamburger.classList.remove("open");
  navList.classList.remove("open");
};

hamburger.addEventListener("click", toggleMenu);

navLinks.forEach((el) => el.addEventListener("click", closeMenu));

// Portfolio image change
const portfolioBtns = document.querySelectorAll(".portfolio-btn");
const portfolioBtnsContainer = document.querySelector(".portfolio-btns");
const portfolioImages = document.querySelectorAll(".portfolio-image");
const seasons = ["winter", "spring", "summer", "autumn"];

const preloadImages = (el) => {
  for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `./assets/img/${el}/${i}.jpg`;
  }
};

seasons.forEach(preloadImages);

const onPortfolioBtnsContainerClick = (event) => {
  if (event.target.classList.contains("portfolio-btn")) {
    changeImage(event);
    changeClassActive(event);
  }
};

const changeImage = (event) =>
  portfolioImages.forEach(
    (img, index) =>
      (img.src = `./assets/img/${event.target.dataset.season}/${index + 1}.jpg`)
  );

const changeClassActive = (event) => {
  portfolioBtns.forEach((el) => el.classList.remove("active"));
  event.target.classList.add("active");
};

portfolioBtnsContainer.addEventListener("click", onPortfolioBtnsContainerClick);

//Page translation into two languages
import i18Obj from "./translate.js";

const switchLng = document.querySelector(".switch-lng");
const switchLngBtns = document.querySelectorAll(".switch-lng-btn");

const onLngBtnClick = (event) => {
  if (event.target.classList.contains("switch-lng-btn")) {
    state.lang = event.target.dataset.lng;
    updateClasses();
  }
};

const updateClasses = () => {
  changeClassLngActive();
  getTranslate(state.lang);
};

const changeClassLngActive = () => {
  switchLngBtns.forEach((el) => el.classList.remove("lng-active"));
  const activeBtn = document.querySelector(`[data-lng=${state.lang}]`);
  activeBtn.classList.add("lng-active");
};

const getTranslate = (currentLanguage) => {
  const dataElements = document.querySelectorAll("[data-i18]");

  dataElements.forEach((el) => {
    if (el.placeholder) {
      el.placeholder = i18Obj[currentLanguage][el.dataset.i18];
      el.textContent = "";
    } else {
      el.textContent = i18Obj[currentLanguage][el.dataset.i18];
    }
  });
};

switchLng.addEventListener("click", onLngBtnClick);

//Switch between light and dark theme
const themeBtn = document.querySelector(".theme-btn");
const sectionTitleLines = document.querySelectorAll(".section-title");
const text = document.querySelectorAll(".theme-el");
const openSidebar = document.querySelectorAll(".sidebar");

const onThemeBtnClick = () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  switchTheme();
};

const switchTheme = () => {
  if (
    state.theme === "light" &&
    !themeBtn.classList.contains("light-theme-btn")
  ) {
    themeBtn.classList.add("light-theme-btn");
    sectionTitleLines.forEach((el) => el.classList.add("light-theme-lines"));
    text.forEach((el) => el.classList.add("light-theme"));
    openSidebar.forEach((el) => el.classList.add("light-theme-sidebar"));
  } else if (
    state.theme === "dark" &&
    themeBtn.classList.contains("light-theme-btn")
  ) {
    themeBtn.classList.remove("light-theme-btn");
    sectionTitleLines.forEach((el) => el.classList.remove("light-theme-lines"));
    text.forEach((el) => el.classList.remove("light-theme"));
    openSidebar.forEach((el) => el.classList.remove("light-theme-sidebar"));
  }
};

themeBtn.addEventListener("click", onThemeBtnClick);

// Local storage
const setLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(state));
};
window.addEventListener("beforeunload", setLocalStorage);

const getLocalStorage = () => {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));
    updateClasses();
    switchTheme();
  }
};
window.addEventListener("load", getLocalStorage);

//Animate buttons
const animateButton = (e) => {
  e.preventDefault;
  //reset animation
  e.target.classList.remove("animate");

  e.target.classList.add("animate");
  setTimeout(() => {
    e.target.classList.remove("animate");
  }, 700);
};

const bubblyButtons = document.querySelectorAll(".bubbly-button");

bubblyButtons.forEach((el) =>
  el.addEventListener("click", animateButton, false)
);
