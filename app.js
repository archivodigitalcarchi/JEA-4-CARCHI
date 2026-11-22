// =========================================================================
// FRONTEND APP.JS — JÓVENES EN ACCIÓN 4 · CARCHI (VERSIÓN V12)
// =========================================================================

const API_URL = 'https://script.google.com/macros/s/AKfycbxqPXZgf_m5RBI8vZQTBmMjqP0comWW6mQDP1CqRpRnsj57aMO2WM-9v0-dv94rTYnJ8A/exec';
const TOKEN_SEGURIDAD = 'JEA4Carchi2026';

let registroActual = null;
let fotoBase64 = '';
let fotoMime = 'image/jpeg';

// Elementos del DOM
const formBuscar = document.getElementById('formBuscar');
const inputCedula = document.getElementById('inputCedula');
const btnBuscar = document.getElementById('btnBuscar');
const mensajeBusqueda = document.getElementById('mensajeBusqueda');
const seccionResultado = document.getElementById('seccionResultado');

const lblNombre = document.getElementById('lblNombre');
const badgeEstado = document.getElementById('badgeEstado');
const bannerFechaConvocatoria = document.getElementById('bannerFechaConvocatoria');
const lblFechaConvocatoria = document.getElementById('lblFechaConvocatoria');
const lblCedula = document.getElementById('lblCedula');
const lblCanton = document.getElementById('lblCanton');
const lblHojaActual = document.getElementById('lblHojaActual');
const lblTutor = document.getElementById('lblTutor');
const lblHorario = document.getElementById('lblHorario');
const lblGrupoApoyo = document.getElementById('lblGrupoApoyo');
const lblSubtutorActual = document.getElementById('lblSubtutorActual');
const lblEstudiaActual = document.getElementById('lblEstudiaActual');

const btnToggleAdmin = document.getElementById('btnToggleAdmin');
const boxAdminReasignar = document.getElementById('boxAdminReasignar');
const selectNuevaHoja = document.getElementById('selectNuevaHoja');
const inputPinAdmin = document.getElementById('inputPinAdmin');
const btnEjecutarTraslado = document.getElementById('btnEjecutarTraslado');
const mensajeAdmin = document.getElementById('mensajeAdmin');

const formRegistro = document.getElementById('formRegistro');
const bloqueActualizacionDatos = document.getElementById('bloqueActualizacionDatos');
const subtituloFormulario = document.getElementById('subtituloFormulario');
const selectEstudia = document.getElementById('selectEstudia');
const grupoDondeEstudia = document.getElementById('grupoDondeEstudia');
const inputDondeEstudia = document.getElementById('inputDondeEstudia');
const selectSubtutor = document.getElementById('selectSubtutor');
const grupoCantonUbicacion = document.getElementById('grupoCantonUbicacion');
const selectCantonUbicado = document.getElementById('selectCantonUbicado');
const inputObservacion = document.getElementById('inputObservacion');

const inputFotoCamara = document.getElementById('inputFotoCamara');
const inputFotoGaleria = document.getElementById('inputFotoGaleria');
const previewContainer = document.getElementById('previewContainer');
const imgPreview = document.getElementById('imgPreview');
const btnQuitarFoto = document.getElementById('btnQuitarFoto');
const btnGuardar = document.getElementById('btnGuardar');
const mensajeGuardado = document.getElementById('mensajeGuardado');

// Filtrar solo dígitos en cédula
inputCedula.addEventListener('input', () => {
  inputCedula.value = inputCedula.value.replace(/\D/g, '').slice(0, 10);
});

// Desplegar "¿Dónde estudia?" al elegir "Sí"
selectEstudia.addEventListener('change', () => {
  if (selectEstudia.value === 'Sí') {
    grupoDondeEstudia.classList.remove('hidden');
    inputDondeEstudia.required = true;
  } else {
    grupoDondeEstudia.classList.add('hidden');
    inputDondeEstudia.required = false;
    inputDondeEstudia.value = '';
  }
});

// Buscar cédula
formBuscar.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cedula = inputCedula.value.trim();

  if (!/^[0-9]{10}$/.test(cedula)) {
    mostrarAlerta(mensajeBusqueda, 'Ingresa un número de cédula válido de 10 dígitos.', 'error');
    return;
  }

  ocultarAlerta(mensajeBusqueda);
  ocultarAlerta(mensajeGuardado);
  ocultarAlerta(mensajeAdmin);
  seccionResultado.classList.add('hidden');

  btnBuscar.disabled = true;
  btnBuscar.textContent = 'Buscando...';

  try {
    const url = `${API_URL}?action=buscar&cedula=${encodeURIComponent(cedula)}&_t=${Date.now()}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!data.ok) {
      mostrarAlerta(mensajeBusqueda, data.error || 'Error al consultar el registro.', 'error');
      return;
    }

    if (!data.encontrado) {
      mostrarAlerta(
        mensajeBusqueda,
        `No se encontró ningún beneficiario con la cédula ${cedula} en la Base Maestra V12.`,
        'error'
      );
      return;
    }

    registroActual = data.registro;
    renderizarFichaJoven(registroActual);
    seccionResultado.classList.remove('hidden');
  } catch (err) {
    mostrarAlerta(
      mensajeBusqueda,
      'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
      'error'
    );
  } finally {
    btnBuscar.disabled = false;
    btnBuscar.textContent = 'Buscar Registro';
  }
});

// Renderizar ficha del joven
function renderizarFichaJoven(reg) {
  lblNombre.textContent = reg.nombre || '—';
  lblCedula.textContent = reg.cedula || '—';
  lblCanton.textContent = reg.canton || '—';
  lblHojaActual.textContent = reg.hojaOrigen || '—';
  lblTutor.textContent = reg.tutorGeneral || '—';
  lblHorario.textContent = reg.horario || 'Por confirmar';
  lblGrupoApoyo.textContent = reg.grupoApoyo || '—';
  lblSubtutorActual.textContent = reg.subtutor || 'Sin asignar';
  lblEstudiaActual.textContent = reg.estudia || 'Por confirmar';

  if (reg.fechaConvocatoria) {
    lblFechaConvocatoria.textContent = reg.fechaConvocatoria;
    bannerFechaConvocatoria.classList.remove('hidden');
  } else {
    bannerFechaConvocatoria.classList.add('hidden');
  }

  limpiarFoto();
  inputObservacion.value = '';

  const esSinUbicacion = reg.hojaOrigen === 'No Presentados' || reg.hojaOrigen === 'Sin Cantón';
  if (esSinUbicacion) {
    grupoCantonUbicacion.classList.remove('hidden');
    selectCantonUbicado.required = true;
  } else {
    grupoCantonUbicacion.classList.add('hidden');
    selectCantonUbicado.required = false;
    selectCantonUbicado.value = '';
  }

  if (reg.yaActualizo) {
    badgeEstado.textContent = 'Datos Confirmados';
    badgeEstado.className = 'badge badge-done';
    bloqueActualizacionDatos.classList.add('hidden');
    selectEstudia.required = false;
    selectSubtutor.required = false;
    grupoDondeEstudia.classList.add('hidden');
    inputDondeEstudia.required = false;
    subtituloFormulario.textContent =
      'Tus datos base ya fueron confirmados. Sube aquí tu nueva fotografía de asistencia o evidencia.';
    btnGuardar.textContent = 'Subir Nueva Evidencia Fotográfica';
  } else {
    badgeEstado.textContent = 'Pendiente de Confirmar';
    badgeEstado.className = 'badge badge-pending';
    bloqueActualizacionDatos.classList.remove('hidden');
    selectEstudia.required = true;
    selectSubtutor.required = true;
    selectEstudia.value = '';
    selectSubtutor.value = '';
    grupoDondeEstudia.classList.add('hidden');
    inputDondeEstudia.required = false;
    inputDondeEstudia.value = '';
    subtituloFormulario.textContent =
      'Confirma si estudias actualmente, verifica tu subtutor y adjunta tu fotografía de asistencia.';
    btnGuardar.textContent = 'Guardar Registro y Subir Evidencia';
  }
}

// Panel administrativo de traslado (PIN 2026)
btnToggleAdmin.addEventListener('click', () => {
  boxAdminReasignar.classList.toggle('hidden');
  ocultarAlerta(mensajeAdmin);
});

btnEjecutarTraslado.addEventListener('click', async () => {
  if (!registroActual) return;
  const nuevaHoja = selectNuevaHoja.value.trim();
  const pin = inputPinAdmin.value.trim();

  if (!nuevaHoja) {
    mostrarAlerta(mensajeAdmin, 'Selecciona la pestaña o grupo de destino.', 'error');
    return;
  }
  if (!pin) {
    mostrarAlerta(mensajeAdmin, 'Ingresa el PIN de tutor para autorizar el traslado.', 'error');
    return;
  }

  btnEjecutarTraslado.disabled = true;
  btnEjecutarTraslado.textContent = 'Trasladando...';
  ocultarAlerta(mensajeAdmin);

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        token: TOKEN_SEGURIDAD,
        action: 'reasignar_hoja',
        cedula: registroActual.cedula,
        nuevaHoja: nuevaHoja,
        pin: pin
      })
    });

    const data = await resp.json();
    if (!data.ok) {
      mostrarAlerta(mensajeAdmin, data.error || 'No se pudo completar el traslado.', 'error');
      return;
    }

    if (data.registro) {
      registroActual = data.registro;
      renderizarFichaJoven(registroActual);
    }
    inputPinAdmin.value = '';
    selectNuevaHoja.value = '';
    mostrarAlerta(
      mensajeAdmin,
      `✓ Registro trasladado correctamente a "${data.hojaDestino}".`,
      'success'
    );
  } catch (err) {
    mostrarAlerta(mensajeAdmin, 'Error de red al intentar trasladar el registro.', 'error');
  } finally {
    btnEjecutarTraslado.disabled = false;
    btnEjecutarTraslado.textContent = 'Ejecutar Traslado';
  }
});

// Procesamiento y compresión de imagen
function manejarArchivoImagen(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    mostrarAlerta(mensajeGuardado, 'Por favor selecciona un archivo de imagen válido.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 1200;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      fotoBase64 = dataUrl.split(',')[1];
      fotoMime = 'image/jpeg';

      imgPreview.src = dataUrl;
      previewContainer.classList.remove('hidden');
      ocultarAlerta(mensajeGuardado);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

inputFotoCamara.addEventListener('change', (e) => manejarArchivoImagen(e.target.files[0]));
inputFotoGaleria.addEventListener('change', (e) => manejarArchivoImagen(e.target.files[0]));

btnQuitarFoto.addEventListener('click', limpiarFoto);

function limpiarFoto() {
  fotoBase64 = '';
  inputFotoCamara.value = '';
  inputFotoGaleria.value = '';
  imgPreview.src = '';
  previewContainer.classList.add('hidden');
}

// Enviar formulario y subir evidencia
formRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!registroActual) return;

  if (!fotoBase64) {
    mostrarAlerta(mensajeGuardado, 'Debes tomar o subir una fotografía de evidencia antes de guardar.', 'error');
    return;
  }

  const actualizarDatos = !registroActual.yaActualizo;
  if (actualizarDatos) {
    if (!selectEstudia.value) {
      mostrarAlerta(mensajeGuardado, 'Selecciona si estudias actualmente.', 'error');
      return;
    }
    if (selectEstudia.value === 'Sí' && !inputDondeEstudia.value.trim()) {
      mostrarAlerta(mensajeGuardado, 'Escribe el nombre de la institución educativa donde estudias.', 'error');
      return;
    }
    if (!selectSubtutor.value) {
      mostrarAlerta(mensajeGuardado, 'Selecciona la opción de Subtutor / Reasignación.', 'error');
      return;
    }
    if (selectCantonUbicado.required && !selectCantonUbicado.value) {
      mostrarAlerta(mensajeGuardado, 'Selecciona el cantón donde realizas actividades.', 'error');
      return;
    }
  }

  btnGuardar.disabled = true;
  btnGuardar.textContent = 'Guardando y subiendo foto...';
  ocultarAlerta(mensajeGuardado);

  const textoDondeEstudia = actualizarDatos && selectEstudia.value === 'Sí'
    ? inputDondeEstudia.value.trim()
    : '';

  const observacionFinal = [
    textoDondeEstudia ? `Estudia en: ${textoDondeEstudia}` : '',
    inputObservacion.value.trim()
  ].filter(Boolean).join(' | ');

  try {
    const payload = {
      token: TOKEN_SEGURIDAD,
      action: 'registrar',
      cedula: registroActual.cedula,
      tutorGeneral: registroActual.tutorGeneral,
      actualizarDatos: actualizarDatos,
      estudia: actualizarDatos ? selectEstudia.value : registroActual.estudia,
      dondeEstudia: textoDondeEstudia,
      subtutor: actualizarDatos ? selectSubtutor.value : registroActual.subtutor,
      cantonUbicado: selectCantonUbicado.value || registroActual.hojaOrigen,
      observacion: observacionFinal,
      selfieBase64: fotoBase64,
      selfieMime: fotoMime
    };

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    if (!data.ok) {
      mostrarAlerta(mensajeGuardado, data.error || 'Ocurrió un error al guardar.', 'error');
      return;
    }

    mostrarAlerta(
      mensajeGuardado,
      `✓ ¡Registro guardado con éxito! Evidencia archivada como ${registroActual.cedula}.jpg en la carpeta de ${registroActual.tutorGeneral}.`,
      'success'
    );

    // Recargar ficha actualizada
    const respReload = await fetch(`${API_URL}?action=buscar&cedula=${encodeURIComponent(registroActual.cedula)}&_t=${Date.now()}`);
    const dataReload = await respReload.json();
    if (dataReload.ok && dataReload.encontrado) {
      registroActual = dataReload.registro;
      renderizarFichaJoven(registroActual);
    } else {
      limpiarFoto();
    }
  } catch (err) {
    mostrarAlerta(
      mensajeGuardado,
      'Error de conexión al enviar los datos. Verifica tu señal e inténtalo nuevamente.',
      'error'
    );
  } finally {
    btnGuardar.disabled = false;
    btnGuardar.textContent = registroActual && registroActual.yaActualizo
      ? 'Subir Nueva Evidencia Fotográfica'
      : 'Guardar Registro y Subir Evidencia';
  }
});

// Utilidades de alertas
function mostrarAlerta(el, texto, tipo) {
  el.textContent = texto;
  el.className = `alert alert-${tipo}`;
  el.classList.remove('hidden');
}

function ocultarAlerta(el) {
  el.classList.add('hidden');
  el.textContent = '';
}
