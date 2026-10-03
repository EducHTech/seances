(() => {
  const status = document.querySelector("[data-save-status]");
  const controls = [...document.querySelectorAll("[data-save]")];
  const sessionId = document.body.dataset.session || "2026-10-03";
  const studentId = document.body.dataset.student;

  if (!studentId) return;

  const team = [
    ["leonor", "Leonor"],
    ["theo", "Théo"],
    ["bianca", "Bianca"],
    ["jasmine", "Jasmine"],
    ["yann-eleve", "Yann (élève)"],
    ["paul", "Paul"],
    ["prajeet", "Prajeet"]
  ];
  const navigation = document.createElement("nav");
  navigation.className = "team-navigation no-print";
  navigation.setAttribute("aria-label", "Navigation dans l’équipe");
  const heading = document.createElement("h2");
  heading.textContent = "Naviguer dans l’équipe";
  navigation.append(heading);
  const links = document.createElement("div");
  links.className = "person-list";
  for (const [id, name] of team) {
    const link = document.createElement("a");
    link.className = "person-card";
    link.href = `../roles/${id}.html`;
    link.textContent = name;
    if (id === studentId) link.setAttribute("aria-current", "page");
    links.append(link);
  }
  const mentors = document.createElement("a");
  mentors.className = "person-card";
  mentors.href = "../mentors.html";
  mentors.textContent = "Mentors · Jérémie, Luca, Sophiane, Ophélie, Ruby";
  links.append(mentors);
  navigation.append(links);
  document.querySelector("main").append(navigation);

  if (!controls.length) return;
  const key = `dragons-rov-guide:${sessionId}:${studentId}`;

  function showError(action, error) {
    if (!status) return;
    status.classList.add("error");
    status.textContent = `Erreur : ${action}. Les réponses ne sont pas confirmées comme sauvegardées (${error.message || String(error)}).`;
  }

  try {
    const saved = localStorage.getItem(key);
    const values = saved ? JSON.parse(saved) : {};
    for (const control of controls) {
      const name = control.dataset.save;
      if (!(name in values)) continue;
      if (control.type === "checkbox") control.checked = Boolean(values[name]);
      else if (control.type === "radio") control.checked = control.value === values[name];
      else control.value = values[name];
    }
    if (status) status.textContent = saved ? "Réponses précédentes restaurées sur cet appareil." : "Sauvegarde locale automatique activée.";
  } catch (error) {
    showError("lecture de la sauvegarde locale", error);
  }

  function save() {
    const values = {};
    for (const control of controls) {
      if (control.type === "radio") {
        if (control.checked) values[control.dataset.save] = control.value;
      } else if (control.type === "checkbox") {
        values[control.dataset.save] = control.checked;
      } else {
        values[control.dataset.save] = control.value;
      }
    }
    try {
      localStorage.setItem(key, JSON.stringify(values));
      if (status) {
        status.classList.remove("error");
        status.textContent = "Sauvegardé sur cet appareil.";
      }
    } catch (error) {
      showError("sauvegarde locale", error);
    }
  }

  document.addEventListener("input", save);
  document.addEventListener("change", save);
})();
