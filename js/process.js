const steps = document.querySelectorAll(".process-step");

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

steps.forEach(step => {

observer.observe(step);

});