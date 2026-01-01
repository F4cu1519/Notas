document.getElementById("addNote").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.NotesAPI?.createNote()
  });
});

function renderGlobalNotes() {
  chrome.storage.local.get({ globalNotes: [] }, ({ globalNotes }) => {
    const list = document.getElementById("globalNotesList");
    list.innerHTML = "";

    globalNotes.forEach(note => {
      const li = document.createElement("li");
      li.className = "note-item";

      const text = document.createElement("span");
      text.className = "note-text";
      text.textContent = note.text.length > 30 ? note.text.slice(0, 30) + "..." : note.text;

      const insertBtn = document.createElement("button");
      insertBtn.className = "btn small";
      insertBtn.textContent = "📌";
      insertBtn.style.background = "none";
      insertBtn.style.border = "none";
      insertBtn.style.fontSize = "16px";
      insertBtn.style.cursor = "pointer";
      insertBtn.onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: noteData => window.NotesAPI?.createNote(noteData),
          args: [note]
        });
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "note-delete";
      deleteBtn.textContent = "🗑";
      deleteBtn.onclick = () => {
        chrome.storage.local.get({ globalNotes: [] }, result => {
          const updated = result.globalNotes.filter(n => n.id !== note.id);
          chrome.storage.local.set({ globalNotes: updated }, renderGlobalNotes);
        });
      };

      li.append(text, insertBtn, deleteBtn);
      list.appendChild(li);
    });
  });
}

document.getElementById("clearGlobalNotes").addEventListener("click", () => {
  if (confirm("¿Borrar todas las notas guardadas?")) {
    chrome.storage.local.set({ globalNotes: [] }, renderGlobalNotes);
  }
});

renderGlobalNotes();
