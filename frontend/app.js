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
      App.handlers.cargarCoordinadoresDiaconoDiscipulos();
      
    },
    handlers: {
      // Aquí puedes agregar más manejadores de eventos si es necesario
      cargarCoordinadoresDiaconoDiscipulos(){
        App.html.lideres.addEventListener("change", () => {
        App.methods.cargarSuperior();
        App.methods.cargarSubordinados();
      });
      }
    },
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

      async cargarSuperior() {
        let liderSelected = App.html.lideres.value;
        try {
          const res = await fetch(
            "http://localhost:6543/api/superior?id=" + liderSelected
          );
          let superior = await res.json();
          App.renderSuperior(superior);
        } catch (e) {
          console.error("Error al cargar coordinadores y diacono:", e);
        }
      },
      async cargarSubordinados() {
        let liderSelected = App.html.lideres.value;
        try {
          const res = await fetch(
            "http://localhost:6543/api/subordinados/" + liderSelected
          );
          let subordinados = await res.json();
          subordinados = subordinados.result;
          App.renderTablaSubordinados(subordinados);
        } catch (e) {
          console.error("Error al cargar discípulos:", e);
        }
      },
    },
    renderNombreLideres(lideres) {
      App.html.lideres.innerHTML =
        '<option value="">Seleccione un lider</option>';
      lideres.forEach((lider) => {
        const option = document.createElement("option");
        option.value = lider.id;
        option.textContent = lider.nombre;
        App.html.lideres.appendChild(option);
      });
    },
    renderSuperior(superiorNombre) {      
      App.html.diaconoCoordinador.textContent =
        superiorNombre.result.nombre_superior;
      ("No hay coordinador disponible");
    },
    renderTablaSubordinados(subordinados){
      tablaSubordinadosRow = App.html.tablaDisciupulos
      tablaSubordinadosRow = tablaSubordinadosRow.querySelector("tbody");
      tablaSubordinadosRow.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
      subordinados.forEach((datosSubordinados) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${datosSubordinados.nombre}</td>
          <td><input type="checkbox" data-asistencia="Doulos"></td>
          <td><input type="checkbox" data-asistencia="Miércoles"></td>
          <td><input type="checkbox" data-asistencia="Viernes"></td>
          <td><input type="checkbox" data-asistencia="Sábado"></td>
          <td><input type="checkbox" data-asistencia="Domingo"></td>
          <td><input type="checkbox" data-asistencia="Santa Cena"></td>
          <td><input type="checkbox" data-asistencia="Contactado"></td>
        `;
        tablaSubordinadosRow.appendChild(tr);
      }
      );
    }
  };
  App.init();
})();
