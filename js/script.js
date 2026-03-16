/* ---------------------------
ANIMATION ON SCROLL
--------------------------- */

const elements = document.querySelectorAll("[data-animate]");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });
});

elements.forEach(el => observer.observe(el));


/* ---------------------------
HERO SLIDER
--------------------------- */

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function showSlide(index){

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

function prevSlide(){

    currentSlide--;

    if(currentSlide < 0){
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}


/* ---------------------------
AUTO SLIDER
--------------------------- */

setInterval(nextSlide, 5000);

/* ---------------------------
HERO STATS COUNTER (APPLE STYLE)
--------------------------- */

const counters = document.querySelectorAll(".counter");

function easeOutCubic(t) {
return 1 - Math.pow(1 - t, 3);
}

const counterObserver = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

const counter = entry.target;
const target = +counter.getAttribute("data-target");

const duration = 2000; // animation time
const startTime = performance.now();

function updateCounter(currentTime){

const elapsed = currentTime - startTime;
const progress = Math.min(elapsed / duration, 1);

const easedProgress = easeOutCubic(progress);

const value = Math.floor(easedProgress * target);

if(counter.dataset.type === "percent"){
counter.innerText = value + "%";
}else{
counter.innerText = value + "+";
}

if(progress < 1){
requestAnimationFrame(updateCounter);
}else{

if(counter.dataset.type === "percent"){
counter.innerText = target + "%";
}else{
counter.innerText = target + "+";
}

}

}

requestAnimationFrame(updateCounter);

counterObserver.unobserve(counter);

}

});

}, { threshold: 0.6 });

counters.forEach(counter => {
counterObserver.observe(counter);
});

const navbar = document.querySelector(".navbar-home");

window.addEventListener("scroll", () => {

if(window.scrollY > 80){
navbar.classList.add("scrolled");
}else{
navbar.classList.remove("scrolled");
}

});