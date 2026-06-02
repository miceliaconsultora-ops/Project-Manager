// Datos de los proyectos para el Tablero de Comando
// ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE por sync_projects.py. NO EDITAR DIRECTAMENTE.
window.projectsData = [
  {
    "id": "control-stock",
    "name": "Control Stock V2",
    "category": "Mobile",
    "description": "Aplicación móvil para la preparación de entregas contra stock y control de despacho por cliente, integrada con Google Drive y Apps Script.",
    "status": "active",
    "progress": 75,
    "isMicelia": false,
    "nextStep": {
      "action": "Desarrollo y testeo de la APK.",
      "responsible": "Diego R.",
      "deadline": "2026-06-06"
    },
    "history": [
      {
        "date": "2026-06-01",
        "note": "Se modificó la modalidad de entrega (posibilidad de envío one touch de la carga terminada por cliente) y se confeccionó el presupuesto y documento técnico para el cliente."
      },
      {
        "date": "2026-05-31",
        "note": "Se generó documento técnico para presentar al cliente. Debe presentarse, responsable. Atika"
      },
      {
        "date": "2026-05-28",
        "note": "Surgió un inconveniente en el canal web. Se evalúa desarrollar una Flask-API o un ejecutable local para hidratar/recolectar datos de la app."
      },
      {
        "date": "2026-05-28",
        "note": "20.30hs.: Ya creamos el task plan. Se hará una integración con Google Drive Desktop a cargo de Diego R."
      },
      {
        "date": "2026-05-26",
        "note": "Flujo completo de entrega probado con Google Drive y Apps Script en entorno de preview web."
      },
      {
        "date": "2026-05-26",
        "note": "Estructuración de base de datos local SQLite y reglas anti-reutilización verificadas con manifest_version."
      }
    ]
  },
  {
    "id": "grunbau",
    "name": "Maestro de Productos Grunbau",
    "category": "Data",
    "description": "Pipeline de extracción de ítems de facturas de compra (digitales y escaneadas vía OCR Tesseract) para construir un maestro unificado de productos con precios de referencia.",
    "status": "active",
    "progress": 80,
    "isMicelia": false,
    "nextStep": {
      "action": "Definir los criterios y rango de fechas para la extracción de recepciones a partir de facturas de compra.",
      "responsible": "Atika",
      "deadline": "2026-05-30"
    },
    "history": [
      {
        "date": "2026-05-27",
        "note": "Inicio de fase de Recepciones: Atika debe definir criterios para la extracción y Diego R. desarrollará el pipeline."
      },
      {
        "date": "2026-05-05",
        "note": "Fase 2 de OCR concluida con 720 productos unificados y 21 proveedores activos en Maestro_Productos_Grunbau.xlsx."
      },
      {
        "date": "2026-04-08",
        "note": "Fase 1 concluida con extracción digital de 17 listas de precios individuales por proveedor."
      }
    ]
  },
  {
    "id": "lampe",
    "name": "Proyecto Lampe (Bot WhatsApp)",
    "category": "IA & Bot",
    "description": "Sistema de atención y prefiltrado administrativo/triage por WhatsApp para clínica de fisioterapia utilizando la plataforma Runamatic.",
    "status": "active",
    "progress": 20,
    "isMicelia": false,
    "nextStep": {
      "action": "Esperar respuesta del cliente sobre el presupuesto entregado.",
      "responsible": "Cliente",
      "deadline": "N/A"
    },
    "history": [
      {
        "date": "2026-05-30",
        "note": "Presupuesto entregado. A la espera de la respuesta del cliente (plazo de 30 días para responder)."
      },
      {
        "date": "2026-05-29",
        "note": "Presupuesto entregado: Próximos pasos, a la espera de la aprobación del cliente, para comennzar demo y MVP."
      },
      {
        "date": "2026-05-28",
        "note": "Presupuesto finalizado. Se acordó la presentación al cliente el lunes 29/06."
      },
      {
        "date": "2026-05-27",
        "note": "Reunión con el cliente concluida. Se definió que el MVP se realizará con Runamatic. Próximo paso: redacción de presupuesto."
      },
      {
        "date": "2026-05-26",
        "note": "Reunión con el cliente programada para el 27/05 para definir alcance del MVP."
      },
      {
        "date": "2026-05-26",
        "note": "Investigación de API y backup local concluida. Se determinó que los flujos visuales deberán reconstruirse manualmente."
      },
      {
        "date": "2026-05-26",
        "note": "Se definió priorizar Runamatic sobre desarrollo propio para acelerar el MVP y validar con clínica real."
      }
    ]
  },
  {
    "id": "charla-siteba",
    "name": "Charlas de IA para SITEBA",
    "category": "Capacitación & IA",
    "description": "Brindar 4 charlas sobre IA en el mundo laboral bancario/financiero para la central gremial y gremio de trabajadores bancarios.",
    "status": "active",
    "progress": 25,
    "isMicelia": true,
    "nextStep": {
      "action": "Crear la web de inscripción, nombrar cursos y crear contenidos.",
      "responsible": "Diego R.",
      "deadline": "2026-06-02"
    },
    "history": [
      {
        "date": "2026-06-01",
        "note": "Modificado Formulario."
      },
      {
        "date": "2026-05-31",
        "note": "Incorporar logos y modificar formulario. Esperar más información por parte del gremio."
      },
      {
        "date": "2026-05-30",
        "note": "Primera versión de la web de inscripción creada. A la espera de información y contenidos por parte del gremio."
      }
    ]
  },
  {
    "id": "zenfit",
    "name": "Proyecto Zenfit",
    "category": "IA & Bot",
    "description": "Acompañar a Zenfit en el onboarding de MiduApp, el CRM elegido para el gimnasio.",
    "status": "active",
    "progress": 25,
    "isMicelia": true,
    "nextStep": {
      "action": "Zenfit probará la app; Diego R. comunicará resultados y coordinará nueva reunión.",
      "responsible": "Diego R. y Cliente",
      "deadline": "N/A"
    },
    "history": [
      {
        "date": "2026-06-01",
        "note": "Reunión con Zenfit. Se definieron datos 100% necesarios y no negociables que debe incluirse."
      },
      {
        "date": "2026-05-28",
        "note": "Inicio de la consultoría de onboarding para MiduApp CRM."
      }
    ]
  },
  {
    "id": "nl2query",
    "name": "NL2Query (VB6 a SQL)",
    "category": "IA & Python",
    "description": "Traductor de lenguaje natural a sentencias SQL sobre vistas del ERP, integrado como sidecar HTTP local para la aplicación legacy en Visual Basic 6.",
    "status": "active",
    "progress": 60,
    "isMicelia": false,
    "nextStep": {
      "action": "Incorporar código y formulario de prueba a VB6 y pasar el instalador.",
      "responsible": "Diego B.",
      "deadline": "2026-06-06"
    },
    "history": [
      {
        "date": "2026-06-01",
        "note": "Finalizada etapa M2, capas de seguridad probadas. Finalizado todo desarrollo posible fuera de VB6 de M3, se creó el archivo .bas, se desarrolló el código necesario, solo falta la incorporación y compilación en VB6 para hacer una prueba."
      },
      {
        "date": "2026-05-31",
        "note": "Revisión exitosa de sentencias SQL creadas por la API."
      },
      {
        "date": "2026-05-26",
        "note": "Stress test finalizado con éxito: 48/48 consultas SQL ejecutadas de forma correcta contra GRUNBAU_PROD y BERTOOLS_PROD."
      },
      {
        "date": "2026-05-26",
        "note": "Estructuración de prompts semánticos por vista y base_rules consolidada para compatibilidad con SQL Server 2008 (compat-100)."
      }
    ]
  }
];
