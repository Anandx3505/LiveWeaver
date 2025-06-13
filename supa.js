
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
// 🔧 Replace with your actual Supabase project credentials
const SUPABASE_URL = 'https://ppsvxmjhvmdbiurfxxtr.supabase.co'
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc3Z4bWpodm1kYml1cmZ4eHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTc1NDgsImV4cCI6MjA2NTI3MzU0OH0.84rrKcuXxPfRYjUjgjLIpH_lzHd1L7K8HA5qZDt0j5A"

const BUCKET_NAME = 'liveweaver-data'
const ROOT_PATH = 'user-data' // base folder

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function listFiles() {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(ROOT_PATH, {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })

  if (error) {
    console.error("❌ Error listing files:", error.message)
    return
  }

  const fileList = document.getElementById("fileList")
  fileList.innerHTML = ""

  if (!data || data.length === 0) {
    const li = document.createElement("li")
    li.textContent = "No files found."
    fileList.appendChild(li)
    return
  }

  data.forEach(item => {
    const li = document.createElement("li")
    li.textContent = item.name + (item.metadata?.mimetype ? ` (${item.metadata.mimetype})` : "")
    fileList.appendChild(li)
  })

  console.log("✅ Files:", data)
}

listFiles()
