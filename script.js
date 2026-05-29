const visor = document.getElementById("visor");
const imgGrande = document.getElementById("imgGrande");
const cerrar = document.getElementById("cerrar");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("img-producto")) {
    visor.style.display = "flex";
    imgGrande.src = e.target.src;
    imgGrande.alt = e.target.alt || "Imagen ampliada";
  }
});

cerrar.addEventListener("click", () => {
  visor.style.display = "none";
  imgGrande.src = "";
});

visor.addEventListener("click", (e) => {
  if (e.target === visor) {
    visor.style.display = "none";
    imgGrande.src = "";
  }
});