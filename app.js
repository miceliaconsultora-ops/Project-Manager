document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos globales
  const projects = window.projectsData || [];
  
  // Selectores DOM
  const projectsGrid = document.getElementById("projects-grid");
  const miceliaProjectsGrid = document.getElementById("micelia-projects-grid");
  const generalProjectsSection = document.getElementById("general-projects-section");
  const miceliaProjectsSection = document.getElementById("micelia-projects-section");
  const statsContainer = document.getElementById("stats-bar");
  const filterButtonsOwner = document.querySelectorAll("[data-filter-owner]");
  const filterButtonsStatus = document.querySelectorAll("[data-filter-status]");
  
  // Estado de filtros activos
  let activeOwner = "all";
  let activeStatus = "all";
  
  // Inicialización
  initDashboard();
  
  function initDashboard() {
    renderStats();
    renderProjects();
    setupFilters();
  }
  
  // Renderizar Tarjetas de Estadísticas
  function renderStats() {
    const total = projects.length;
    const active = projects.filter(p => p.status === "active").length;
    
    // Contar pendientes por responsable
    const byAtika = projects.filter(p => p.status === "active" && p.nextStep.responsible === "Atika").length;
    const byDiegoR = projects.filter(p => p.status === "active" && p.nextStep.responsible === "Diego R.").length;
    const byDiegoB = projects.filter(p => p.status === "active" && p.nextStep.responsible === "Diego B.").length;
    
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div>
          <div class="stat-title">Proyectos Totales</div>
          <div class="stat-value">${total}</div>
        </div>
      </div>
      <div class="stat-card" style="border-left: 3px solid var(--color-active)">
        <div>
          <div class="stat-title">En Curso</div>
          <div class="stat-value">${active}</div>
        </div>
      </div>
      <div class="stat-card" style="border-left: 3px solid var(--primary)">
        <div>
          <div class="stat-title">Pendientes Diego R.</div>
          <div class="stat-value">${byDiegoR}</div>
        </div>
      </div>
      <div class="stat-card" style="border-left: 3px solid var(--secondary)">
        <div>
          <div class="stat-title">Pendientes Atika</div>
          <div class="stat-value">${byAtika}</div>
        </div>
      </div>
    `;
  }
  
  // Obtener Avatar de Responsable
  function getOwnerAvatar(name) {
    if (!name || name === "N/A") return { letter: "-", color: "var(--text-muted)" };
    
    if (name.includes("Diego R")) {
      return { letter: "DR", color: "var(--owner-dr)" };
    }
    if (name.includes("Diego B.")) {
      return { letter: "DB", color: "var(--owner-db)" };
    }
    if (name.includes("Atika")) {
      return { letter: "A", color: "var(--owner-atika)" };
    }
    
    return { letter: name.substring(0, 2).toUpperCase(), color: "var(--primary)" };
  }
  
  // Formatear Fecha
  function formatDate(dateStr) {
    if (!dateStr || dateStr === "N/A") return "N/A";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }
  
  // Renderizar Grilla de Proyectos
  function renderProjects() {
    projectsGrid.innerHTML = "";
    miceliaProjectsGrid.innerHTML = "";
    
    // Filtrar proyectos
    const filteredProjects = projects.filter(project => {
      const matchOwner = activeOwner === "all" || 
                         (project.nextStep && project.nextStep.responsible === activeOwner);
      const matchStatus = activeStatus === "all" || project.status === activeStatus;
      return matchOwner && matchStatus;
    });
    
    // Ordenar proyectos: 1) En curso (active) primero, 2) Cercanía de fecha de próximo paso (deadline)
    filteredProjects.sort((a, b) => {
      const aActive = a.status === "active" ? 1 : 0;
      const bActive = b.status === "active" ? 1 : 0;
      
      if (aActive !== bActive) {
        return bActive - aActive; // Activo primero
      }
      
      const aDate = a.nextStep ? a.nextStep.deadline : "N/A";
      const bDate = b.nextStep ? b.nextStep.deadline : "N/A";
      const aHasDate = aDate && aDate !== "N/A";
      const bHasDate = bDate && bDate !== "N/A";
      
      if (aHasDate && bHasDate) {
        return aDate.localeCompare(bDate); // Orden cronológico ascendente (más cercanos primero)
      }
      if (aHasDate) return -1;
      if (bHasDate) return 1;
      
      return 0;
    });
    
    // Separar en Generales y MicelIA
    const generalProjects = filteredProjects.filter(p => !p.isMicelia);
    const miceliaProjects = filteredProjects.filter(p => p.isMicelia);
    
    if (filteredProjects.length === 0) {
      generalProjectsSection.style.display = "block";
      miceliaProjectsSection.style.display = "block";
      projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
          <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No se encontraron proyectos con los filtros seleccionados.</p>
          <p style="font-size: 0.9rem;">Prueba cambiando el responsable o el estado.</p>
        </div>
      `;
      return;
    }
    
    // Ocultar o mostrar contenedores según cantidad de proyectos
    if (generalProjects.length === 0) {
      generalProjectsSection.style.display = "none";
    } else {
      generalProjectsSection.style.display = "block";
      renderProjectList(generalProjects, projectsGrid);
    }
    
    if (miceliaProjects.length === 0) {
      miceliaProjectsSection.style.display = "none";
    } else {
      miceliaProjectsSection.style.display = "block";
      renderProjectList(miceliaProjects, miceliaProjectsGrid);
    }
  }
  
  // Función auxiliar para renderizar una lista en una grilla específica
  function renderProjectList(projectList, gridContainer) {
    projectList.forEach((project, idx) => {
      const card = document.createElement("div");
      card.className = `project-card ${project.isMicelia ? "micelia-card" : ""}`;
      card.style.animationDelay = `${idx * 0.08}s`;
      
      const avatarInfo = getOwnerAvatar(project.nextStep.responsible);
      
      // Armar el badge de estado
      let statusClass = "status-active";
      let statusLabel = "En Curso";
      if (project.status === "completed") {
        statusClass = "status-completed";
        statusLabel = "Sin Pendientes";
      } else if (project.status === "pending-review") {
        statusClass = "status-pending";
        statusLabel = "En Revisión";
      }
      
      // Renderizar el historial
      let historyItems = "";
      if (project.history && project.history.length > 0) {
        historyItems = project.history.map(item => `
          <li class="history-item">
            <span class="history-date">${formatDate(item.date)}</span>
            <span>${item.note}</span>
          </li>
        `).join("");
      } else {
        historyItems = `<li class="history-item" style="color: var(--text-muted);">Sin novedades registradas.</li>`;
      }
      
      // Verificar si la fecha de vencimiento es hoy o pasada
      let dateMetaClass = "meta-date";
      if (project.nextStep.deadline && project.nextStep.deadline !== "N/A") {
        const deadlineDate = new Date(project.nextStep.deadline);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (deadlineDate < today) {
          dateMetaClass += " overdue";
        }
      }
      
      card.innerHTML = `
        <div>
          <div class="card-header">
            <span class="project-category">${project.category}</span>
            <span class="status-badge ${statusClass}">${statusLabel}</span>
          </div>
          
          <h2 class="project-title">${project.name}</h2>
          <p class="project-desc">${project.description}</p>
          
          <div class="progress-container">
            <div class="progress-header">
              <span class="progress-label">Progreso</span>
              <span class="progress-pct">${project.progress}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
            </div>
          </div>
          
          <div class="next-step-box">
            <div class="next-step-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              Próximo Paso
            </div>
            <div class="next-step-desc">${project.nextStep.action}</div>
            <div class="next-step-meta">
              <div class="meta-owner">
                <span class="owner-avatar" style="background-color: ${avatarInfo.color}">${avatarInfo.letter}</span>
                <span class="owner-name">${project.nextStep.responsible}</span>
              </div>
              <div class="${dateMetaClass}">
                ${project.nextStep.deadline !== "N/A" ? `Vence: ${formatDate(project.nextStep.deadline)}` : "Plazo: N/A"}
              </div>
            </div>
          </div>
        </div>
        
        <div class="history-section">
          <div class="history-header collapsed" onclick="toggleHistory(this)">
            Registro de Avance
          </div>
          <ul class="history-list">
            ${historyItems}
          </ul>
        </div>
      `;
      
      gridContainer.appendChild(card);
    });
  }
  
  // Manejo de Filtros
  function setupFilters() {
    filterButtonsOwner.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtonsOwner.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeOwner = btn.getAttribute("data-filter-owner");
        renderProjects();
      });
    });
    
    filterButtonsStatus.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtonsStatus.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeStatus = btn.getAttribute("data-filter-status");
        renderProjects();
      });
    });
  }
});

// Función global para manejar el acordeón de historial
window.toggleHistory = function(headerElement) {
  headerElement.classList.toggle("collapsed");
};
