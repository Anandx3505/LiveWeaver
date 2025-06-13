// Supabase setup
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ppsvxmjhvmdbiurfxxtr.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc3Z4bWpodm1kYml1cmZ4eHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTc1NDgsImV4cCI6MjA2NTI3MzU0OH0.84rrKcuXxPfRYjUjgjLIpH_lzHd1L7K8HA5qZDt0j5A";
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'liveweaver-data';
const ROOT_FOLDER = 'user-data';

const fileList = ['index.html', 'style.css', 'script.js'];
const files = {};
let currentFile = 'index.html';
const codeEditor = document.getElementById('codeEditor');

// Extract UID and project from URL params
const params = new URLSearchParams(window.location.search);
const uid = params.get('uid');
const project = params.get('project');

// Load files from Supabase
async function loadFiles() {
  for (const name of fileList) {
    const path = `${ROOT_FOLDER}/${uid}/${project}/${name}`;
    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .download(path);

    if (!error && data) {
      const text = await data.text();
      files[name] = text;
    } else {
      console.error(`❌ Error loading ${name}:`, error?.message || error);
      files[name] = ''; // Fallback to empty file
    }
  }

  codeEditor.value = files[currentFile];
}
await loadFiles();

// Handle tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    files[currentFile] = codeEditor.value;
    currentFile = tab.getAttribute('data-file');

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    codeEditor.value = files[currentFile];
  });
});

// Save file content on input
codeEditor.addEventListener('input', () => {
  files[currentFile] = codeEditor.value;
});

// MIME helper
function getMimeType(filename) {
  if (filename.endsWith('.html')) return 'text/html';
  if (filename.endsWith('.css')) return 'text/css';
  if (filename.endsWith('.js')) return 'application/javascript';
  return 'text/plain';
}

// Save button handler
async function saveProject() {
  files[currentFile] = codeEditor.value;

  const path = `${ROOT_FOLDER}/${uid}/${project}/${currentFile}`;
  const blob = new Blob([files[currentFile]], { type: getMimeType(currentFile) });

  const { error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(path, blob, { upsert: true });

  if (error) {
    alert(`❌ Error saving ${currentFile}: ${error.message}`);
  } else {
    alert(`✅ ${currentFile} saved successfully!`);
  }
}

document.getElementById('saveBtn').addEventListener('click', saveProject);

// Ctrl+S / Cmd+S shortcut
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveProject();
  }
});

// Live preview
document.getElementById('previewBtn').addEventListener('click', () => {
  files[currentFile] = codeEditor.value;

  const html = files['index.html'] || '';
  const css = files['style.css'] || '';
  const js = files['script.js'] || '';

  const previewContent = `
    <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}<\/script>
    </body>
    </html>
  `;

  const previewWindow = window.open('', '_blank');
  previewWindow.document.open();
  previewWindow.document.write(previewContent);
  previewWindow.document.close();
});

// Save all files and redirect to dashboard
document.getElementById('editorLogo')?.addEventListener('click', async () => {
  files[currentFile] = codeEditor.value;

  const uid = new URLSearchParams(window.location.search).get('uid');
  const project = new URLSearchParams(window.location.search).get('project');
  const folderPath = `user-data/${uid}/${project}/`;

  for (const [filename, content] of Object.entries(files)) {
    const type = filename.endsWith('.html') ? 'text/html' :
                 filename.endsWith('.css') ? 'text/css' :
                 'application/javascript';

    const blob = new Blob([content], { type });

    const { error } = await supabase
      .storage
      .from('liveweaver-data')
      .upload(`${folderPath}${filename}`, blob, { upsert: true });

    if (error) {
      console.error(`❌ Error saving ${filename}:`, error.message);
      alert(`❌ Failed to save ${filename}`);
      return;
    }
  }

  // Secure redirect using location.replace (prevents back nav)
  location.replace("dashboard.html");
});



//v2
