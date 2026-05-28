#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path

def parse_markdown_project(file_path):
    print(f"Procesando: {file_path.name}...")
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"  Error al leer el archivo: {e}")
        return None

    # 1. Parsear YAML Frontmatter
    # El frontmatter debe estar al principio del archivo, entre dos líneas de '---'
    frontmatter_match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n", content, re.DOTALL)
    if not frontmatter_match:
        print("  Ignorado: No contiene metadatos (YAML frontmatter '---' al inicio).")
        return None

    yaml_text = frontmatter_match.group(1)
    metadata = {}
    for line in yaml_text.splitlines():
        if ":" in line:
            key, val = line.split(":", 1)
            metadata[key.strip()] = val.strip().strip('"').strip("'")

    # Validar campos mínimos
    required_fields = ["id", "name", "category", "status", "progress"]
    for field in required_fields:
        if field not in metadata:
            print(f"  Ignorado: Falta el campo requerido '{field}' en los metadatos.")
            return None

    # Convertir progreso a entero
    try:
        progress = int(metadata["progress"])
    except ValueError:
        progress = 0

    is_micelia = any(p.lower() == "micelia" for p in file_path.parts)
    responsible = metadata.get("next_step_responsible", "N/A")
    if is_micelia:
        is_valid_resp = (responsible == "Diego R." or 
                         "cliente" in responsible.lower())
        if not is_valid_resp:
            print(f"  [ADVERTENCIA] Proyecto MicelIA '{metadata.get('name')}' tiene un responsable no permitido: '{responsible}'. Debe ser Diego R. o el Cliente.")

    # Construir objeto del proyecto
    project = {
        "id": metadata["id"],
        "name": metadata["name"],
        "category": metadata["category"],
        "description": metadata.get("description", ""),
        "status": metadata["status"],
        "progress": progress,
        "isMicelia": is_micelia,
        "nextStep": {
            "action": metadata.get("next_step_action", "N/A"),
            "responsible": responsible,
            "deadline": metadata.get("next_step_deadline", "N/A")
        },
        "history": []
    }

    # 2. Parsear sección de Registro de Avance / Historial
    # Buscar el título de Registro de Avance o Historial o Bitácora
    # Buscamos desde el final del frontmatter
    remaining_content = content[frontmatter_match.end():]
    
    # Expresión regular para encontrar el encabezado y el texto posterior
    history_section_match = re.search(
        r"##\s*(?:registro\s+de\s+avance|historial|bitacora|bitácora).*?\r?\n(.*)", 
        remaining_content, 
        re.IGNORECASE | re.DOTALL
    )
    
    if history_section_match:
        history_text = history_section_match.group(1)
        # Cortar si empieza otra sección ## posterior
        next_header_match = re.search(r"##\s+", history_text)
        if next_header_match:
            history_text = history_text[:next_header_match.start()]
            
        # Buscar viñetas con fechas (ejemplo: - 2026-05-26: Detalle del avance)
        # Soporta guión (-), asterisco (*) y puede o no tener negritas en la fecha
        bullet_pattern = re.compile(r"^\s*[-*]\s*(?:\*\*)?(\d{4}-\d{2}-\d{2})(?:\*\*)?\s*:\s*(.*)$", re.MULTILINE)
        
        for date_str, note in bullet_pattern.findall(history_text):
            project["history"].append({
                "date": date_str.strip(),
                "note": note.strip()
            })
            
        # Ordenar el historial por fecha descendente (más recientes primero)
        project["history"].sort(key=lambda x: x["date"], reverse=True)

    if not project["history"]:
        project["history"].append({
            "date": "N/A",
            "note": "Sin novedades registradas en el archivo markdown."
        })

    print(f"  Cargado exitosamente: '{project['name']}' con {len(project['history'])} hitos de historial.")
    return project

def main():
    workspace_dir = Path(__file__).parent.resolve()
    projects = []

    # Buscar recursivamente todos los archivos .md (excluyendo carpetas ocultas como .git)
    for root, dirs, files in os.walk(workspace_dir):
        # Excluir carpetas ocultas
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        
        for file in files:
            if file.endswith(".md"):
                file_path = Path(root) / file
                # Omitir archivos de documentación internos de brain/ y templates
                if "antigravity-ide" in str(file_path) or "brain" in str(file_path):
                    continue
                
                project_data = parse_markdown_project(file_path)
                if project_data:
                    projects.append(project_data)

    if not projects:
        print("No se encontraron proyectos con metadatos válidos para sincronizar.")
        return

    # Escribir projects.js
    projects_js_path = workspace_dir / "projects.js"
    js_content = f"""// Datos de los proyectos para el Tablero de Comando
// ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE por sync_projects.py. NO EDITAR DIRECTAMENTE.
window.projectsData = {json.dumps(projects, indent=2, ensure_ascii=False)};
"""
    
    try:
        projects_js_path.write_text(js_content, encoding="utf-8")
        print(f"\nSincronización exitosa. Se actualizaron {len(projects)} proyectos en '{projects_js_path.name}'.")
    except Exception as e:
        print(f"Error al escribir '{projects_js_path.name}': {e}")

if __name__ == "__main__":
    main()
