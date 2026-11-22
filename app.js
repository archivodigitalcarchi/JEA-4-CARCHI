// ============================================================
// CONFIGURA ESTO con la URL de tu Apps Script ya publicado
// ============================================================
const API_URL = 'https://script.google.com/macros/s/AKfycby9nJ5fIwNPqOOHBPkfSASv8ewkQpOJETGo5Nun73RGBM0c9bU9pEPcbLHXcZQHY7Xj/exec';
const TOKEN = 'JEA4Carchi2026'; // debe ser igual al TOKEN en Codigo.gs

// ---- Estado ----
let currentStep = 1;
let registro = null; // datos del joven encontrado
let selfieBase64 = null;
let selfieMime = 'image/jpeg';
let searching = false;
let submitting = false;

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------
// Navegación entre pasos
// ---------------------------------------------------------------
const STEP_META = {
  1: { title: 'Buscar tu registro', label: 'Paso 1 de 3 — Consulta tu cédula' },
  2: { title: 'Tus datos actuales', label: 'Paso 2 de 3 — Verifica tu ficha' },
  3: { title: 'Evidencia y estado', label: 'Paso 3 de 3 — Registro y fotografía' },
};

function goToStep(n) {
  currentStep = n;
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  if (n <= 3) {
    $(`screen-${n}`).classList.add('active');
    $('headerTitle').textContent = STEP_META[n].title;
    $('stepLabel').textContent = STEP_META[n].label;
    document.querySelectorAll('.step-dot').forEach((d) => {
      const step = Number(d.dataset.step);
      d.classList.toggle('active', step === n);
      d.classList.toggle('done', step < n);
    });
  } else {
    $('screen-success').classList.add('active');
    $('headerTitle').textContent = 'Envío completado';
    $('stepLabel').textContent = 'Proceso finalizado ✓';
  }
  renderFooter();
  window.scrollTo(0, 0);
}

function renderFooter() {
  const inner = $('footerInner');
  inner.innerHTML = '';

  if (currentStep === 1) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.id = 'btnBuscar';
    btn.textContent = 'Buscar';
    btn.addEventListener('click', onBuscar);
    inner.appendChild(btn);
  }

  if (currentStep === 2) {
    const back = document.createElement('button');
    back.className = 'btn btn-ghost';
    back.textContent = 'Volver';
    back.addEventListener('click', () => goToStep(1));

    const next = document.createElement('button');
    next.className = 'btn btn-primary';
    next.textContent = registro && registro.yaActualizo ? 'Subir evidencia' : 'Continuar';
    next.addEventListener('click', () => goToStep(3));

    inner.appendChild(back);
    inner.appendChild(next);
  }

  if (currentStep === 3) {
    const back = document.createElement('button');
    back.className = 'btn btn-ghost';
    back.textContent = 'Volver';
    back.addEventListener('click', () => goToStep(2));

    const send = document.createElement('button');
    send.className = 'btn btn-primary';
    send.id = 'btnEnviar';
    send.textContent = registro && registro.yaActualizo ? 'Enviar evidencia' : 'Guardar y enviar';
    send.addEventListener('click', onEnviar);

    inner.appendChild(back);
    inner.appendChild(send);
  }

  if (currentStep > 3) {
    const again = document.createElement('button');
    again.className = 'btn btn-primary';
    again.textContent = 'Consultar otra cédula';
    again.addEventListener('click', resetAll);
    inner.appendChild(again);
  }
}

function resetAll() {
  registro = null;
  selfieBase64 = null;
  $('cedulaInput').value = '';
  $('selfiePreview').classList.remove('show');
  $('selfieStatus').textContent = 'Aún no se ha seleccionado la foto';
  document.querySelectorAll('#estudiaRadioGroup input').forEach((r) => (r.checked = false));
  $('dondeEstudia').value = '';
  $('institucionNombre').value = '';
  $('subtutorReasignacion').value = '';
  $('cantonUbicado').value = '';
  $('observacionFoto').value = '';
  $('bloqueDondeEstudia').style.display = 'none';
  hideAlert('searchError');
  hideAlert('searchInfo');
  hideAlert('formError');
  goToStep(1);
}

// ---------------------------------------------------------------
// Alertas
// ---------------------------------------------------------------
function showAlert(id, msg) {
  const el = $(id);
  el.textContent = msg;
  el.classList.add('show');
}
function hideAlert(id) {
  $(id).classList.remove('show');
}

// ---------------------------------------------------------------
// Mostrar/ocultar selector "¿Dónde estudias?" según Sí / No
// ---------------------------------------------------------------
document.querySelectorAll('#estudiaRadioGroup input').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'Sí') {
      $('bloqueDondeEstudia').style.display = 'block';
    } else {
      $('bloqueDondeEstudia').style.display = 'none';
      $('dondeEstudia').value = '';
      $('institucionNombre').value = '';
    }
  });
});

// ---------------------------------------------------------------
// Paso 1 → Buscar por cédula
// ---------------------------------------------------------------
async function onBuscar() {
  const cedula = $('cedulaInput').value.trim();
  hideAlert('searchError');
  hideAlert('searchInfo');

  if (!/^[0-9]{10}$/.test(cedula)) {
    showAlert('searchError', 'Ingresa una cédula válida de 10 dígitos.');
    return;
  }
  if (searching) return;
  if (!API_URL || API_URL.indexOf('PEGA_AQUI') === 0) {
    showAlert('searchError', 'La app todavía no está conectada al sistema. Contacta al administrador.');
    return;
  }

  searching = true;
  const btn = $('btnBuscar');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Buscando...';
  showAlert('searchInfo', 'Consultando tu registro...');

  try {
    const res = await fetch(`${API_URL}?action=buscar&cedula=${encodeURIComponent(cedula)}`);
    const data = await res.json();

    if (!data.ok) {
      hideAlert('searchInfo');
      showAlert('searchError', data.error || 'No se pudo completar la búsqueda. Intenta de nuevo.');
      return;
    }
    if (!data.encontrado) {
      hideAlert('searchInfo');
      showAlert('searchError', 'No encontramos ningún registro con esa cédula. Verifica el número o consulta con tu tutor.');
      return;
    }

    hideAlert('searchInfo');
    registro = data.registro;
    llenarFicha(registro);
    configurarModoPaso3(registro);
    goToStep(2);
  } catch (err) {
    hideAlert('searchInfo');
    showAlert('searchError', 'No se pudo conectar con el sistema. Revisa tu conexión a internet e intenta de nuevo.');
  } finally {
    searching = false;
    btn.disabled = false;
    btn.textContent = 'Buscar';
  }
}

function llenarFicha(r) {
  $('fName').textContent = r.nombre || '—';
  $('fCedula').textContent = 'Cédula: ' + (r.cedula || '—');
  $('fTutorBadge').textContent = 'Tutor General: ' + (r.tutorGeneral || 'Otros Tutores');
  $('fCanton').textContent = r.canton || '—';
  $('fHoja').textContent = r.hojaBase || '—';
  $('fHorario').textContent = r.horario || '—';
  $('fGrupoApoyo').textContent = r.grupoApoyo || '—';
  $('fSubtutorActual').textContent = r.subtutor || 'Sin asignar';
  $('fCantonUbicacionActual').textContent = r.cantonUbicado || r.canton || 'Por confirmar';
  $('fEstudiaActual').textContent = r.estudia || 'Por confirmar';

  const banner = $('fichaStatusBanner');
  if (r.yaActualizo) {
    banner.style.background = '#E7F3ED';
    banner.style.color = '#1B4B43';
    banner.textContent = '✓ Cambios realizados: ya actualizaste tus datos. Ahora solo está habilitado subir evidencia fotográfica.';
  } else {
    banner.style.background = '#EAF1EE';
    banner.style.color = '#1B4B43';
    banner.textContent = 'En el siguiente paso podrás registrar si estudias (Universidad, Instituto o Colegio), tu Subtutor/Reasignación, el cantón donde estás ubicado y subir tu evidencia fotográfica.';
  }
}

function configurarModoPaso3(r) {
  document.querySelectorAll('#estudiaRadioGroup input').forEach((el) => (el.checked = false));
  $('dondeEstudia').value = '';
  $('institucionNombre').value = '';
  $('subtutorReasignacion').value = '';
  $('cantonUbicado').value = '';
  $('bloqueDondeEstudia').style.display = 'none';
  selfieBase64 = null;
  $('selfiePreview').classList.remove('show');
  $('selfieStatus').textContent = 'Aún no se ha seleccionado la foto';
  $('observacionFoto').value = '';

  if (r.yaActualizo) {
    $('cardDatosEditable').style.display = 'none';
    $('cardDatosBloqueado').style.display = 'block';
    $('estudiaGuardadoTexto').textContent = r.estudia || 'Registrado';
    $('subtutorGuardadoTexto').textContent = r.subtutor || 'Registrado';
    $('cantonGuardadoTexto').textContent = r.cantonUbicado || r.canton || 'Registrado';
  } else {
    $('cardDatosEditable').style.display = 'block';
    $('cardDatosBloqueado').style.display = 'none';
    // Preseleccionar si ya tenía subtutor o cantón
    if (r.subtutor && r.subtutor !== 'Sin asignar') {
      const optS = Array.from($('subtutorReasignacion').options).find(o => o.value === r.subtutor);
      if (optS) $('subtutorReasignacion').value = r.subtutor;
    }
  }
}

// ---------------------------------------------------------------
// Evidencia fotográfica: captura + compresión en canvas
// ---------------------------------------------------------------
$('btnCapture').addEventListener('click', () => $('selfieFile').click());

$('selfieFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  $('selfieStatus').textContent = 'Procesando foto...';

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX_W = 900;
      const scale = Math.min(1, MAX_W / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
      selfieBase64 = dataUrl.split(',')[1];
      selfieMime = 'image/jpeg';

      $('selfiePreview').src = dataUrl;
      $('selfiePreview').classList.add('show');
      $('selfieStatus').textContent = 'Foto lista ✓';
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// ---------------------------------------------------------------
// Paso 3 → Enviar
// ---------------------------------------------------------------
async function onEnviar() {
  hideAlert('formError');

  let estadoEstudiaFinal = registro.estudia || '';
  let subtutorFinal = registro.subtutor || '';
  let cantonUbicadoFinal = registro.cantonUbicado || '';
  let actualizarDatos = false;

  if (!registro.yaActualizo) {
    const estudiaEl = document.querySelector('#estudiaRadioGroup input:checked');
    if (!estudiaEl) {
      showAlert('formError', 'Selecciona si estudias actualmente (Sí o No).');
      return;
    }

    if (estudiaEl.value === 'Sí') {
      const donde = $('dondeEstudia').value;
      if (!donde) {
        showAlert('formError', 'Selecciona dónde estudias: Universidad, Instituto o Colegio.');
        return;
      }
      const inst = $('institucionNombre').value.trim();
      estadoEstudiaFinal = inst ? `Sí - ${donde} (${inst})` : `Sí - ${donde}`;
    } else {
      estadoEstudiaFinal = 'No estudia';
    }

    subtutorFinal = $('subtutorReasignacion').value;
    if (!subtutorFinal) {
      showAlert('formError', 'Selecciona tu Subtutor / Reasignación.');
      return;
    }

    cantonUbicadoFinal = $('cantonUbicado').value;
    if (!cantonUbicadoFinal) {
      showAlert('formError', 'Selecciona en qué cantón estás ubicado actualmente.');
      return;
    }

    actualizarDatos = true;
  }

  if (!selfieBase64) {
    showAlert('formError', 'Toma o sube tu evidencia fotográfica antes de enviar.');
    return;
  }
  if (submitting) return;

  submitting = true;
  const btn = $('btnEnviar');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Enviando...';

  const payload = {
    action: 'registrar',
    token: TOKEN,
    cedula: registro.cedula,
    nombre: registro.nombre,
    tutorGeneral: registro.tutorGeneral,
    canton: registro.canton,
    hojaBase: registro.hojaBase,
    hojaOrigen: registro.hojaOrigen,
    filaOrigen: registro.filaOrigen,
    actualizarDatos: actualizarDatos,
    estudia: estadoEstudiaFinal,
    subtutor: subtutorFinal,
    cantonUbicado: cantonUbicadoFinal,
    observacion: $('observacionFoto').value.trim(),
    selfieBase64: selfieBase64,
    selfieMime: selfieMime,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita preflight CORS
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!data.ok) {
      showAlert('formError', data.error || 'No se pudo guardar el registro. Intenta de nuevo.');
      return;
    }

    if (actualizarDatos) {
      $('successTitle').textContent = 'Cambios realizados y evidencia enviada';
      $('successDetail').textContent =
        `Tus datos (${estadoEstudiaFinal} · ${subtutorFinal} · ${cantonUbicadoFinal}) quedaron guardados y bloqueados, y tu evidencia fotográfica fue enviada a tu Tutor General.`;
    } else {
      $('successTitle').textContent = 'Evidencia fotográfica enviada';
      $('successDetail').textContent =
        'Tu nueva evidencia fotográfica se registró correctamente en la carpeta de tu Tutor General.';
    }

    goToStep(4);
  } catch (err) {
    showAlert('formError', 'No se pudo conectar con el sistema. Revisa tu conexión a internet e intenta de nuevo.');
  } finally {
    submitting = false;
    btn.disabled = false;
    btn.textContent = registro && registro.yaActualizo ? 'Enviar evidencia' : 'Guardar y enviar';
  }
}

// ---------------------------------------------------------------
// Inicio
// ---------------------------------------------------------------
$('cedulaInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') onBuscar();
});

renderFooter();
