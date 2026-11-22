// =========================================================================
// FRONTEND APP.JS — JÓVENES EN ACCIÓN 4 · CARCHI (VERSIÓN V12 - REV 5)
// =========================================================================

const API_URL = 'https://script.google.com/macros/s/AKfycbxqPXZgf_m5RBI8vZQTBmMjqP0comWW6mQDP1CqRpRnsj57aMO2WM-9v0-dv94rTYnJ8A/exec';
const TOKEN_SEGURIDAD = 'JEA4Carchi2026';

let registroActual = null;
let fotoBase64 = '';
let fotoMime = 'image/jpeg';

let certBase64 = '';
let certMime = 'image/jpeg';

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

// Elementos Sección 3: Certificados (Solo Imagen Comprimida)
const seccionCertificados = document.getElementById('seccionCertificados');
const formCertificado = document.getElementById('formCertificado');
const selectPlataformaCert = document.getElementById('selectPlataformaCert');
const selectSemanaCert = document.getElementById('selectSemanaCert');
const inputNombreCurso = document.getElementById('inputNombreCurso');
const inputCertCamara = document.getElementById('inputCertCamara');
const inputArchivoCertificado = document.getElementById('inputArchivoCertificado');
const previewCertContainer = document.getElementById('previewCertContainer');
const imgCertPreview = document.getElementById('imgCertPreview');
const lblInfoPesoCert = document.getElementById('lblInfoPesoCert');
const btnQuitarCert = document.getElementById('btnQuitarCert');
const btnSubirCertificado = document.getElementById('btnSubirCertificado');
const mensajeCertificado = document.getElementById('mensajeCertificado');

// Filtrar solo dígitos en cédula
inputCedula.addEventListener('input', () => {
  inputCedula.value = inputCedula.value.replace(/\D/g, '').slice(0, 10);
});

// Mostrar u ocultar "¿Dónde estudia?"
function actualizarVisibilidadDondeEstudia() {
  if (!selectEstudia || !grupoDondeEstudia || !inputDondeEstudia) return;

  if (selectEstudia.value === 'Sí') {
    grupoDondeEstudia.classList.remove('hidden');
    grupoDondeEstudia.style.display = 'block';
    inputDondeEstudia.required = true;
  } else {
    grupoDondeEstudia.classList.add('hidden');
    grupoDondeEstudia.style.display = 'none';
    inputDondeEstudia.required = false;
    inputDondeEstudia.value = '';
  }
}

selectEstudia.addEventListener('change', actualizarVisibilidadDondeEstudia);

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
  ocultarAlerta(mensajeCertificado);
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
  limpiarCertificado();
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
    grupoDondeEstudia.style.display = 'none';
    inputDondeEstudia.required = false;
    subtituloFormulario.textContent =
      'Tus datos base ya fueron confirmados. Sube aquí tu nueva fotografía de asistencia o evidencia.';
    btnGuardar.textContent = 'Subir Nueva Evidencia Fotográfica';

    // Desbloquear sección de certificados
    seccionCertificados.classList.remove('hidden');
  } else {
    badgeEstado.textContent = 'Pendiente de Confirmar';
    badgeEstado.className = 'badge badge-pending';
    bloqueActualizacionDatos.classList.remove('hidden');
    selectEstudia.required = true;
    selectSubtutor.required = true;
    selectEstudia.value = '';
    selectSubtutor.value = '';
    actualizarVisibilidadDondeEstudia();
    subtituloFormulario.textContent =
      'Confirma si estudias actualmente, verifica tu subtutor y adjunta tu fotografía de asistencia.';
    btnGuardar.textContent = 'Guardar Registro y Subir Evidencia';

    // Bloqueada hasta que complete su primer registro
    seccionCertificados.classList.add('hidden');
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

// Función genérica de compresión de imágenes (para ahorro de espacio)
function comprimirImagen(file, maxWidth, calidad, callbackOk, callbackError) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    callbackError('Formato no permitido. Selecciona únicamente una fotografía o captura de pantalla (JPG/PNG), no PDF.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', calidad);
      const base64 = dataUrl.split(',')[1];
      const pesoKb = Math.round((base64.length * 3) / 4 / 1024);

      callbackOk({
        dataUrl: dataUrl,
        base64: base64,
        mime: 'image/jpeg',
        pesoKb: pesoKb
      });
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// Procesamiento de foto de asistencia
function manejarFotoAsistencia(file) {
  comprimirImagen(
    file,
    1200,
    0.80,
    (res) => {
      fotoBase64 = res.base64;
      fotoMime = res.mime;
      imgPreview.src = res.dataUrl;
      previewContainer.classList.remove('hidden');
      ocultarAlerta(mensajeGuardado);
    },
    (errMsg) => mostrarAlerta(mensajeGuardado, errMsg, 'error')
  );
}

inputFotoCamara.addEventListener('change', (e) => manejarFotoAsistencia(e.target.files[0]));
inputFotoGaleria.addEventListener('change', (e) => manejarFotoAsistencia(e.target.files[0]));
btnQuitarFoto.addEventListener('click', limpiarFoto);

function limpiarFoto() {
  fotoBase64 = '';
  inputFotoCamara.value = '';
  inputFotoGaleria.value = '';
  imgPreview.src = '';
  previewContainer.classList.add('hidden');
}

// Enviar formulario de asistencia y desbloquear certificados
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
      '✓ ¡Registro guardado con éxito! Se ha desbloqueado abajo la Sección 3 para que subas las fotos de tus certificados.',
      'success'
    );

    const respReload = await fetch(`${API_URL}?action=buscar&cedula=${encodeURIComponent(registroActual.cedula)}&_t=${Date.now()}`);
    const dataReload = await respReload.json();
    if (dataReload.ok && dataReload.encontrado) {
      registroActual = dataReload.registro;
      renderizarFichaJoven(registroActual);
    } else {
      limpiarFoto();
    }
    seccionCertificados.classList.remove('hidden');
    seccionCertificados.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// =========================================================================
// SECCIÓN 3: CARGA DE CERTIFICADOS (ÚNICAMENTE IMAGEN COMPRIMIDA)
// =========================================================================

function manejarFotoCertificado(file) {
  comprimirImagen(
    file,
    1200,
    0.78,
    (res) => {
      certBase64 = res.base64;
      certMime = res.mime;
      imgCertPreview.src = res.dataUrl;
      lblInfoPesoCert.textContent = `✓ Imagen optimizada (${res.pesoKb} KB)`;
      previewCertContainer.classList.remove('hidden');
      ocultarAlerta(mensajeCertificado);
    },
    (errMsg) => {
      limpiarCertificado();
      mostrarAlerta(mensajeCertificado, errMsg, 'error');
    }
  );
}

inputCertCamara.addEventListener('change', (e) => manejarFotoCertificado(e.target.files[0]));
inputArchivoCertificado.addEventListener('change', (e) => manejarFotoCertificado(e.target.files[0]));
btnQuitarCert.addEventListener('click', limpiarCertificado);

function limpiarCertificado() {
  certBase64 = '';
  certMime = 'image/jpeg';
  inputCertCamara.value = '';
  inputArchivoCertificado.value = '';
  imgCertPreview.src = '';
  previewCertContainer.classList.add('hidden');
}

formCertificado.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!registroActual) return;

  const plataforma = selectPlataformaCert.value.trim();
  const semana = selectSemanaCert.value.trim();
  const curso = inputNombreCurso.value.trim();

  if (!plataforma) {
    mostrarAlerta(mensajeCertificado, 'Selecciona la plataforma donde realizaste el curso.', 'error');
    return;
  }
  if (!semana) {
    mostrarAlerta(mensajeCertificado, 'Selecciona la semana de entrega.', 'error');
    return;
  }
  if (!curso) {
    mostrarAlerta(mensajeCertificado, 'Escribe el nombre del curso aprobado.', 'error');
    return;
  }
  if (!certBase64) {
    mostrarAlerta(mensajeCertificado, 'Toma una foto o sube una captura de pantalla de tu certificado.', 'error');
    return;
  }

  btnSubirCertificado.disabled = true;
  btnSubirCertificado.textContent = 'Subiendo foto de certificado...';
  ocultarAlerta(mensajeCertificado);

  try {
    const payload = {
      token: TOKEN_SEGURIDAD,
      action: 'registrar',
      tipoEvidencia: 'CERTIFICADO',
      cedula: registroActual.cedula,
      tutorGeneral: registroActual.tutorGeneral,
      actualizarDatos: false,
      estudia: registroActual.estudia,
      subtutor: registroActual.subtutor,
      cantonUbicado: registroActual.hojaOrigen,
      observacion: `CERTIFICADO [${plataforma}] (${semana}): ${curso}`,
      selfieBase64: certBase64,
      selfieMime: certMime
    };

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    if (!data.ok) {
      mostrarAlerta(mensajeCertificado, data.error || 'No se pudo subir el certificado.', 'error');
      return;
    }

    mostrarAlerta(
      mensajeCertificado,
      `✓ ¡Certificado "${curso}" (${plataforma} · ${semana}) guardado como imagen ligera! Ya puedes subir tu siguiente certificado.`,
      'success'
    );
    inputNombreCurso.value = '';
    limpiarCertificado();
  } catch (err) {
    mostrarAlerta(
      mensajeCertificado,
      'Error de conexión al enviar el certificado. Verifica tu señal e inténtalo nuevamente.',
      'error'
    );
  } finally {
    btnSubirCertificado.disabled = false;
    btnSubirCertificado.textContent = '📤 Subir Foto de Certificado';
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
