// ESTRUCTURA ACTUALIZADA DE COORDINACIONES Y LÍDERES
const ESTRUCTURA = {
  // COORDINACIONES Y SUS LÍDERES DIRECTOS
  COORDINACIONES: {
    "R&H": ["R&H"],
    "Akemi": ["Akemi B", "Ana B"],
    "Fede": ["Fede", "Jossuel", "Jorge", "Eliecer", "Gezer", "Eduardo", "Disham"],
    "Milena": ["Milena", "Joyce", "Ana P", "Genesis B"],
    "Tania": ["Tania"],
    "C&R": ["C&R"],
    "Isa": ["Isa"],
    "Neftali": ["Neftali"],
    "George": ["George", "Lucas"],
    "Miguel": ["Miguel"],
    "Gery": ["Gery"]
  },
  
  // DISCÍPULOS POR LÍDER
  DISCIPULOS: {
    "R&H": ["Akemi", "Isa", "Fede", "George", "Miguel", "Nef Apache", "Rocio", "Cesar", "Tania", "Gery", "Milena"],
    "Akemi B": ["Ana B"],
    "Fede": ["Jossuel", "Jorge", "Eliecer", "Gezer", "Eduardo", "Disham"],
    "Milena": ["Joyce", "Ana P", "Genesis B", "Evelyn"],
    "Tania": ["Dayana"],
    "C&R": ["Milagros", "Josue", "Yare", "Ismael", "Julia", "Ruth"],
    "Isa": ["Andy"],
    "Neftali": ["Daniel B", "Jaffet", "Daniel S", "Victor"],
    "George": ["Jose C", "Eduardo", "Lucas"],
    "Miguel": [],
    "Gery": ["Crysti", "Nicole"]
  }
};

// LISTA COMPLETA DE TODOS LOS LÍDERES QUE PUEDEN LLENAR INFORMES
const TODOS_LIDERES = [
  "R&H", "Akemi B", "Ana B", "Fede", "Jossuel", "Jorge", "Eliecer", "Gezer", 
  "Eduardo", "Disham", "Milena", "Joyce", "Ana P", "Genesis B", "Tania", 
  "C&R", "Isa", "Neftali", "George", "Lucas", "Miguel", "Gery",
  "Nef Apache"
].filter((v, i, a) => a.indexOf(v) === i);

// Función para obtener coordinación de un líder
function obtenerCoordinacion(lider) {
  for (const [coordinacion, lideres] of Object.entries(ESTRUCTURA.COORDINACIONES)) {
    if (lideres.includes(lider)) {
      return coordinacion;
    }
  }
  return "";
}

// Función para cargar discípulos
function cargarDiscipulos() {
  const lider = document.getElementById("lider").value;
  const tbody = document.querySelector("#tablaDiscipulos tbody");
  tbody.innerHTML = "";

  const coordinacion = obtenerCoordinacion(lider);
  if (coordinacion) {
    document.getElementById("coordinacion").value = coordinacion;
  }

  if (lider && ESTRUCTURA.DISCIPULOS[lider]) {
    ESTRUCTURA.DISCIPULOS[lider].forEach(nombre => {
      if (nombre.trim() !== "") {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${nombre}</td>
          <td><input type="checkbox" data-asistencia="Doulos"></td>
          <td><input type="checkbox" data-asistencia="Miércoles"></td>
          <td><input type="checkbox" data-asistencia="Viernes"></td>
          <td><input type="checkbox" data-asistencia="Sábado"></td>
          <td><input type="checkbox" data-asistencia="Domingo"></td>
          <td><input type="checkbox" data-asistencia="Santa Cena"></td>
          <td><input type="checkbox" data-asistencia="Contactado"></td>
        `;
        tbody.appendChild(row);
      }
    });
  }
}

// Función para manejar el envío del formulario (CORRECCIÓN PRINCIPAL)
document.getElementById("informeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        lider: document.getElementById("lider").value,
        coordinacion: document.getElementById("coordinacion").value,
        fecha: document.getElementById("fecha").value,
        discipulos: [],
        asistenciaRedes: {
            discipulos: parseInt(document.getElementById("redDiscipulos").value) || 0,
            nuevos: parseInt(document.getElementById("redNuevos").value) || 0,
            ofrenda: parseFloat(document.getElementById("redOfrenda").value) || 0
        },
        asistenciaIglesia: {
            miercoles: parseInt(document.getElementById("iglesiaMiercoles").value) || 0,
            viernes: parseInt(document.getElementById("iglesiaViernes").value) || 0,
            sabado: parseInt(document.getElementById("iglesiaSabado").value) || 0,
            domingo: parseInt(document.getElementById("iglesiaDomingo").value) || 0
        },
        nuevosDiscipulos: document.getElementById("nuevosDiscipulos").value.trim() === "" ? [] : 
                         document.getElementById("nuevosDiscipulos").value.split(',').map(n => n.trim()).filter(n => n !== "")
    };

    const rows = document.querySelectorAll("#tablaDiscipulos tbody tr");
    rows.forEach(row => {
        const nombre = row.cells[0].textContent;
        const asistencias = {};
        const checks = row.querySelectorAll("input[type='checkbox']");
        ["Doulos", "Miércoles", "Viernes", "Sábado", "Domingo", "Santa Cena", "Contactado"].forEach((tipo, i) => {
            asistencias[tipo] = checks[i].checked;
        });
        data.discipulos.push({ nombre, asistencias });
    });

    let informes = JSON.parse(localStorage.getItem("informes") || "[]");
    informes.push(data);
    localStorage.setItem("informes", JSON.stringify(informes));
    
    mostrarNotificacion("WAAOOO Líder! Informe guardado correctamente", "success");
    
    this.reset();
    document.querySelector("#tablaDiscipulos tbody").innerHTML = "";
});

// Funciones para ver informes
function cargarInformes() {
    const contenedor = document.getElementById("contenedorInformes");
    const totales = document.getElementById("totalesInformes");
    const filtro = document.getElementById("filtroCoordinacion");
    const informes = JSON.parse(localStorage.getItem("informes") || "[]");

    if (informes.length === 0) {
        contenedor.innerHTML = "<p>No hay informes guardados.</p>";
        totales.innerHTML = "";
        filtro.innerHTML = `
            <option value="todas">Todas</option>
            <option value="sin_informe">Quién no llenó su informe</option>
        `;
        return;
    }

    const coordinaciones = [...new Set(informes.map(i => i.coordinacion).filter(Boolean))];
    filtro.innerHTML = `
        <option value="todas">Todas</option>
        <option value="sin_informe">Quién no llenó su informe</option>
        ${coordinaciones.map(c => `<option value="${c}">${c}</option>`).join("")}
    `;

    filtrarInformes();
}

function filtrarInformes() {
    const filtro = document.getElementById("filtroCoordinacion").value;
    const informes = JSON.parse(localStorage.getItem("informes") || "[]");
    
    if (filtro === "sin_informe") {
        mostrarLideresSinInforme();
    } else {
        const filtrados = filtro === "todas" ? informes : informes.filter(i => i.coordinacion === filtro);
        mostrarInformes(filtrados);
    }
}

function mostrarLideresSinInforme() {
    const contenedor = document.getElementById("contenedorInformes");
    const totales = document.getElementById("totalesInformes");
    const informes = JSON.parse(localStorage.getItem("informes") || "[]");
    
    const lideresConInforme = [...new Set(informes.map(i => i.lider))];
    const lideresSinInforme = TODOS_LIDERES.filter(lider => !lideresConInforme.includes(lider));

    contenedor.innerHTML = `
        <div class="info-box">
            <h3><i class="fas fa-exclamation-triangle"></i> Líderes que no han llenado informes</h3>
            <ol>${lideresSinInforme.map(lider => `<li><strong>${lider}</strong></li>`).join("")}</ol>
        </div>
    `;
    
    totales.innerHTML = `
        <div class="summary-box">
            <strong>Total líderes sin informe:</strong> ${lideresSinInforme.length}
        </div>
    `;
}

function mostrarInformes(informes) {
    const contenedor = document.getElementById("contenedorInformes");
    const totales = document.getElementById("totalesInformes");
    contenedor.innerHTML = "";

    let totalRedDiscipulos = 0, totalRedNuevos = 0, totalRed = 0,
        totalMiercoles = 0, totalViernes = 0, totalSabado = 0, 
        totalDomingo = 0, totalNuevos = 0, totalOfrenda = 0,
        totalDoulos = 0, totalMiercolesD = 0, totalViernesD = 0,
        totalSabadoD = 0, totalDomingoD = 0, totalSantaCena = 0, totalContactados = 0;
    
    const lideresConInforme = [...new Set(informes.map(i => i.lider))];
    const lideresSinInforme = TODOS_LIDERES.filter(lider => !lideresConInforme.includes(lider));

    informes.forEach((inf) => {
        const totalesDiscipulos = {
            Doulos: 0,
            Miércoles: 0,
            Viernes: 0,
            Sábado: 0,
            Domingo: 0,
            "Santa Cena": 0,
            Contactado: 0
        };

        inf.discipulos.forEach(d => {
            Object.entries(d.asistencias).forEach(([tipo, valor]) => {
                if (valor) totalesDiscipulos[tipo]++;
            });
        });

        const discipulosRedes = parseInt(inf.asistenciaRedes.discipulos || 0);
        const nuevosRedes = parseInt(inf.asistenciaRedes.nuevos || 0);
        const totalRedesLider = discipulosRedes + nuevosRedes;

        totalRedDiscipulos += discipulosRedes;
        totalRedNuevos += nuevosRedes;
        totalRed = totalRedDiscipulos + totalRedNuevos;
        totalOfrenda += parseFloat(inf.asistenciaRedes.ofrenda || 0);
        totalMiercoles += parseInt(inf.asistenciaIglesia.miercoles || 0);
        totalViernes += parseInt(inf.asistenciaIglesia.viernes || 0);
        totalSabado += parseInt(inf.asistenciaIglesia.sabado || 0);
        totalDomingo += parseInt(inf.asistenciaIglesia.domingo || 0);
        totalDoulos += totalesDiscipulos.Doulos;
        totalMiercolesD += totalesDiscipulos.Miércoles;
        totalViernesD += totalesDiscipulos.Viernes;
        totalSabadoD += totalesDiscipulos.Sábado;
        totalDomingoD += totalesDiscipulos.Domingo;
        totalSantaCena += totalesDiscipulos["Santa Cena"];
        totalContactados += totalesDiscipulos.Contactado;
        totalNuevos += inf.nuevosDiscipulos.length;

        const div = document.createElement("div");
        div.className = "informe-item";
        div.innerHTML = `
            <div class="informe-header">
                <h4>${inf.lider}</h4>
                <span class="informe-meta">${inf.coordinacion} • ${formatFecha(inf.fecha)}</span>
            </div>
            
            <div class="informe-content">
                <div class="informe-row">
                    <span class="informe-label">Asistencia a Redes:</span>
                    <span class="informe-value">${discipulosRedes} discípulos + ${nuevosRedes} nuevos = <strong>${totalRedesLider} total</strong></span>
                </div>
                
                <div class="informe-row ofrenda">
                    <span class="informe-label">Ofrenda:</span>
                    <span class="informe-value">$${parseFloat(inf.asistenciaRedes.ofrenda || 0).toFixed(2)}</span>
                </div>
                
                <div class="informe-row">
                    <span class="informe-label">Asistencia a Iglesia:</span>
                    <span class="informe-value">
                        Miér: ${inf.asistenciaIglesia.miercoles || 0} | 
                        Vie: ${inf.asistenciaIglesia.viernes || 0} | 
                        Sáb: ${inf.asistenciaIglesia.sabado || 0} | 
                        Dom: ${inf.asistenciaIglesia.domingo || 0}
                    </span>
                </div>
                
                ${inf.nuevosDiscipulos.length > 0 ? `
                <div class="informe-row">
                    <span class="informe-label">Nuevos Discípulos:</span>
                    <span class="informe-value">${inf.nuevosDiscipulos.join(", ")}</span>
                </div>
                ` : ''}
                
                <details class="informe-details">
                    <summary><i class="fas fa-users"></i> Ver detalles de discípulos</summary>
                    <ul class="discipulos-list">
                        ${inf.discipulos.map(d => `
                        <li>
                            <strong>${d.nombre}:</strong>
                            ${Object.entries(d.asistencias)
                                .filter(([k,v]) => v)
                                .map(([k]) => k)
                                .join(", ")}
                        </li>
                        `).join("")}
                    </ul>
                </details>
            </div>
        `;
        contenedor.appendChild(div);
    });

    let htmlTotales = `
        <div class="totales-box">
            <h4><i class="fas fa-chart-bar"></i> Resumen General</h4>
            
            <div class="totales-grid">
                <div class="totales-item">
                    <span class="totales-label">Redes (Total):</span>
                    <span class="totales-value">${totalRed} <small>(${totalRedDiscipulos} + ${totalRedNuevos})</small></span>
                </div>
                
                <div class="totales-item">
                    <span class="totales-label">Ofrenda Total:</span>
                    <span class="totales-value ofrenda">$${totalOfrenda.toFixed(2)}</span>
                </div>
                
                <div class="totales-item">
                    <span class="totales-label">Iglesia Miér:</span>
                    <span class="totales-value">${totalMiercoles}</span>
                </div>
                
                <div class="totales-item">
                    <span class="totales-label">Iglesia Vie:</span>
                    <span class="totales-value">${totalViernes}</span>
                </div>
                
                <div class="totales-item">
                    <span class="totales-label">Iglesia Sáb:</span>
                    <span class="totales-value">${totalSabado}</span>
                </div>
                
                <div class="totales-item">
                    <span class="totales-label">Iglesia Dom:</span>
                    <span class="totales-value">${totalDomingo}</span>
                </div>
                
                <div class="totales-item">
                    <span class="totales-label">Nuevos Disc.:</span>
                    <span class="totales-value">${totalNuevos}</span>
                </div>
            </div>
    `;

    const filtro = document.getElementById("filtroCoordinacion").value;
    if (filtro === "todas" && lideresSinInforme.length > 0) {
        htmlTotales += `
            <div class="totales-alert">
                <i class="fas fa-info-circle"></i> Hay ${lideresSinInforme.length} líderes sin informe
            </div>
        `;
    }

    htmlTotales += `</div>`;
    totales.innerHTML = htmlTotales;
}

function exportarExcel() {
    const informes = JSON.parse(localStorage.getItem("informes") || "[]");
    
    const headers = [
        "No.", "Líder", "Coordinación", "Fecha",
        "Discípulos en Redes", "Nuevos en Redes", "Total Redes (D+N)", "Ofrenda ($)",
        "Asistencia Miércoles", "Asistencia Viernes", 
        "Asistencia Sábado", "Asistencia Domingo",
        "Total Doulos", "Total Miércoles", "Total Viernes",
        "Total Sábado", "Total Domingo", "Total Santa Cena",
        "Total Contactados", "Nuevos Discípulos"
    ];

    let totalRedDiscipulos = 0, totalRedNuevos = 0, totalRed = 0,
        totalMiercoles = 0, totalViernes = 0, totalSabado = 0, 
        totalDomingo = 0, totalNuevos = 0, totalOfrenda = 0,
        totalDoulos = 0, totalMiercolesD = 0, totalViernesD = 0,
        totalSabadoD = 0, totalDomingoD = 0, totalSantaCena = 0, totalContactados = 0;

    const rows = informes.map((inf, index) => {
        const totales = {
            Doulos: 0,
            Miércoles: 0,
            Viernes: 0,
            Sábado: 0,
            Domingo: 0,
            "Santa Cena": 0,
            Contactado: 0
        };

        inf.discipulos.forEach(d => {
            Object.entries(d.asistencias).forEach(([tipo, valor]) => {
                if (valor) totales[tipo]++;
            });
        });

        const totalRedesLider = parseInt(inf.asistenciaRedes.discipulos || 0) + parseInt(inf.asistenciaRedes.nuevos || 0);

        totalRedDiscipulos += parseInt(inf.asistenciaRedes.discipulos || 0);
        totalRedNuevos += parseInt(inf.asistenciaRedes.nuevos || 0);
        totalRed = totalRedDiscipulos + totalRedNuevos;
        totalOfrenda += parseFloat(inf.asistenciaRedes.ofrenda || 0);
        totalMiercoles += parseInt(inf.asistenciaIglesia.miercoles || 0);
        totalViernes += parseInt(inf.asistenciaIglesia.viernes || 0);
        totalSabado += parseInt(inf.asistenciaIglesia.sabado || 0);
        totalDomingo += parseInt(inf.asistenciaIglesia.domingo || 0);
        totalDoulos += totales.Doulos;
        totalMiercolesD += totales.Miércoles;
        totalViernesD += totales.Viernes;
        totalSabadoD += totales.Sábado;
        totalDomingoD += totales.Domingo;
        totalSantaCena += totales["Santa Cena"];
        totalContactados += totales.Contactado;
        totalNuevos += inf.nuevosDiscipulos.length;

        return [
            index + 1,
            `"${inf.lider}"`,
            `"${inf.coordinacion}"`,
            `"${formatFecha(inf.fecha)}"`,
            inf.asistenciaRedes.discipulos || "0",
            inf.asistenciaRedes.nuevos || "0",
            totalRedesLider,
            parseFloat(inf.asistenciaRedes.ofrenda || 0).toFixed(2),
            inf.asistenciaIglesia.miercoles || "0",
            inf.asistenciaIglesia.viernes || "0",
            inf.asistenciaIglesia.sabado || "0",
            inf.asistenciaIglesia.domingo || "0",
            totales.Doulos,
            totales.Miércoles,
            totales.Viernes,
            totales.Sábado,
            totales.Domingo,
            totales["Santa Cena"],
            totales.Contactado,
            `"${inf.nuevosDiscipulos.join(", ") || "Ninguno"}"`
        ];
    });

    const totalesRow = [
        "TOTALES",
        "", "", "",
        totalRedDiscipulos,
        totalRedNuevos,
        totalRed,
        totalOfrenda.toFixed(2),
        totalMiercoles,
        totalViernes,
        totalSabado,
        totalDomingo,
        totalDoulos,
        totalMiercolesD,
        totalViernesD,
        totalSabadoD,
        totalDomingoD,
        totalSantaCena,
        totalContactados,
        `"${totalNuevos} nuevos en total"`
    ];

    let csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(",")),
        "",
        "Resumen General,,,", 
        `Total Redes (Discípulos + Nuevos),${totalRed}`,
        `Total Ofrenda,$${totalOfrenda.toFixed(2)}`,
        `Total Asistencia Miércoles,${totalMiercoles}`,
        `Total Asistencia Viernes,${totalViernes}`,
        `Total Asistencia Sábado,${totalSabado}`,
        `Total Asistencia Domingo,${totalDomingo}`,
        `Total Nuevos Discípulos,${totalNuevos}`
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Informes_Lideres_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatFecha(fechaStr) {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function borrarInformes() {
    if (confirm("¿Estás seguro de borrar todos los informes? Esta acción no se puede deshacer.")) {
        localStorage.removeItem("informes");
        mostrarNotificacion("Todos los informes han sido borrados", "warning");
        cargarInformes();
    }
}

function mostrarNotificacion(mensaje, tipo = "info") {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add("mostrar");
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove("mostrar");
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 500);
    }, 3000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Llenar select de líderes
    const selectLider = document.getElementById("lider");
    selectLider.innerHTML = '<option value="">Seleccione un líder</option>';
    
    TODOS_LIDERES.forEach(lider => {
        const option = document.createElement("option");
        option.value = lider;
        option.textContent = lider;
        selectLider.appendChild(option);
    });

    // Llenar select de coordinaciones
    const selectCoordinacion = document.getElementById("coordinacion");
    selectCoordinacion.innerHTML = '<option value="">Seleccione una coordinación</option>';
    
    Object.keys(ESTRUCTURA.COORDINACIONES).forEach(coordinacion => {
        const option = document.createElement("option");
        option.value = coordinacion;
        option.textContent = coordinacion;
        selectCoordinacion.appendChild(option);
    });

    // Establecer fecha actual
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    
    // Mejorar selects en móviles
    if ('ontouchstart' in window) {
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('focus', function() {
                this.size = 5;
            });
            select.addEventListener('blur', function() {
                this.size = 1;
            });
        });
    }
});