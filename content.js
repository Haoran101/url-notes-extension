chrome.storage.local.get(['rules'], (result) => {
    const rules = result.rules || [];
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname + window.location.search + window.location.hash;
  
    for (let rule of rules) {
      const regex = new RegExp(rule.pattern);
      if (regex.test(currentPath)) {
        const note = document.createElement('div');
        note.textContent = rule.note;
        note.style.position = 'fixed';
        note.style.bottom = '10px';
        note.style.right = '10px';
        note.style.backgroundColor = 'yellow';
        note.style.padding = '10px';
        note.style.zIndex = '1000';
        document.body.appendChild(note);
        break;
      }
    }
  });
  