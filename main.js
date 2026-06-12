const skillSearch = document.querySelector("#skill-search");
const skillCards = Array.from(document.querySelectorAll(".skill-card"));
const checklist = document.querySelector("#developer-checklist");
const checklistItems = Array.from(document.querySelectorAll("#developer-checklist input[type='checkbox']"));
const progressValue = document.querySelector("#progress-value");
const progressBar = document.querySelector("#progress-bar");
const progressCopy = document.querySelector("#progress-copy");
const resetChecklist = document.querySelector("#reset-checklist");
const storageKey = "developer-field-guide-checklist";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function filterSkills() {
  const query = normalize(skillSearch?.value);

  skillCards.forEach((card) => {
    const haystack = normalize(`${card.textContent} ${card.dataset.keywords}`);
    card.classList.toggle("is-hidden", query.length > 0 && !haystack.includes(query));
  });
}

function readChecklistState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function writeChecklistState() {
  const state = {};

  checklistItems.forEach((item) => {
    state[item.name] = item.checked;
  });

  localStorage.setItem(storageKey, JSON.stringify(state));
}

function updateProgress() {
  const total = checklistItems.length;
  const done = checklistItems.filter((item) => item.checked).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  if (progressValue) {
    progressValue.textContent = `${percent}%`;
  }

  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }

  if (progressCopy) {
    progressCopy.textContent = done === total
      ? "오늘 기준은 모두 점검했습니다."
      : `${total}개 중 ${done}개를 완료했습니다.`;
  }
}

function restoreChecklist() {
  const state = readChecklistState();

  checklistItems.forEach((item) => {
    item.checked = Boolean(state[item.name]);
  });

  updateProgress();
}

skillSearch?.addEventListener("input", filterSkills);

checklist?.addEventListener("change", () => {
  writeChecklistState();
  updateProgress();
});

resetChecklist?.addEventListener("click", () => {
  checklistItems.forEach((item) => {
    item.checked = false;
  });
  writeChecklistState();
  updateProgress();
});

restoreChecklist();
