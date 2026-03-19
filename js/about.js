/* ================================
   NEWS CARD SLIDERS
================================ */

const sliders = document.querySelectorAll(".card-slider");

sliders.forEach(slider => {

  const slides = slider.querySelectorAll(".slide");
  let index = 0;

  setInterval(() => {

    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");

  }, 2500);

});


/* ================================
   EXPORT MARKETS MAP
================================ */

(async function() {

  const svg = d3.select("#world-map");
  const width = 960, height = 500;
  const tooltip = document.getElementById("map-tooltip");

  const projection = d3.geoNaturalEarth1()
    .scale(153)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  const destinations = [
    { name: "United States",  coords: [-95, 38],   region: "Americas" },
    { name: "Canada",         coords: [-96, 56],   region: "Americas" },
    { name: "United Kingdom", coords: [-1, 52],    region: "Europe"   },
    { name: "France",         coords: [2, 46],     region: "Europe"   },
    { name: "Spain",          coords: [-3, 40],    region: "Europe"   },
    { name: "Portugal",       coords: [-8, 39],    region: "Europe"   },
    { name: "Italy",          coords: [12, 42],    region: "Europe"   },
    { name: "Greece",         coords: [22, 39],    region: "Europe"   },
    { name: "Romania",        coords: [25, 46],    region: "Europe"   },
    { name: "Albania",        coords: [20, 41],    region: "Europe"   },
    { name: "Netherlands",    coords: [5, 52],     region: "Europe"   },
    { name: "Ukraine",        coords: [32, 49],    region: "Europe"   },
    { name: "Morocco",        coords: [-6, 32],    region: "Africa"   },
    { name: "Egypt",          coords: [30, 26],    region: "Africa"   },
    { name: "Libya",          coords: [17, 27],    region: "Africa"   },
    { name: "South Africa",   coords: [25, -29],   region: "Africa"   },
    { name: "Arab Emirates",  coords: [54, 24],    region: "Asia"     },
    { name: "Lebanon",        coords: [35, 33],    region: "Asia"     },
    { name: "China",          coords: [104, 35],   region: "Asia"     },
    { name: "South Korea",    coords: [127, 37],   region: "Asia"     },
    { name: "Taiwan",         coords: [121, 23],   region: "Asia"     },
    { name: "Vietnam",        coords: [108, 16],   region: "Asia"     },
    { name: "Thailand",       coords: [101, 15],   region: "Asia"     },
    { name: "Malaysia",       coords: [110, 4],    region: "Asia"     },
  ];

  const ecuador = [-78.5, -1.8];

  const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
  const countries = topojson.feature(world, world.objects.countries);

  // Draw countries
  svg.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#e8eef5")
    .attr("stroke", "#c5d3e0")
    .attr("stroke-width", 0.4);

  const ecuadorPx = projection(ecuador);

  // Draw animated lines from Ecuador — más lentas
  destinations.forEach((d, i) => {
    const destPx = projection(d.coords);
    const duration = 5000 + (i * 300); // era 2000 + (i * 150)

    const dx = destPx[0] - ecuadorPx[0];
    const dy = destPx[1] - ecuadorPx[1];
    const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;

    const lineEl = svg.append("path")
      .attr("d", `M${ecuadorPx[0]},${ecuadorPx[1]} A${dr},${dr} 0 0,1 ${destPx[0]},${destPx[1]}`)
      .attr("fill", "none")
      .attr("stroke", "#0f3c66")
      .attr("stroke-width", 0.9)
      .attr("stroke-dasharray", "4 3")
      .attr("opacity", 0.45);

    const totalLen = lineEl.node().getTotalLength();

    (function animateLine(el) {
      el.transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attrTween("stroke-dashoffset", () => d3.interpolate(0, -(totalLen)))
        .on("end", () => animateLine(el));
    })(lineEl);
  });

  const regionColors = {
    Americas: "#2a9d8f",
    Europe:   "#1a6fbd",
    Africa:   "#e9c46a",
    Asia:     "#e76f51",
  };

  // Draw destination dots
  destinations.forEach(d => {
    const px = projection(d.coords);
    const color = regionColors[d.region];

    const g = svg.append("g")
      .attr("class", "dest-dot")
      .style("cursor", "pointer");

    g.append("circle")
      .attr("cx", px[0])
      .attr("cy", px[1])
      .attr("r", 5)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1)
      .attr("opacity", 0.3)
      .attr("class", "pulse-ring");

    g.append("circle")
      .attr("cx", px[0])
      .attr("cy", px[1])
      .attr("r", 3.5)
      .attr("fill", color)
      .attr("opacity", 0.9);

    g.on("mouseover", function(event) {
        const svgEl = document.getElementById("world-map");
        const svgRect = svgEl.getBoundingClientRect();
        const wrapperRect = svgEl.closest(".map-wrapper").getBoundingClientRect();

        const scaleX = svgRect.width / width;
        const scaleY = svgRect.height / height;

        const dotX = svgRect.left - wrapperRect.left + px[0] * scaleX;
        const dotY = svgRect.top  - wrapperRect.top  + px[1] * scaleY;

        tooltip.textContent = d.name;
        tooltip.style.left = (dotX + 10) + "px";
        tooltip.style.top  = (dotY - 12) + "px";
        tooltip.style.opacity = "1";
        tooltip.style.visibility = "visible";

        d3.select(this).select("circle:last-child").attr("r", 5).attr("opacity", 1);
      })
      .on("mouseout", function() {
        tooltip.style.opacity = "0";
        tooltip.style.visibility = "hidden";
        d3.select(this).select("circle:last-child").attr("r", 3.5).attr("opacity", 0.85);
      });
  });

  // Pulse ring animation
  (function pulseDots() {
    svg.selectAll(".pulse-ring")
      .transition().duration(1500).ease(d3.easeLinear)
      .attr("r", 9).attr("opacity", 0)
      .transition().duration(0)
      .attr("r", 5).attr("opacity", 0.3)
      .on("end", pulseDots);
  })();

  // Ecuador origin dot
  svg.append("circle")
    .attr("cx", ecuadorPx[0])
    .attr("cy", ecuadorPx[1])
    .attr("r", 6)
    .attr("fill", "#0f3c66");

  svg.append("circle")
    .attr("cx", ecuadorPx[0])
    .attr("cy", ecuadorPx[1])
    .attr("r", 6)
    .attr("fill", "none")
    .attr("stroke", "#0f3c66")
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.4)
    .attr("class", "ecuador-pulse");

  (function pulseEcuador() {
    svg.select(".ecuador-pulse")
      .transition().duration(1800).ease(d3.easeLinear)
      .attr("r", 18).attr("opacity", 0)
      .transition().duration(0)
      .attr("r", 6).attr("opacity", 0.4)
      .on("end", pulseEcuador);
  })();

  svg.append("text")
    .attr("x", ecuadorPx[0])
    .attr("y", ecuadorPx[1] + 16)
    .attr("text-anchor", "middle")
    .style("font-family", "Inter, sans-serif")
    .style("font-size", "8px")
    .style("font-weight", "600")
    .style("fill", "#0f3c66")
    .style("letter-spacing", "0.8px")
    .text("ECUADOR");

})();


/* ================================
   COUNTER ANIMATION — stat cards
================================ */

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const statCards = document.querySelectorAll(".export-stat-card h3");

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const raw = el.getAttribute("data-target");
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    const target = parseFloat(raw);
    const isDecimal = raw.includes(".");
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const val = eased * target;
      el.innerHTML = `${prefix}${isDecimal ? val.toFixed(1) : Math.floor(val)}<span>${suffix}</span>`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

statCards.forEach(el => counterObserver.observe(el));


/* ================================
   FLEET REVEAL ON SCROLL
================================ */

const fleetReveal = document.querySelector('[data-fleet-reveal]');

if (fleetReveal) {
  const fleetObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        fleetObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  fleetObserver.observe(fleetReveal);
}