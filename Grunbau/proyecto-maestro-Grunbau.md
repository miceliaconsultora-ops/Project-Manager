---
id: grunbau
name: Maestro de Productos Grunbau
category: Data
status: active
progress: 80
description: Pipeline de extracción de ítems de facturas de compra (digitales y escaneadas vía OCR Tesseract) para construir un maestro unificado de productos con precios de referencia.
next_step_action: Definir los criterios y rango de fechas para la extracción de recepciones a partir de facturas de compra.
next_step_responsible: Atika
next_step_deadline: 2026-06-06
---

# Proyecto Maestro de Productos Grunbau
*Registro de avance — última actualización: 26 mayo 2026*
- EXTENDER PLAZO HASTA EL 06-06-2026

---

## Objetivo

Construir un maestro unificado de productos con precios de referencia, a partir de las facturas de compra de Grunbau/Bertools, con listas de precios individuales por proveedor listas para consulta y comparación.

---

## Arquitectura general

- **Fuente de datos:** Facturas PDF de Bertools (digitales + escaneadas)
- **Pipeline:** PDF → extracción Python → JSON limpio → merge con dedup → XLSX maestro + pricelists
- **Criterio de dedup:** por código de proveedor (si existe) o por descripción normalizada, dentro del mismo CUIT. En caso de duplicado, gana el precio más reciente.
- **Exclusiones:** CUIT 30715401467 (AWARE SOLUTIONS — proveedor IT, no industrial)

---

## Fases ejecutadas

### Fase 1 — Extracción facturas digitales Bertools
**Período:** 6 al 8 de abril de 2026

Facturas en PDF con texto extraíble (no escaneadas). Se desarrollaron tres versiones del extractor hasta lograr cobertura y precisión adecuadas.

**Scripts producidos:**
- `extractor.py` → `extractor2.py` → `extractor3.py` (6 abr)
- `extract_headers.py` → `extract_headers2.py` → `extract_headers3.py` (7 abr)
- `extractor_v2.py` — versión final con soporte multi-proveedor y detección de moneda (8 abr)
- `reextract_desc.py` — recuperación de descripciones truncadas (7 abr)
- `build_final.py` → `build_maestro.py` → `build_pricelists.py` — construcción del maestro y pricelists (7–8 abr)

**Resultado al 8 de abril:**
- `items_raw_v2.json` — 1.193 ítems extraídos de facturas digitales
- `Maestro_Productos_Grunbau.xlsx` — **676 productos**, 20 proveedores
- `Comparacion_Maestro_vs_Base.xlsx` — análisis de cobertura vs. base preexistente
- `Proveedores_Bertools_20260408.xlsx` — resumen de proveedores detectados
- **17 pricelists** individuales `{CUIT}_20260408.xlsx`

Proveedores incluidos en esta fase: AREVALO VILMA, LA CASA DE LAS HERRAMIENTAS, PROSEIND, COMERCIAL ARGENTINA, CERRO INDUMENTARIA, ITC INTERNATIONAL TEXTIL, PINTURAS SRL, DATUM, COMASEG, PIRAGINE, ACETO, LOGA, PATAGONIA EPP, AÑELO CORRALÓN, ALBORELLI, LOGIQUEN, INSPECCIÓN DE CORROSIÓN EN FORMACIÓN.

---

### Fase 2 — OCR facturas escaneadas Bertools
**Fecha:** 5 de mayo de 2026

Segunda tanda de facturas: 81 PDFs escaneados (imágenes), sin texto extraíble directamente. Se procesaron con Tesseract OCR y se aplicó limpieza iterativa de artefactos.

**Scripts producidos:**
- `prescreening.py` — análisis previo de facturas digitales pendientes (5 may)
- `extractor_nuevas.py` — extracción de ítems adicionales de facturas digitales (5 may) → `items_nuevas.json` (35 ítems)
- `ocr_prescreening.py` — clasificación de PDFs escaneados antes de OCR completo (5 may)
- `extractor_ocr.py` — extractor OCR con corrección de artefactos Tesseract (5 may) → `items_ocr.json` (43 ítems raw)
- `merge_maestro.py` — merge base v2 + nuevas (5 may)
- `merge_ocr.py` — merge final con items OCR limpios (5 may)

**Proveedores nuevos incorporados en esta fase:**
- ACEROS SANCHEZ (CUIT 30710839960)
- TODO SANITARIO Y GAS (CUIT 30718172582)

**Correcciones OCR aplicadas (ejemplos):**
- `'SLERRA TRASP SIN PAR 20MM —'` → `'SIERRA TRASP SIN PAR 20MM'`
- `'PISTULA PARA BARRA DE SILICON'` → `'PISTOLA PARA BARRA DE SILICON'`
- `'LIMPIADOR DE ESPUMA POLIURETANICA PENO:! 21.00 8,834.93...'` → `'LIMPIADOR ESPUMA POLIURETANICA PENOSIL'`
- `'zOMÁ. SINT, 62 X 1LT AZUL FRA'` → `'ESMALTE SINT. X 1LT AZUL FRANCE'`
- Eliminación de prefijos de cantidad/código OCR y de datos de precio embebidos en descripción

**Resultado al 5 de mayo:**
- `items_ocr_clean.json` — 43 ítems OCR corregidos (ORM SRL: 29, AGÜERA: 6, PIRAGINE: 5, ACEROS SANCHEZ: 2, TODO SANITARIO Y GAS: 1)
- `Maestro_Productos_Grunbau.xlsx` — **720 productos**, 21 proveedores *(versión vigente)*
- **5 pricelists** regeneradas `{CUIT}_20260505.xlsx`:
  - `27243889842` — AGÜERA CLAUDIA (8 ítems)
  - `30710839960` — ACEROS SANCHEZ (2 ítems)
  - `30712213856` — ORM SRL (37 ítems)
  - `30714239348` — PIRAGINE HNOS. S.R.L. (152 ítems)
  - `30718172582` — TODO SANITARIO Y GAS (1 ítem)

---

## Estado del maestro (versión vigente)

| Indicador | Valor |
|---|---|
| Productos totales | 720 |
| Proveedores activos | 21 |
| Fecha maestro | 5 mayo 2026 |
| Archivo | `Maestro_Productos_Grunbau.xlsx` |

**Top proveedores por cantidad de ítems:**

| Proveedor | Ítems |
|---|---|
| LA CASA DE LAS HERRAMIENTAS S.A. | 225 |
| PIRAGINE HNOS. S.R.L. | 152 |
| LOGA S.A.S. | 106 |
| PROSEIND S.A. | 67 |
| ORM SRL | 37 |

---

## Archivos de salida (carpeta Factuas)

| Archivo | Descripción | Fecha |
|---|---|---|
| `Maestro_Productos_Grunbau.xlsx` | Maestro unificado vigente | 05/05/2026 |
| `{CUIT}_20260408.xlsx` | Pricelists fase 1 (17 proveedores) | 08/04/2026 |
| `{CUIT}_20260505.xlsx` | Pricelists fase 2 actualizadas (5 proveedores) | 05/05/2026 |
| `Comparacion_Maestro_vs_Base.xlsx` | Análisis cobertura vs base preexistente | 08/04/2026 |
| `Proveedores_Bertools_20260408.xlsx` | Resumen proveedores detectados | 08/04/2026 |

---

## Pendientes / próximos pasos

27/05/2026

- CREAR "RECEPCIONES" A PARTIR DE LAS FACTURAS:
  - DECISIONES A TOMAR: 
  - DESDE CUANDO SE VAN A TOMAR LAS FACTURAS
  - DEFINIR EL PIPLINE DE EXTRACCIÓN Y CREACIÓN DE RECEPCIONES

- RESPONSABLE:
  - ATIKA: DEFINIR LOS CRITERIOS PARA LA EXTRACCIÓN

- DEFINIDOS LOS CRITERIOS. 
  - DIEGO R. SE ENCARGARÁ DEL DESARROLLO. 

---

## Registro de Avance
- 2026-05-27: Inicio de fase de Recepciones: Atika debe definir criterios para la extracción y Diego R. desarrollará el pipeline.
- 2026-05-05: Fase 2 de OCR concluida con 720 productos unificados y 21 proveedores activos en Maestro_Productos_Grunbau.xlsx.
- 2026-04-08: Fase 1 concluida con extracción digital de 17 listas de precios individuales por proveedor.