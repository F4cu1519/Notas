let selectedNote = null;

const menu = document.createElement("div");
menu.id = "custom-note-menu";
menu.className = "context-menu";
menu.style.position = "fixed";
menu.style.background = "#fff";
menu.style.border = "1px solid #ccc";
menu.style.padding = "5px";
menu.style.zIndex = "10000";
menu.style.display = "none";
document.body.appendChild(menu);

// Ocultar menú si haces clic fuera
document.addEventListener("click", () => {
  menu.style.display = "none";
});

// Mostrar menú solo al hacer clic derecho sobre una sticky-note
document.addEventListener("contextmenu", e => {
  const note = e.target.closest(".sticky-note");

  if (note) {
    e.preventDefault();
    selectedNote = note;
    showContextMenu(e.pageX, e.pageY);
  } else {
    menu.style.display = "none";
  }
});

function showContextMenu(x, y) {
  if (!selectedNote) return;

  menu.innerHTML = "";

  // --- Botón Editar ---
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏ Edit note";
  editBtn.onclick = () => {
    selectedNote.contentEditable = true;
    selectedNote.focus();
    menu.style.display = "none";
  };

  // --- Botón Eliminar ---
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑 Delete note";
  deleteBtn.onclick = () => {
    selectedNote.remove();
    window.NotesAPI?.saveNotes();
    menu.style.display = "none";
  };

  // --- Botón Guardar Global ---
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "📌 Save Globally";
  saveBtn.onclick = () => {
    const data = {
      id: selectedNote.dataset.id,
      text: selectedNote.innerText,
      top: selectedNote.style.top,
      left: selectedNote.style.left,
      width: selectedNote.style.width,
      height: selectedNote.style.height,
      bg: selectedNote.style.background,
      color: selectedNote.style.color
    };

    chrome.storage.local.get({ globalNotes: [] }, (result) => {
      const updated = [
        ...result.globalNotes.filter(n => n.id !== data.id),
        data
      ];
      chrome.storage.local.set({ globalNotes: updated });
    });

    menu.style.display = "none";
  };

  // --- Cambiar color fondo ---
  const bgInput = document.createElement("input");
  bgInput.type = "color";
  const computedStyles = window.getComputedStyle(selectedNote);
  bgInput.value = getHexColor(computedStyles.backgroundColor);
  bgInput.oninput = () => {
    selectedNote.style.background = bgInput.value;
    window.NotesAPI?.saveNotes();
  };

  // --- Cambiar color texto ---
  const textColorInput = document.createElement("input");
  textColorInput.type = "color";
  textColorInput.value = getHexColor(computedStyles.color);
  textColorInput.oninput = () => {
    selectedNote.style.color = textColorInput.value;
    window.NotesAPI?.saveNotes();
  };

  [editBtn, deleteBtn, saveBtn].forEach(btn => menu.appendChild(btn));
  menu.appendChild(document.createTextNode("Change Background Color:"));
  menu.appendChild(bgInput);
  menu.appendChild(document.createElement("br"));
  menu.appendChild(document.createTextNode("ChangeText Color:"));
  menu.appendChild(textColorInput);

  menu.style.top = `${y}px`;
  menu.style.left = `${x}px`;
  menu.style.display = "block";
}

// Convertir rgb a #hex
function getHexColor(rgb) {
  if (!rgb) return "#000000"; // fallback
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return "#000000";
  return `#${result.slice(0, 3)
    .map(c => parseInt(c).toString(16).padStart(2, "0"))
    .join("")}`;
}

// ✅ Restaurar notas al cargar la página
function waitForNotesAPI() {
  const check = setInterval(() => {
    if (window.NotesAPI?.restoreNotes) {
      clearInterval(check);
      window.NotesAPI.restoreNotes();
    }
  }, 50);
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", waitForNotesAPI)
  : waitForNotesAPI();
