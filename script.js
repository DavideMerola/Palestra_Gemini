let exercises = JSON.parse(localStorage.getItem("gymExercises")) || [];
let history = JSON.parse(localStorage.getItem("gymHistory")) || [];

function toggleNav() {
  const side = document.getElementById("sidebar");
  side.style.width = side.style.width === "280px" ? "0" : "280px";
}

function openModal(id = null) {
  const modal = document.getElementById("modal");
  const title = document.getElementById("modal-title");
  const completeBtn = document.getElementById("complete-btn-modal");

  if (id) {
    const ex = exercises.find((e) => e.id === id);
    title.innerText = "Modifica Esercizio";
    document.getElementById("ex-id").value = ex.id;
    document.getElementById("ex-name").value = ex.name;
    document.getElementById("ex-sets").value = ex.sets;
    document.getElementById("ex-reps").value = ex.reps;
    document.getElementById("ex-rest").value = ex.rest;
    document.getElementById("ex-weight").value = ex.weight;
    document.getElementById("ex-video").value = ex.video;
    completeBtn.style.display = "block";
    completeBtn.onclick = () => {
      toggleComplete(id);
      closeModal();
    };
  } else {
    title.innerText = "Nuovo Esercizio";
    document.getElementById("ex-id").value = "";
    document
      .querySelectorAll(".modal-content input")
      .forEach((i) => (i.value = ""));
    completeBtn.style.display = "none";
  }
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function saveExercise() {
  const id = document.getElementById("ex-id").value;
  const name = document.getElementById("ex-name").value;
  if (!name) return alert("Inserisci il nome!");

  const data = {
    id: id ? parseInt(id) : Date.now(),
    name: name,
    sets: document.getElementById("ex-sets").value || 0,
    reps: document.getElementById("ex-reps").value || 0,
    rest: document.getElementById("ex-rest").value || "-",
    weight: document.getElementById("ex-weight").value || 0,
    video: document.getElementById("ex-video").value || "",
    completed: id
      ? exercises.find((e) => e.id === parseInt(id)).completed
      : false,
  };

  if (id) {
    exercises = exercises.map((e) => (e.id === parseInt(id) ? data : e));
  } else {
    exercises.push(data);
  }

  localStorage.setItem("gymExercises", JSON.stringify(exercises));
  renderExercises();
  closeModal();
}

function renderExercises() {
  const list = document.getElementById("exercise-list");
  list.innerHTML = "<h3>I miei Esercizi</h3>";
  exercises.forEach((ex) => {
    const card = document.createElement("div");
    card.className = `exercise-card ${ex.completed ? "completed" : ""}`;
    card.innerHTML = `
            <div class="info" onclick="openModal(${ex.id})">
                <h4>${ex.name} ${ex.completed ? "✅" : ""}</h4>
                <p>${ex.sets}x${ex.reps} | ${ex.weight}kg | Rec: ${ex.rest}</p>
            </div>
            <div style="display:flex; gap:10px;">
                ${
                  ex.video
                    ? `<button onclick="window.open('${ex.video}', '_blank')" style="background:none; border:none; font-size:20px;">🎥</button>`
                    : ""
                }
                <button onclick="deleteExercise(${
                  ex.id
                })" style="background:none; border:none; color:#ff4444;">✕</button>
            </div>
        `;
    list.appendChild(card);
  });
  if (document.getElementById("sidebar").style.width !== "0px") toggleNav();
}

function toggleComplete(id) {
  exercises = exercises.map((ex) =>
    ex.id === id ? { ...ex, completed: !ex.completed } : ex
  );
  localStorage.setItem("gymExercises", JSON.stringify(exercises));
  renderExercises();
}

function deleteExercise(id) {
  if (confirm("Eliminare l'esercizio?")) {
    exercises = exercises.filter((ex) => ex.id !== id);
    localStorage.setItem("gymExercises", JSON.stringify(exercises));
    renderExercises();
  }
}

function finishWorkout() {
  const done = exercises.filter((ex) => ex.completed);
  if (done.length === 0) return alert("Nessun esercizio completato!");
  history.push({ date: new Date().toLocaleString("it-IT"), data: done });
  localStorage.setItem("gymHistory", JSON.stringify(history));
  exercises.forEach((ex) => (ex.completed = false));
  localStorage.setItem("gymExercises", JSON.stringify(exercises));
  alert("Salvato!");
  renderExercises();
}

function showHistory() {
  const list = document.getElementById("exercise-list");
  list.innerHTML = "<h3>Storico</h3>";
  if (history.length === 0) list.innerHTML += "<p>Vuoto</p>";
  history
    .slice()
    .reverse()
    .forEach((item) => {
      let exHtml = item.data
        .map((e) => `<li>${e.name}: ${e.sets}x${e.reps}</li>`)
        .join("");
      list.innerHTML += `<div class="history-card"><small>${item.date}</small><ul>${exHtml}</ul></div>`;
    });
  toggleNav();
}

function clearHistory() {
  if (confirm("Cancelli tutto?")) {
    localStorage.clear();
    location.reload();
  }
}

renderExercises();
