document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('export').addEventListener('click', () => {
      chrome.storage.local.get(['rules'], (result) => {
        const rules = result.rules || [];
        const blob = new Blob([JSON.stringify(rules, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  
    document.getElementById('import').addEventListener('click', () => {
      document.getElementById('importFile').click();
    });
  
    document.getElementById('importFile').addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const rules = JSON.parse(e.target.result);
          chrome.storage.local.set({ rules: rules }, () => {
            alert('Notes imported!');
            displayNotes();
          });
        };
        reader.readAsText(file);
      }
    });

    function deleteNote(index) {
      if (confirm("Are you sure to delete this note?")) {
        chrome.storage.local.get(['rules'], (result) => {
          const notes = result.rules || [];
          notes.splice(index, 1);
          chrome.storage.local.set({ rules: notes }, () => {
            alert('One Note deleted!');
            displayNotes();
          });
        });
      }   
  }

    function noteCard(note, index) {
      
      const noteItem = document.createElement('li');
      noteItem.className = 'note-item w3-bar';

      const noteContent = document.createElement('div');
      noteContent.className = "w3-bar-item"
      noteContent.innerHTML = `
            <h3>${note.title}</h3>
            <p class="multiline">${note.note}</p>
            <p>${note.pattern}</p>
      `;

        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-button w3-button w3-xlarge w3-right w3-bar-item';
        deleteButton.innerHTML = '&times;';
        deleteButton.addEventListener('click', () => deleteNote(index));

        noteItem.appendChild(noteContent);
        noteItem.appendChild(deleteButton);
     
      return noteItem
    }
  
    function displayNotes() {
      chrome.storage.local.get(['rules'], (result) => {
        const rules = result.rules || [];
        const noteList = document.getElementById('noteList');
        noteList.innerHTML = '';
        rules.forEach((rule, index) => {
          let card = noteCard(rule, index)
          noteList.appendChild(card)
        });
      });
    }
  
    displayNotes();
  });
  