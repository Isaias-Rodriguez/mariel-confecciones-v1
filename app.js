function normalizarCategoria(categoria) {
  const valor = (categoria || "").toLowerCase().trim();

  if (valor === "guardapolvos" || valor === "guardapolvo") {
    return "guardapolvos";
  }

  if (valor === "remeras" || valor === "remera") {
    return "remeras";
  }

  if (valor === "chombas" || valor === "chomba") {
    return "chombas";
  }

if (
  valor === "indumentaria femenina" ||
  valor === "indumentaria" ||
  valor === "femenina"
) {
  return "indumentaria-femenina";
}

  if (valor === "bordados" || valor === "bordado") {
    return "bordados";
  }

  if (
    valor === "estampados" ||
    valor === "estampado" ||
    valor === "sublimados" ||
    valor === "sublimado" ||
    valor === "estampados y sublimados" ||
    valor === "estampado y sublimado"
  ) {
    return "estampados";
  }

  if (valor === "liquidacion" || valor === "liquidación") {
    return "liquidacion";
  }

  return valor;
}

function crearCard(producto) {
  const card = document.createElement("div");
  card.className = "card";

  const etiqueta = producto.en_liquidacion
    ? `<span class="badge-liquidacion">🔥 OFERTA</span>`
    : "";

  const precioHtml = producto.precio
    ? `<p class="precio">$${producto.precio}</p>`
    : `<p class="precio-consultar">Consultar precio</p>`;

  card.innerHTML = `
    <div class="img-container">
      ${etiqueta}
      <img src="${producto.imagen_url || ""}" alt="${producto.nombre}" class="img-producto">
    </div>

    <div class="card-body">
      <h3>${producto.nombre}</h3>
      <p class="descripcion">${producto.descripcion || ""}</p>
      ${precioHtml}

      <a 
        class="btn-card" 
        href="https://wa.me/5492634698464?text=Hola,%20quiero%20consultar%20por%20${encodeURIComponent(producto.nombre)}."
        target="_blank"
      >
        Consultar
      </a>
    </div>
  `;

  return card;
}

let productosPorCategoria = {
    guardapolvos: [],
    remeras: [],
    chombas: [],
    bordados: [],
    estampados: [],
    "indumentaria-femenina": [],
    liquidacion: []
};

const nombresCategorias = {
  guardapolvos: "Guardapolvos",
  remeras: "Remeras",
  chombas: "Chombas",
  "indumentaria-femenina": "Indumentaria femenina",
  bordados: "Bordados",
  estampados: "Estampados",
  liquidacion: "🔥 Liquidación"
};

function mostrarVistaCategorias() {
  document.getElementById("vista-categorias").style.display = "block";
  document.getElementById("vista-productos").style.display = "none";
}

function mostrarVistaProductos(categoria) {
  const vistaCategorias = document.getElementById("vista-categorias");
  const vistaProductos = document.getElementById("vista-productos");
  const tituloCategoria = document.getElementById("titulo-categoria-actual");
  const contenedorProductos = document.getElementById("productos-categoria-actual");
  const mensajeVacio = document.getElementById("mensaje-categoria-vacia");

  vistaCategorias.style.display = "none";
  vistaProductos.style.display = "block";

  tituloCategoria.textContent = nombresCategorias[categoria] || "Categoría";
  contenedorProductos.innerHTML = "";

  const productos = productosPorCategoria[categoria] || [];

  if (productos.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  }

  mensajeVacio.style.display = "none";

  productos.forEach((producto) => {
    contenedorProductos.appendChild(crearCard(producto));
  });

  vistaProductos.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

async function cargarProductos() {
  let { data, error } = await window.supabaseClient
    .from("productos")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error("Error al cargar productos:", error);
    return;
  }

  productosPorCategoria = {
  guardapolvos: [],
  remeras: [],
  chombas: [],
  bordados: [],
  estampados: [],
  "indumentaria-femenina": [],
  liquidacion: []
};

  data = data.filter((producto) => producto.imagen_url && producto.imagen_url.trim() !== "");

data.forEach((producto) => {
    const categoria = normalizarCategoria(producto.categoria);

    if (producto.en_liquidacion || categoria === "liquidacion") {
      productosPorCategoria.liquidacion.push(producto);
    } else if (categoria === "guardapolvos") {
      productosPorCategoria.guardapolvos.push(producto);
    } else if (categoria === "remeras") {
      productosPorCategoria.remeras.push(producto);
    } else if (categoria === "chombas") {
      productosPorCategoria.chombas.push(producto);
    }else if (categoria === "indumentaria-femenina") {
    productosPorCategoria["indumentaria-femenina"].push(producto);
    } else if (categoria === "bordados") {
      productosPorCategoria.bordados.push(producto);
    } else if (categoria === "estampados") {
      productosPorCategoria.estampados.push(producto);
    }
  });

  const cardCategorias = document.querySelectorAll(".categoria-card");

  cardCategorias.forEach((card) => {
    const categoria = card.dataset.categoria;
    const tieneProductos = (productosPorCategoria[categoria] || []).length > 0;
    card.style.display = tieneProductos ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();

  const cardCategorias = document.querySelectorAll(".categoria-card");
  const btnVolver = document.getElementById("btn-volver-categorias");

 cardCategorias.forEach((card) => {
  card.addEventListener("click", () => {
    const categoria = card.dataset.categoria;

    history.pushState(
      { categoria: categoria },
      "",
      "#"+categoria
    );

    mostrarVistaProductos(categoria);
  });
});


window.addEventListener("popstate", () => {
  mostrarVistaCategorias();

  document.getElementById("vista-categorias").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});


  btnVolver.addEventListener("click", () => {
    mostrarVistaCategorias();

    document.getElementById("vista-categorias").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});