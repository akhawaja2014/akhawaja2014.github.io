// Format authors list nicely
function formatAuthors(authorString) {
  if (!authorString) return '';
  
  // Split by " and " (BibTeX uses "and" to separate authors)
  const authors = authorString.split(/\s+and\s+/).map(a => a.trim());
  
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(' and ');
  
  // For 3+ authors: "Author 1, Author 2, and Author 3"
  return authors.slice(0, -1).join(', ') + ', and ' + authors[authors.length - 1];
}

// Robust BibTeX parser
function parseBibTeX(bibContent) {
  const entries = [];
  
  // Match @type{key, ... } - handles multiline entries
  const entryRegex = /@(\w+)\s*\{\s*([^,\s]+)\s*,\s*([\s\S]*?)\n\}/g;
  let match;

  while ((match = entryRegex.exec(bibContent)) !== null) {
    const type = match[1].toLowerCase();
    const key = match[2].trim();
    const fieldsContent = match[3];
    const fields = {};

    // Parse each field: fieldname = {value} or fieldname = value
    // Handle both formats with and without braces
    const lines = fieldsContent.split('\n');
    let currentField = '';
    let currentValue = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Check if this line contains an equals sign (start of a field)
      if (trimmed.includes('=')) {
        // Save previous field if any
        if (currentField && currentValue) {
          const fieldName = currentField.toLowerCase();
          const fieldValue = currentValue.replace(/[{}]/g, '').trim().replace(/,\s*$/, '');
          if (fieldName && fieldValue) {
            fields[fieldName] = fieldValue;
          }
        }
        
        // Parse new field
        const [fieldName, ...rest] = trimmed.split('=');
        currentField = fieldName.trim();
        currentValue = rest.join('=').trim();
      } else {
        // Continuation of previous field
        currentValue += ' ' + trimmed;
      }
    }
    
    // Save last field
    if (currentField && currentValue) {
      const fieldName = currentField.toLowerCase();
      const fieldValue = currentValue.replace(/[{}]/g, '').trim().replace(/,\s*$/, '');
      if (fieldName && fieldValue) {
        fields[fieldName] = fieldValue;
      }
    }

    entries.push({
      type,
      key,
      ...fields
    });
  }

  return entries;
}

// Format a single BibTeX entry as HTML
function formatEntry(entry) {
  let html = '<li class="pub-entry">';

  // Title
  if (entry.title) {
    html += `<strong>${entry.title}</strong><br>`;
  }

  // Authors
  if (entry.author) {
    const formattedAuthors = formatAuthors(entry.author);
    html += `<em>${formattedAuthors}</em><br>`;
  }

  // Publication details based on type
  const pubDetails = [];
  
  if (entry.type === 'inproceedings' || entry.type === 'conference') {
    if (entry.booktitle) pubDetails.push(entry.booktitle);
  } else if (entry.type === 'article' || entry.type === 'journal') {
    if (entry.journal) pubDetails.push(entry.journal);
  }
  
  if (entry.volume) pubDetails.push(`vol. ${entry.volume}`);
  if (entry.number) pubDetails.push(`no. ${entry.number}`);
  if (entry.pages) pubDetails.push(`pp. ${entry.pages}`);
  if (entry.year) pubDetails.push(entry.year);
  
  if (pubDetails.length > 0) {
    html += pubDetails.join(', ') + '<br>';
  }

  // DOI and URL
  const links = [];
  if (entry.doi) {
    links.push(`<a href="https://doi.org/${entry.doi}" target="_blank">DOI</a>`);
  }
  if (entry.url) {
    links.push(`<a href="${entry.url}" target="_blank">Link</a>`);
  }
  if (links.length > 0) {
    html += links.join(' | ');
  }

  html += '</li>';
  return html;
}

// Load and render BibTeX
function loadAndRenderBibTeX() {
  fetch('/publications.bib')
    .then(response => response.text())
    .then(bibContent => {
      const entries = parseBibTeX(bibContent);
      const pubList = document.getElementById('bib-list');
      if (pubList) {
        pubList.innerHTML = entries.map(entry => formatEntry(entry)).join('');
      }
    })
    .catch(error => {
      console.error('Error loading BibTeX file:', error);
      document.getElementById('bib-list').innerHTML = '<p>Error loading publications.</p>';
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndRenderBibTeX);
} else {
  loadAndRenderBibTeX();
}
