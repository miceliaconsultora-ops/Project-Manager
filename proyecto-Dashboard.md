---
id: dashboard
name: Tablero de Comando (Dashboard)
category: Management
status: active
progress: 60
description: Aplicación web estática y dinámica para organizar, filtrar y seguir en tiempo real todos los proyectos de desarrollo y gestión administrativa.
next_step_action: Desarrollar un script que actualice projects.js leyendo de forma automática las novedades desde los archivos .md.
next_step_responsible: Diego R.
next_step_deadline: 2026-05-31
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

El tablero de comando actualmente da seguimiento a los siguientes desarrollos, cada uno documentado en su respectivo archivo maestro:

1.  **[Control Stock V2](file:///c:/Antigravity/Project%20Manager/Control%20Stock/proyecto-ControlStock.md)** (Mobile / React Native / SQLite / Google Apps Script)
2.  **[Maestro de Productos Grunbau](file:///c:/Antigravity/Project%20Manager/Grunbau/proyecto-maestro-Grunbau.md)** (Data / Python / OCR)
3.  **[Proyecto Lampe - Bot WhatsApp](file:///c:/Antigravity/Project%20Manager/Lampe/proyecto-lampe.md)** (IA & Bot / Runamatic)
4.  **[NL2Query - VB6 a SQL](file:///c:/Antigravity/Project%20Manager/NL2Query/proyecto-NL2Query.md)** (IA & Python / FastAPI / Claude API / VB6)

---

## Arquitectura y Mecanismo de Actualización del Dashboard

El Dashboard está construido como una aplicación web estática pero dinámica en el cliente, ubicada en la raíz del proyecto:
*   [index.html](file:///c:/Antigravity/Project%20Manager/index.html) - Estructura y maquetación principal.
*   [styles.css](file:///c:/Antigravity/Project%20Manager/styles.css) - Estilos modernos y responsivos.
*   [app.js](file:///c:/Antigravity/Project%20Manager/app.js) - Lógica de renderizado de tarjetas, cálculo de estadísticas y filtros.
*   [projects.js](file:///c:/Antigravity/Project%20Manager/projects.js) - Base de datos en memoria (Array JS) con los datos del tablero.

### Idea de Actualización Automática a Demanda

La actualización del archivo [projects.js](file:///c:/Antigravity/Project%20Manager/projects.js) se realiza de forma que lea las últimas novedades de cada proyecto directamente desde su archivo `.md` particular. 

Esto se puede ejecutar mediante:
1.  **Llamada a un script local (Python/Node):** Un script que parsee cada `.md` del proyecto, extraiga el "Estado actual", "Registro de avance" / "Historial", "Progreso" y "Próximos pasos", y reescriba [projects.js](file:///c:/Antigravity/Project%20Manager/projects.js).
2.  **Actualización guiada por Agente de IA:** El agente lee los archivos `.md` de los proyectos modificados y edita [projects.js](file:///c:/Antigravity/Project%20Manager/projects.js) sincronizando el progreso, fechas límites (`deadline`), responsables e historial de avances de cada tarjeta del tablero de comando.

---

## Registro de Avance
- 2026-05-27: Se crea el archivo maestro del Dashboard (proyecto-Dashboard.md) y se agrega como proyecto en el tablero.

