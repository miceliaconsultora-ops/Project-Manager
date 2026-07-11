---
id: lampe
name: Proyecto Lampe (Bot WhatsApp)
category: IA & Bot
status: suspended
progress: 20
description: Sistema de atención y prefiltrado administrativo/triage por WhatsApp para clínica de fisioterapia utilizando la plataforma Runamatic.
next_step_action: Proyecto suspendido por falta de acuerdo con el cliente.
next_step_responsible: N/A
next_step_deadline: N/A
---

# Proyecto Lampe

Fecha de corte: 2026-05-26

## Descripcion general

Proyecto Lampe es el nombre de trabajo para un sistema de atencion y prefiltrado por WhatsApp para una clinica de fisioterapia. La primera etapa apunta a resolver consultas basicas, ordenar la demanda, detectar si una persona podria avanzar hacia un turno y derivar a recepcion cuando el caso requiere intervencion humana.

El objetivo no es reemplazar criterio medico ni diagnosticar. El bot debe operar como filtro administrativo y de orientacion inicial: cobertura, disponibilidad, sede, tipo general de consulta, orden medica si aplica, datos minimos de contacto y motivo general. Cuando aparezcan dudas, urgencias, informacion sensible o casos fuera del alcance, el flujo debe pasar a recepcion.

## Enfoque elegido

La opcion mas razonable para el MVP es usar Runamatic como base operativa, principalmente por tres motivos: ya hay conocimiento previo de la plataforma, incluye inbox multiagente para recepcion y permite combinar flujos, campos personalizados, API requests e IA.

La alternativa de desarrollar todo desde cero sigue siendo viable, pero hoy queda como segunda etapa. Para validar el servicio con una clinica real, Runamatic reduce el tiempo de implementacion y evita construir desde cero el inbox, la asignacion humana, los estados de conversacion y la operatoria diaria.

## Decisiones tomadas

| Tema | Decision actual |
| --- | --- |
| WhatsApp | Usar canales oficiales de Meta/WhatsApp. Evitar automatizaciones no oficiales sobre WhatsApp Web. |
| Plataforma inicial | Priorizar Runamatic por sobre ManyChat, Chatfuel o un desarrollo 100% propio para el MVP. |
| Inbox | Usar el inbox de Runamatic si la nueva cuenta permite operar recepcion con varios usuarios, asignaciones y derivacion bot/humano. |
| IA | Evaluar Pro + AI si se busca velocidad y bajo mantenimiento. Evaluar Pro con API key propia si se necesita control de costos, logs, modelo y prompts. |
| Alcance del bot | Triage administrativo, FAQ y derivacion. No diagnostico, no indicaciones clinicas personalizadas. |
| Restauracion | No asumir que se puede restaurar la cuenta vieja. Tratar el backup como insumo para reconstruccion parcial. |
| Integraciones | Usar API requests de Runamatic para conectar agenda, calendarios, sistemas propios o capas intermedias. |

## Investigacion de Runamatic

Runamatic ofrece planes Pro, Pro + AI y Runamatic gestionado. En la investigacion previa, Pro figuraba en USD 40/mes, Pro + AI en USD 60/mes y el plan gestionado desde USD 240/mes. Pro + AI incluye 3 millones de tokens mensuales de OpenAI segun la documentacion publica de la plataforma.

La plataforma documenta bandeja unificada multiagente, derivacion a humano, flujos, campos personalizados, tags, pipelines, API requests, integraciones con IA y conexion de WhatsApp Cloud o WhatsApp Business App.

La documentacion publica es util para operar la plataforma, pero no alcanza como referencia tecnica completa para una migracion automatica. Faltan detalles publicos sobre limites, payloads internos de flujos, versionado, import/export de flujos, SLA, subprocesadores y tratamiento especifico de datos sensibles.

## API de Runamatic

La documentacion Swagger revisada esta en:

https://app.runamatic.io/api/swagger/

La API actual usa autenticacion por header `X-ACCESS-TOKEN`.

La API permite trabajar con cuentas, admins, teams, tags, custom fields, bot fields, integraciones, contactos, mensajes, pipelines, oportunidades y ecommerce. Tambien permite enviar flujos existentes a un contacto, enviar mensajes, crear contactos y guardar mensajes en historial de IA.

El punto importante es que no aparece un endpoint publico para crear, actualizar, clonar o importar flujos. Esto limita la restauracion automatica de los bots anteriores.

## Backup local revisado

El backup esta en:

`C:\Antigravity\Runamatic_data`

La carpeta contiene scripts de exploracion/extraccion, un `swagger_spec.json`, skills locales y una carpeta `export` con datos exportados de la cuenta anterior.

La cuenta exportada aparece como `MicelIA Consultora`, activa, con 17 usuarios/contactos reportados. El backup incluye 7 tags, 34 custom fields, 1 pipeline llamado `Leads`, 7 etapas de pipeline y 41 flujos listados por id y nombre.

Los nombres de flujos mas relevantes para este proyecto son `RECEP - FLUJO`, `Conectar cliente con humano Recep`, `Exportar data Recep`, `Agendar Turno`, `reprogramar_turno`, `Pasar a Lead - Cita agendada`, `Booking confirmation - MicelIA Google Calendar` y `Reminder - MicelIA Google Calendar`.

Los campos mas vinculados al proyecto son `Paciente`, `motivo_consulta`, `Tipo_tratamiento`, `fecha_hora_turno`, `profesional_texto`, `Turno_agendado`, `id_turno`, `recepnoia`, `prompt_actualizado`, `prompt_maestro_cuenta` y `solicitud_de_cambio_en_prompt`.

## Estado de restauracion

La restauracion completa de la cuenta anterior no parece viable con la informacion disponible.

Lo recuperable por API o reconstruccion asistida son tags, custom fields, valores de bot fields compatibles, pipeline, etapas y posiblemente oportunidades/contactos si se consiguen datos fuente. Lo no recuperable de forma directa son los flujos visuales completos, porque los archivos en `flows_detail` no contienen la estructura interna de nodos, condiciones, textos, botones y acciones.

De los 41 flujos listados, 38 contienen solo `id` y `name`. Otros 3 tienen bot fields, pero el `full_detail` devuelve error 404. Esto confirma que el backup sirve como mapa de reconstruccion, no como snapshot importable.

Tambien se detecto una API key hardcodeada en scripts locales. Si esa key todavia existe o pertenece a una cuenta activa, conviene rotarla.

## Riesgos abiertos

| Riesgo | Impacto |
| --- | --- |
| No hay importacion publica de flujos | La reconstruccion de bots sera manual o semiautomatizada, no un restore directo. |
| Backup incompleto de nodos | Se pueden recuperar nombres y campos, pero no la logica exacta anterior. |
| Tipos de custom field | El backup tiene campos tipo `5`, mientras la API documenta tipos `0-4`. Hay que probar compatibilidad. |
| Datos sensibles de salud | Hace falta definir politica de privacidad, retencion, permisos de recepcion y criterios de derivacion. |
| WhatsApp pricing | La documentacion de Runamatic sobre pricing de WhatsApp puede estar desactualizada frente a Meta. |
| Cuenta anterior no restaurable | Hay que asumir cuenta nueva y reconstruccion progresiva. |

## Donde estamos ahora

Estamos en etapa de definicion tecnica y recuperacion de contexto. Ya se eligio Runamatic como candidato principal para el MVP, se reviso la API publica, se inspecciono el backup local y se concluyo que la restauracion sera parcial.

La proxima decision practica es abrir o preparar una nueva cuenta de Runamatic, obtener una API key nueva y hacer un script de preflight que compare la cuenta vacia contra el backup sin modificar nada. Ese preflight deberia informar que tags, custom fields y bot fields faltan, que tipos no son compatibles y que elementos deben recrearse manualmente desde la interfaz.

Despues de eso, el trabajo central sera reconstruir los flujos de recepcion y turnos con una version mas limpia que la anterior, usando los nombres y campos recuperados como guia.

## Proximos pasos

| Orden | Paso |
| --- | --- |
| 1 | Crear nueva cuenta Runamatic o confirmar acceso a una cuenta destino. |
| 2 | Generar API key nueva y no reutilizar la key vieja del backup. |
| 3 | Crear script dry-run de comparacion contra `C:\Antigravity\Runamatic_data\export`. |
| 4 | Importar o recrear tags y custom fields compatibles. |
| 5 | Verificar si los campos tipo `5` se pueden crear por API o requieren UI. |
| 6 | Reconstruir manualmente los flujos `RECEP - FLUJO`, `Agendar Turno`, `reprogramar_turno` y `Conectar cliente con humano Recep`. |
| 7 | Definir reglas de triage con la clinica: aceptados, no aceptados, derivacion, urgencias y datos minimos. |
| 8 | Conectar WhatsApp oficial y probar con recepcion en entorno controlado. |
| 9 | Medir conversaciones, derivaciones, errores y casos sin resolver. |
| 10 | Decidir si se queda en Runamatic o si se empieza una capa propia encima. |

---

## Registro de Avance
- 2026-07-11: Proyecto suspendido. No se llegó a un acuerdo comercial con el cliente.
- 2026-05-30: Presupuesto entregado. A la espera de la respuesta del cliente (plazo de 30 días para responder).
- 2026-05-29: Presupuesto entregado: Próximos pasos, a la espera de la aprobación del cliente, para comennzar demo y MVP. 
- 2026-05-28: Presupuesto finalizado. Se acordó la presentación al cliente el lunes 29/06.
- 2026-05-27: Reunión con el cliente concluida. Se definió que el MVP se realizará con Runamatic. Próximo paso: redacción de presupuesto.
- 2026-05-26: Reunión con el cliente programada para el 27/05 para definir alcance del MVP.
- 2026-05-26: Investigación de API y backup local concluida. Se determinó que los flujos visuales deberán reconstruirse manualmente.
- 2026-05-26: Se definió priorizar Runamatic sobre desarrollo propio para acelerar el MVP y validar con clínica real. 