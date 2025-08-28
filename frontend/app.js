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
      grafficoTotales: document.getElementById("graficoAsistencias"),
      loader: document.querySelector(".lider__loader"),
      diaconoCoordinadorLoader: document.querySelector(
        ".diaconocordinador__loader"
      ),
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
        App.html.buttonGuardar.addEventListener("click", (e) => {
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

        App.html.filtroCoordinacion.addEventListener("change", () => {
          const liderSelected = App.html.filtroCoordinacion.value;
          if (liderSelected) {
            App.methods.cargarInformePorLider(liderSelected);
          } else {
            App.html.contenedorInformes.innerHTML = ""; // Limpiar informes previos si no hay selección
          }
        });
      },
    },
    methods: {
      async cargarNombreLideres() {
        try {
          const res = await fetch(
            "https://informe-lideres-backend.onrender.com/api/lideres"
          );
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

      sumarAsistencia(asistenciaArray) {
        const asistenciaCount = {
          miercoles: 0,
          viernes: 0,
          sabado: 0,
          domingo: 0,
          santa_cena: 0,
          doulos: 0,
          contactado: 0,
        };

        asistenciaArray.forEach((asistencia) => {
          if (asistenciaCount.hasOwnProperty(asistencia)) {
            asistenciaCount[asistencia]++;
          }
        });

        return asistenciaCount;
      },

      async guardarInforme(informeData) {
        try {
          const res = await fetch(
            // "https://informe-lideres-backend.onrender.com/api/guardarInforme",
            "http://localhost:6543/api/guardarInforme",
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
          // const res = await fetch("https://informe-lideres-backend.onrender.com/api/obtenerInforme");
          const res = await fetch("http://localhost:6543/api/obtenerInforme");
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

      async cargarInformePorLider(liderSelected) {
        console.log("Cargando informes por líder...");
        console.log("Líder seleccionado:", liderSelected);
        try {
          // const res = await fetch("https://informe-lideres-backend.onrender.com/api/obtenerInformePorlider?id=" + liderSelected);
          const res = await fetch(
            "http://localhost:6543/api/obtenerInformePorlider?id=" +
              liderSelected
          );

          const informe = await res.json();
          informeData = informe.result;
          console.log("Respuesta del servidor:", informeData);
          App.renderInformes(informeData);
        } catch (e) {
          console.log("Error al cargar informes por líder:", e);
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
      App.html.diaconoCoordinador.textContent =
        superiorNombre.result.nombre_superior;
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
      document.getElementById("contenedorTotales").innerHTML = "";

      const contenedorTotales = document.getElementById("contenedorTotales"); // Limpiar el contenedor antes de agregar nuevos
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
    
          <h2 class="mb-4">Informe Conglomerado</h2>

<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalViernes" placeholder="Viernes" value="${total.total_viernes}" disabled>
      <label for="totalViernes">Viernes</label>
    </div>
  </div>

  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalSabado" placeholder="Sábado" value="${total.total_sabado}" disabled>
      <label for="totalSabado">Sábado</label>
    </div>
  </div>

  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalDomingo" placeholder="Domingo" value="${total.total_domingo}" disabled>
      <label for="totalDomingo">Domingo</label>
    </div>
  </div>

  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalSantaCena" placeholder="Santa Cena" value="${total.total_santa_cena}" disabled>
      <label for="totalSantaCena">Santa Cena</label>
    </div>
  </div>

  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalDoulos" placeholder="Doulos" value="${total.total_doulos}" disabled>
      <label for="totalDoulos">Doulos</label>
    </div>
  </div>

  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalRedDiscipulos" placeholder="Redes (Discípulos)" value="${total.total_red_discipulos}" disabled>
      <label for="totalRedDiscipulos">Redes (Discípulos)</label>
    </div>
  </div>

  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalNuevosDiscipulos" placeholder="Nuevos Discípulos" value="${total.total_nuevos_discipulos}" disabled>
      <label for="totalNuevosDiscipulos">Nuevos Discípulos</label>
    </div>
  </div>

  <div class="col w-auto">
    <div class="form-floating">
      <input type="text" class="form-control" id="totalOfrenda" placeholder="Ofrenda" value="${total.total_ofrenda}" disabled>
      <label for="totalOfrenda">Ofrenda</label>
    </div>
  </div>
</div>


     
        `;
        contenedorTotales.appendChild(totalDiv);
      });

      // // Renderizar gráfico de barras con Chart.js
      const ctx = App.html.grafficoTotales.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Miércoles",
            "Viernes",
            "Sábado",
            "Domingo",
            "Santa Cena",
            "Doulos",
            "Redes (Discípulos)",
          ],
          datasets: [
            {
              label: "Totales",
              data: [
                totales[0].total_miercoles,
                totales[0].total_viernes,
                totales[0].total_sabado,
                totales[0].total_domingo,
                totales[0].total_santa_cena,
                totales[0].total_doulos,
                totales[0].total_red_discipulos,
                totales[0].total_nuevos_discipulos,
              ],
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
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
        
        <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4 bg-secondary px-3 text-light rounded" id="contenedorInformes__header">
  <div>
    <label class="form-label fw-semibold mt-1">Líder</label>
    <p class="fs-5">${informe.nombre_lider}</p>
  </div>
  <div>
    <label class="form-label fw-semibold mb-1">Coordinador</label>
    <p class="fs-5">${informe.diacono_coordinador}</p>
  </div>
  <div>
    <label class="form-label fw-semibold mb-1">Fecha de publicación</label>
    <p class="fs-5">${informe.fecha}</p>
  </div>
</div>


        <p class="mb-4">Seguimiento Semanal</p>

<div class="d-flex flex-wrap gap-2 rounded mb-4">
  <div class="form-floating" style="width: 110px;">
    <input type="text" class="form-control form-control-sm" id="asistenciaMiercoles" placeholder="Miércoles" value="${informe.asistencia_miercoles}" disabled>
    <label for="asistenciaMiercoles">Miércoles</label>
  </div>

  <div class="form-floating" style="width: 110px;">
    <input type="text" class="form-control form-control-sm" id="asistenciaViernes" placeholder="Viernes" value="${informe.asistencia_viernes}" disabled>
    <label for="asistenciaViernes">Viernes</label>
  </div>

  <div class="form-floating" style="width: 110px;">
    <input type="text" class="form-control form-control-sm" id="asistenciaSabado" placeholder="Sábado" value="${informe.asistencia_sabado}" disabled>
    <label for="asistenciaSabado">Sábado</label>
  </div>

  <div class="form-floating" style="width: 110px;">
    <input type="text" class="form-control form-control-sm" id="asistenciaDomingo" placeholder="Domingo" value="${informe.asistencia_domingo}" disabled>
    <label for="asistenciaDomingo">Domingo</label>
  </div>

  <div class="form-floating" style="width: 110px;">
    <input type="text" class="form-control form-control-sm" id="asistenciaSantaCena" placeholder="Santa Cena" value="${informe.asistencia_santa_cena}" disabled>
    <label for="asistenciaSantaCena">Santa Cena</label>
  </div>

  <div class="form-floating" style="width: 110px;">
    <input type="text" class="form-control form-control-sm" id="asistenciaDoulos" placeholder="Doulos" value="${informe.asistencia_doulos}" disabled>
    <label for="asistenciaDoulos">Doulos</label>
  </div>

  <div class="form-floating" style="width: 110px;">
    <input type="text" class="form-control form-control-sm" id="asistenciaContactado" placeholder="Contactado" value="${informe.contactado}" disabled>
    <label for="asistenciaContactado">Contactado</label>
  </div>
</div>


        <!-- Asistencia a Redes -->
<p class="mb-3">Asistencia a Redes</p>
<div class="d-flex flex-wrap gap-2 mb-4">
  <div class="form-floating" style="width: 160px;">
    <input type="text" class="form-control form-control-sm" id="redDiscipulos" placeholder="Discípulos" value="${informe.red_discipulos}" disabled>
    <label for="redDiscipulos">Discípulos</label>
  </div>
  <div class="form-floating" style="width: 160px;">
    <input type="text" class="form-control form-control-sm" id="nuevosDiscipulos" placeholder="Nuevos" value="${informe.nuevos_discipulos}" disabled>
    <label for="nuevosDiscipulos">Nuevos</label>
  </div>
  <div class="form-floating" style="width: 160px;">
    <input type="text" class="form-control form-control-sm" id="ofrenda" placeholder="Ofrenda" value="${informe.ofrenda}" disabled>
    <label for="ofrenda">Ofrenda</label>
  </div>
</div>

<!-- Asistencias Totales -->
<p class="mb-3">Asistencias Totales <span class="text-muted small">(invitados y Discípulos)</span></p>
<div class="d-flex flex-wrap gap-2 mb-4">
  <div class="form-floating" style="width: 160px;">
    <input type="text" class="form-control form-control-sm" id="totalMiercoles" placeholder="Miércoles" value="${informe.total_miercoles}" disabled>
    <label for="totalMiercoles">Miércoles</label>
  </div>
  <div class="form-floating" style="width: 160px;">
    <input type="text" class="form-control form-control-sm" id="totalViernes" placeholder="Viernes" value="${informe.total_viernes}" disabled>
    <label for="totalViernes">Viernes</label>
  </div>
  <div class="form-floating" style="width: 160px;">
    <input type="text" class="form-control form-control-sm" id="totalSabado" placeholder="Sábado" value="${informe.total_sabado}" disabled>
    <label for="totalSabado">Sábado</label>
  </div>
  <div class="form-floating" style="width: 160px;">
    <input type="text" class="form-control form-control-sm" id="totalDomingo" placeholder="Domingo" value="${informe.total_domingo}" disabled>
    <label for="totalDomingo">Domingo</label>
  </div>
</div>

        `;
        contenedorInformes.appendChild(informeDiv);
      });
    },
    renderFiltroCoordinacion(informe) {
      informe.forEach((datos_informe) => {
        const option = document.createElement("option");
        option.value = datos_informe.lider_id;
        option.textContent = datos_informe.nombre_lider;
        App.html.filtroCoordinacion.appendChild(option);
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
    },
  };
  App.init();
})();
