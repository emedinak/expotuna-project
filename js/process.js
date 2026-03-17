/* --------------------------------
   STAGGERED CARD ENTRANCE
   Cards animate in sequence as the
   grid scrolls into view
-------------------------------- */

const cards = document.querySelectorAll(".process-card");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // fire once
        }

    });

}, {
    threshold: 0.15   // trigger when 15% of card is visible
});

cards.forEach(card => observer.observe(card));