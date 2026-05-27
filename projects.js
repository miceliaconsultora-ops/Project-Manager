// Datos de los proyectos para el Tablero de Comando
window.projectsData = [
  {
    id: "control-stock",
    name: "Control Stock V2",
    category: "Mobile",
    description: "Aplicación móvil para la preparación de entregas contra stock y control de despacho por cliente, integrada con Google Drive y Apps Script.",
    status: "active", // active | completed | pending-review
    progress: 75,
    nextStep: {
      action: "Probar en celular con Expo Go (cámara, SQLite, sincronización) y compilar APK para preview.",
      responsible: "Diego R.",
      deadline: "2026-05-29"
    },
    history: [
      { date: "2026-05-26", note: "Flujo completo de entrega probado con Google Drive y Apps Script en entorno de preview web." },
      { date: "2026-05-26", note: "Estructuración de base de datos local SQLite y reglas anti-reutilización verificadas con manifest_version." }
    ]
  },
  {
    id: "grunbau",
    name: "Maestro de Productos Grunbau",
    category: "Data",
    description: "Pipeline de extracción de ítems de facturas de compra (digitales y escaneadas vía OCR Tesseract) para construir un maestro unificado de productos con precios de referencia.",
    status: "completed",
    progress: 100,
    nextStep: {
      action: "Sin pendientes inmediatos.",
      responsible: "N/A",
      deadline: "N/A"
    },
    history: [
      { date: "2026-05-05", note: "Fase 2 de OCR concluida con 720 productos unificados y 21 proveedores activos en Maestro_Productos_Grunbau.xlsx." },
      { date: "2026-04-08", note: "Fase 1 concluida con extracción digital de 17 listas de precios individuales por proveedor." }
    ]
  },
  {
    id: "lampe",
    name: "Proyecto Lampe (Bot WhatsApp)",
    category: "IA & Bot",
    description: "Sistema de atención y prefiltrado administrativo/triage por WhatsApp para clínica de fisioterapia utilizando la plataforma Runamatic.",
    status: "active",
    progress: 20,
    nextStep: {
      action: "Reunión con el cliente para definir reglas de triage y alcance del MVP.",
      responsible: "Diego R.",
      deadline: "2026-05-27"
    },
    history: [
      { date: "2026-05-26", note: "Reunión con el cliente programada para el 27/05 para definir alcance del MVP." },
      { date: "2026-05-26", note: "Investigación de API y backup local concluida. Se determinó que los flujos visuales deberán reconstruirse manualmente." },
      { date: "2026-05-26", note: "Se definió priorizar Runamatic sobre desarrollo propio para acelerar el MVP y validar con clínica real." }
    ]
  },
  {
    id: "nl2query",
    name: "NL2Query (VB6 a SQL)",
    category: "IA & Python",
    description: "Traductor de lenguaje natural a sentencias SQL sobre vistas del ERP, integrado como sidecar HTTP local para la aplicación legacy en Visual Basic 6.",
    status: "active",
    progress: 50,
    nextStep: {
      action: "Gestión de suscripción para habilitar la API real de Anthropic (Claude) en el sidecar local.",
      responsible: "Atika",
      deadline: "2026-05-28"
    },
    history: [
      { date: "2026-05-26", note: "Stress test finalizado con éxito: 48/48 consultas SQL ejecutadas de forma correcta contra GRUNBAU_PROD y BERTOOLS_PROD." },
      { date: "2026-05-26", note: "Estructuración de prompts semánticos por vista y base_rules consolidada para compatibilidad con SQL Server 2008 (compat-100)." }
    ]
  }
];
