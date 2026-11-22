<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jóvenes en Acción 4 · Carchi — Control y Evidencias</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <span class="badge-program">JÓVENES EN ACCIÓN 4 · CARCHI</span>
        <h1>Registro de Asistencia, Reasignación y Evidencia</h1>
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

        <!-- BANNER DESTACADO DE FECHA DE CONVOCATORIA (N23..D4) -->
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

      <!-- TARJETA DE ACTUALIZACIÓN Y EVIDENCIA -->
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
                <select id="selectEstudia" required>
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
    </section>
  </main>

  <footer class="footer">
    <p>Programa Jóvenes en Acción 4 · Provincia del Carchi · Versión V12</p>
  </footer>

  <script src="app.js"></script>
</body>
</html>
