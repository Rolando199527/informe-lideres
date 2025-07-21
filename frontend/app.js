(() => {
  const App = {
    html: {
      lideres: document.getElementById("lider"),
      coordinacion: document.getElementById("diaconoCoordinador"),
    },
    init() {
      App.bindEvents();
    },
    bindEvents() {
      App.methods.cargarNombreLideres();
      App.html.lideres.addEventListener(
        "change",
        App.methods.cargarCoordinadoresDiacono
      );
    },
    handlers: {},
    methods: {
      async cargarNombreLideres() {
        try {
          const res = await fetch("http://localhost:6543/api/lideres");
          let lideres = await res.json();
          lideres = lideres.result;
          // Función para cargar lideres en el select
          App.renderNombreLideres(lideres);
        } catch (e) {
          console.error(
            "Error al cargar la estructura de coordinaciones y líderes:",
            e
          );
        }
      },

      async cargarCoordinadoresDiacono() {
        let liderSelected = App.html.lideres.value;
        console.log("Lider seleccionado:", liderSelected);
        console.log("Cargando coordinadores y diacono...");

        try {
          const res = await fetch(
            "http://localhost:6543/api/diaconoCoordinador?name=" + liderSelected
          );
          let coordinadores = await res.json();
          App.renderDiaconoCoordinador(coordinadores);
        } catch (e) {
          console.error("Error al cargar coordinadores y diacono:", e);
        }
      },
    },
    renderNombreLideres(lideres) {
      console.log("Lideres a renderizar:", lideres);
      App.html.lideres.innerHTML =
        '<option value="">Seleccione un lider</option>';
      lideres.forEach((lider) => {
        const option = document.createElement("option");
        option.value = lider.nombreLider;
        option.textContent = lider.nombreLider;
        App.html.lideres.appendChild(option);
      });
    },
    renderDiaconoCoordinador(coordinadores) {
     App.html.coordinacion.textContent = coordinadores.result[0].diaconoCoordinador || "No hay coordinador disponible";
    },
  };
  App.init();
})();
