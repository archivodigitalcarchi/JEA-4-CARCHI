<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jóvenes en Acción 4 · Carchi — Control y Evidencias</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css?v=5" />
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand-wrap">
        <div class="logo-box">
          <img src="IMG_2891.jpeg" alt="MiT Jóvenes en Acción 4 Edición" class="brand-logo" />
        </div>
        <div class="brand">
          <span class="badge-program">JÓVENES EN ACCIÓN 4 · CARCHI</span>
          <h1>Registro de Asistencia, Reasignación y Evidencia</h1>
        </div>
      </div>
      <div class="status-pill" id="apiStatusPill">
        <span class="dot"></span>
        <span>Sistema V12 en línea</span>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- PASO 1: BUSCADOR POR CÉDULA -->
    <section class="card search-card">
      <div class="card-header">
        <h2>1. Consulta por Número de Cédula</h2>
        <p>Ingresa los 10 dígitos de tu cédula para verificar tu convocatoria, fecha, turno y tutor.</p>
      </div>

      <form id="formBuscar" class="search-form" autocomplete="off">
        <div class="input-group">
          <input
            type="text"
            id="inputCedula"
            inputmode="numeric"
            maxlength="10"
            placeholder="Ej: 0402010631"
            required
          />
          <button type="submit" id="btnBuscar" class="btn btn-primary">
            Buscar Registro
          </button>
        </div>
        <small class="hint">Solo números (10 dígitos). Si empieza con 0, inclúyelo.</small>
      </form>

      <div id="mensajeBusqueda" class="alert hidden"></div>
    </section>

    <!-- PASO 2: FICHA DEL JOVEN Y FORMULARIO -->
    <section id="seccionResultado" class="hidden">
      <!-- TARJETA DE INFORMACIÓN DEL JOVEN -->
      <article class="card info-card">
        <div class="card-header row-between">
          <div>
            <span class="eyebrow">REGISTRO ENCONTRADO</span>
            <h2 id="lblNombre">—</h2>
          </div>
          <span id="badgeEstado" class="badge badge-pending">Pendiente</span>
        </div>

        <!-- BANNER DESTACADO DE FECHA DE CONVOCATORIA -->
        <div id="bannerFechaConvocatoria" class="fecha-banner hidden">
          <span class="fecha-icon">📅</span>
          <div>
            <small>FECHA DE CONVOCATORIA</small>
            <strong id="lblFechaConvocatoria">—</strong>
          </div>
        </div>

        <div class="grid-datos">
          <div class="dato-box">
            <span class="dato-label">Cédula</span>
            <strong id="lblCedula">—</strong>
          </div>
          <div class="dato-box">
            <span class="dato-label">Cantón Domicilio</span>
            <strong id="lblCanton">—</strong>
          </div>
          <div class="dato-box">
            <span class="dato-label">Pestaña / Grupo Actual</span>
            <strong id="lblHojaActual">—</strong>
          </div>
          <div class="dato-box">
            <span class="dato-label">Tutor General</span>
            <strong id="lblTutor">—</strong>
          </div>
          <div class="dato-box">
            <span class="dato-label">Turno / Horario</span>
            <strong id="lblHorario">—</strong>
          </div>
          <div class="dato-box">
            <span class="dato-label">Grupo de Apoyo / Dependencia</span>
            <strong id="lblGrupoApoyo">—</strong>
          </div>
          <div class="dato-box">
            <span class="dato-label">Subtutor / Reasignación</span>
            <strong id="lblSubtutorActual">—</strong>
          </div>
          <div class="dato-box">
            <span class="dato-label">¿Estudia actualmente?</span>
            <strong id="lblEstudiaActual">—</strong>
          </div>
        </div>

        <!-- PANEL ADMINISTRATIVO DE TRASLADO CON PIN 2026 -->
        <div class="admin-panel">
          <button type="button" id="btnToggleAdmin" class="btn-link">
            🔒 Opciones de Tutor: Trasladar joven a otra hoja / grupo
          </button>

          <div id="boxAdminReasignar" class="admin-box hidden">
            <p class="admin-note">
              Traslada físicamente este registro hacia otra pestaña de la Base Maestra (conservando su cantón de domicilio y actualizando el Buscador).
            </p>
            <div class="admin-grid">
              <div>
                <label for="selectNuevaHoja">Pestaña / Grupo Destino</label>
                <select id="selectNuevaHoja">
                  <option value="">-- Selecciona destino --</option>
                  <option value="Grupo Prioritario">Grupo Prioritario</option>
                  <option value="Fin de Semana">Fin de Semana</option>
                  <option value="Ximena">Ximena</option>
                  <option value="Patricio">Patricio</option>
                  <option value="Tulcán">Tulcán</option>
                  <option value="Montúfar">Montúfar</option>
                  <option value="Espejo">Espejo</option>
                  <option value="Mira">Mira</option>
                  <option value="Bolívar">Bolívar</option>
                  <option value="San Pedro de Huaca">San Pedro de Huaca</option>
                  <option value="No Presentados">No Presentados</option>
                  <option value="Sin Cantón">Sin Cantón</option>
                </select>
              </div>
              <div>
                <label for="inputPinAdmin">PIN de Tutor</label>
                <input type="password" id="inputPinAdmin" maxlength="8" placeholder="PIN" />
              </div>
              <div class="admin-btn-wrap">
                <button type="button" id="btnEjecutarTraslado" class="btn btn-warning">
                  Ejecutar Traslado
                </button>
              </div>
            </div>
            <div id="mensajeAdmin" class="alert hidden"></div>
          </div>
        </div>
      </article>

      <!-- TARJETA 2: CONFIRMACIÓN DE DATOS Y EVIDENCIA FOTOGRÁFICA -->
      <article class="card form-card">
        <div class="card-header">
          <h2>2. Confirmación de Datos y Evidencia Fotográfica</h2>
          <p id="subtituloFormulario">
            Completa tus datos de seguimiento y sube tu fotografía de asistencia.
          </p>
        </div>

        <form id="formRegistro">
          <!-- BLOQUE DE DATOS ACTUALIZABLES -->
          <div id="bloqueActualizacionDatos">
            <div class="form-grid">
              <div class="form-group">
                <label for="selectEstudia">¿Estudia actualmente? *</label>
                <select
                  id="selectEstudia"
                  required
                  onchange="toggleCampoDondeEstudia(this.value)"
                >
                  <option value="">-- Selecciona una opción --</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div class="form-group">
                <label for="selectSubtutor">Subtutor / Reasignación *</label>
                <select id="selectSubtutor" required>
                  <option value="">Selecciona tu subtutor o grupo...</option>
                  <option value="Mantenerme en el actual">Mantenerme en el actual</option>
                  <option value="Tenencia o jefatura política">Tenencia o jefatura política</option>
                  <option value="Puntos digitales">Puntos digitales</option>
                  <option value="Gestión documental Ximena R">Gestión documental Ximena R</option>
                  <option value="Gestión documental Patricio E">Gestión documental Patricio E</option>
                  <option value="Apoyo administrativo">Apoyo administrativo</option>
                  <option value="Apoyo comunitario">Apoyo comunitario</option>
                  <option value="Grupo Prioritario">Grupo Prioritario</option>
                </select>
              </div>

              <!-- CAMPO DESPLEGABLE AL ELEGIR "Sí" -->
              <div class="form-group full-width hidden" id="grupoDondeEstudia" style="display: none;">
                <label for="inputDondeEstudia">¿Dónde estudia? (Institución / Universidad / Colegio) *</label>
                <input
                  type="text"
                  id="inputDondeEstudia"
                  maxlength="120"
                  placeholder="Escribe el nombre de tu Universidad, Instituto o Colegio..."
                />
              </div>

              <div class="form-group hidden" id="grupoCantonUbicacion">
                <label for="selectCantonUbicado">Cantón donde realiza actividades *</label>
                <select id="selectCantonUbicado">
                  <option value="">-- Selecciona cantón --</option>
                  <option value="Tulcán">Tulcán</option>
                  <option value="Montúfar">Montúfar</option>
                  <option value="Espejo">Espejo</option>
                  <option value="Mira">Mira</option>
                  <option value="Bolívar">Bolívar</option>
                  <option value="San Pedro de Huaca">San Pedro de Huaca</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="inputObservacion">Observación o novedad (opcional)</label>
                <input
                  type="text"
                  id="inputObservacion"
                  maxlength="140"
                  placeholder="Ej: Asiste puntual / Cambio de horario autorizado"
                />
              </div>
            </div>
          </div>

          <!-- BLOQUE DE FOTO / EVIDENCIA -->
          <div class="foto-section">
            <label class="foto-label">Fotografía de Evidencia / Asistencia *</label>
            <p class="foto-hint">
              Puedes tomar una foto con la cámara o seleccionar una imagen. Se guardará automáticamente con tu número de cédula.
            </p>

            <div class="foto-actions">
              <label for="inputFotoCamara" class="btn btn-secondary">
                📷 Tomar Foto
              </label>
              <input
                type="file"
                id="inputFotoCamara"
                accept="image/*"
                capture="user"
                class="hidden-file"
              />

              <label for="inputFotoGaleria" class="btn btn-outline">
                🖼️ Subir desde Galería
              </label>
              <input
                type="file"
                id="inputFotoGaleria"
                accept="image/*"
                class="hidden-file"
              />
            </div>

            <div id="previewContainer" class="preview-box hidden">
              <img id="imgPreview" alt="Vista previa de evidencia" />
              <button type="button" id="btnQuitarFoto" class="btn-remove-foto">
                ✕ Quitar imagen
              </button>
            </div>
          </div>

          <div class="submit-bar">
            <button type="submit" id="btnGuardar" class="btn btn-success btn-lg">
              Guardar Registro y Subir Evidencia
            </button>
          </div>
        </form>

        <div id="mensajeGuardado" class="alert hidden"></div>
      </article>

      <!-- TARJETA 3: ACTIVIDAD ADICIONAL — CAPACITACIÓN Y ENTREGA DE CERTIFICADOS -->
      <article id="seccionCertificados" class="card cert-card hidden">
        <div class="card-header row-between">
          <div>
            <span class="eyebrow-cert">🔓 SECCIÓN DESBLOQUEADA · ACTIVIDAD ADICIONAL</span>
            <h2>3. Capacitación Virtual y Entrega de Certificados</h2>
          </div>
          <span class="badge badge-info">Mínimo 2 / semana</span>
        </div>

        <div class="cert-info-box">
          <p class="cert-desc">
            Como parte de tu formación integral en <strong>Jóvenes en Acción 4</strong>, esta es una
            <strong>actividad adicional de cumplimiento obligatorio</strong> que podrás desarrollar de manera continua
            <strong>a partir del 29</strong>.
          </p>
          <ul class="cert-rules">
            <li>📌 <strong>Escoge la plataforma oficial de tu preferencia</strong> entre las tres opciones habilitadas abajo.</li>
            <li>📌 Completa los cursos de tu interés y obtén tus certificados aprobados.</li>
            <li>📌 Debes subir en este apartado <strong>al menos dos (2) certificados por semana</strong> mediante fotografía o captura nítida.</li>
          </ul>

          <p class="platform-choose-label">Elige una plataforma de capacitación para ingresar:</p>
          <div class="platform-grid">
            <a
              href="https://capacitateparaelempleo.org/cursos"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-platform"
            >
              🎓 Capacítate para el Empleo ↗
            </a>
            <a
              href="https://elearning.trabajo.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-platform btn-platform-alt"
            >
              💼 Ministerio del Trabajo (E-Learning) ↗
            </a>
            <a
              href="https://cursos.seps.gob.ec/login/index.php"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-platform btn-platform-seps"
            >
              🏛️ Cursos Virtuales SEPS ↗
            </a>
          </div>
        </div>

        <form id="formCertificado" class="cert-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="selectPlataformaCert">Plataforma donde realizaste el curso *</label>
              <select id="selectPlataformaCert" required>
                <option value="">-- Selecciona plataforma --</option>
                <option value="Capacítate para el Empleo">Capacítate para el Empleo</option>
                <option value="Ministerio del Trabajo (E-Learning)">Ministerio del Trabajo (E-Learning)</option>
                <option value="Cursos Virtuales SEPS">Cursos Virtuales SEPS</option>
              </select>
            </div>

            <div class="form-group">
              <label for="selectSemanaCert">Semana de Entrega *</label>
              <select id="selectSemanaCert" required>
                <option value="">-- Selecciona semana --</option>
                <option value="Semana 1 (Desde el 29)">Semana 1 (Desde el 29)</option>
                <option value="Semana 2">Semana 2</option>
                <option value="Semana 3">Semana 3</option>
                <option value="Semana 4">Semana 4</option>
                <option value="Semana Adicional">Semana Adicional</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="inputNombreCurso">Nombre del Curso Aprobado *</label>
              <input
                type="text"
                id="inputNombreCurso"
                maxlength="120"
                placeholder="Ej: Atención al Cliente / Emprendimiento / Finanzas Personales"
                required
              />
            </div>
          </div>

          <div class="foto-section cert-upload-box">
            <label class="foto-label">Fotografía o Captura del Certificado (Solo Imagen JPG/PNG) *</label>
            <p class="foto-hint">
              Para optimizar el almacenamiento, sube únicamente una <strong>foto o captura de pantalla legible</strong> de tu certificado (no PDF). Se optimizará automáticamente antes de guardarse.
            </p>

            <div class="foto-actions">
              <label for="inputCertCamara" class="btn btn-secondary">
                📷 Tomar Foto al Certificado
              </label>
              <input
                type="file"
                id="inputCertCamara"
                accept="image/*"
                capture="environment"
                class="hidden-file"
              />

              <label for="inputArchivoCertificado" class="btn btn-outline">
                🖼️ Subir Captura / Imagen desde Galería
              </label>
              <input
                type="file"
                id="inputArchivoCertificado"
                accept="image/*"
                class="hidden-file"
              />
            </div>

            <div id="previewCertContainer" class="preview-box hidden">
              <img id="imgCertPreview" alt="Vista previa del certificado" />
              <div class="cert-meta-row">
                <span id="lblInfoPesoCert" class="cert-size-badge">Imagen optimizada</span>
                <button type="button" id="btnQuitarCert" class="btn-remove-foto">✕ Quitar imagen</button>
              </div>
            </div>
          </div>

          <button type="submit" id="btnSubirCertificado" class="btn btn-primary btn-lg">
            📤 Subir Foto de Certificado
          </button>
        </form>

        <div id="mensajeCertificado" class="alert hidden"></div>
      </article>
    </section>
  </main>

  <footer class="footer">
    <p>Programa Jóvenes en Acción 4 · Provincia del Carchi · Versión V12</p>
  </footer>

  <!-- Control inmediato para el despliegue de "¿Dónde estudia?" -->
  <script>
    function toggleCampoDondeEstudia(valor) {
      var grupo = document.getElementById('grupoDondeEstudia');
      var input = document.getElementById('inputDondeEstudia');
      if (!grupo || !input) return;

      if (valor === 'Sí') {
        grupo.classList.remove('hidden');
        grupo.style.display = 'block';
        input.required = true;
        input.focus();
      } else {
        grupo.classList.add('hidden');
        grupo.style.display = 'none';
        input.required = false;
        input.value = '';
      }
    }
  </script>

  <script src="app.js?v=5"></script>
</body>
</html>
