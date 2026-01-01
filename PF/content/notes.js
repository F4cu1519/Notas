(() => {
  const NOTE_CLASS = "sticky-note";

  function saveNotes() {
    const notes = document.querySelectorAll(`.${NOTE_CLASS}`);
    const data = Array.from(notes).map(note => ({
      id: note.dataset.id,
      text: note.innerText,
      top: note.style.top,
      left: note.style.left,
      width: note.style.width,
      height: note.style.height,
      bg: note.style.background,
      color: note.style.color
    }));

    const key = window.location.href;
    chrome.storage.local.set({ [key]: data });
  }

  function createNote(data = {}) {
    const note = document.createElement("div");
    note.className = NOTE_CLASS;
    note.dataset.id = data.id || Date.now().toString();
    note.contentEditable = false;
    note.innerText = data.text || "Write something...";

    Object.assign(note.style, {
      position: "fixed",
      top: data.top || "100px",
      left: data.left || "100px",
      width: data.width || "200px",
      height: data.height || "150px",
      background: data.bg || "yellow",
      color: data.color || "black",
      padding: "8px",
      border: "none",
      zIndex: 9999,
      resize: "both",
      overflow: "auto",
      cursor: "move"
    });

    document.body.appendChild(note);

    let isDragging = false;
    let offsetX, offsetY;

    note.addEventListener("mousedown", e => {
      if (e.button !== 0) return;
      const nearEdge = e.offsetX > note.clientWidth - 10 || e.offsetY > note.clientHeight - 10;
      if (nearEdge) return;
      isDragging = true;
      offsetX = e.clientX - note.offsetLeft;
      offsetY = e.clientY - note.offsetTop;
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (isDragging) {
        note.style.left = `${e.clientX - offsetX}px`;
        note.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        saveNotes();
      }
    });

    note.addEventListener("input", saveNotes);
    note.addEventListener("mouseup", saveNotes);
    note.addEventListener("mouseleave", saveNotes);

    saveNotes();
  }

  function restoreNotes() {
    chrome.storage.local.get(null, (allData) => {
      const key = window.location.href;
      const notes = allData[key];
      if (Array.isArray(notes)) {
        notes.forEach(note => createNote(note));
      }
    });
  }

  // Exponer API global
  window.NotesAPI = {
    createNote,
    saveNotes,
    restoreNotes
  };
})();
