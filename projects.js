// Datos de los proyectos para el Tablero de Comando
// ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE por sync_projects.py. NO EDITAR DIRECTAMENTE.
window.projectsData = [
  {
    "id": "dashboard",
    "name": "Tablero de Comando (Dashboard)",
    "category": "Management",
    "description": "Aplicación web estática y dinámica para organizar, filtrar y seguir en tiempo real todos los proyectos de desarrollo y gestión administrativa.",
    "status": "completed",
    "progress": 100,
    "isMicelia": false,
    "nextStep": {
      "action": "Sin pendientes inmediatos.",
      "responsible": "N/A",
      "deadline": "N/A"
    },
    "history": [
      {
        "date": "N/A",
        "note": "Sin novedades registradas en el archivo markdown."
      }
    ]
  },
  {
    "id": "control-stock",
    "name": "Control Stock V2",
    "category": "Mobile",
    "description": "Aplicación móvil para la preparación de entregas contra stock y control de despacho por cliente, integrada con Google Drive y Apps Script.",
    "status": "active",
    "progress": 75,
    "isMicelia": false,
    "nextStep": {
      "action": "Evaluar la posibilidad de desarrollar Flask-API o ejecutable local para la hidratación y recolección de la app.",
      "responsible": "Diego R.",
      "deadline": "2026-06-02"
    },
    "history": [
      {
        "date": "2026-05-28",
        "note": "Surgió un inconveniente en el canal web. Se evalúa desarrollar una Flask-API o un ejecutable local para hidratar/recolectar datos de la app."
      },
      {
        "date": "2026-05-28",
        "note": "Ya creamos el task plan. Se hará una integración con Google Drive Desktop a cargo de Diego R."
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
      "action": "Presentación del presupuesto finalizado al cliente.",
      "responsible": "Diego R.",
      "deadline": "2026-06-29"
    },
    "history": [
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
    "progress": 10,
    "isMicelia": true,
    "nextStep": {
      "action": "Crear la web de inscripción al curso, nombrar cursos y crear contenidos.",
      "responsible": "Diego R.",
      "deadline": "2026-06-02"
    },
    "history": [
      {
        "date": "2026-05-30",
        "note": "Se creó el proyecto y la primera versión de la web de inscripción."
      }
    ]
  },
  {
    "id": "zenfit",
    "name": "Proyecto Zenfit",
    "category": "IA & Bot",
    "description": "Acompañar a Zenfit en el onboarding de MiduApp, el CRM elegido para el gimnasio.",
    "status": "active",
    "progress": 15,
    "isMicelia": true,
    "nextStep": {
      "action": "Reunión para charlar sobre el onboarding de usuarios, planificar capacitaciones y escuchar detalles de migración. Estarán presentes Diego R., Midu y Zenfit.",
      "responsible": "Diego R. y Cliente",
      "deadline": "2026-06-01"
    },
    "history": [
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
    "progress": 50,
    "isMicelia": false,
    "nextStep": {
      "action": "Gestión de suscripción para habilitar la API real de Anthropic (Claude) en el sidecar local.",
      "responsible": "Atika",
      "deadline": "2026-05-28"
    },
    "history": [
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
