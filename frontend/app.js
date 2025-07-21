(() => {
  const App = {
    html: {
      lideres: document.getElementById("lider"),
      diaconoCoordinador: document.getElementById("diaconoCoordinador"),
      tablaDisciupulos: document.getElementById("tablaDiscipulos"),
    },
    init() {
      App.bindEvents();
    },
    bindEvents() {
      App.methods.cargarNombreLideres();
      App.html.lideres.addEventListener("change", () => {
        App.methods.cargarCoordinadoresDiacono();
        App.methods.cargarDiscipulos();
      });
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
      async cargarDiscipulos() {
        let liderSelected = App.html.lideres.value;
        try {
          const res = await fetch(
            "http://localhost:6543/api/discipulos?lider=" + liderSelected
          );
          let discipulos = await res.json();
          discipulos = discipulos.result;
          console.log("Discipulos obtenidos:", discipulos);
          App.renderTablaDiscipulos(discipulos);
        } catch (e) {
          console.error("Error al cargar discípulos:", e);
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
    renderDiaconoCoordinador(diaconoCoordinadorNombre) {
      App.html.diaconoCoordinador.textContent =
        diaconoCoordinadorNombre.result[0].diaconoCoordinador;
      ("No hay coordinador disponible");
    },
    renderTablaDiscipulos(discipulos){
      tablaDiscipulosRow = App.html.tablaDisciupulos
      tablaDiscipulosRow = tablaDiscipulosRow.querySelector("tbody");
      tablaDiscipulosRow.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
      discipulos.forEach((datosDiscipulos) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${datosDiscipulos.name}</td>
          <td><input type="checkbox" data-asistencia="Doulos"></td>
          <td><input type="checkbox" data-asistencia="Miércoles"></td>
          <td><input type="checkbox" data-asistencia="Viernes"></td>
          <td><input type="checkbox" data-asistencia="Sábado"></td>
          <td><input type="checkbox" data-asistencia="Domingo"></td>
          <td><input type="checkbox" data-asistencia="Santa Cena"></td>
          <td><input type="checkbox" data-asistencia="Contactado"></td>
        `;
        tablaDiscipulosRow.appendChild(tr);
      }
      );
    }
  };
  App.init();
})();
