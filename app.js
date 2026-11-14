(() => {
  const STORAGE_KEY = 'movember_60km_state_v1';
  const GOAL_KM = 60;

  /**
   * Regla anual de edición Movember:
   * - Desde el 1 de noviembre hasta el 31 de diciembre: edición del año actual (ej. Noviembre 2026).
   * - Desde el 1 de enero hasta el 31 de octubre del año siguiente: sigue activa la edición
   *   del noviembre anterior (ej. hasta el 31 de octubre de 2027 sigue siendo Noviembre 2026).
   * - A partir del 1 de noviembre del año siguiente: cambia automáticamente al nuevo noviembre.
   */
  function getActiveMovemberYear(now = new Date()) {
    // getMonth(): 0 = Enero ... 9 = Octubre, 10 = Noviembre, 11 = Diciembre
    return now.getMonth() >= 10 ? now.getFullYear() : now.getFullYear() - 1;
  }

  function getMovemberEditionRange(editionYear = getActiveMovemberYear()) {
    // 1 de noviembre 00:00:00 a 30 de noviembre 23:59:59 (hora local y timestamps UNIX para Strava)
    const startLocal = new Date(editionYear, 10, 1, 0, 0, 0, 0);
    const endLocal = new Date(editionYear, 10, 30, 23, 59, 59, 999);
    return {
      editionYear,
      startISO: `${editionYear}-11-01`,
      endISO: `${editionYear}-11-30`,
      afterEpochSec: Math.floor(startLocal.getTime() / 1000),
      beforeEpochSec: Math.floor(endLocal.getTime() / 1000)
    };
  }

  const ACTIVE_EDITION_YEAR = getActiveMovemberYear();

  const I18N = {
    es: {
      pageTitle: `MOVEMBER ${ACTIVE_EDITION_YEAR} — Reto 60 KM`,
      brandTitle: 'RETO 60 KM',
      brandEditionKicker: (yr) => `MOVE FOR MOVEMBER ${yr}`,
      editionEyebrow: (yr) => `PROGRESO ACUMULADO · NOVIEMBRE ${yr}`,
      signInBtn: 'Iniciar sesión',
      langBtnTitle: 'Cambiar idioma (Español / Inglés)',
      themeBtnTitle: 'Alternar contraste blanco y negro',
      themeBtnLabel: 'B / N',
      shareCardBtn: 'Tarjeta de progreso',
      addActivityBtn: 'Añadir actividad',
      savedLocallyHint: 'Modo local · Inicia sesión para sincronizar',
      syncedCloudHint: (email) => `Sincronizado · ${email}`,
      progressSaved: 'Progreso guardado en este dispositivo',
      legendRun: 'Correr:',
      legendWalk: 'Caminar:',
      legendActivities: 'Actividades:',
      stravaBannerTitle: 'CONECTAR CON STRAVA',
      stravaEditionTag: (yr) => `NOVIEMBRE ${yr}`,
      stravaBannerDesc:
        'Importa automáticamente tus carreras, caminatas, trail running y rutas de senderismo de noviembre con sus kilómetros y fechas.',
      stravaConnectBtn: 'Conectar Strava',
      stravaSyncNowBtn: 'Sincronizar Noviembre',
      sportRunUpper: 'CORRER',
      sportWalkUpper: 'CAMINAR',
      sportRun: 'Correr',
      sportWalk: 'Caminar',
      quickLogRun: '+ Registrar carrera',
      quickLogWalk: '+ Registrar caminata',
      historyTitle: 'HISTORIAL DE ACTIVIDADES',
      historySubtitle: (yr) => `Sesiones contabilizadas para la edición Noviembre ${yr}`,
      filterAll: 'Todas',
      resetBtn: 'Reiniciar',
      emptyTitle: 'Aún no has registrado kilómetros',
      emptyDesc:
        'Pulsa en «Añadir actividad» o conecta tu cuenta de Strava para sumar tus kilómetros de noviembre.',
      emptyAddBtn: 'Añadir primera actividad',
      footerWhyStrong: 'POR QUÉ 60 KM:',
      footerWhyBody:
        '60 kilómetros por los 60 hombres que perdemos por suicidio cada hora en el mundo. Muévete por la salud masculina.',
      authModalKicker: 'SINCRONIZACIÓN MULTIDISPOSITIVO',
      authModalTitle: 'Iniciar sesión',
      authIntroText:
        'Accede a tu cuenta para ver y actualizar tu barra de 60 km desde el móvil, tablet u ordenador. Tus actividades locales se conservarán automáticamente.',
      continueWithGoogle: 'Continuar con Google',
      continueWithStrava: 'Continuar con Strava',
      authOrEmail: 'O CON TU CORREO ELECTRÓNICO',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Mínimo 6 caracteres',
      emailSignInBtn: 'Entrar / Registrarse con correo',
      continueGuestBtn: 'Seguir sin cuenta por ahora (guardado solo en este navegador)',
      connectedAccountLabel: 'CUENTA CONECTADA',
      stravaStatusTitle: 'Conexión con Strava',
      stravaNotConnectedYet: 'No vinculada todavía',
      signOutBtn: 'Cerrar sesión',
      authPendingStepMsg: (provider) =>
        `La interfaz para acceder con ${provider} está lista. En el siguiente paso conectaremos las claves gratuitas de autenticación para activarlo en vivo.`,
      modalKickerNew: 'NUEVO REGISTRO',
      modalTitleNew: 'Añadir actividad',
      modalKickerEdit: 'EDITAR REGISTRO',
      modalTitleEdit: 'Editar actividad',
      formSportLabel: '1. Tipo de deporte',
      patternSolid: 'Trazo sólido',
      patternStriped: 'Trazo rayado',
      formKmLabel: '2. Kilómetros hechos',
      kmPlaceholder: 'Ej. 5.5',
      formDateLabel: '3. Fecha de la actividad',
      todayBtn: 'Hoy',
      yesterdayBtn: 'Ayer',
      formNoteLabel: '4. Nota opcional',
      formNoteHint: '(ruta, tiempo, sensaciones)',
      notePlaceholder: 'Ej. Vuelta por el parque al atardecer',
      previewLabel: 'Nuevo total tras guardar:',
      cancelBtn: 'Cancelar',
      saveKmBtn: 'Guardar kilómetros',
      saveChangesBtn: 'Guardar cambios',
      shareModalKicker: 'COMPARTIR RETO MOVEMBER',
      shareModalTitle: 'Tarjeta de progreso',
      cardFormatLabel: 'Formato:',
      formatStory: 'Vertical (Stories)',
      formatSquare: 'Cuadrado (Post)',
      cardThemeLabel: 'Fondo:',
      cardThemeLight: 'Blanco',
      cardThemeDark: 'Negro',
      copyImageBtn: 'Copiar imagen',
      downloadPngBtn: 'Descargar PNG',
      nativeShareBtn: 'Compartir (Stories / WhatsApp)',
      copiedFeedback: '¡Imagen copiada al portapapeles! Ya puedes pegarla donde quieras.',
      downloadedFeedback: '¡Tarjeta PNG descargada!',
      sharedFeedback: '¡Menú de compartir abierto!',
      whatsappFallbackFeedback:
        '¡Imagen copiada! Se ha abierto WhatsApp: pulsa Ctrl+V en el chat para pegar la tarjeta.',
      copyErrorFeedback: 'Tu navegador no permite copiar directamente; usa «Descargar PNG».',
      shareCaptionText: (curr, goal, yr) =>
        `Llevo ${curr} / ${goal} km en el Reto Movember ${yr} 🥸🏃‍♂️ https://movember-60km.netlify.app/`,
      cardQuote:
        '60 KM POR LOS 60 HOMBRES QUE PERDEMOS POR SUICIDIO CADA HORA EN EL MUNDO.',
      cardSessionsLabel: 'SESIONES TOTALES',
      defaultProfileName: 'MOVEMBER',
      remainingKm: (rem) => `Faltan ${rem} km para alcanzar los 60 km`,
      goalCompletedExact: '¡RETO COMPLETADO! Has alcanzado los 60 km del Movember',
      goalCompletedExtra: (extra) =>
        `¡RETO COMPLETADO! Has superado los 60 km por +${extra} km`,
      ariaProgressText: (curr, goal) =>
        `${curr} kilómetros completados de ${goal} kilómetros`,
      sessionsCount: (n) =>
        n === 1 ? '1 sesión registrada' : `${n} sesiones registradas`,
      noCategoryActivities: (cat) =>
        `No hay actividades registradas en la categoría «${cat}».`,
      defaultSessionNote: (sportLabel) => `${sportLabel} — Sesión Movember`,
      editActivityTitle: 'Editar actividad',
      deleteActivityTitle: 'Eliminar actividad',
      errInvalidKm: 'Introduce una cantidad válida de kilómetros mayor que 0.',
      errMaxKm: 'Por favor, introduce una sesión menor o igual a 300 km.',
      errInvalidDate: 'Por favor, selecciona una fecha válida.',
      confirmReset: () =>
        `¿Quieres reiniciar a 0 km tu progreso de la edición Noviembre ${ACTIVE_EDITION_YEAR}?`
    },
    en: {
      pageTitle: `MOVEMBER ${ACTIVE_EDITION_YEAR} — 60 KM Challenge`,
      brandTitle: '60 KM CHALLENGE',
      brandEditionKicker: (yr) => `MOVE FOR MOVEMBER ${yr}`,
      editionEyebrow: (yr) => `TOTAL PROGRESS · NOVEMBER ${yr}`,
      signInBtn: 'Sign in',
      langBtnTitle: 'Switch language (Spanish / English)',
      themeBtnTitle: 'Toggle black & white contrast',
      themeBtnLabel: 'B / W',
      shareCardBtn: 'Progress card',
      addActivityBtn: 'Add activity',
      savedLocallyHint: 'Local mode · Sign in to sync across devices',
      syncedCloudHint: (email) => `Synced · ${email}`,
      progressSaved: 'Progress saved on this device',
      legendRun: 'Run:',
      legendWalk: 'Walk:',
      legendActivities: 'Activities:',
      stravaBannerTitle: 'CONNECT WITH STRAVA',
      stravaEditionTag: (yr) => `NOVEMBER ${yr}`,
      stravaBannerDesc:
        'Automatically import your November runs, walks, trail runs, and hikes with their distance and dates.',
      stravaConnectBtn: 'Connect Strava',
      stravaSyncNowBtn: 'Sync November',
      sportRunUpper: 'RUN',
      sportWalkUpper: 'WALK',
      sportRun: 'Run',
      sportWalk: 'Walk',
      quickLogRun: '+ Log a run',
      quickLogWalk: '+ Log a walk',
      historyTitle: 'ACTIVITY LOG',
      historySubtitle: (yr) => `Sessions counted toward the November ${yr} edition`,
      filterAll: 'All',
      resetBtn: 'Reset',
      emptyTitle: 'No kilometers logged yet',
      emptyDesc:
        'Click "Add activity" or connect your Strava account to log your November kilometers.',
      emptyAddBtn: 'Add first activity',
      footerWhyStrong: 'WHY 60 KM:',
      footerWhyBody:
        '60 kilometers for the 60 men we lose to suicide each hour globally. Move for men’s health.',
      authModalKicker: 'CROSS-DEVICE SYNC',
      authModalTitle: 'Sign in',
      authIntroText:
        'Sign in to view and update your 60 km bar from your phone, tablet, or computer. Your local activities will be preserved automatically.',
      continueWithGoogle: 'Continue with Google',
      continueWithStrava: 'Continue with Strava',
      authOrEmail: 'OR WITH YOUR EMAIL',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      emailSignInBtn: 'Sign in / Sign up with email',
      continueGuestBtn: 'Continue without an account for now (saved only in this browser)',
      connectedAccountLabel: 'CONNECTED ACCOUNT',
      stravaStatusTitle: 'Strava Connection',
      stravaNotConnectedYet: 'Not linked yet',
      signOutBtn: 'Sign out',
      authPendingStepMsg: (provider) =>
        `The ${provider} sign-in interface is ready. In the next step we will connect the free auth credentials to activate it live.`,
      modalKickerNew: 'NEW ENTRY',
      modalTitleNew: 'Add activity',
      modalKickerEdit: 'EDIT ENTRY',
      modalTitleEdit: 'Edit activity',
      formSportLabel: '1. Sport type',
      patternSolid: 'Solid fill',
      patternStriped: 'Striped fill',
      formKmLabel: '2. Kilometers completed',
      kmPlaceholder: 'E.g. 5.5',
      formDateLabel: '3. Activity date',
      todayBtn: 'Today',
      yesterdayBtn: 'Yesterday',
      formNoteLabel: '4. Optional note',
      formNoteHint: '(route, time, how it felt)',
      notePlaceholder: 'E.g. Evening loop around the park',
      previewLabel: 'New total after saving:',
      cancelBtn: 'Cancel',
      saveKmBtn: 'Save kilometers',
      saveChangesBtn: 'Save changes',
      shareModalKicker: 'SHARE MOVEMBER CHALLENGE',
      shareModalTitle: 'Progress card',
      cardFormatLabel: 'Format:',
      formatStory: 'Vertical (Stories)',
      formatSquare: 'Square (Post)',
      cardThemeLabel: 'Theme:',
      cardThemeLight: 'White',
      cardThemeDark: 'Black',
      copyImageBtn: 'Copy image',
      downloadPngBtn: 'Download PNG',
      nativeShareBtn: 'Share (Stories / WhatsApp)',
      copiedFeedback: 'Image copied to clipboard! Ready to paste anywhere.',
      downloadedFeedback: 'PNG card downloaded!',
      sharedFeedback: 'Share menu opened!',
      whatsappFallbackFeedback:
        'Image copied! WhatsApp opened: press Ctrl+V in the chat to paste your card.',
      copyErrorFeedback: 'Clipboard copy not supported here; please use "Download PNG".',
      shareCaptionText: (curr, goal, yr) =>
        `I'm at ${curr} / ${goal} km in the Movember ${yr} Challenge 🥸🏃‍♂️ https://movember-60km.netlify.app/`,
      cardQuote:
        '60 KM FOR THE 60 MEN WE LOSE TO SUICIDE EACH HOUR GLOBALLY.',
      cardSessionsLabel: 'TOTAL SESSIONS',
      defaultProfileName: 'MOVEMBER',
      remainingKm: (rem) => `${rem} km left to reach the 60 km goal`,
      goalCompletedExact: 'CHALLENGE COMPLETED! You reached the 60 km Movember goal',
      goalCompletedExtra: (extra) =>
        `CHALLENGE COMPLETED! You passed 60 km by +${extra} km`,
      ariaProgressText: (curr, goal) =>
        `${curr} kilometers completed out of ${goal} kilometers`,
      sessionsCount: (n) =>
        n === 1 ? '1 session logged' : `${n} sessions logged`,
      noCategoryActivities: (cat) =>
        `No activities logged under "${cat}".`,
      defaultSessionNote: (sportLabel) => `${sportLabel} — Movember Session`,
      editActivityTitle: 'Edit activity',
      deleteActivityTitle: 'Delete activity',
      errInvalidKm: 'Please enter a valid kilometer amount greater than 0.',
      errMaxKm: 'Please enter a session of 300 km or less.',
      errInvalidDate: 'Please select a valid date.',
      confirmReset: () =>
        `Do you want to reset your November ${ACTIVE_EDITION_YEAR} progress back to 0 km?`
    }
  };

  const createDefaultState = () => ({
    lang: 'es',
    themeInverted: false,
    activeProfileId: 'default',
    user: null, // Will hold { id, email, name, provider, stravaConnected } once logged in
    profiles: {
      default: {
        id: 'default',
        name: 'MOVEMBER',
        activities: []
      }
    }
  });

  let state = loadState();
  let currentFilter = 'all';
  let editingActivityId = null;
  let shareCardFormat = 'story';
  let shareCardTheme = 'light';

  // DOM Elements
  const brandEditionKicker = document.getElementById('brandEditionKicker');
  const editionEyebrow = document.getElementById('editionEyebrow');
  const authHeaderBtn = document.getElementById('authHeaderBtn');
  const authHeaderBtnLabel = document.getElementById('authHeaderBtnLabel');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langOptEs = document.getElementById('langOptEs');
  const langOptEn = document.getElementById('langOptEn');
  const invertThemeBtn = document.getElementById('invertThemeBtn');
  const themeBtnLabel = document.getElementById('themeBtnLabel');

  const heroCard = document.querySelector('.hero-card');
  const currentKmValue = document.getElementById('currentKmValue');
  const remainingKmText = document.getElementById('remainingKmText');
  const storageIndicatorBtn = document.getElementById('storageIndicatorBtn');
  const storageIndicatorText = document.getElementById('storageIndicatorText');
  const progressTrack = document.getElementById('progressTrack');
  const progressFillRun = document.getElementById('progressFillRun');
  const progressFillWalk = document.getElementById('progressFillWalk');

  const runKmTotal = document.getElementById('runKmTotal');
  const walkKmTotal = document.getElementById('walkKmTotal');
  const activitiesCount = document.getElementById('activitiesCount');

  // Strava Banner Elements
  const stravaEditionTag = document.getElementById('stravaEditionTag');
  const stravaSyncBtn = document.getElementById('stravaSyncBtn');
  const emptyStravaBtn = document.getElementById('emptyStravaBtn');

  const statRunKm = document.getElementById('statRunKm');
  const statRunSessions = document.getElementById('statRunSessions');
  const statWalkKm = document.getElementById('statWalkKm');
  const statWalkSessions = document.getElementById('statWalkSessions');

  const historySubtitle = document.getElementById('historySubtitle');
  const emptyState = document.getElementById('emptyState');
  const activityList = document.getElementById('activityList');
  const filterPills = document.querySelectorAll('[data-filter]');
  const resetAllBtn = document.getElementById('resetAllBtn');

  // Auth Modal Elements
  const authModal = document.getElementById('authModal');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
  const authGuestView = document.getElementById('authGuestView');
  const authAccountView = document.getElementById('authAccountView');
  const loginGoogleBtn = document.getElementById('loginGoogleBtn');
  const loginStravaBtn = document.getElementById('loginStravaBtn');
  const emailAuthForm = document.getElementById('emailAuthForm');
  const authEmailInput = document.getElementById('authEmailInput');
  const authPasswordInput = document.getElementById('authPasswordInput');
  const authFeedbackMsg = document.getElementById('authFeedbackMsg');
  const continueAsGuestBtn = document.getElementById('continueAsGuestBtn');
  const accountIdentityText = document.getElementById('accountIdentityText');
  const accountProviderTag = document.getElementById('accountProviderTag');
  const accountStravaStatusText = document.getElementById('accountStravaStatusText');
  const accountStravaSyncBtn = document.getElementById('accountStravaSyncBtn');
  const signOutBtn = document.getElementById('signOutBtn');

  // Activity Modal Elements
  const activityModal = document.getElementById('activityModal');
  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  const openModalBtn = document.getElementById('openModalBtn');
  const emptyAddBtn = document.getElementById('emptyAddBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const submitActivityBtn = document.getElementById('submitActivityBtn');
  const activityForm = document.getElementById('activityForm');
  const kmInput = document.getElementById('kmInput');
  const dateInput = document.getElementById('dateInput');
  const dateTodayBtn = document.getElementById('dateTodayBtn');
  const dateYesterdayBtn = document.getElementById('dateYesterdayBtn');
  const noteInput = document.getElementById('noteInput');
  const formError = document.getElementById('formError');
  const previewNewTotal = document.getElementById('previewNewTotal');
  const presetChips = document.querySelectorAll('.chip-btn');
  const quickSportBtns = document.querySelectorAll('[data-quick-sport]');

  // Share Card Modal Elements
  const shareModal = document.getElementById('shareModal');
  const openShareModalBtn = document.getElementById('openShareModalBtn');
  const closeShareModalBtn = document.getElementById('closeShareModalBtn');
  const shareCanvas = document.getElementById('shareCanvas');
  const shareFeedback = document.getElementById('shareFeedback');
  const copyCardBtn = document.getElementById('copyCardBtn');
  const downloadCardBtn = document.getElementById('downloadCardBtn');
  const nativeShareCardBtn = document.getElementById('nativeShareCardBtn');
  const formatBtns = document.querySelectorAll('[data-card-format]');
  const cardThemeBtns = document.querySelectorAll('[data-card-theme]');

  function getLang() {
    return state.lang === 'en' ? 'en' : 'es';
  }

  function t() {
    return I18N[getLang()];
  }

  function getLocalISODate(dateObj = new Date()) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function extractActivityISODate(item) {
    if (item.dateISO && /^\d{4}-\d{2}-\d{2}$/.test(item.dateISO)) {
      return item.dateISO;
    }
    if (item.createdAt) {
      const d = new Date(item.createdAt);
      if (!Number.isNaN(d.getTime())) {
        return getLocalISODate(d);
      }
    }
    return getLocalISODate(new Date());
  }

  /**
   * Determina a qué edición de Movember pertenece una actividad.
   * Si tiene editionYear explícito lo usa; si no, aplica la misma regla del 1 nov - 31 oct.
   */
  function getActivityEditionYear(item) {
    if (item.editionYear) return Number(item.editionYear);
    const iso = extractActivityISODate(item);
    const parts = iso.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!Number.isNaN(d.getTime())) {
        return getActiveMovemberYear(d);
      }
    }
    return ACTIVE_EDITION_YEAR;
  }

  function getActiveEditionActivities(activities = []) {
    return activities.filter((item) => getActivityEditionYear(item) === ACTIVE_EDITION_YEAR);
  }

  function formatActivityDate(item) {
    const iso = extractActivityISODate(item);
    const parts = iso.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!Number.isNaN(d.getTime())) {
        const locale = getLang() === 'en' ? 'en-GB' : 'es-ES';
        return d.toLocaleDateString(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    }
    return item.dateFormatted || iso;
  }

  function sortActivities(activities) {
    return [...activities].sort((a, b) => {
      const dateA = extractActivityISODate(a);
      const dateB = extractActivityISODate(b);
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      const timeA = a.createdAt || '';
      const timeB = b.createdAt || '';
      return timeB.localeCompare(timeA);
    });
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.profiles) {
        return createDefaultState();
      }
      if (!parsed.lang) parsed.lang = 'es';
      if (!parsed.profiles[parsed.activeProfileId]) {
        parsed.activeProfileId = Object.keys(parsed.profiles)[0] || 'default';
      }
      return parsed;
    } catch (err) {
      console.error('Error reading localStorage:', err);
      return createDefaultState();
    }
  }

  let firebaseApp = null;
  let firebaseAuth = null;
  let firestoreDb = null;
  let unsubscribeCloudSnapshot = null;
  let isInitialCloudSync = false;

  function isFirebaseConfigured() {
    const cfg = window.MOVEMBER_FIREBASE_CONFIG;
    return Boolean(cfg && cfg.apiKey && cfg.projectId && typeof window.firebase !== 'undefined');
  }

  function mergeActivityLists(localList = [], cloudList = []) {
    const map = new Map();
    [...cloudList, ...localList].forEach((act) => {
      if (!act || !act.id) return;
      const key = act.stravaId ? `strava_${act.stravaId}` : act.id;
      if (!map.has(key)) {
        map.set(key, act);
      } else {
        const existing = map.get(key);
        const existingTime = existing.updatedAt || existing.createdAt || '';
        const incomingTime = act.updatedAt || act.createdAt || '';
        if (incomingTime >= existingTime) {
          map.set(key, { ...existing, ...act });
        }
      }
    });
    return sortActivities(Array.from(map.values()));
  }

  async function pushActivitiesToCloud() {
    if (!firestoreDb || !state.user || !state.user.uid) return;
    try {
      const profile = getActiveProfile();
      await firestoreDb.collection('users').doc(state.user.uid).set(
        {
          email: state.user.email || '',
          name: state.user.name || '',
          provider: state.user.provider || 'email',
          updatedAt: new Date().toISOString(),
          activities: profile.activities || [],
          stravaAthlete: state.stravaAthlete || null,
          stravaRefreshToken: state.stravaRefreshToken || null
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Error syncing to Firestore:', err);
    }
  }

  function saveState(skipCloudPush = false) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      flashStorageIndicator();
      if (!skipCloudPush && state.user && state.user.uid) {
        pushActivitiesToCloud();
      }
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }

  function flashStorageIndicator() {
    if (!storageIndicatorText) return;
    storageIndicatorText.textContent = state.user
      ? t().syncedCloudHint(state.user.email || state.user.name)
      : t().progressSaved;
  }

  function getActiveProfile() {
    return state.profiles[state.activeProfileId] || state.profiles.default;
  }

  function formatKm(num) {
    const rounded = Math.round(num * 100) / 100;
    const locale = getLang() === 'en' ? 'en-GB' : 'es-ES';
    return Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toLocaleString(locale, { maximumFractionDigits: 2 });
  }

  function translateSportName(sportValue) {
    return sportValue === 'Correr' ? t().sportRun : t().sportWalk;
  }

  function getTotals(activities) {
    let runKm = 0;
    let walkKm = 0;
    let runCount = 0;
    let walkCount = 0;

    for (const act of activities) {
      const km = Number(act.km) || 0;
      if (act.sport === 'Correr') {
        runKm += km;
        runCount += 1;
      } else {
        walkKm += km;
        walkCount += 1;
      }
    }

    const totalKm = Math.round((runKm + walkKm) * 100) / 100;
    return {
      runKm: Math.round(runKm * 100) / 100,
      walkKm: Math.round(walkKm * 100) / 100,
      totalKm,
      runCount,
      walkCount,
      totalCount: activities.length
    };
  }

  function applyTheme() {
    document.body.classList.toggle('theme-inverted', Boolean(state.themeInverted));
  }

  function applyTranslations() {
    const dict = t();
    const lang = getLang();

    document.documentElement.lang = lang;
    document.title = dict.pageTitle;

    langOptEs.classList.toggle('is-active', lang === 'es');
    langOptEn.classList.toggle('is-active', lang === 'en');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (typeof dict[key] === 'string') {
        el.textContent = dict[key];
      }
    });

    // Dynamic edition labels (Noviembre 2026 until Oct 31 2027, then Noviembre 2027)
    brandEditionKicker.textContent = dict.brandEditionKicker(ACTIVE_EDITION_YEAR);
    editionEyebrow.textContent = dict.editionEyebrow(ACTIVE_EDITION_YEAR);
    stravaEditionTag.textContent = dict.stravaEditionTag(ACTIVE_EDITION_YEAR);
    historySubtitle.textContent = dict.historySubtitle(ACTIVE_EDITION_YEAR);

    // Update Auth Button in Header
    if (state.user) {
      authHeaderBtn.classList.add('is-logged-in');
      authHeaderBtnLabel.textContent = state.user.name || state.user.email || dict.signInBtn;
      storageIndicatorText.textContent = dict.syncedCloudHint(state.user.email || state.user.name);
    } else {
      authHeaderBtn.classList.remove('is-logged-in');
      authHeaderBtnLabel.textContent = dict.signInBtn;
      storageIndicatorText.textContent = dict.savedLocallyHint;
    }

    // Update Strava button label when already linked
    const stravaSyncBtnLabel = document.getElementById('stravaSyncBtnLabel');
    if (stravaSyncBtnLabel && state.stravaRefreshToken) {
      stravaSyncBtnLabel.textContent =
        lang === 'en' ? 'Sync November (Strava)' : 'Sincronizar Noviembre (Strava)';
    }

    kmInput.placeholder = dict.kmPlaceholder;
    noteInput.placeholder = dict.notePlaceholder;
    authEmailInput.placeholder = dict.emailPlaceholder;
    authPasswordInput.placeholder = dict.passwordPlaceholder;
    langToggleBtn.title = dict.langBtnTitle;
    invertThemeBtn.title = dict.themeBtnTitle;
    themeBtnLabel.textContent = dict.themeBtnLabel;
  }

  function render() {
    applyTheme();
    applyTranslations();

    const dict = t();
    const profile = getActiveProfile();
    const editionActivities = getActiveEditionActivities(profile.activities || []);
    const activities = sortActivities(editionActivities);
    const { runKm, walkKm, totalKm, runCount, walkCount, totalCount } = getTotals(activities);

    currentKmValue.textContent = formatKm(totalKm);

    const remaining = Math.max(0, Math.round((GOAL_KM - totalKm) * 100) / 100);
    if (totalKm >= GOAL_KM) {
      const extra = Math.round((totalKm - GOAL_KM) * 100) / 100;
      remainingKmText.textContent =
        extra > 0 ? dict.goalCompletedExtra(formatKm(extra)) : dict.goalCompletedExact;
      remainingKmText.classList.add('completed-pill');
      heroCard.classList.add('goal-completed');
    } else {
      remainingKmText.textContent = dict.remainingKm(formatKm(remaining));
      remainingKmText.classList.remove('completed-pill');
      heroCard.classList.remove('goal-completed');
    }

    const runRatio = Math.min(runKm / GOAL_KM, 1);
    const remainingCapacity = Math.max(0, 1 - runRatio);
    const walkRatio = Math.min(walkKm / GOAL_KM, remainingCapacity);

    progressFillRun.style.width = `${(runRatio * 100).toFixed(3)}%`;
    progressFillWalk.style.width = `${(walkRatio * 100).toFixed(3)}%`;

    progressTrack.setAttribute('aria-valuenow', String(Math.min(totalKm, GOAL_KM)));
    progressTrack.setAttribute('aria-valuetext', dict.ariaProgressText(formatKm(totalKm), GOAL_KM));

    runKmTotal.textContent = `${formatKm(runKm)} km`;
    walkKmTotal.textContent = `${formatKm(walkKm)} km`;
    activitiesCount.textContent = String(totalCount);

    statRunKm.textContent = `${formatKm(runKm)} km`;
    statRunSessions.textContent = dict.sessionsCount(runCount);

    statWalkKm.textContent = `${formatKm(walkKm)} km`;
    statWalkSessions.textContent = dict.sessionsCount(walkCount);

    const filtered =
      currentFilter === 'all'
        ? activities
        : activities.filter((item) => item.sport === currentFilter);

    activityList.innerHTML = '';

    if (activities.length === 0) {
      emptyState.hidden = false;
      resetAllBtn.hidden = true;
    } else {
      emptyState.hidden = true;
      resetAllBtn.hidden = false;

      if (filtered.length === 0) {
        const li = document.createElement('li');
        li.className = 'activity-item';
        const filterLabel = translateSportName(currentFilter);
        li.innerHTML = `<span class="activity-date">${escapeHtml(dict.noCategoryActivities(filterLabel))}</span>`;
        activityList.appendChild(li);
      } else {
        filtered.forEach((item) => {
          const li = document.createElement('li');
          li.className = 'activity-item';

          const isRun = item.sport === 'Correr';
          const tagClass = isRun ? 'tag-run' : 'tag-walk';
          const sportLabel = translateSportName(item.sport);
          const noteText = item.note ? item.note : dict.defaultSessionNote(sportLabel);
          const formattedDate = formatActivityDate(item);
          const stravaBadge = item.stravaId
            ? `<span class="strava-source-badge">STRAVA</span>`
            : '';

          li.innerHTML = `
            <div class="activity-left">
              <span class="activity-type-tag ${tagClass}">${escapeHtml(sportLabel)}</span>
              <div class="activity-info">
                <div class="activity-note-row">
                  <span class="activity-note">${escapeHtml(noteText)}</span>
                  ${stravaBadge}
                </div>
                <span class="activity-date">${escapeHtml(formattedDate)}</span>
              </div>
            </div>
            <div class="activity-right">
              <span class="activity-km">+${formatKm(item.km)} km</span>
              <div class="activity-actions">
                <button
                  type="button"
                  class="edit-activity-btn"
                  data-edit-id="${escapeHtml(item.id)}"
                  title="${escapeHtml(dict.editActivityTitle)}"
                  aria-label="${escapeHtml(dict.editActivityTitle)} (${formatKm(item.km)} km)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  class="delete-activity-btn"
                  data-delete-id="${escapeHtml(item.id)}"
                  title="${escapeHtml(dict.deleteActivityTitle)}"
                  aria-label="${escapeHtml(dict.deleteActivityTitle)} (${formatKm(item.km)} km)"
                >✕</button>
              </div>
            </div>
          `;
          activityList.appendChild(li);
        });
      }
    }

    updateModalPreview();
    if (shareModal.classList.contains('is-open')) {
      renderShareCardCanvas();
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // Auth Modal (Login / Account View)
  // =========================================================================
  function openAuthModal(initialFeedback = '') {
    if (state.user) {
      authGuestView.hidden = true;
      authAccountView.hidden = false;
      accountIdentityText.textContent = state.user.email || state.user.name;
      accountProviderTag.textContent = (state.user.provider || 'EMAIL').toUpperCase();

      if (accountStravaStatusText) {
        if (state.stravaAthlete && state.stravaAthlete.name) {
          accountStravaStatusText.textContent =
            getLang() === 'en'
              ? `Connected as ${state.stravaAthlete.name}`
              : `Conectado como ${state.stravaAthlete.name}`;
        } else {
          accountStravaStatusText.textContent = t().accountStravaHint;
        }
      }
      if (accountStravaSyncBtn) {
        accountStravaSyncBtn.textContent = state.stravaRefreshToken
          ? getLang() === 'en'
            ? 'Sync Now'
            : 'Sincronizar ahora'
          : t().connectStravaShort;
      }
    } else {
      authGuestView.hidden = false;
      authAccountView.hidden = true;
    }

    if (initialFeedback) {
      authFeedbackMsg.textContent = initialFeedback;
      authFeedbackMsg.hidden = false;
    } else {
      authFeedbackMsg.hidden = true;
    }

    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
  }

  function closeAuthModal() {
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
  }

  function subscribeToUserCloudDoc(uid) {
    if (!firestoreDb || !uid) return;
    if (unsubscribeCloudSnapshot) {
      unsubscribeCloudSnapshot();
      unsubscribeCloudSnapshot = null;
    }

    isInitialCloudSync = true;
    const userDocRef = firestoreDb.collection('users').doc(uid);
    unsubscribeCloudSnapshot = userDocRef.onSnapshot(
      async (docSnap) => {
        const profile = getActiveProfile();
        const localActs = profile.activities || [];

        if (docSnap.exists) {
          const data = docSnap.data() || {};
          const cloudActs = Array.isArray(data.activities) ? data.activities : [];

          if (data.stravaAthlete && !state.stravaAthlete) {
            state.stravaAthlete = data.stravaAthlete;
          }
          if (data.stravaRefreshToken && !state.stravaRefreshToken) {
            state.stravaRefreshToken = data.stravaRefreshToken;
          }

          if (isInitialCloudSync) {
            isInitialCloudSync = false;
            const merged = mergeActivityLists(localActs, cloudActs);
            profile.activities = merged;
            saveState(true);
            render();

            if (merged.length > cloudActs.length) {
              await pushActivitiesToCloud();
            }
          } else {
            // Subsequent snapshots reflect authoritative cloud state (including deletions/edits)
            profile.activities = sortActivities(cloudActs);
            saveState(true);
            render();
          }
        } else {
          isInitialCloudSync = false;
          // First time user document: upload any existing local activities
          await pushActivitiesToCloud();
        }
      },
      (err) => {
        console.error('Firestore listener error:', err);
      }
    );
  }

  function initFirebaseCloud() {
    if (!isFirebaseConfigured()) return;
    try {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(window.MOVEMBER_FIREBASE_CONFIG);
      } else {
        firebaseApp = firebase.app();
      }
      firebaseAuth = firebase.auth();
      firestoreDb = firebase.firestore();

      firebaseAuth.onAuthStateChanged((fbUser) => {
        if (fbUser) {
          const providerId =
            fbUser.providerData && fbUser.providerData[0]
              ? fbUser.providerData[0].providerId
              : 'email';
          const providerLabel = providerId.includes('google') ? 'Google' : 'Email';

          state.user = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Usuario'),
            provider: providerLabel
          };
          saveState(true);
          render();
          subscribeToUserCloudDoc(fbUser.uid);
        } else {
          if (unsubscribeCloudSnapshot) {
            unsubscribeCloudSnapshot();
            unsubscribeCloudSnapshot = null;
          }
          // Only clear if previous session was a Firebase session
          if (state.user && state.user.uid) {
            state.user = null;
            saveState(true);
            render();
          }
        }
      });
    } catch (err) {
      console.error('Error initializing Firebase:', err);
    }
  }

  authHeaderBtn.addEventListener('click', () => openAuthModal());
  storageIndicatorBtn.addEventListener('click', () => openAuthModal());
  closeAuthModalBtn.addEventListener('click', closeAuthModal);
  continueAsGuestBtn.addEventListener('click', closeAuthModal);

  loginGoogleBtn.addEventListener('click', async () => {
    if (!isFirebaseConfigured() || !firebaseAuth) {
      authFeedbackMsg.textContent = t().authPendingStepMsg('Google');
      authFeedbackMsg.hidden = false;
      return;
    }
    try {
      authFeedbackMsg.hidden = true;
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebaseAuth.signInWithPopup(provider);
        closeAuthModal();
      } catch (popupErr) {
        if (popupErr.code === 'auth/popup-blocked') {
          await firebaseAuth.signInWithRedirect(provider);
        } else {
          throw popupErr;
        }
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return;
      authFeedbackMsg.textContent = err.message || 'Error al iniciar sesión con Google.';
      authFeedbackMsg.hidden = false;
    }
  });

  async function resolveStravaClientId() {
    if (window.MOVEMBER_STRAVA_CLIENT_ID) {
      return String(window.MOVEMBER_STRAVA_CLIENT_ID).trim();
    }
    try {
      const res = await fetch('/.netlify/functions/strava');
      if (res.ok) {
        const data = await res.json();
        if (data && data.clientId) return String(data.clientId).trim();
      }
    } catch (err) {
      // Running locally without Netlify CLI
    }
    return '';
  }

  async function startStravaOAuth() {
    const clientId = await resolveStravaClientId();
    if (!clientId) {
      openAuthModal(t().authPendingStepMsg('Strava'));
      return;
    }

    const redirectUri = window.location.origin + window.location.pathname;
    const authUrl = new URL('https://www.strava.com/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('approval_prompt', 'auto');
    authUrl.searchParams.set('scope', 'read,activity:read_all');
    window.location.href = authUrl.toString();
  }

  async function syncStravaPayload(payload) {
    const stravaSyncBtnLabel = document.getElementById('stravaSyncBtnLabel');
    const stravaBannerDesc = document.getElementById('stravaBannerDesc');
    const originalBtnText = stravaSyncBtnLabel ? stravaSyncBtnLabel.textContent : '';

    if (stravaSyncBtnLabel) {
      stravaSyncBtnLabel.textContent =
        getLang() === 'en' ? 'Syncing Strava...' : 'Sincronizando Strava...';
    }

    try {
      const range = getMovemberEditionRange(ACTIVE_EDITION_YEAR);
      const res = await fetch('/.netlify/functions/strava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          editionYear: ACTIVE_EDITION_YEAR,
          after: range.afterEpochSec,
          before: range.beforeEpochSec
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al sincronizar con Strava.');
      }

      const profile = getActiveProfile();
      const imported = Array.isArray(data.activities) ? data.activities : [];
      profile.activities = mergeActivityLists(profile.activities || [], imported);

      if (data.refreshToken) {
        state.stravaRefreshToken = data.refreshToken;
      }

      if (data.athlete) {
        const athleteName =
          `${data.athlete.firstname || ''} ${data.athlete.lastname || ''}`.trim() ||
          data.athlete.username ||
          'Atleta Strava';

        state.stravaAthlete = {
          id: data.athlete.id,
          name: athleteName
        };

        // If user wasn't signed in with Google/Email yet, sign them in with their Strava profile
        if (!state.user) {
          state.user = {
            uid: null,
            email: athleteName,
            name: athleteName,
            provider: 'Strava'
          };
        }
      }

      saveState();
      render();

      if (stravaBannerDesc) {
        stravaBannerDesc.textContent =
          getLang() === 'en'
            ? `Strava synced! ${imported.length} November running/walking sessions imported.`
            : `¡Strava sincronizado! Se han importado ${imported.length} sesiones de correr/caminar de noviembre.`;
      }
    } catch (err) {
      console.error('Strava sync error:', err);
      openAuthModal(err.message || 'Error al conectar con Strava.');
      if (stravaSyncBtnLabel) stravaSyncBtnLabel.textContent = originalBtnText;
    }
  }

  async function checkStravaOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (!code && !error) return;

    // Clean query params from browser URL bar
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    if (error) {
      openAuthModal(
        getLang() === 'en'
          ? 'Strava authorization was cancelled.'
          : 'Se canceló la autorización con Strava.'
      );
      return;
    }

    if (code) {
      await syncStravaPayload({ code });
    }
  }

  loginStravaBtn.addEventListener('click', () => {
    startStravaOAuth();
  });

  emailAuthForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured() || !firebaseAuth) {
      authFeedbackMsg.textContent = t().authPendingStepMsg('Email');
      authFeedbackMsg.hidden = false;
      return;
    }

    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    if (!email || !password || password.length < 6) {
      authFeedbackMsg.textContent =
        getLang() === 'en'
          ? 'Enter a valid email and a password of at least 6 characters.'
          : 'Introduce un correo válido y una contraseña de al menos 6 caracteres.';
      authFeedbackMsg.hidden = false;
      return;
    }

    try {
      authFeedbackMsg.hidden = true;
      try {
        await firebaseAuth.signInWithEmailAndPassword(email, password);
      } catch (signInErr) {
        if (
          signInErr.code === 'auth/user-not-found' ||
          signInErr.code === 'auth/invalid-credential'
        ) {
          try {
            await firebaseAuth.createUserWithEmailAndPassword(email, password);
          } catch (createErr) {
            if (createErr.code === 'auth/email-already-in-use') {
              throw new Error(
                getLang() === 'en'
                  ? 'Incorrect password for this email account.'
                  : 'La contraseña introducida no es correcta para este correo.'
              );
            }
            throw createErr;
          }
        } else if (signInErr.code === 'auth/wrong-password') {
          throw new Error(
            getLang() === 'en'
              ? 'Incorrect password for this email account.'
              : 'La contraseña introducida no es correcta para este correo.'
          );
        } else {
          throw signInErr;
        }
      }
      emailAuthForm.reset();
      closeAuthModal();
    } catch (err) {
      authFeedbackMsg.textContent = err.message || 'Error al autenticar con correo.';
      authFeedbackMsg.hidden = false;
    }
  });

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      if (firebaseAuth && state.user && state.user.uid) {
        await firebaseAuth.signOut();
      }
      state.user = null;
      state.stravaRefreshToken = null;
      state.stravaAthlete = null;
      saveState(true);
      render();
      closeAuthModal();
    });
  }

  // Strava Banner & Empty State Connect Buttons
  function handleStravaConnectTrigger() {
    if (state.stravaRefreshToken) {
      syncStravaPayload({ refreshToken: state.stravaRefreshToken });
    } else {
      startStravaOAuth();
    }
  }

  stravaSyncBtn.addEventListener('click', handleStravaConnectTrigger);
  if (emptyStravaBtn) emptyStravaBtn.addEventListener('click', handleStravaConnectTrigger);
  if (accountStravaSyncBtn) accountStravaSyncBtn.addEventListener('click', handleStravaConnectTrigger);

  // =========================================================================
  // Activity Modal (Add / Edit)
  // =========================================================================
  function openActivityModal(options = {}) {
    const { defaultSport = null, activityToEdit = null } = options;
    const dict = t();

    formError.hidden = true;
    activityForm.reset();

    if (activityToEdit) {
      editingActivityId = activityToEdit.id;
      modalKicker.textContent = dict.modalKickerEdit;
      modalTitle.textContent = dict.modalTitleEdit;
      submitActivityBtn.textContent = dict.saveChangesBtn;

      const radio = activityForm.querySelector(
        `input[name="sportType"][value="${activityToEdit.sport}"]`
      );
      if (radio) radio.checked = true;

      kmInput.value = String(activityToEdit.km);
      dateInput.value = extractActivityISODate(activityToEdit);
      noteInput.value = activityToEdit.note || '';
    } else {
      editingActivityId = null;
      modalKicker.textContent = dict.modalKickerNew;
      modalTitle.textContent = dict.modalTitleNew;
      submitActivityBtn.textContent = dict.saveKmBtn;

      if (defaultSport) {
        const radio = activityForm.querySelector(
          `input[name="sportType"][value="${defaultSport}"]`
        );
        if (radio) radio.checked = true;
      }

      dateInput.value = getLocalISODate(new Date());
    }

    updateModalPreview();
    activityModal.classList.add('is-open');
    activityModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      kmInput.focus();
      if (activityToEdit) kmInput.select();
    }, 50);
  }

  function closeActivityModal() {
    editingActivityId = null;
    activityModal.classList.remove('is-open');
    activityModal.setAttribute('aria-hidden', 'true');
  }

  function updateModalPreview() {
    const profile = getActiveProfile();
    const activities = getActiveEditionActivities(profile.activities || []);

    const baseActivities = editingActivityId
      ? activities.filter((act) => act.id !== editingActivityId)
      : activities;

    const { totalKm } = getTotals(baseActivities);
    const entered = parseFloat(String(kmInput.value).replace(',', '.'));
    const addKm = !Number.isNaN(entered) && entered > 0 ? entered : 0;
    const newTotal = Math.round((totalKm + addKm) * 100) / 100;
    previewNewTotal.textContent = `${formatKm(newTotal)} / ${GOAL_KM} km`;
  }

  dateTodayBtn.addEventListener('click', () => {
    dateInput.value = getLocalISODate(new Date());
    formError.hidden = true;
  });

  dateYesterdayBtn.addEventListener('click', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    dateInput.value = getLocalISODate(yesterday);
    formError.hidden = true;
  });

  openModalBtn.addEventListener('click', () => openActivityModal());
  emptyAddBtn.addEventListener('click', () => openActivityModal());
  closeModalBtn.addEventListener('click', closeActivityModal);
  cancelModalBtn.addEventListener('click', closeActivityModal);

  quickSportBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openActivityModal({ defaultSport: btn.getAttribute('data-quick-sport') });
    });
  });

  kmInput.addEventListener('input', () => {
    formError.hidden = true;
    updateModalPreview();
  });

  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const val = parseFloat(chip.getAttribute('data-km'));
      kmInput.value = String(val);
      formError.hidden = true;
      updateModalPreview();
      kmInput.focus();
    });
  });

  activityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dict = t();
    const sportRadio = activityForm.querySelector('input[name="sportType"]:checked');
    const sport = sportRadio ? sportRadio.value : 'Correr';
    const rawKm = String(kmInput.value).trim().replace(',', '.');
    const km = parseFloat(rawKm);
    const dateISO = dateInput.value;

    if (Number.isNaN(km) || km <= 0) {
      formError.textContent = dict.errInvalidKm;
      formError.hidden = false;
      kmInput.focus();
      return;
    }

    if (km > 300) {
      formError.textContent = dict.errMaxKm;
      formError.hidden = false;
      kmInput.focus();
      return;
    }

    if (!dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
      formError.textContent = dict.errInvalidDate;
      formError.hidden = false;
      dateInput.focus();
      return;
    }

    const profile = getActiveProfile();
    const roundedKm = Math.round(km * 100) / 100;
    const cleanNote = noteInput.value.trim();

    if (editingActivityId) {
      const target = (profile.activities || []).find((item) => item.id === editingActivityId);
      if (target) {
        target.sport = sport;
        target.km = roundedKm;
        target.dateISO = dateISO;
        target.editionYear = ACTIVE_EDITION_YEAR;
        target.note = cleanNote;
        target.updatedAt = new Date().toISOString();
      }
    } else {
      const nowIso = new Date().toISOString();
      const newActivity = {
        id: 'act_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        sport,
        km: roundedKm,
        dateISO,
        editionYear: ACTIVE_EDITION_YEAR,
        note: cleanNote,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      profile.activities.unshift(newActivity);
    }

    saveState();
    render();
    closeActivityModal();
  });

  // Edit or Delete single activity
  activityList.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-id]');
    if (editBtn) {
      const id = editBtn.getAttribute('data-edit-id');
      const profile = getActiveProfile();
      const activityToEdit = (profile.activities || []).find((item) => item.id === id);
      if (activityToEdit) {
        openActivityModal({ activityToEdit });
      }
      return;
    }

    const deleteBtn = e.target.closest('[data-delete-id]');
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-delete-id');
      const profile = getActiveProfile();
      profile.activities = (profile.activities || []).filter((item) => item.id !== id);
      saveState();
      render();
    }
  });

  // Filter activities
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter') || 'all';
      render();
    });
  });

  // Reset current edition progress
  resetAllBtn.addEventListener('click', () => {
    const profile = getActiveProfile();
    const editionActs = getActiveEditionActivities(profile.activities || []);
    if (editionActs.length === 0) return;
    const confirmed = window.confirm(t().confirmReset());
    if (!confirmed) return;
    profile.activities = (profile.activities || []).filter(
      (item) => getActivityEditionYear(item) !== ACTIVE_EDITION_YEAR
    );
    saveState();
    render();
  });

  // Language Switcher (ES <-> EN)
  langToggleBtn.addEventListener('click', () => {
    state.lang = getLang() === 'es' ? 'en' : 'es';
    saveState();
    render();
  });

  // Theme Invert (White/Black <-> Black/White)
  invertThemeBtn.addEventListener('click', () => {
    state.themeInverted = !state.themeInverted;
    saveState();
    applyTheme();
  });

  // =========================================================================
  // SHAREABLE / DOWNLOADABLE PROGRESS CARD GENERATOR (Canvas 2D)
  // =========================================================================
  function openShareModal() {
    shareFeedback.hidden = true;
    shareCardTheme = state.themeInverted ? 'dark' : 'light';
    cardThemeBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-card-theme') === shareCardTheme);
    });

    renderShareCardCanvas();
    shareModal.classList.add('is-open');
    shareModal.setAttribute('aria-hidden', 'false');
  }

  function closeShareModal() {
    shareModal.classList.remove('is-open');
    shareModal.setAttribute('aria-hidden', 'true');
  }

  openShareModalBtn.addEventListener('click', openShareModal);
  closeShareModalBtn.addEventListener('click', closeShareModal);

  formatBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      formatBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      shareCardFormat = btn.getAttribute('data-card-format') || 'story';
      shareFeedback.hidden = true;
      renderShareCardCanvas();
    });
  });

  cardThemeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      cardThemeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      shareCardTheme = btn.getAttribute('data-card-theme') || 'light';
      shareFeedback.hidden = true;
      renderShareCardCanvas();
    });
  });

  function createDiagonalStripePattern(ctx, fgColor, bgColor) {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 24;
    pCanvas.height = 24;
    const pCtx = pCanvas.getContext('2d');

    pCtx.fillStyle = bgColor;
    pCtx.fillRect(0, 0, 24, 24);

    pCtx.strokeStyle = fgColor;
    pCtx.lineWidth = 8;
    pCtx.beginPath();
    pCtx.moveTo(-12, 24);
    pCtx.lineTo(24, -12);
    pCtx.moveTo(0, 36);
    pCtx.lineTo(36, 0);
    pCtx.stroke();

    return ctx.createPattern(pCanvas, 'repeat');
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currY);
    return currY;
  }

  function renderShareCardCanvas() {
    const dict = t();
    const profile = getActiveProfile();
    const editionActs = getActiveEditionActivities(profile.activities || []);
    const { runKm, walkKm, totalKm, runCount, walkCount, totalCount } = getTotals(editionActs);

    const isStory = shareCardFormat === 'story';
    const W = 1080;
    const H = isStory ? 1350 : 1080;
    shareCanvas.width = W;
    shareCanvas.height = H;

    const ctx = shareCanvas.getContext('2d');
    const isDark = shareCardTheme === 'dark';

    const bg = isDark ? '#0a0a0a' : '#ffffff';
    const bgCard = isDark ? '#121212' : '#ffffff';
    const bgSubtle = isDark ? '#1d1d1d' : '#f3f3f3';
    const fg = isDark ? '#ffffff' : '#0a0a0a';
    const fgMuted = isDark ? '#a0a0a0' : '#555555';
    const gridDot = isDark ? '#2a2a2a' : '#dedede';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = gridDot;
    const step = 36;
    for (let gx = 24; gx < W; gx += step) {
      for (let gy = 24; gy < H; gy += step) {
        ctx.fillRect(gx, gy, 2.5, 2.5);
      }
    }

    const pad = 64;
    const cardW = W - pad * 2;
    const cardH = H - pad * 2;

    ctx.fillStyle = fg;
    ctx.fillRect(pad + 14, pad + 14, cardW, cardH);

    ctx.fillStyle = bgCard;
    ctx.fillRect(pad, pad, cardW, cardH);
    ctx.lineWidth = 5;
    ctx.strokeStyle = fg;
    ctx.strokeRect(pad, pad, cardW, cardH);

    const innerX = pad + 56;
    const innerW = cardW - 112;
    let cursorY = pad + (isStory ? 68 : 54);

    ctx.save();
    ctx.translate(innerX, cursorY + 2);
    const mScale = 1.05;
    ctx.scale(mScale, mScale);
    const mustachePath = new Path2D(
      'M60 15C54 4 44 2 34 5C23 8 17 24 9 23C6 22.5 4.5 18 3 13C1.5 22 6 37 21 41C36 45 51 39 60 28C69 39 84 45 99 41C114 37 118.5 22 117 13C115.5 18 114 22.5 111 23C103 24 97 8 86 5C76 2 66 4 60 15Z'
    );
    ctx.fillStyle = fg;
    ctx.fill(mustachePath);
    ctx.restore();

    const titleX = innerX + 142;
    const kickerText = dict.brandEditionKicker(ACTIVE_EDITION_YEAR);
    ctx.fillStyle = fgMuted;
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText(kickerText, titleX, cursorY + 14);
    const kickerW = ctx.measureText(kickerText).width;

    ctx.fillStyle = fg;
    ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(dict.brandTitle, titleX, cursorY + 50);
    const titleW = ctx.measureText(dict.brandTitle).width;

    const leftHeaderEnd = titleX + Math.max(kickerW, titleW) + 24;
    const maxBadgeW = Math.max(180, innerX + innerW - leftHeaderEnd);

    const rawUser = state.user
      ? (state.user.name || state.user.email || 'MOVEMBER').split('@')[0].trim()
      : `MOVEMBER ${ACTIVE_EDITION_YEAR}`;
    const userLine = rawUser.length > 26 ? rawUser.slice(0, 25).toUpperCase() + '…' : rawUser.toUpperCase();
    const todayFormatted = new Date()
      .toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      .toUpperCase();

    let userFontSize = 15;
    ctx.font = `700 ${userFontSize}px "JetBrains Mono", monospace`;
    while (ctx.measureText(userLine).width + 32 > maxBadgeW && userFontSize > 11) {
      userFontSize -= 1;
      ctx.font = `700 ${userFontSize}px "JetBrains Mono", monospace`;
    }
    const line1W = ctx.measureText(userLine).width;

    ctx.font = '600 13px "JetBrains Mono", monospace';
    const line2W = ctx.measureText(todayFormatted).width;

    const badgeW = Math.min(maxBadgeW, Math.max(line1W, line2W) + 32);
    const badgeH = 54;
    const badgeX = innerX + innerW - badgeW;
    const badgeY = cursorY - 2;

    ctx.fillStyle = bgSubtle;
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.lineWidth = 3;
    ctx.strokeStyle = fg;
    ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

    ctx.fillStyle = fg;
    ctx.font = `700 ${userFontSize}px "JetBrains Mono", monospace`;
    ctx.fillText(userLine, badgeX + 16, badgeY + 23);

    ctx.fillStyle = fgMuted;
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText(todayFormatted, badgeX + 16, badgeY + 43);

    cursorY += isStory ? 95 : 78;

    ctx.beginPath();
    ctx.moveTo(innerX, cursorY);
    ctx.lineTo(innerX + innerW, cursorY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = fg;
    ctx.stroke();

    cursorY += isStory ? 75 : 56;

    ctx.fillStyle = fgMuted;
    ctx.font = '700 22px "JetBrains Mono", monospace';
    ctx.fillText(dict.editionEyebrow(ACTIVE_EDITION_YEAR), innerX, cursorY);

    cursorY += isStory ? 132 : 112;

    const mainKmStr = formatKm(totalKm);
    ctx.fillStyle = fg;
    ctx.font = `700 ${isStory ? 136 : 116}px "JetBrains Mono", monospace`;
    ctx.fillText(mainKmStr, innerX, cursorY);
    const mainKmWidth = ctx.measureText(mainKmStr).width;

    ctx.fillStyle = fgMuted;
    ctx.font = `600 ${isStory ? 56 : 48}px "JetBrains Mono", monospace`;
    ctx.fillText('/ 60 km', innerX + mainKmWidth + 22, cursorY);

    cursorY += isStory ? 54 : 42;

    const remaining = Math.max(0, Math.round((GOAL_KM - totalKm) * 100) / 100);
    const isCompleted = totalKm >= GOAL_KM;
    const extra = Math.round((totalKm - GOAL_KM) * 100) / 100;
    const statusStr = isCompleted
      ? extra > 0
        ? dict.goalCompletedExtra(formatKm(extra))
        : dict.goalCompletedExact
      : dict.remainingKm(formatKm(remaining));

    ctx.font = '700 21px "JetBrains Mono", monospace';
    const statusW = Math.min(innerW, ctx.measureText(statusStr).width + 38);
    ctx.fillStyle = isCompleted ? fg : bgSubtle;
    ctx.fillRect(innerX, cursorY, statusW, 48);
    ctx.lineWidth = 3;
    ctx.strokeStyle = fg;
    ctx.strokeRect(innerX, cursorY, statusW, 48);

    ctx.fillStyle = isCompleted ? bgCard : fg;
    ctx.fillText(statusStr, innerX + 19, cursorY + 31);

    cursorY += isStory ? 92 : 76;

    const barH = isStory ? 78 : 66;
    ctx.fillStyle = bgSubtle;
    ctx.fillRect(innerX, cursorY, innerW, barH);

    const runRatio = Math.min(runKm / GOAL_KM, 1);
    const remainingCap = Math.max(0, 1 - runRatio);
    const walkRatio = Math.min(walkKm / GOAL_KM, remainingCap);

    const runW = Math.round(innerW * runRatio);
    const walkW = Math.round(innerW * walkRatio);

    if (runW > 0) {
      ctx.fillStyle = fg;
      ctx.fillRect(innerX, cursorY, runW, barH);
    }

    if (walkW > 0) {
      ctx.fillStyle = createDiagonalStripePattern(ctx, fg, bgCard);
      ctx.fillRect(innerX + runW, cursorY, walkW, barH);
    }

    [0.25, 0.5, 0.75].forEach((ratio) => {
      const tx = innerX + Math.round(innerW * ratio);
      ctx.beginPath();
      ctx.moveTo(tx, cursorY);
      ctx.lineTo(tx, cursorY + barH);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = fgMuted;
      ctx.stroke();
    });

    ctx.lineWidth = 4.5;
    ctx.strokeStyle = fg;
    ctx.strokeRect(innerX, cursorY, innerW, barH);

    cursorY += barH + 32;

    ctx.fillStyle = fgMuted;
    ctx.font = '700 20px "JetBrains Mono", monospace';
    const scaleMarks = ['0 km', '15 km', '30 km', '45 km', '60 km'];
    scaleMarks.forEach((label, idx) => {
      const ratio = idx / 4;
      const lw = ctx.measureText(label).width;
      let lx = innerX + innerW * ratio - lw / 2;
      if (idx === 0) lx = innerX;
      if (idx === 4) lx = innerX + innerW - lw;
      ctx.fillText(label, lx, cursorY);
    });

    cursorY += isStory ? 68 : 48;

    const gap = 24;
    const boxW = Math.floor((innerW - gap * 2) / 3);
    const boxH = isStory ? 185 : 148;

    const cardsData = [
      {
        title: dict.sportRunUpper,
        value: `${formatKm(runKm)} km`,
        meta: dict.sessionsCount(runCount),
        solidHeader: true
      },
      {
        title: dict.sportWalkUpper,
        value: `${formatKm(walkKm)} km`,
        meta: dict.sessionsCount(walkCount),
        solidHeader: false
      },
      {
        title: dict.cardSessionsLabel,
        value: String(totalCount),
        meta: `${formatKm(totalKm)} / 60 km`,
        solidHeader: false
      }
    ];

    cardsData.forEach((c, idx) => {
      const bx = innerX + idx * (boxW + gap);
      ctx.fillStyle = bgCard;
      ctx.fillRect(bx, cursorY, boxW, boxH);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = fg;
      ctx.strokeRect(bx, cursorY, boxW, boxH);

      ctx.font = '700 17px "JetBrains Mono", monospace';
      const tagW = Math.min(boxW - 32, ctx.measureText(c.title).width + 24);
      ctx.fillStyle = c.solidHeader ? fg : bgSubtle;
      ctx.fillRect(bx + 20, cursorY + 20, tagW, 34);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = fg;
      ctx.strokeRect(bx + 20, cursorY + 20, tagW, 34);

      ctx.fillStyle = c.solidHeader ? bgCard : fg;
      ctx.fillText(c.title, bx + 32, cursorY + 43);

      ctx.fillStyle = fg;
      ctx.font = `700 ${isStory ? 44 : 36}px "JetBrains Mono", monospace`;
      ctx.fillText(c.value, bx + 20, cursorY + (isStory ? 116 : 98));

      ctx.fillStyle = fgMuted;
      ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(c.meta, bx + 20, cursorY + (isStory ? 154 : 130));
    });

    const footerY = pad + cardH - (isStory ? 85 : 68);
    ctx.beginPath();
    ctx.moveTo(innerX, footerY - 34);
    ctx.lineTo(innerX + innerW, footerY - 34);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = fg;
    ctx.stroke();

    ctx.fillStyle = fg;
    ctx.font = '700 18px "JetBrains Mono", monospace';
    wrapCanvasText(ctx, dict.cardQuote, innerX, footerY, innerW, 26);
  }

  function showShareFeedback(msg) {
    shareFeedback.textContent = msg;
    shareFeedback.hidden = false;
  }

  downloadCardBtn.addEventListener('click', () => {
    renderShareCardCanvas();
    const dataUrl = shareCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `movember-${ACTIVE_EDITION_YEAR}-60km.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showShareFeedback(t().downloadedFeedback);
  });

  copyCardBtn.addEventListener('click', () => {
    renderShareCardCanvas();
    if (!navigator.clipboard || !window.ClipboardItem) {
      showShareFeedback(t().copyErrorFeedback);
      return;
    }

    shareCanvas.toBlob(async (blob) => {
      if (!blob) {
        showShareFeedback(t().copyErrorFeedback);
        return;
      }
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        showShareFeedback(t().copiedFeedback);
      } catch (err) {
        console.error('Error copying canvas image:', err);
        showShareFeedback(t().copyErrorFeedback);
      }
    }, 'image/png');
  });

  if (nativeShareCardBtn) {
    nativeShareCardBtn.addEventListener('click', () => {
      renderShareCardCanvas();
      const dict = t();
      const profile = getActiveProfile();
      const editionActs = getActiveEditionActivities(profile.activities || []);
      const { totalKm } = getTotals(editionActs);
      const caption = dict.shareCaptionText(formatKm(totalKm), GOAL_KM, ACTIVE_EDITION_YEAR);
      const fileName = `movember-${ACTIVE_EDITION_YEAR}-60km.png`;

      shareCanvas.toBlob(async (blob) => {
        if (!blob) {
          showShareFeedback(dict.copyErrorFeedback);
          return;
        }

        // 1. Mobile / Modern Browsers with native Web Share API Level 2 (Instagram Stories, WhatsApp, etc.)
        if (typeof File !== 'undefined' && navigator.share && navigator.canShare) {
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: dict.pageTitle,
                text: caption
              });
              showShareFeedback(dict.sharedFeedback);
              return;
            } catch (err) {
              if (err && err.name === 'AbortError') return;
            }
          }
        }

        // 2. Desktop fallback: Copy image to clipboard (for Ctrl+V) and open WhatsApp Web
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          }
        } catch (err) {
          // Ignore clipboard error on fallback
        }
        window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, '_blank', 'noopener');
        showShareFeedback(dict.whatsappFallbackFeedback);
      }, 'image/png');
    });
  }

  // Close modals on Escape or backdrop click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (activityModal.classList.contains('is-open')) closeActivityModal();
      if (shareModal.classList.contains('is-open')) closeShareModal();
      if (authModal.classList.contains('is-open')) closeAuthModal();
    }
  });

  [activityModal, shareModal, authModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal === activityModal) closeActivityModal();
        if (modal === shareModal) closeShareModal();
        if (modal === authModal) closeAuthModal();
      }
    });
  });

  // Expose edition range helper for upcoming Strava step
  window.MovemberEdition = {
    getActiveMovemberYear,
    getMovemberEditionRange
  };

  // Initial render & Cloud Auth/Firestore listener
  render();
  initFirebaseCloud();
  checkStravaOAuthCallback();
})();
