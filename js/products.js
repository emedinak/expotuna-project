const sliders = document.querySelectorAll(".product-slider");

sliders.forEach(slider => {

const images = slider.querySelectorAll(".product-image");
const next = slider.querySelector(".next");
const prev = slider.querySelector(".prev");

let index = 0;

function showImage(i){

images.forEach(img => img.classList.remove("active"));
images[i].classList.add("active");

}

next.addEventListener("click", () => {

index++;
if(index >= images.length) index = 0;

showImage(index);

});

prev.addEventListener("click", () => {

index--;
if(index < 0) index = images.length-1;

showImage(index);

});

});

const track = document.querySelector(".brands-track");

const next = document.querySelector(".brand-arrow.right");

const prev = document.querySelector(".brand-arrow.left");


next.addEventListener("click", () => {

track.scrollBy({

left:310,

behavior:"smooth"

});

});


prev.addEventListener("click", () => {

track.scrollBy({

left:-310,

behavior:"smooth"

});

});