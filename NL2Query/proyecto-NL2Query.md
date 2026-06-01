---
id: nl2query
name: NL2Query (VB6 a SQL)
category: IA & Python
status: active
progress: 50
description: Traductor de lenguaje natural a sentencias SQL sobre vistas del ERP, integrado como sidecar HTTP local para la aplicación legacy en Visual Basic 6.
next_step_action: Continuar desarrollo.
next_step_responsible: Diego R.
next_step_deadline: 2026-06-07
---

# NL2Query — Estado consolidado del proyecto

**Cliente interno:** ATIKA
**Última actualización:** 2026-05-26
**Estado:** Piloto técnico **validado contra dos DBs reales** (48/48 SQL correctos). Listo para habilitar Claude API en el sidecar.

---

## 1. Resumen ejecutivo

Sistema que permite al usuario de una aplicación legacy en Visual Basic 6 escribir un pedido en lenguaje natural (español rioplatense) dentro de la pantalla "Filtrar en Grilla", y recibir automáticamente la sentencia SQL equivalente sobre la vista que el menú activo está mostrando. El SQL se inserta en el constructor de filtros existente del legacy; el usuario revisa y aplica.

**Stack:**
- **Generación de SQL desde NL:** Claude API (Sonnet 4.6 por defecto), con OpenAI como alternativa intercambiable vía adapter.
- **Integración con legacy VB6:** servicio local HTTP (sidecar Python + FastAPI).
- **Base de datos:** SQL Server (validado contra `GRUNBAU_PROD` y `BERTOOLS_PROD`).

El sidecar corre como proceso liviano (`nl2query.exe`) en la misma PC del usuario. No requiere cambios de infraestructura ni modificación de la base de datos.

> **Cambio de alcance original:** el proyecto era "Voice2Query" (voz → texto → SQL). Se simplificó a **texto → SQL**, eliminando Whisper API y captura de audio. La arquitectura es la misma, más liviana.

---

## 2. Arquitectura del sistema

### Flujo de una consulta

1. Usuario abre una pantalla del menú del legacy. La clase del form ya tiene armado un `SELECT * FROM VIEW_GRD_X [WHERE filtro_previo] [ORDER BY campo]` que alimenta la grilla.
2. Usuario abre "Filtrar en Grilla" y escribe: *"facturas de abril 2026 con saldo pendiente"*.
3. Presiona el nuevo botón **Generar condiciones**.
4. VB6 hace `POST http://localhost:8765/nl2sql` con `{ texto, sql_base }`.
5. El sidecar parsea `sql_base` con `sqlglot`, extrae el nombre de la vista del `FROM`, y selecciona el system prompt correspondiente (cacheado).
6. El sidecar llama a Claude API pasando el texto NL y el SQL base como contexto. Recibe el SQL final combinado.
7. El sidecar valida el output con `sqlglot` (solo SELECT, solo vistas whitelisteadas, sin funciones prohibidas en compat-100) y devuelve el SQL como string plano.
8. VB6 muestra el SQL al usuario o lo aplica a la grilla.
9. Usuario aplica el filtro con el botón habitual.

**Por qué `sql_base` y no `vista`:** el mapeo `form → vista` no existe en el legacy y requeriría relevar manualmente cientos de forms. El SELECT base trae la vista en el `FROM` y, gratis, el contexto de cualquier filtro previo del usuario.

### Diagrama

```
┌──────────────────────────┐  POST /nl2sql           ┌──────────────────────────┐
│  App VB6                 │ ─{texto, sql_base}────► │  Sidecar NL2Query        │
│                          │                         │                          │
│  - Tiene el SELECT base  │ ◄── SQL plano ───────── │  - sqlglot parse →       │
│    armado por el form    │                         │    extrae vista del FROM │
│  - Lo manda + texto NL   │                         │  - Carga prompt[vista]   │
│  - Recibe SQL final      │                         │  - Llama a Claude con    │
│  - Lo aplica al grid     │                         │    sql_base como ctx     │
└──────────────────────────┘                         │  - Valida output sqlglot │
                                                     └──────────────────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────────┐
                                                    │  Anthropic Claude    │
                                                    │  (Sonnet 4.6)        │
                                                    └──────────────────────┘
```

---

## 3. Estado del proyecto

### ✅ Hecho

- Análisis y diseño completo del flujo.
- Pivot de diseño: `{ texto, sql_base }` resuelve el mapeo menú→vista sin trabajo manual.
- Identificación del universo de vistas filtrables: **`VIEW_GRD_*`** + lista corta de excepciones documentadas (~201 vistas en GRUNBAU_PROD).
- Selección de 3 vistas piloto con cobertura representativa:
  - **`VIEW_GRD_FACTURAS_CLIENTES`** (67 columnas) — core de facturación.
  - **`VIEW_GRD_COMPROBANTES_CLIENTES`** (65 columnas) — análisis fiscal con desglose por alícuota.
  - **`VIEW_GRD_REMITOS_CLIENTES`** (19 columnas) — entregas físicas.
- DDLs extraídos, catálogos maestros del ERP mapeados (TIPOS_COMPROBANTES, MONEDAS, CONDICIONES_DE_IVA, CONDICIONES_PAGO, PROVINCIAS, FORMAS_ENTREGA).
- **`base_rules.md`** + 3 system prompts + 3 descriptores semánticos `.json` creados en [sidecar/llm/prompts/](sidecar/llm/prompts/).
- **Validación contra dos DBs reales del ERP: 48/48 SQL correctos.**
- Roadmap a etapa 2 (NL global sin contexto de menú) documentado con artefactos puente sin retrabajo.

### ⏳ Pendiente

- **M1.1** — Scaffolding del sidecar Python (FastAPI + truststore + estructura).
- **M1.2** — `LLMClient` interface + cliente Anthropic real con prompt caching, endpoint `/nl2sql`.
- **M1.3** — Suite de eval automatizada con las 48 frases del stress test como fixtures.
- **M1.4** — Validar costos reales con la suite y proyectar consumo mensual.
- **M2** — Capa de seguridad (validador `sqlglot` + whitelist + rechazo de features incompatibles).
- **M3** — Integración VB6 (módulo HTTP cliente + botón nuevo + wiring al constructor de filtros).
- **M4** — Empaquetado (PyInstaller + servicio Windows + script de instalación).
- **M5** — Piloto con cliente real.

### ➡️ Próximo paso inmediato

**Habilitar Claude API en el sidecar** (ver §8 — "Próximo paso").

---

## 4. Validación realizada (stress test)

### Suite de fixtures

48 frases en lenguaje natural cubriendo: filtros temporales relativos ("este mes", "año pasado") y absolutos ("abril 2026"), agregados (SUM/COUNT), TOP N + ORDER BY, polimorfismo de tipos de comprobante (FC/CF/NC/CC/CD), LIKE sobre descripciones de catálogo, multi-filtro, manejo de género del estado (EMITIDA vs EMITIDO), motivos de anulación, valores declarados, observaciones, IVA por alícuota, percepciones, redondeo, etc.

### Resultados

| DB | Datos | Resultado |
|---|---|---|
| **GRUNBAU_PROD** (restauración nueva, datos limitados) | FACTURAS 66 / COMPROBANTES 66 / REMITOS 57 | **30/30** SQL ejecutables ✅ |
| **BERTOOLS_PROD** (segunda DB del ERP, más volumen y diversidad) | FACTURAS 198 / COMPROBANTES 198 / REMITOS 112 + 4 años de datos, 5 clientes, 4 usuarios, 4 provincias | **48/48** SQL ejecutables ✅ (30 originales + 18 nuevas que aprovechan la diversidad) |

### Pruebas adicionales con OpenAI real (sesión inicial)

| Modelo | Acierto sobre 10 frases | Costo/query | Latencia |
|---|---|---|---|
| GPT-4o | 7/10 | $0.0031 | 1.5s |
| GPT-4o-mini | 9/10 | $0.00019 | 1.2s |

Confirma que la cadena de prompts + validación funciona contra API real. La medición contra Claude API real es el próximo paso (M1.3).

### Lo que NO ejercitamos todavía (pendiente para piloto futuro)

Ambas DBs validadas son de empresas que operan con IVA 21% únicamente. Estos paths del prompt están sintácticamente correctos pero esperan un cliente con esa diversidad fiscal para validación semántica:

- IVA al 10.5% / 27%
- Percepciones (IVA, IIBB CABA, IIBB BSAS)
- Redondeos de factura
- Letras B/C/M/E (solo se vio A y X)

---

## 5. Hallazgos críticos (consolidados)

### 5.1 La DB corre en `compatibility_level = 100`

Aunque el servidor es SQL Server 2022, las DBs del ERP corren en compat-100 (modo retrocompatible SQL Server 2008). Esto rompe funciones modernas que el LLM podría generar instintivamente.

| Prohibidas en compat-100 | Reemplazo válido |
|---|---|
| `TRY_CONVERT`, `TRY_CAST` | `CONVERT` o evitar conversión |
| `IIF` | `CASE WHEN ... THEN ... ELSE ... END` |
| `STRING_AGG`, `CONCAT_WS` | `STUFF(... FOR XML PATH(''))` |
| `DATEFROMPARTS`, `TIMEFROMPARTS` | `CONVERT(date, 'YYYY-MM-DD')` |
| `STRING_SPLIT`, `JSON_*`, `OFFSET-FETCH` | Equivalentes manuales |
| `LAG`/`LEAD` con default alternativos | Sin esos defaults |

**Acción:** restricción explícita incluida en [base_rules.md](sidecar/llm/prompts/base_rules.md) §3.

### 5.2 Fechas en `varchar` formato `DD/MM/YYYY`

Las columnas de fecha (`FAC_EMISION`, `RCL_EMISION`, etc.) son `varchar(10)`. El orden alfabético **no coincide** con el cronológico (`'01/04/2026'` < `'30/03/2026'` alfabéticamente).

Patrón seguro (sin `TRY_CONVERT`, compat con SQL Server 2008):

```sql
-- Año:    SUBSTRING(FAC_EMISION, 7, 4) = '2026'
-- Mes:    SUBSTRING(FAC_EMISION, 4, 2) = '03'
-- Rango:  SUBSTRING(c,7,4)+SUBSTRING(c,4,2)+SUBSTRING(c,1,2) BETWEEN '20260301' AND '20260331'
-- Igualdad: FAC_EMISION = '26/05/2026'
```

**Optimización por vista:** `VIEW_GRD_FACTURAS_CLIENTES` expone `DIA`, `MES`, `ANIO` pre-extraídos — preferir esos en lugar de `SUBSTRING`.

### 5.3 La fecha actual hay que inyectarla en cada request

"Hoy", "ayer", "mes pasado", "este año" son inservibles sin contexto. El sidecar debe inyectar `FECHA_ACTUAL: DD/MM/YYYY` al final del system prompt en cada llamada a la API.

### 5.4 La regla TOP tiene una excepción

Regla original: "Nunca uses TOP". Corrección: cuando el pedido es semánticamente "la más cara", "los 5 más recientes", "el último", `TOP N` o subquery con `MAX/MIN` es necesario. Regla iterada:

> "NO uses TOP para limitar arbitrariamente. SÍ usá TOP N o subquery con MAX/MIN cuando el pedido lo requiera semánticamente."

### 5.5 Los catálogos deben ser EXHAUSTIVOS en el prompt

GPT-4o falló 3 queries en el piloto inicial por asumir que "factura" significaba `FAC_SUPERTIPO = 'FC'`, ignorando `CF` (electrónica MiPyMEs). La regla iterada (válida para todo el ERP):

| "factura" en NL | `FAC_SUPERTIPO IN ('FC', 'CF')` |
|---|---|
| "factura tradicional" | `FAC_SUPERTIPO = 'FC'` |
| "factura electrónica MiPyME" | `FAC_SUPERTIPO = 'CF'` |
| "nota de crédito" | `FAC_SUPERTIPO IN ('NC', 'CC')` |

### 5.6 SSL en Windows con proxy/AV

La máquina del piloto tiene inspección SSL (proxy corporativo o antivirus). Ni `certifi` ni `openssl` por defecto pueden validar el cert de `api.openai.com` / `api.anthropic.com`. **Solución obligatoria al inicio del entrypoint del sidecar:**

```python
import truststore
truststore.inject_into_ssl()  # Usa el cert store nativo de Windows
```

### 5.7 Los catálogos maestros del ERP son consistentes entre clientes

Validación clave de la sesión: `TIPOS_COMPROBANTES` (36 entradas con IDs/SUPERTIPOS/APLICAs), `MONEDAS`, `CONDICIONES_DE_IVA`, `CONDICIONES_PAGO`, `PROVINCIAS`, `FORMAS_ENTREGA` son **idénticos en estructura e IDs** entre GRUNBAU_PROD y BERTOOLS_PROD. Vienen "de fábrica" en el ERP.

**Implicación:** [base_rules.md](sidecar/llm/prompts/base_rules.md) **no necesita adaptación por cliente**. Sirve igual para todos los deploys del mismo ERP. Solo cambian los datos transaccionales.

### 5.8 La naturaleza de los datos varía por empresa

Aunque la estructura del ERP es la misma, **el uso varía mucho entre clientes**:

| Aspecto | GRUNBAU | BERTOOLS |
|---|---|---|
| Moneda dominante | Dólares (65/66) | Pesos (196/198) |
| Provincia dominante | Neuquén | CABA |
| Cliente dominante | Halliburton | Halliburton (también) |
| Naturaleza de NCs | `NCAF` (anulación de FC) | `NCAC` (pago a cuenta) |
| Letras de factura | A solamente | A (132) + X (66) |

**Implicación:** el system prompt **no debe asumir** distribuciones de datos. Debe basarse solo en estructura + catálogos. Frases como "facturas en pesos" deben funcionar igual en cualquier cliente.

---

## 6. Decisiones técnicas (consolidadas)

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Sidecar HTTP local | Shell + parseo stdout | Mantiene prompt cache vivo, feedback en tiempo real, errores estructurados |
| Python + FastAPI | .NET COM Interop | Ecosistema LLM/SQL más maduro |
| **Claude Sonnet 4.6 por defecto** | Opus 4.7 | 5x más barato con calidad suficiente; Opus solo si la calidad lo requiere |
| OpenAI como vendor alternativo (adapter) | Migrar todo a OpenAI o solo Claude | Anthropic tiene prompt caching nativo más maduro; algunos clientes prefieren OpenAI por contrato |
| Validación con `sqlglot` | Regex sobre el SQL | Regex no entiende dialecto, falsos negativos garantizados |
| Comparación de fechas con `SUBSTRING` reordenado | `TRY_CONVERT`/`CONVERT` | Compat-100 no tiene `TRY_CONVERT`; `CONVERT` falla con fechas mal formateadas |
| `truststore` para SSL en Windows | `certifi` + `REQUESTS_CA_BUNDLE` | El proxy/AV del entorno hace inspección SSL; truststore usa el cert nativo donde está el cert del proxy |
| Payload `{ texto, sql_base }` | Payload `{ texto, vista }` con mapeo externo | Cero relevamiento manual; mapeo automático del FROM con sqlglot; contexto de filtros previos viaja gratis |
| Confirmación humana del SQL antes de aplicar | Auto-ejecución | Reduce riesgo de queries mal interpretadas; el usuario sigue teniendo control |
| Output del LLM = string SQL plano | JSON con metadata | El legacy solo necesita el string; menos parseo, menos errores |
| System prompts por vista (modulares) | Un prompt monolítico para toda la DB | Prompt más corto = más rápido + más barato (caching efectivo) + más fácil de mantener |
| Descriptores semánticos `.json` por vista | Solo prompts | Artefacto puente a etapa 2 (router de vistas); cero overhead en etapa 1 |

---

## 7. Catálogos del ERP (compartidos por todos los clientes)

Estos catálogos vienen "de fábrica" en el ERP y son consistentes entre clientes. Documentados completos en [base_rules.md](sidecar/llm/prompts/base_rules.md) §6.

| Catálogo | Cardinalidad | Uso en prompts |
|---|---|---|
| `TIPOS_COMPROBANTES` | 36 IDs con SUPERTIPO (FC/NC/ND/CF/CC/CD) y APLICA (C/P/A) | Mapeo de `FAC_TIPO` a descripción larga |
| `MONEDAS` | 7 (Pesos/Dolares/Libras/Yens/Euros + 2 variantes de DOLAR IMPO) | Filtros por moneda |
| `CONDICIONES_DE_IVA` | 13 (RI, Monotributo, CF, Exento, etc.) | Filtros por condición fiscal del cliente |
| `CONDICIONES_PAGO` | 17-31 según cliente | Filtros como "a 30 días", "contado", "cheque" |
| `PROVINCIAS` | 30-33 (incluye internacionales) | Filtros geográficos |
| `FORMAS_ENTREGA` | 8 | Filtros de logística (solo aplica a remitos/pedidos) |

---

## 8. ➡️ Próximo paso — Habilitar Claude API

### Objetivo

Implementar el sidecar Python mínimo que conecte los prompts ya creados con la API real de Anthropic, ejecutar la suite de 48 fixtures, y medir acierto real + costo real.

### Pasos concretos

#### M1.1 — Scaffolding (~1 h)

1. Crear `pyproject.toml` con dependencias: `fastapi`, `uvicorn`, `anthropic`, `openai`, `sqlglot`, `truststore`, `python-dotenv`, `httpx`.
2. Crear `sidecar/main.py` con:
   - `truststore.inject_into_ssl()` como primera línea (antes de cualquier import HTTP).
   - FastAPI app con endpoint `/healthz`.
   - Lectura de `.env` (claves API ya están).
3. Estructura de carpetas según §9 (`sidecar/llm/client.py`, `sidecar/llm/anthropic_client.py`, `sidecar/sql/validator.py`, `sidecar/api/routes.py`).

#### M1.2 — Cliente Claude real con endpoint `/nl2sql` (~2-3 h)

1. **`sidecar/llm/client.py`** — interface `LLMClient` con método `generate_sql(texto: str, sql_base: str) -> str`.
2. **`sidecar/llm/anthropic_client.py`** — implementación con prompt caching (cache de `base_rules.md` + system prompt de vista). Modelo: `claude-sonnet-4-6`.
3. **`sidecar/api/routes.py`** — endpoint `POST /nl2sql`:
   - Parsea `sql_base` con `sqlglot`, extrae nombre de vista del `FROM`.
   - Valida que la vista esté en whitelist (`VIEW_GRD_*` + excepciones).
   - Carga `prompts/{vista}.md` + `base_rules.md`.
   - Inyecta `FECHA_ACTUAL` actual.
   - Llama a `LLMClient.generate_sql(...)`.
   - Valida output con `sqlglot` (solo SELECT, sin funciones prohibidas, sin INSERT/UPDATE/DELETE).
   - Devuelve SQL como string plano.

#### M1.3 — Suite de eval automatizada (~2 h)

1. **`tests/fixtures/ejemplos_por_vista.json`** — las 48 frases NL como fixtures con metadatos: vista esperada, palabras clave del SQL esperado, etc.
2. **`tests/test_nl2sql_eval.py`** — script que:
   - Itera las 48 fixtures.
   - Llama al endpoint `/nl2sql` con cada una.
   - Ejecuta el SQL devuelto contra `BERTOOLS_PROD` (la DB con más diversidad).
   - Valida: ejecuta sin error + devuelve filas coherentes + no contiene funciones prohibidas.
   - Reporta acierto y costo total.

#### M1.4 — Análisis de costo real (~1 h)

Con la suite corrida contra Claude Sonnet 4.6 con prompt caching activo:
- Medir tokens entrada / salida / cache hits.
- Costo real por consulta.
- Proyección mensual por perfil de usuario (liviano/medio/intensivo).
- Comparativa actualizada vs estimación de §11.

### Decisiones a tomar antes de arrancar M1.2

1. **¿Confirmamos Claude Sonnet 4.6 como default?** (vs Haiku 4.5 que es 3x más barato pero quizás peor en SQL complejo). Recomendación: arrancar con Sonnet, evaluar Haiku después con la suite ya armada.
2. **¿Prompt caching de día 1?** Recomendación: sí. El prompt `base_rules.md` + system prompt de vista representa ~80% del prompt total → con cache la latencia y el costo se reducen ~5x. Anthropic lo soporta nativo.
3. **¿Logging estructurado desde día 1?** Recomendación: sí. JSONL local con cada request (texto NL, vista extraída, SQL generado, tokens, latencia, status). Es el dataset puente para la etapa 2 (ver §10).

### Lo que NO hace falta hacer todavía

- M2 (validador completo de seguridad): basta con el check mínimo en M1.2.
- M3 (integración VB6): el sidecar es independiente. Diego confirma cuándo arrancamos integración.
- M4 (empaquetado PyInstaller/NSSM): solo cuando vayamos a piloto real.

### Tiempo estimado total para M1

**~6-8 horas** para llegar a un sidecar funcional con suite automatizada y costo medido.

---

## 9. Estructura de archivos del proyecto

### Estructura objetivo

```
NL2Query/
├── proyecto-NL2Query.md            # Este documento (estado consolidado)
├── README.md                        # Quick start (cuando arme M1.1)
├── .env                             # API keys (gitignored) ✅ existe
├── .env.example                     # Plantilla (a crear)
├── .gitignore                       # ✅ existe
├── pyproject.toml                   # Dependencias Python (a crear)
├── sidecar/
│   ├── main.py                      # FastAPI app + truststore init
│   ├── llm/
│   │   ├── client.py                # LLMClient interface
│   │   ├── anthropic_client.py      # Implementación Claude
│   │   ├── openai_client.py         # Implementación OpenAI
│   │   └── prompts/                 # ✅ Ya creados
│   │       ├── base_rules.md
│   │       ├── view_grd_facturas_clientes.md
│   │       ├── view_grd_facturas_clientes.descriptor.json
│   │       ├── view_grd_comprobantes_clientes.md
│   │       ├── view_grd_comprobantes_clientes.descriptor.json
│   │       ├── view_grd_remitos_clientes.md
│   │       └── view_grd_remitos_clientes.descriptor.json
│   ├── sql/
│   │   ├── validator.py             # sqlglot + whitelist
│   │   └── parser.py                # Extracción de vista del FROM
│   └── api/
│       └── routes.py                # /nl2sql /healthz /vistas
├── vb6/
│   ├── modNL2Query.bas              # Wrapper MSXML2.XMLHTTP
│   └── ejemplo_integracion.md
├── tests/
│   ├── test_validator.py            # Adversariales (no debe pasar DELETE)
│   ├── test_nl2sql_eval.py          # Suite de evaluación (48 fixtures)
│   └── fixtures/
│       └── ejemplos_por_vista.json
└── scripts/
    ├── build_exe.ps1                # PyInstaller
    └── install_service.ps1          # NSSM
```

### Archivos existentes (al cierre de esta sesión)

- [proyecto-NL2Query.md](proyecto-NL2Query.md) — este documento.
- [.env](.env) y [.gitignore](.gitignore).
- [test_openai.py](test_openai.py) — throwaway de la primera sesión (eliminable cuando esté M1.2).
- [resultados_gpt-4o.json](resultados_gpt-4o.json) y [resultados_gpt-4o-mini.json](resultados_gpt-4o-mini.json) — outputs del comparativo OpenAI.
- [sidecar/llm/prompts/](sidecar/llm/prompts/) — los 7 archivos de prompts y descriptores.

---

## 10. Roadmap a futuro — etapa 2

Documenta decisiones de la etapa 1 (actual) deliberadamente orientadas a habilitar la etapa 2 sin retrabajo.

### Etapa 1 (en curso)
NL dentro del contexto de un menú. El usuario navega a una pantalla y, dentro del filtro de esa grilla, escribe NL. El sidecar recibe `{ texto, sql_base }` y genera SQL acotado a la vista del `sql_base`.

### Etapa 2 (futura)
NL global, sin contexto de menú. El usuario escribe NL en un campo global (o asistente) sin haber navegado. El sistema decide qué vista atacar a partir del NL → requiere un **router de vistas** nuevo.

### Cómo la etapa 1 alimenta la etapa 2 (sin retrabajo)

| Artefacto de etapa 1 | Uso en etapa 2 |
|---|---|
| **System prompts modulares por vista** | Bloque reutilizable: el router decide la vista, después se carga su prompt tal cual |
| **Descriptor semántico por vista** (`.json` ya creados) | Input principal del router para mapear NL → vista candidata |
| **Logging estructurado de cada request** (a implementar en M1.3) | Dataset real para entrenar/evaluar el router |
| **Whitelist consolidada de vistas habilitadas** | Universo sobre el que el router puede decidir |
| **Glosario del cliente** (a recolectar en M5) | Términos específicos que el router también necesita |

### Costo extra en M1 para dejarlo preparado

- ~1-2 h: logging estructurado a JSONL local (sidecar). Una línea por consulta, solo metadata (no datos del cliente).
- Descriptores semánticos: ya creados, cero costo adicional.
- Cero impacto en la API externa del sidecar.

### Lo que NO se diseña en etapa 1

- El router en sí (LLM-as-router vs clasificador vs RAG). Las decisiones de arquitectura se toman cuando hay datos reales de producción.
- Relaciones entre vistas (joins implícitos, jerarquías). Si etapa 2 las necesita, se construyen entonces.

### Riesgo a mitigar dentro de etapa 1

Si etapa 2 quisiera atacar vistas que **nunca aparecen en un menú** (y por lo tanto nunca se loggean), el dataset no las cubre. **Mitigación adoptada:** al consolidar la whitelist de etapa 1, generar un **catálogo completo de `VIEW_GRD_*`** con descriptor mínimo aunque la vista no se active todavía. Etapa 2 arranca con cobertura total del universo.

---

## 11. Costos operativos estimados

### Por consulta

| Modelo | Sin cache | Con prompt caching | Notas |
|---|---|---|---|
| **Claude Sonnet 4.6** | ~$0.005 | ~$0.001 | Recomendado por defecto |
| Claude Haiku 4.5 | ~$0.0015 | ~$0.0003 | Si la calidad alcanza (evaluar en M1.3) |
| GPT-4o | $0.0031 (medido) | n/a | Para clientes que prefieren OpenAI |
| GPT-4o-mini | $0.00019 (medido) | n/a | Mejor relación precio/calidad en OpenAI |

### Proyección mensual por usuario

| Perfil | Consultas/día | Costo/mes (Sonnet con cache) | Costo/mes (GPT-4o-mini) |
|---|---|---|---|
| Liviano (5) | 150/mes | ~$0.20 | ~$0.03 |
| Medio (20) | 600/mes | ~$0.80 | ~$0.12 |
| Intensivo (100) | 3.000/mes | ~$4 | ~$0.60 |

Pass-through directo al proveedor de API. Contemplar en la tarifa al cliente final.

> **Pendiente:** medir costo real con Claude API en M1.4 y actualizar esta tabla.

---

## 12. Estimación de horas totales

| # | Milestone | Horas | Estado |
|---|---|---|---|
| **M1** | Sidecar Python: cliente Claude (con truststore, prompt caching, adapter OpenAI), endpoint `/nl2sql`, suite de eval | **6-10 h** | Pendiente |
| **M2** | Capa de seguridad: validación sqlglot, whitelist de vistas, rechazo de features incompatibles | **4-8 h** | Pendiente |
| **M3** | Integración VB6: módulo HTTP cliente, botón nuevo, inserción en constructor de filtros | **10-16 h** | Pendiente |
| **M4** | Empaquetado: PyInstaller, servicio Windows con NSSM, `.env` por cliente, script de instalación | **6-10 h** | Pendiente |
| **M5** | Piloto con cliente real: glosario de términos, observabilidad, docs operativos | **10-16 h** | Pendiente |
| **Total** | | **36-60 h** | ~1.5 semanas |

---

## 13. Bitácora compacta

### 2026-05-26 (sesión completa)

**Fase 1 — Piloto inicial:**
- Pivot del proyecto: voz → texto. Voice2Query → NL2Query.
- Introspección de GRUNBAU_PROD via MCP. Detectado: 500+ vistas, compat-100, fechas en varchar.
- 3 vistas piloto iniciales (no-GRD), 46/46 SQLs correctos en pruebas simuladas.
- Pruebas OpenAI reales: GPT-4o 7/10, GPT-4o-mini 9/10.
- 6 hallazgos críticos documentados.

**Fase 2 — Pivot de arquitectura:**
- Diego confirma: mapeo menú→vista no existe en el legacy.
- SELECTs del legacy son uniformes (`SELECT * FROM <vista> WHERE <filtro> ORDER BY <campo>`) y disponibles para enviarse íntegros.
- **Decisión:** payload pasa a `{ texto, sql_base }`. El sidecar extrae la vista del FROM con sqlglot. Elimina relevamiento manual.

**Fase 3 — Corrección sobre universo de vistas:**
- Diego aclara: los filtros aplican casi exclusivamente sobre `VIEW_GRD_*` (201 vistas en GRUNBAU). El piloto inicial estaba sobre vistas no-GRD → re-relevar.

**Fase 4 — Re-piloto sobre VIEW_GRD_*:**
- DB GRUNBAU casi vacía → terna piloto ajustada: FACTURAS + COMPROBANTES + REMITOS (todas con datos del lado cliente).
- DDLs + catálogos extraídos. `base_rules.md` + 3 prompts + 3 descriptores creados.
- **Stress test: 30/30 SQL correctos.**

**Fase 5 — Validación con BERTOOLS_PROD:**
- Segunda DB del ERP con 3x más datos y mucha más diversidad.
- Catálogos maestros confirmados consistentes entre clientes.
- **Stress test ampliado: 48/48 SQL correctos** (30 originales + 18 nuevas).
- Limitación: ninguna de las dos DBs tiene IVA 10.5%/27% ni percepciones — esos paths quedarán validados con un futuro cliente con esa diversidad fiscal.

**Fase 6 — Roadmap:**
- Documentado roadmap a etapa 2 (router de vistas).
- Decisiones de etapa 1 deliberadamente orientadas a habilitar etapa 2 sin retrabajo.

### Próxima sesión

**Habilitar Claude API** (M1.1 + M1.2 + M1.3 + M1.4 — total ~6-8 horas):
1. Scaffolding del sidecar (`pyproject.toml`, FastAPI + truststore).
2. `LLMClient` interface + `AnthropicClient` con prompt caching.
3. Endpoint `/nl2sql` con parser sqlglot + selector de prompt por vista.
4. Suite de eval con las 48 fixtures ejecutando contra BERTOOLS_PROD.
5. Medición de costo real con Claude Sonnet 4.6 + prompt caching.

Decisiones a confirmar antes de arrancar:
- Default = Claude Sonnet 4.6 (recomendado).
- Prompt caching activo desde día 1 (recomendado).
- Logging estructurado JSONL desde día 1 (recomendado, alimenta etapa 2).

---

## Registro de Avance
- 2026-05-31: Revisión exitosa de sentencias SQL creadas por la API.
- 2026-05-26: Stress test finalizado con éxito: 48/48 consultas SQL ejecutadas de forma correcta contra GRUNBAU_PROD y BERTOOLS_PROD.
- 2026-05-26: Estructuración de prompts semánticos por vista y base_rules consolidada para compatibilidad con SQL Server 2008 (compat-100).