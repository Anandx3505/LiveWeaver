// v1.2
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyDA10atWSkGuAu1k7Ezx9LRxjvLu_X92WE",
     authDomain: "liveweaver-e6ebe.firebaseapp.com",
     projectId: "liveweaver-e6ebe",
     storageBucket: "liveweaver-e6ebe.firebasestorage.app",
     messagingSenderId: "226590483250",
     appId: "1:226590483250:web:4446ec8f9043c707a36d2b",
     measurementId: "G-PPRYS6NFBN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Supabase Config ---
const supabaseUrl = 'https://ppsvxmjhvmdbiurfxxtr.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc3Z4bWpodm1kYml1cmZ4eHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTc1NDgsImV4cCI6MjA2NTI3MzU0OH0.84rrKcuXxPfRYjUjgjLIpH_lzHd1L7K8HA5qZDt0j5A";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Constants ---
const BUCKET_NAME = 'liveweaver-data';
const ROOT_FOLDER = 'user-data';

// --- Auth State ---
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "sign.html";
    return;
  }

  const uid = user.uid;
  const email = user.email;
  const authType = sessionStorage.getItem("authType");

  showWelcomeMessage(email, authType);

  if (authType === "signup") {
    const exists = await checkIfFolderExists(`${ROOT_FOLDER}/${uid}/welcome-project/`);
    if (!exists) await createStarterProject(uid);
  }

  await listUserProjects(uid);
});

// --- Welcome Text ---
function showWelcomeMessage(email, type) {
  const welcomeText = document.getElementById("welcomeText");
  welcomeText.textContent = type === "signup"
    ? `Welcome, ${email}`
    : `Welcome back, ${email}`;
}

// --- Folder Check ---
async function checkIfFolderExists(folderPath) {
  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .list(folderPath, { limit: 1 });
  return !error && data && data.length > 0;
}

// --- Starter Project ---
async function createStarterProject(uid) {
  const basePath = `${ROOT_FOLDER}/${uid}/welcome-project/`;
  const starterFiles = [
    { name: 'index.html', type: 'text/html', content: `<html><body><h1>Hello from LiveWeaver!</h1></body></html>` },
    { name: 'style.css', type: 'text/css', content: `body { font-family: Arial; background: #f0f0f0; }` },
    { name: 'script.js', type: 'application/javascript', content: `console.log('Welcome to LiveWeaver!');` }
  ];

  for (const file of starterFiles) {
    const fullPath = `${basePath}${file.name}`;
    const blob = new Blob([file.content], { type: file.type });

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(fullPath, blob, { upsert: false });

    if (error && error.statusCode !== '409') {
      console.error(`❌ Failed to upload ${file.name}:`, error.message);
    } else if (error?.statusCode === '409') {
      console.warn(`⚠️ File already exists: ${file.name}`);
    } else {
      console.log(`✅ Uploaded: ${file.name}`);
    }
  }
}

// --- List Projects ---
async function listUserProjects(uid) {
  const container = document.getElementById("projectsContainer");
  const emptyState = document.getElementById("emptyState");
  container.innerHTML = "";

  const basePath = `${ROOT_FOLDER}/${uid}/`;
  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .list(basePath, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" }
    });

  if (error) {
    console.error("❌ Error listing projects:", error.message);
    emptyState.style.display = "block";
    emptyState.textContent = "Error fetching your projects.";
    return;
  }

  if (!data || data.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  const folders = data.filter(item => item.name && item.metadata === null);
  folders.forEach(folder => {
    const projectName = folder.name;
    const card = document.createElement("div");
    card.className = "project-card";

    const title = document.createElement("div");
    title.className = "project-title";
    title.textContent = projectName;

    const actions = document.createElement("div");
    actions.className = "project-actions";

    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.onclick = () => openProject(projectName);

    actions.appendChild(openBtn);
    card.appendChild(title);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

// --- Open Editor ---
function openProject(projectName) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const encoded = encodeURIComponent(projectName);
  window.location.href = `editor.html?uid=${uid}&project=${encoded}`;
}

// --- Logout ---
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  auth.signOut().then(() => {
    sessionStorage.removeItem("authType");
    window.location.href = "index.html";
  });
});

// --- Modal ---
window.closeModal = function () {
  document.getElementById("projectModal").style.display = "none";
  document.getElementById("projectNameInput").value = "";
};

window.createNewProject = async function () {
  const input = document.getElementById("projectNameInput");
  const projectName = input.value.trim();
  if (!projectName) return alert("Please enter a project name.");

  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const folderPath = `${ROOT_FOLDER}/${uid}/${projectName}/`;
  const exists = await checkIfFolderExists(folderPath);
  if (exists) return alert("A project with this name already exists.");

  const starterFiles = [
    { name: 'index.html', type: 'text/html', content: `<html><body><h1>${projectName}</h1></body></html>` },
    { name: 'style.css', type: 'text/css', content: `body { font-family: Arial; background: #f0f0f0; }` },
    { name: 'script.js', type: 'application/javascript', content: `console.log('Welcome to ${projectName}');` }
  ];

  for (const file of starterFiles) {
    const fullPath = `${folderPath}${file.name}`;
    const blob = new Blob([file.content], { type: file.type });

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(fullPath, blob, { upsert: false });
    if (error && error.statusCode !== '409') {
      return alert(`Failed to create project: ${error.message}`);
    }
  }

  closeModal();
  await listUserProjects(uid);
};

document.getElementById("newProjectBtn")?.addEventListener("click", () => {
  document.getElementById("projectModal").style.display = "flex";
});


