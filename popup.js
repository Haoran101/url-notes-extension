function wildcardMatch(text, pattern) {
    const regexPattern =
        new RegExp('^' + pattern.replace(/\?/g, '.').replace(/\*/g, '.*') + '$');
    return regexPattern.test(text);
}

document.addEventListener('DOMContentLoaded', () => {
    const regexInput = document.getElementById('regex');
    const titleInput = document.getElementById('title');
    const noteInput = document.getElementById('note');
    const viewNoteDiv = document.getElementById('viewNote');
    const editNoteDiv = document.getElementById('editNote');
    const noteTitleH2 = document.getElementById('noteTitle');
    const savedNoteP = document.getElementById('savedNote');
  
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentUrl = new URL(tabs[0].url);
      const currentPath = currentUrl.pathname + currentUrl.search + currentUrl.hash;
  
      chrome.storage.local.get(['rules'], (result) => {
        const rules = result.rules || [];
        const matchedRule = rules.find(rule => wildcardMatch(currentPath, rule.pattern));
  
        if (matchedRule) {
          noteTitleH2.textContent = matchedRule.title;
          savedNoteP.textContent = matchedRule.note;
          viewNoteDiv.style.display = 'block';
        } else {
          regexInput.value = currentPath;
          editNoteDiv.style.display = 'block';
        }
      });
    });
  
    document.getElementById('save').addEventListener('click', () => {
      const regex = regexInput.value;
      const title = titleInput.value;
      const note = noteInput.value;

      if (regex == "" || regex == undefined) {
        alert("Path Pattern Not Specified")
        return
      } 
  
      chrome.storage.local.get(['rules'], (result) => {
        const rules = result.rules || [];
        const existingRuleIndex = rules.findIndex(rule => rule.pattern === regex);
  
        if (existingRuleIndex >= 0) {
          rules[existingRuleIndex].title = title;
          rules[existingRuleIndex].note = note;
        } else {
          rules.push({ pattern: regex, title: title, note: note });
        }
  
        chrome.storage.local.set({ rules: rules }, () => {
          editNoteDiv.style.display = 'none';
          viewNoteDiv.style.display = 'block';
          noteTitleH2.textContent = title;
          savedNoteP.textContent = note;
        });
      });
    });
  
    document.getElementById('edit').addEventListener('click', () => {

        editNoteDiv.style.display = 'block';
        viewNoteDiv.style.display = 'none';
      
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const currentUrl = new URL(tabs[0].url);
            const currentPath = currentUrl.pathname + currentUrl.search + currentUrl.hash;
        
            chrome.storage.local.get(['rules'], (result) => {
              const rules = result.rules || [];
              const matchedRule = rules.find(rule => wildcardMatch(currentPath, rule.pattern));
        
              if (matchedRule) {
                regexInput.value = matchedRule.pattern;
                titleInput.value = matchedRule.title;
                noteInput.textContent = matchedRule.note;
              }
            });
          });

    });
  
  });
  