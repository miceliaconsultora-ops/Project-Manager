---
id: dashboard
name: Tablero de Comando (Dashboard)
category: Management
status: completed
progress: 100
description: Aplicación web estática y dinámica para organizar, filtrar y seguir en tiempo real todos los proyectos de desarrollo y gestión administrativa.
next_step_action: Sin pendientes inmediatos.
next_step_responsible: N/A
next_step_deadline: N/A
---

# Proyecto Maestro - Tablero de Comando (Dashboard)

Este archivo centraliza el contexto, los roles del equipo y la arquitectura del propio **Tablero de Comando** (Dashboard de Proyectos). Su objetivo es servir de referencia para los agentes de IA y los desarrolladores, evitando tener que reexplicar el contexto general del espacio de trabajo en cada sesión.

---

## Objetivo General

Centralizar, organizar y dar visibilidad al estado y próximos pasos de todos los desarrollos activos de la operación. El tablero sirve como punto de control y coordinación del equipo.

---

## Roles y Responsabilidades del Equipo

El equipo y la división de tareas dentro de los proyectos se definen de la siguiente manera:

*   **Atika:**
    *   **Responsabilidad:** Gestión de cuestiones de suscripciones (APIs, plataformas), tareas administrativas, operativas y financieras generales de los proyectos.
*   **Diego R. (Usuario):**
    *   **Responsabilidad:** Desarrollo de software en todo lo relativo a Inteligencia Artificial (IA) y/o Python, desarrollo full-stack o cualquier otro componente que **no** involucre específicamente Visual Basic 6 (VB6).
    *   **Metodología:** La mayor parte del desarrollo se realiza de forma agéntica con IA utilizando *vibe coding*.
*   **Diego B.:**
    *   **Responsabilidad:** Desarrollo y mantenimiento exclusivo de los componentes legacy en **Visual Basic 6 (VB6)** (por ejemplo, el ERP legacy y la integración del lado del cliente en NL2Query).

---

## Proyectos en el Tablero

El tablero de comando da seguimiento a los siguientes desarrollos, cada uno documentado en su respectivo archivo maestro:

1.  **[Control Stock V2](file:///c:/Antigravity/Project%20Manager/Control%20Stock/proyecto-ControlStock.md)** (Mobile / React Native / SQLite / Google Apps Script)
2.  **[Maestro de Productos Grunbau](file:///c:/Antigravity/Project%20Manager/Grunbau/proyecto-maestro-Grunbau.md)** (Data / Python / OCR)
3.  **[Proyecto Lampe - Bot WhatsApp](file:///c:/Antigravity/Project%20Manager/Lampe/proyecto-lampe.md)** (IA & Bot / Runamatic)
4.  **[NL2Query - VB6 a SQL](file:///c:/Antigravity/Project%20Manager/NL2Query/proyecto-NL2Query.md)** (IA & Python / FastAPI / Claude API / VB6)
5.  **[Tablero de Comando (Dashboard)](file:///c:/Antigravity/Project%20Manager/proyecto-Dashboard.md)** (Management / HTML / CSS / JS / Python)

---

## Arquitectura y Mecanismo de Sincronización del Dashboard

El Dashboard está construido como una aplicación web estática ubicada en la raíz del proyecto. Los componentes visuales se actualizan dinámicamente en el cliente al recargar la página:
*   [index.html](file:///c:/Antigravity/Project%20Manager/index.html) - Estructura y maquetación principal.
*   [styles.css](file:///c:/Antigravity/Project%20Manager/styles.css) - Estilos modernos y responsivos.
*   [app.js](file:///c:/Antigravity/Project%20Manager/app.js) - Lógica de renderizado de tarjetas, cálculo de estadísticas y filtros.
*   [projects.js](file:///c:/Antigravity/Project%20Manager/projects.js) - Base de datos en memoria (Array JS) con los datos del tablero.

### Funcionamiento de la Automatización

El sistema automatizado de sincronización se compone de tres piezas clave:

1.  **Script de Sincronización Local ([sync_projects.py](file:///c:/Antigravity/Project%20Manager/sync_projects.py)):**
    Es un script en Python que escanea recursivamente el directorio del workspace en busca de archivos `.md`. Para cada archivo detectado, extrae los datos estructurados y reescribe [projects.js](file:///c:/Antigravity/Project%20Manager/projects.js).

2.  **Script de Integración y Push ([push_changes.ps1](file:///c:/Antigravity/Project%20Manager/push_changes.ps1)):**
    Es un script en PowerShell que:
    *   Ejecuta `sync_projects.py` para regenerar la base de datos del dashboard.
    *   Realiza las operaciones de control de versiones: agrega los archivos modificados (`git add .`), realiza un commit con fecha y hora actual, y sube los cambios al repositorio en GitHub (`git push origin main`).
    *   Controla el flujo de excepciones para evitar que PowerShell aborte la ejecución con las salidas de progreso habituales de Git en stderr.

3.  **Tarea Programada en Windows (`ProjectManager-DailySync`):**
    Mediante el script [schedule_task.ps1](file:///c:/Antigravity/Project%20Manager/schedule_task.ps1) se registra una tarea programada diaria a nivel de usuario en Windows que corre a las **19:00**. Esta tarea arranca `push_changes.ps1` en segundo plano (modo oculto).

---

## Reglas de Formato para Archivos de Proyecto (`.md`)

Para que un proyecto sea detectado e incorporado correctamente al Dashboard por el script de sincronización, debe cumplir con las siguientes reglas:

1.  **Cabecera de Metadatos (YAML Frontmatter):**
    Debe ubicarse al inicio exacto del archivo, delimitado por `---`, e incluir la siguiente estructura obligatoria:
    ```yaml
    ---
    id: identificador-unico-del-proyecto
    name: Nombre Visible del Proyecto
    category: Categoría (p. ej. Mobile, Data, IA & Bot, Management)
    status: active | completed | pending-review
    progress: 80 # Entero de 0 a 100
    description: Descripción corta y concisa del proyecto.
    next_step_action: Próximo paso inmediato a ejecutar.
    next_step_responsible: Nombre del responsable (p. ej. Diego R., Atika, Diego B.)
    next_step_deadline: AAAA-MM-DD
    ---
    ```

2.  **Sección de Historial (Registro de Avance):**
    El script buscará una sección con el encabezado de segundo nivel `## Registro de Avance` (o también `## Historial` o `## Bitácora`). Cada hito del historial debe declararse en una lista de viñetas con el formato de fecha exacto `AAAA-MM-DD`:
    ```markdown
    ## Registro de Avance
    - 2026-05-27: Hito o avance detallado aquí.
    - 2026-05-26: Otro avance anterior.
    ```

---

## Registro de Avance
- 2026-05-27: Desarrollado el script de sincronización local (sync_projects.py) y la automatización del push diario a GitHub (push_changes.ps1/schedule_task.ps1).
- 2026-05-27: Se crea el archivo maestro del Dashboard (proyecto-Dashboard.md) y se agrega como proyecto en el tablero.


