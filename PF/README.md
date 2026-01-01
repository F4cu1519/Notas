# Hidden Notes

#### Video Demo: <https://youtu.be/_HzBdFJscy4>

#### Description:

Hidden Notes is a Google Chrome extension that allows users to create, move, edit, and save floating sticky notes directly on any webpage. It is useful for annotating content, covering parts of a page, leaving reminders, or sharing visual feedback on websites.

### Main Features:

- 📌 Create sticky notes anywhere on a webpage.
- ✏ Edit note content via right-click and selecting “Edit”.
- 🎨 Change background and text colors using a custom context menu.
- 🗑 Delete individual notes.
- 💾 Automatic saving:
  - **Local**: notes are visible only on the current URL.
  - **Global**: notes are accessible from the extension popup on any page.
- 📂 Popup panel with:
  - List of all global notes.
  - Button to add a new note to the current page.
  - Option to delete all global notes.

### Technical Details:

- Built using **Manifest V3**.
- Uses `chrome.storage.local` for persistent storage.
- Notes are inserted directly into the webpage’s DOM.
- Designed to run on `<all_urls>`, except Chrome-restricted pages like `chrome://`.
- Modern interface with styled inputs and clean, accessible buttons.

### Project Files:

- `manifest.json`: main configuration file (version, permissions, scripts).
- `content.js`: injects the sticky notes into webpages.
- `popup.html`, `popup.js`, `popup.css`: interface and logic for the popup panel.
- `background.js`: handles creation and retrieval of global notes.
- `storage.js`: logic for storing and retrieving notes via `chrome.storage`.
- `contextMenu.js`: builds and handles the right-click menu actions.
- `styles.css`: contains styling for both the notes and the popup.

### Design Decisions:

- Notes are inserted directly into the DOM for simplicity and better integration with the page.
- Storage is split between local notes (URL-specific) and global notes (accessible from any page).
- Notes are saved automatically when moved, resized, or edited — no save button needed.
- A custom context menu improves usability without interfering with the browser's default behavior.

Hidden Notes is ideal for users who frequently take notes while browsing, conduct research, or need to cover specific content for focus or visual annotation.

This project was created as the final project for **CS50x 2025**.

### Acknowledgments

This project was completed as part of the CS50x 2025 final project.

Thanks to [CS50 staff](https://cs50.harvard.edu/x/2025/) and the OpenAI ChatGPT assistant for support and guidance during development.
