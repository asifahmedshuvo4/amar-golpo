/* ============================================
   Story Blog – GitHub Pages
   story/ ফোল্ডার থেকে .txt ফাইল + pic/ থেকে ছবি নিয়ে দেখায়
   ============================================ */

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMsg = document.getElementById("error-msg");
const gridEl = document.getElementById("story-grid");
const emptyEl = document.getElementById("empty");
const modal = document.getElementById("story-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");

// ----- Helper: raw GitHub URL -----
function rawUrl(path) {
  return `https://raw.githubusercontent.com/${CONFIG.githubRepo}/${CONFIG.branch}/${path}`;
}

// ----- Helper: GitHub API contents -----
async function fetchFolder(folder) {
  const url = `https://api.github.com/repos/${CONFIG.githubRepo}/contents/${folder}?ref=${CONFIG.branch}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return await res.json();
}

// ----- Helper: title from filename -----
function niceTitle(filename) {
  // "amar-golpo.txt" → "Amar Golpo"
  return filename
    .replace(/\.txt$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ----- Find matching image for a story -----
function findImage(baseName, picFiles) {
  for (const ext of CONFIG.imageExtensions) {
    const match = picFiles.find(
      (f) => f.name.toLowerCase() === (baseName + ext).toLowerCase()
    );
    if (match) return rawUrl(`pic/${match.name}`);
  }
  return null;
}

// ----- Load all stories -----
async function loadStories() {
  try {
    // config check
    if (
      !CONFIG.githubRepo ||
      CONFIG.githubRepo.includes("YOUR_USERNAME")
    ) {
      throw new Error(
        "config.js ফাইলে আপনার GitHub username ও repository নাম লিখুন।\nউদাহরণ: \"rahim/amar-golpo\""
      );
    }

    const [storyFiles, picFiles] = await Promise.all([
      fetchFolder("story"),
      fetchFolder("pic"),
    ]);

    // শুধু .txt ফাইল নাও
    const txtFiles = storyFiles.filter(
      (f) => f.type === "file" && f.name.toLowerCase().endsWith(".txt")
    );

    if (txtFiles.length === 0) {
      loadingEl.classList.add("hidden");
      emptyEl.classList.remove("hidden");
      return;
    }

    // প্রতিটি গল্পের জন্য টেক্সট লোড করো
    const stories = await Promise.all(
      txtFiles.map(async (file) => {
        const baseName = file.name.replace(/\.txt$/i, "");
        const textUrl = rawUrl(`story/${file.name}`);
        let content = "";
        try {
          const res = await fetch(textUrl);
          content = await res.text();
        } catch {
          content = "(গল্প লোড করা যায়নি)";
        }

        // প্রথম লাইনকে title হিসেবে নেওয়া (যদি খালি না হয়)
        const lines = content.trim().split("\n");
        let title = niceTitle(file.name);
        let body = content.trim();

        // যদি প্রথম লাইন ছোট হয় এবং # বা ** দিয়ে শুরু না হয়, title হিসেবে নিতে পারি
        if (lines[0] && lines[0].length < 80 && lines[0].trim()) {
          title = lines[0].trim().replace(/^#+\s*/, "");
          body = lines.slice(1).join("\n").trim() || content.trim();
        }

        const excerpt =
          body.length > 120 ? body.substring(0, 120).trim() + "…" : body;

        return {
          id: baseName,
          title,
          excerpt,
          body,
          image: findImage(baseName, picFiles || []),
          filename: file.name,
        };
      })
    );

    // নতুন গল্প আগে দেখাও (নাম অনুসারে sort, চাইলে reverse)
    stories.sort((a, b) => b.filename.localeCompare(a.filename));

    renderStories(stories);
    loadingEl.classList.add("hidden");
  } catch (err) {
    console.error(err);
    loadingEl.classList.add("hidden");
    errorEl.classList.remove("hidden");
    errorMsg.textContent = err.message || "কিছু একটা ভুল হয়েছে।";
  }
}

// ----- Render cards -----
function renderStories(stories) {
  gridEl.innerHTML = "";

  stories.forEach((story) => {
    const card = document.createElement("article");
    card.className = "story-card";
    card.onclick = () => openStory(story);

    const imgHtml = story.image
      ? `<img class="card-image" src="${story.image}" alt="${story.title}" loading="lazy" onerror="this.outerHTML='<div class=\\'card-image placeholder\\'>📖</div>'" />`
      : `<div class="card-image placeholder">📖</div>`;

    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <h2 class="card-title">${escapeHtml(story.title)}</h2>
        <p class="card-excerpt">${escapeHtml(story.excerpt)}</p>
        <div class="card-footer">
          <span>পড়ুন →</span>
        </div>
      </div>
    `;

    gridEl.appendChild(card);
  });
}

// ----- Modal open / close -----
function openStory(story) {
  modalTitle.textContent = story.title;
  modalText.textContent = story.body;

  if (story.image) {
    modalImg.src = story.image;
    modalImg.alt = story.title;
    modalImg.parentElement.style.display = "block";
  } else {
    modalImg.parentElement.style.display = "none";
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeStory() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

// ESC দিয়ে বন্ধ
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeStory();
});

// ----- Escape HTML -----
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ----- Start -----
loadStories();
