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

// Simple BibTeX parser
function parseBibTeX(bibContent) {
  const entries = [];
  const entryRegex = /@(\w+)\s*\{\s*([^,]+),\s*([\s\S]*?)\n\s*\}/g;
  let match;

  while ((match = entryRegex.exec(bibContent)) !== null) {
    const type = match[1].toLowerCase();
    const key = match[2].trim();
    const fields = {};

    const fieldsContent = match[3];
    const fieldRegex = /(\w+)\s*=\s*\{?([^,}]*)\}?(?=,|$)/g;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(fieldsContent)) !== null) {
      const fieldName = fieldMatch[1].trim().toLowerCase();
      const fieldValue = fieldMatch[2].trim().replace(/[{}]/g, '');
      fields[fieldName] = fieldValue;
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
  if (entry.type === 'article' || entry.type === 'journal') {
    if (entry.journal) html += `${entry.journal}`;
    if (entry.volume) html += `, vol. ${entry.volume}`;
    if (entry.number) html += `, no. ${entry.number}`;
    if (entry.pages) html += `, pp. ${entry.pages}`;
  } else if (entry.type === 'inproceedings' || entry.type === 'conference') {
    if (entry.booktitle) html += `${entry.booktitle}`;
    if (entry.pages) html += `, pp. ${entry.pages}`;
  } else if (entry.type === 'thesis') {
    if (entry.school) html += `${entry.school}`;
    if (entry.type === 'mastersthesis' || entry.type === 'thesis') html += ' (Master\'s Thesis)';
    if (entry.type === 'phdthesis') html += ' (PhD Thesis)';
  }

  if (entry.year) {
    html += `, ${entry.year}`;
  }

  html += '<br>';

  // DOI and URL
  if (entry.doi) {
    html += ` <a href="https://doi.org/${entry.doi}" target="_blank">DOI</a>`;
  }
  if (entry.url) {
    html += ` <a href="${entry.url}" target="_blank">PDF</a>`;
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
