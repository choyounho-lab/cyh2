const capacityForm = document.querySelector("#capacity-form");
const resultInstances = document.querySelector("#result-instances");
const resultDb = document.querySelector("#result-db");
const resultConcurrency = document.querySelector("#result-concurrency");
const resultCache = document.querySelector("#result-cache");
const runbookForm = document.querySelector("#runbook-form");
const runbookItems = Array.from(document.querySelectorAll("#runbook-form input[type='checkbox']"));
const runbookProgress = document.querySelector("#runbook-progress");
const runbookBar = document.querySelector("#runbook-bar");
const runbookReset = document.querySelector("#runbook-reset");
const runbookStorageKey = "traffic-lab-runbook";

function numberFromForm(formData, key, fallback) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(Math.round(value));
}

function updateCapacity() {
  if (!(capacityForm instanceof HTMLFormElement)) {
    return;
  }

  const formData = new FormData(capacityForm);
  const rps = numberFromForm(formData, "rps", 1000);
  const latency = numberFromForm(formData, "latency", 120);
  const cache = Math.min(numberFromForm(formData, "cache", 70), 99);
  const instance = Math.max(numberFromForm(formData, "instance", 250), 1);
  const dbRps = rps * ((100 - cache) / 100);
  const cachedRps = rps - dbRps;
  const concurrency = rps * (latency / 1000);
  const instances = Math.max(Math.ceil((rps / instance) * 1.3), 1);

  if (resultInstances) resultInstances.textContent = `${formatNumber(instances)}대`;
  if (resultDb) resultDb.textContent = `${formatNumber(dbRps)} RPS`;
  if (resultConcurrency) resultConcurrency.textContent = `${formatNumber(concurrency)}개`;
  if (resultCache) resultCache.textContent = `${formatNumber(cachedRps)} RPS`;
}

function readRunbookState() {
  try {
    return JSON.parse(localStorage.getItem(runbookStorageKey) || "{}");
  } catch {
    return {};
  }
}

function writeRunbookState() {
  const state = {};

  runbookItems.forEach((item) => {
    state[item.name] = item.checked;
  });

  localStorage.setItem(runbookStorageKey, JSON.stringify(state));
}

function updateRunbookProgress() {
  const total = runbookItems.length;
  const done = runbookItems.filter((item) => item.checked).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  if (runbookProgress) {
    runbookProgress.textContent = `${percent}%`;
  }

  if (runbookBar) {
    runbookBar.style.width = `${percent}%`;
  }
}

function restoreRunbook() {
  const state = readRunbookState();

  runbookItems.forEach((item) => {
    item.checked = Boolean(state[item.name]);
  });

  updateRunbookProgress();
}

capacityForm?.addEventListener("input", updateCapacity);

runbookForm?.addEventListener("change", () => {
  writeRunbookState();
  updateRunbookProgress();
});

runbookReset?.addEventListener("click", () => {
  runbookItems.forEach((item) => {
    item.checked = false;
  });
  writeRunbookState();
  updateRunbookProgress();
});

updateCapacity();
restoreRunbook();
