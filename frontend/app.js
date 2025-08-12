(() => {
  const App = {
    html: {
      datosInforme: document.getElementById("datosInforme"),
      lideres: document.getElementById("lider"),
      diaconoCoordinador: document.getElementById("diaconoCoordinador"),
      tablaDisciupulos: document.getElementById("tablaDiscipulos"),
      // Datos del informe
      fecha: document.getElementById("fecha"),
      redDiscipulos: document.getElementById("redDiscipulos"),
      nuevosDiscipulos: document.getElementById("redNuevos"),
      ofrenda: document.getElementById("redOfrenda"),
      nuevosDiscipulosNombre: document.getElementById("nuevosDiscipulos"),
      verInformes: document.getElementById("verInformes"),
      llenarInforme: document.getElementById("llenarInforme"),
      seccionVer: document.getElementById("seccionVer"),
      llenarInforme: document.getElementById("llenarInforme"),
      contenedorInformes: document.getElementById("contenedorInformes"),
      inputsForm: document.querySelectorAll('input'),
      selectForm: document.querySelectorAll('select'),
      buttonGuardar: document.getElementById("guardarInforme"),
      successContainer: document.getElementById("success-container")
    },
    data: {
      fechaInicio: (fechaInicio = new Date()), // Fecha de inicio del informe, puedes cambiarla según sea necesario
      fechaFiltrado: null, // Fecha filtrada para la consulta de informes, puedes cambiarla según sea necesario",
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
      cargarCoordinadoresDiaconoDiscipulos() {
        App.html.lideres.addEventListener("change", () => {
          App.methods.cargarSuperior();
          App.methods.cargarSubordinados();
        });
        App.html.datosInforme.addEventListener("submit", (e) => {
          e.preventDefault();
          // Aquí puedes agregar la lógica para guardar el informe
          App.methods.capturarDatosInforme();
        });
        App.html.verInformes.addEventListener("click", () => {
          App.methods.cargarInformes();
          App.methods.obtenerTotales();
          App.methods.formatearFecha();
        });
        App.html.llenarInforme.addEventListener("click", () => {
          App.html.datosInforme.style.display = "block";
          App.html.seccionVer.style.display = "none";
          App.html.contenedorInformes.innerHTML = ""; // Limpiar informes previos
        });
      },
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
      capturarDatosInforme() {
        lideres = App.html.lideres.value;
        diaconoCoordinador = App.html.diaconoCoordinador.textContent;
        fecha = App.html.fecha.value;
        const checkboxes = App.html.tablaDisciupulos.querySelectorAll(
          "input[name='asistencia']:checked"
        );
        const asistencia = Array.from(checkboxes).map(
          (checkbox) => checkbox.value
        );
        const asistenciaCount = App.methods.sumarAsistencia(asistencia);
        redDiscipulos = App.html.redDiscipulos.value;
        nuevosDiscipulos = App.html.nuevosDiscipulos.value;
        ofrenda = App.html.ofrenda.value;
        nombreNuevosDiscipulos = App.html.nuevosDiscipulosNombre.value;
        const nombreNuevosDiscipulosArray = nombreNuevosDiscipulos
          .split(",")
          .map((nombre) => nombre.trim());

        const informeData = {
          lideres,
          diaconoCoordinador,
          fecha,
          asistencia: asistenciaCount,
          redDiscipulos,
          nuevosDiscipulos,
          ofrenda,
          nombreNuevosDiscipulos: nombreNuevosDiscipulosArray,
        };

        App.methods.guardarInforme(informeData);
      },
      sumarAsistencia(asistencia) {
        const asistenciaCount = asistencia.reduce((acumulador, value) => {
          acumulador[value] = (acumulador[value] || 0) + 1;
          return acumulador;
        }, {});

        return {
          miercoles: asistenciaCount["Miercoles"] || 0,
          viernes: asistenciaCount["Viernes"] || 0,
          sabado: asistenciaCount["Sabado"] || 0,
          domingo: asistenciaCount["Domingo"] || 0,
          santa_cena: asistenciaCount["Santa Cena"] || 0,
          doulos: asistenciaCount["Doulos"] || 0,
          contactado: asistenciaCount["Contactado"] || 0,
        };
      },
      async guardarInforme(informeData) {
        try {
          const res = await fetch("http://localhost:6543/api/guardarInforme", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(informeData),
          });

          const data = await res.json();
          console.log("Código de estado:", res.status);

          if (res.ok) {
            console.log("Informe guardado exitosamente:", data);
            App.methods.limpiarCampos();
          } else {
            console.error("Error desde el backend:", data);
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      },
      formatearFecha() {
        fechaActual = new Date();
        if (fechaActual.getDay() === 0) {
          // Si es domingo, sumar un día
          App.data.fechaInicio = fechaActual;
          App.data.fechaFiltrado = fechaActual.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        // return fechaFormateada;
      },
      async cargarInformes() {
        try {
          const res = await fetch(
            "http://localhost:6543/api/obtenerInforme"
          );
          let informes = await res.json();
          informes = informes.result;
          if (res.ok) {

            // Aquí puedes renderizar los informes en tu interfaz
            App.renderInformes(informes);
          } else if (res.status === 404) {
            App.renderSinInformes();
          } else if (res.status === 500) {
            console.error("Error al obtener informes:", informes.error);
            App.renderSinInformes();
          }
        } catch (error) {
          console.error("Error en la solicitud de informes:", error);
          App.renderSinInformes();
        }
      },

      async obtenerTotales() {
        try {
          const res = await fetch("http://localhost:6543/api/obtenerTotales");
          const totales = await res.json();
          if (res.ok) {
            console.log("Totales obtenidos exitosamente:", totales);
            // Aquí puedes renderizar los totales en tu interfaz
            App.renderTotales(totales.result);
          } else if (res.status === 404) {
            console.error("No se encontraron totales:", totales.message);
          } else if (res.status === 500) {
            console.error("Error al obtener totales:", totales.error);
          }
        } catch (error) {
          console.error("Error al obtener totales:", error);
        }
      },

      limpiarCampos() {

        const inputs = App.html.inputsForm;
        inputs.forEach(input => input.value = "");

        const checkboxes = App.html.tablaDisciupulos.querySelectorAll("input[name='asistencia']");
        checkboxes.forEach(checkbox => checkbox.checked = false);

        const selects = App.html.selectForm;
        selects.forEach(select => select.selectedIndex = 0);


        // setTimeout (() => {location.reload(true);}, 1000);
        App.renderSuccessMessage();
        

        window.scrollTo({
          top:0,
          behavior: "smooth"
        })
      }
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
    renderTablaSubordinados(subordinados) {
      tablaSubordinadosRow = App.html.tablaDisciupulos;
      tablaSubordinadosRow = tablaSubordinadosRow.querySelector("tbody");
      tablaSubordinadosRow.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
      subordinados.forEach((datosSubordinados) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${datosSubordinados.nombre}</td>
          <td><input type="checkbox" data-asistencia="Doulos" name="asistencia" value="Doulos"></td>
          <td><input type="checkbox" data-asistencia="Miércoles" name="asistencia" value="Miercoles"></td>
          <td><input type="checkbox" data-asistencia="Viernes" name="asistencia" value="Viernes"></td>
          <td><input type="checkbox" data-asistencia="Sábado" name="asistencia" value="Sabado"></td>
          <td><input type="checkbox" data-asistencia="Domingo" name="asistencia" value="Domingo"></td>
          <td><input type="checkbox" data-asistencia="Santa Cena" name="asistencia" value="Santa Cena"></td>
          <td><input type="checkbox" data-asistencia="Contactado" name="asistencia" value="Contactado"></td>
        `;
        tablaSubordinadosRow.appendChild(tr);
      });
    },
    renderTotales(totales) {
      App.html.datosInforme.style.display = "none";
      App.html.seccionVer.style.display = "block";

      const contenedorTotales = document.getElementById("contenedorTotales");
      contenedorTotales.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos
      totales.forEach((total) => {
        const fecha = new Date(total.fecha);
        total.fecha = fecha.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const totalDiv = document.createElement("div");
        totalDiv.classList.add("total");
        totalDiv.innerHTML = `
          <h2>Total de Informes</h2>
          <p>Fecha: ${total.fecha}</p>
          <p>Asistencia Miercoles: ${total.total_miercoles}</p>
          <p>Asistencia Viernes: ${total.total_viernes}</p>
          <p>Asistencia Sabado: ${total.total_sabado}</p>
          <p>Asistencia Domingo: ${total.total_domingo}</p>
          <p>Asistencia Santa Cena: ${total.total_santa_cena}</p>
          <p>Asistencia Doulos: ${total.total_doulos}</p>
          <p>Asistencia a redes (Discipulos): ${total.total_discipulos}</p>
          <p>Total Nuevos Discipulos: ${total.total_nuevos_discipulos}</p>
          <p>Total Ofrenda: ${total.total_ofrenda}</p>
          `;
          contenedorTotales.appendChild(totalDiv);

      });
    },
    renderInformes(informes) {
      App.html.datosInforme.style.display = "none";
      App.html.seccionVer.style.display = "block";

      contenedorInformes = App.html.contenedorInformes;
      contenedorInformes.innerHTML = "";
      // Limpiar el contenedor antes de agregar nuevos
      informes.forEach((informe) => {
        const fecha = new Date(informe.fecha);
        informe.fecha = fecha.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const informeDiv = document.createElement("div");
        informeDiv.classList.add("informe");
        informeDiv.innerHTML = `
        <div id="contenedorInformes__header">
            <div>
              <h2>${informe.nombre_lider}</h2>
              <h4>${informe.diacono_coordinador}</h4>
            </div>
            <p id="header__fecha">Publicado: ${informe.fecha}</p>
          </div>
        <table id="tablaAsistenciaInforme">
        <h3>Seguimiento Semanal</h3>
            <tr>
                <th>Miercoles</th>
                <th>Viernes</th>
                <th>Sabado</th>
                <th>Doulos</th>
                <th>Domingo</th>
                <th>Santa Cena</th>
                <th>Contactado</th>
            </tr>
            <tr>
                <td>${informe.asistencia_miercoles}</td>
                <td>${informe.asistencia_viernes}</td>
                <td>${informe.asistencia_sabado}</td>
                <td>${informe.asistencia_domingo}</td>
                <td>${informe.asistencia_santa_cena}</td>
                <td>${informe.asistencia_doulos}</td>
                <td>${informe.contactado}</td>
            </tr>
          </table>
            <table id="tablaRedInforme">
              <h3>Informe de Red</h3>

   
            <tr>
              <th>Discipulos</th>
              <td>${informe.red_discipulos}</td>
            </tr>
            
            <tr>
              <th>Nuevos</th>
              <td>${informe.nuevos_discipulos}</td>
            </tr>
            <tr>
              <th>Ofrenda</th>
              <td>${informe.ofrenda}</td>
            </tr>
          </table>
           <div>
            <h3>Nombres Nuevos Discipulos</h3>
            <p> ${informe.nombre_nuevos_discipulos.join(", ")}</p>
          </div>
      
        `;
        contenedorInformes.appendChild(informeDiv);
      });
    },
    renderSinInformes() {
      App.html.datosInforme.style.display = "none";
      App.html.seccionVer.style.display = "block";
      App.html.contenedorInformes.innerHTML = `
      <img id="iconoEmpty" src="https://api.iconify.design/line-md:alert-circle-twotone-loop.svg?color=%23888888" alt="">
      <h3 class="mensajeVacio">No hay informes publicados</h3>`;
    },
    renderSuccessMessage() {
      App.html.buttonGuardar.style.display = "none";
      App.html.successContainer.style.display = "inline-flex";
       setTimeout(() => {
          location.reload(true);
       }, 3000); // Ocultar el mensaje después de 3 segundos
    }
  };
  App.init();
})();
