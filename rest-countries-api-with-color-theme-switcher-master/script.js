const API = "data.json";
//const API = "https://restcountries.com/v3.1/all";




const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const countriesGrid = document.getElementById("countriesGrid");

function setTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

(function initTheme() {
  const saved = localStorage.getItem("theme");
  setTheme(saved || "light");
})();

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "light" ? "dark" : "light");
});

async function fetchCountries() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const valid = data.filter(c => c.name?.common || c.name?.official);
    renderCountries(valid);
    searchInput.addEventListener("input", () => applyFilters(valid));
    regionSelect.addEventListener("change", () => applyFilters(valid));
  } catch (err) {
    countriesGrid.innerHTML = `<p>Error loading countries.</p>`;
    console.error(err);
  }
}

function countryCard(c) {
  const flag = c.flags?.png || "";
  const name = c.name?.common || c.name?.official || "Unknown";
  const population = c.population?.toLocaleString() || "—";
  const region = c.region || "—";
  const capital = Array.isArray(c.capital) ? c.capital.join(", ") : (c.capital || "—");

  return `
    <div class="card" tabindex="0">
      <img src="${flag}" alt="Flag of ${name}" />
      <div class="content">
        <h3>${name}</h3>
        <div class="meta">
          <div><strong>Population:</strong> ${population}</div>
          <div><strong>Region:</strong> ${region}</div>
          <div><strong>Capital:</strong> ${capital}</div>
        </div>
      </div>
    </div>
  `;
}

function renderCountries(list) {
  countriesGrid.innerHTML = list.map(countryCard).join("");
}

function applyFilters(data) {
  const term = searchInput.value.toLowerCase();
  const region = regionSelect.value;
  const filtered = data.filter(c => {
    const name = (c.name?.common || c.name?.official || "").toLowerCase();
    const matchesTerm = !term || name.includes(term);
    const matchesRegion = !region || c.region === region;
    return matchesTerm && matchesRegion;
  });
  renderCountries(filtered);
}

fetchCountries();
