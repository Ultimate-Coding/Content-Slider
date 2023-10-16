// Defines a JavaScript class named "Slider" responsible for managing and creating the slider.
// It includes methods to initialize the slider, create slides and dots, start autoplay, and navigate between slides.
// The constructor method initializes the Slider instance based on the provided container and configuration.
// If data-config attribute is missing or empty, provide a default configuration.

class Slider {
  constructor(container) {
    this.container = container;
    this.config = this.checkConfig(container.getAttribute("data-config"));
    this.interval = this.config.interval || 3000;
    this.autoplay = this.config.autoplay || false;
    this.slides = this.config.slides;
    this.currentSlide = 0;
    this.slidesContainer = null;
    this.dotsContainer = null;
    this.dots = [];
    this.timer = null;
    this.init();
  }

  checkConfig(value) {
    let config;
    try {
      if (value) {
        config = JSON.parse(value);
      } else {
        config = {
          autoplay: true,
          interval: 3000,
          slides: [],
        };
      }
    } catch (error) {
      console.error("Invalid JSON data");
      config = {
        autoplay: true,
        interval: 3000,
        slides: [],
      };
    }
    return config;
  }

  // Initializes the slider by creating the HTML structure for slides, dots, and navigation arrows.
  // Add functionality to arrows
  init() {
    const sliderHTML = `
            <div class="slider"></div>
            <div class="dots"></div>
            <div class="arrows">
             <div class="prev" aria-label="Previous Slide" tabindex="0">⮜</div>
             <div class="next" aria-label="Next Slide" tabindex="0">⮞</div>
            </div>
          `;
    this.container.innerHTML = sliderHTML;
    this.slidesContainer = this.container.querySelector(".slider");
    this.createSlides();
    this.createDots();

    this.container.querySelector(".prev").addEventListener("click", () => {
      this.goToSlide(this.currentSlide - 1);
    });
    this.container.querySelector(".next").addEventListener("click", () => {
      this.goToSlide(this.currentSlide + 1);
    });

    if (this.autoplay) {
      this.startAutoPlay();
    }
  }

  // Creates the individual slides based on the configuration data and appends them to the slider container.
  createSlides() {
    this.slides.forEach((slide) => {
      const slideElement = document.createElement("div");
      slideElement.classList.add("slide");
      slideElement.innerHTML = `
            <p class="text">${slide.description}</p>
            <img src="${slide.img}" alt="${slide.name}">
            <div class="info">
              <h3>${slide.name}</h3>
              <p class="title">${slide.title}</p>
            </div>
            <div class="button">View CV Sample</div>
          `;
      this.slidesContainer.appendChild(slideElement);
    });
  }

  // Creates navigation dots for each slide and adds click event listeners to navigate to the corresponding slide.
  createDots() {
    this.dotsContainer = this.container.querySelector(".dots");
    for (let i = 0; i < this.slides.length; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
      dot.addEventListener("click", () => {
        this.goToSlide(i);
      });
    }
    if (this.dots.length > 0) {
      this.dots[0].classList.add("active");
    }
  }

  // Initiates automatic slide transitions with the specified interval.
  startAutoPlay() {
    this.timer = setInterval(() => {
      this.goToSlide(this.currentSlide + 1);
    }, this.interval);
  }

  // Navigates to the specified slide by updating the current slide index and adjusting the slider's position.
  // The navigation is so easy, because in css code, we guarantee that the slide width is equal to the screen width,
  // so the navigation or translation will be 100% * the current slide index.
  goToSlide(index) {
    if (index < 0) {
      this.currentSlide = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = index;
    }
    this.slidesContainer.style.transform = `translateX(-${
      this.currentSlide * 100
    }%)`;
    this.updateDots();
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }
}

// Selects all elements with the class "slider-container" in the HTML document.
// Initializes a new Slider instance for each selected container
const sliderContainers = document.querySelectorAll(".slider-container");
sliderContainers.forEach((container) => new Slider(container));

// Some of ES6 features used in the code:
// 1.Class Definition
// 2.Template Literals
// 3.Arrow Functions
// 4.const and let Declarations
// 5.for...of Loop
// 6.Default Parameters
// 7.querySelector and querySelectorAll
// 8.forEach
