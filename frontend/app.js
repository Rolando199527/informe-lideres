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
      inputsForm: document.querySelectorAll("input"),
      selectForm: document.querySelectorAll("select"),
      buttonGuardar: document.getElementById("guardarInforme"),
      successContainer: document.getElementById("success-container"),
      isHidden: document.getElementById("isHidden"),
      total_miercoles: document.getElementById("asistenciaTotalMiercoles"),
      total_viernes: document.getElementById("asistenciaTotalViernes"),
      total_sabado: document.getElementById("asistenciaTotalSabado"),
      total_domingo: document.getElementById("asistenciaTotalDomingo"),
      loader: document.querySelector(".lider__loader"),
      diaconoCoordinadorLoader: document.querySelector(".diaconocordinador__loader"),
      discipulosLoader: document.querySelector(".discipulos__loader"),
      filtroCoordinacion: document.getElementById("filtroCoordinacion"),
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
          const res = await fetch("https://informe-lideres-backend.onrender.com/api/lideres");
          // const res = await fetch("http://localhost:6543/api/lideres");
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
            "https://informe-lideres-backend.onrender.com/api/superior?id=" +
              liderSelected
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
            "https://informe-lideres-backend.onrender.com/api/subordinados/" +
              liderSelected
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
        total_miercoles = App.html.total_miercoles.value;
        total_viernes = App.html.total_viernes.value;
        total_sabado = App.html.total_sabado.value;
        total_domingo = App.html.total_domingo.value;
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
          total_miercoles,
          total_viernes,
          total_sabado,
          total_domingo,
        };

        App.methods.guardarInforme(informeData);
      },

      async guardarInforme(informeData) {
        try {
          const res = await fetch(
            "https://informe-lideres-backend.onrender.com/api/guardarInforme",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(informeData),
            }
          );

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
            "https://informe-lideres-backend.onrender.com/api/obtenerInforme"
          );
          let informes = await res.json();
          informes = informes.result;
          if (res.ok) {
            // Aquí puedes renderizar los informes en tu interfaz
            App.renderInformes(informes);
            App.renderFiltroCoordinacion(informes);
            console.log("Informes obtenidos exitosamente:", informes);
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
          const res = await fetch(
            "https://informe-lideres-backend.onrender.com/api/obtenerTotales"
          );
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
        inputs.forEach((input) => (input.value = ""));

        const checkboxes = App.html.tablaDisciupulos.querySelectorAll(
          "input[name='asistencia']"
        );
        checkboxes.forEach((checkbox) => (checkbox.checked = false));

        const selects = App.html.selectForm;
        selects.forEach((select) => (select.selectedIndex = 0));

        // setTimeout (() => {location.reload(true);}, 1000);
        App.renderSuccessMessage();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
    },
    renderNombreLideres(lideres) {
      lideres.forEach((lider) => {
        const option = document.createElement("option");
        option.value = lider.id;
        option.textContent = lider.nombre;
        App.html.lideres.appendChild(option);
      });

      App.html.lideres.style.display = "block";
      App.html.loader.style.display = "none"; // Ocultar el loader una vez que se cargan los líderes
      
    },
    renderSuperior(superiorNombre) {
      // TODO: agregar un loader para el diacono coordinador
      App.html.diaconoCoordinadorLoader.style.display = "block"; // Ocultar el loader una vez que se carga el diacono coordinador
      App.html.diaconoCoordinador.textContent = superiorNombre.result.nombre_superior;
      App.html.diaconoCoordinador.style.display = "block";
      App.html.diaconoCoordinadorLoader.style.display = "none"; // Ocultar el loader una vez que se carga el diacono coordinador
    },
    renderTablaSubordinados(subordinados) {
      App.html.discipulosLoader.style.display = "block"; // Mostrar el loader mientras se cargan los subordinados
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
      App.html.discipulosLoader.style.display = "none"; // Mostrar el loader mientras se cargan los subordinados

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
        const totalDiv = document.createElement("table");
        totalDiv.classList.add("total");
        totalDiv.innerHTML = `
          <h2>Total de Informes</h2>

     <tr>
      <th>Asistencia Miercoles</th>
      <td>${total.total_miercoles}</td>
    </tr>

     <tr>
      <th>Asistencia Viernes</th>
      <td>${total.total_viernes}</td>
     </tr>

     <tr>
      <th>Asistencia Sabado</th>
      <td>${total.total_sabado}</td>
     </tr>

     <tr>
      <th>Asistencia Domingo</th>
      <td>${total.total_domingo}</td>
     </tr>

     <tr>
      <th>Asistencia Santa Cena</th>
      <td>${total.total_santa_cena}</td>
     </tr>

     <tr>
      <th>Asistencia Doulos</th>
      <td>${total.total_doulos}</td>
     </tr>

     <tr>
      <th>Asistencia a redes (Discipulos)</th>
      <td>${total.total_red_discipulos}</td>
     </tr>

     <tr>
      <th>Total Nuevos Discipulos</th>
      <td>${total.total_nuevos_discipulos}</td>
     </tr>

     <tr>
      <th>Total Ofrenda</th>
      <td>${total.total_ofrenda}</td>
     </tr>
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

        <div id="contenedorTablasInforme">
          <table id="tablaRedInforme">
            <tr>
              <th colspan="2">
                <h3 class="form-informe__subtitle">Asistencia a Redes</h3>
              </th>
            </tr>
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

          <table id="tablaAsistenciasTotalesInforme">
            <tr>
              <th colspan="2"><h3 class="form-informe__subtitle">Asistencias Totales <span
                id="form-informe__subtitle--disabled">(invitados y Discípulos)</span></h3></th>
            </tr>
            
            <tr>
              <th>Miercoles</th>
              <td>${informe.total_miercoles}</td>
            </tr>

            <tr>
              <th>Viernes</th>
              <td>${informe.total_viernes}</td>
            </tr>
            <tr>
              <th>Sabado</th>
              <td>${informe.total_sabado}</td>
            </tr>
            <tr>
              <th>Domingo</th>
              <td>${informe.total_domingo}</td>
            </tr>
          </table>
        </div>

        <div>
          <h3>Nombres Nuevos Discipulos</h3>
          <p> ${informe.nombre_nuevos_discipulos.join(", ")}</p>
        </div>
        `;
        contenedorInformes.appendChild(informeDiv);
      });
    },
    renderFiltroCoordinacion(informe) {

      informe.forEach((datos_informe) => {
        const option = document.createElement("option")
        option.value = datos_informe.lider_id;
        option.textContent = datos_informe.nombre_lider;
        App.html.filtroCoordinacion.appendChild(option);
      
      })
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
    },
  };
  App.init();
})();
