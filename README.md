# 🥸 Movember — Reto 60 KM (`movember-60km`)

Aplicación web de diseño editorial en **blanco y negro puro** para registrar, sincronizar y compartir el progreso del **Reto de los 60 KM de Movember** (60 kilómetros corriendo o caminando durante noviembre por los 60 hombres que perdemos por suicidio cada hora en el mundo).

🔗 **Demo en vivo:** [https://movember-60km.netlify.app/](https://movember-60km.netlify.app/)

---

## ✨ Características principales

- **Barra de progreso visual en kilómetros (`0–60 km`)**:
  - Diferencia visualmente los kilómetros de **Correr** (relleno negro sólido) frente a los de **Caminar** (trama de líneas diagonales).
- **Sincronización automática con Strava (`OAuth 2.0`)**:
  - Función *serverless* en Netlify (`/.netlify/functions/strava`) que conecta con la API v3 de Strava e importa automáticamente todas las actividades de noviembre (`Run`, `TrailRun`, `VirtualRun`, `Walk`, `Hike`, `Snowshoe`).
- **Sincronización multidispositivo en tiempo real (`Firebase`)**:
  - Funciona al instante en modo local (`localStorage`) sin registro obligatorio y permite iniciar sesión con **Google**, **Strava** o **Correo y contraseña** mediante **Firebase Authentication + Cloud Firestore**.
- **Generador de Tarjeta de Progreso (`HTML5 Canvas 2D`)**:
  - Genera tarjetas de alta resolución en formato **Vertical Stories (`1080×1350`)** y **Cuadrado Post (`1080×1080`)** en tema Blanco o Negro.
  - Integración con **Web Share API (`navigator.share`)** para compartir directamente en **Instagram Stories** y **WhatsApp** desde el móvil, además de copia al portapapeles y descarga en PNG.
- **Bilingüe (`ES / EN`) y Modo Contraste (`B / N`)**:
  - Cambio instantáneo de idioma (Español / Inglés) e inversión completa de paleta blanco/negro.

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: HTML5 semántico, CSS3 (Custom Properties, diseño *brutalist/editorial* monocromático, responsive), JavaScript Vanilla (`ES6+`, `Canvas 2D API`, `Web Share API`).
- **Backend / Serverless**: Node.js sobre **Netlify Functions** ([`netlify/functions/strava.js`](./netlify/functions/strava.js)).
- **Base de datos y Autenticación**: **Firebase Auth** & **Cloud Firestore**.
- **Despliegue**: **Netlify**.

---

## 📂 Estructura del proyecto

```text
├── index.html                  # Estructura principal, cabeceras y modales
├── styles.css                  # Sistema de diseño editorial en blanco y negro
├── app.js                      # Lógica de estado, i18n, Canvas 2D, Firebase y Strava
├── firebase-config.js          # Configuración pública del proyecto Firebase y Client ID
├── netlify.toml                # Reglas de redirección y cabeceras de seguridad
├── netlify/
│   └── functions/
│       └── strava.js           # Función serverless para OAuth 2.0 y API de Strava
└── WALKTHROUGH_ARQUITECTURA.md # Documentación técnica detallada de la arquitectura
```

---

## 👤 Autor

Desarrollado por **Mario Rodríguez Ortega**.
