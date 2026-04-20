const form = document.querySelector("#booking-form");
const statusMessage = document.querySelector("#form-status");

if (form && statusMessage) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const defaultButtonLabel = submitButton?.dataset.label || submitButton?.textContent || "예약 요청 보내기";
    const formData = new FormData(form);
    const email = form.querySelector('input[name="email"]');
    const replyTo = form.querySelector('input[name="_replyto"]');

    if (submitButton) {
      submitButton.dataset.label = defaultButtonLabel;
    }

    if (replyTo && email instanceof HTMLInputElement) {
      replyTo.value = email.value.trim();
      formData.set("_replyto", replyTo.value);
    }

    statusMessage.textContent = "";
    statusMessage.className = "form-status";
    form.setAttribute("aria-busy", "true");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "예약 요청 전송 중...";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";

        try {
          const data = await response.json();
          const firstError = Array.isArray(data.errors) ? data.errors[0] : null;

          if (firstError?.message) {
            errorMessage = firstError.message;
          }
        } catch {
          // Ignore JSON parse failures and fall back to the default message.
        }

        throw new Error(errorMessage);
      }

      form.reset();
      statusMessage.textContent = "예약 요청이 접수되었습니다. 입력하신 이메일로 운항 가능 여부와 안내를 회신드리겠습니다.";
      statusMessage.classList.add("is-success");
    } catch (error) {
      statusMessage.textContent =
        error instanceof Error ? error.message : "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
      statusMessage.classList.add("is-error");
    } finally {
      form.removeAttribute("aria-busy");

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonLabel;
      }
    }
  });
}

const portalSearchData = [
  {
    title: "실시간 뉴스 브리핑",
    description: "주요 헤드라인과 속보를 빠르게 확인하는 뉴스 허브입니다.",
    category: "뉴스",
    keywords: ["뉴스", "실시간 뉴스", "브리핑", "헤드라인"],
  },
  {
    title: "오늘 일정 정리",
    description: "캘린더 일정을 한 번에 모아보고 우선순위를 정리합니다.",
    category: "일정",
    keywords: ["일정", "캘린더", "오늘 일정", "미팅"],
  },
  {
    title: "메일 확인 센터",
    description: "받은편지함, 중요 메일, 회신 대기 메일을 확인하는 영역입니다.",
    category: "메일",
    keywords: ["메일", "이메일", "받은편지함", "회신"],
  },
  {
    title: "쇼핑 추천 모음",
    description: "자주 찾는 상품과 추천 카테고리를 빠르게 둘러봅니다.",
    category: "쇼핑",
    keywords: ["쇼핑", "상품", "추천", "구매"],
  },
  {
    title: "지도 검색 서비스",
    description: "장소, 주소, 이동 경로를 조회할 수 있는 지도 기능 자리입니다.",
    category: "지도",
    keywords: ["지도", "위치", "주소", "길찾기"],
  },
  {
    title: "빠른 메모 작성",
    description: "즉시 메모를 남기고 후속 작업으로 연결하는 영역입니다.",
    category: "메모",
    keywords: ["메모", "기록", "노트", "아이디어"],
  },
];

const portalForm = document.querySelector("#portal-search-form");
const portalInput = document.querySelector("#portal-search-input");
const portalStickySearch = document.querySelector("#portal-sticky-search");
const portalStickySearchForm = document.querySelector("#portal-sticky-search-form");
const portalStickySearchInput = document.querySelector("#portal-sticky-search-input");
const portalProviderPicker = document.querySelector("#portal-provider-picker");
const portalProviderCopy = document.querySelector("#portal-provider-copy");
const portalProviderButtons = document.querySelectorAll("[data-search-provider]");
const portalResultsList = document.querySelector("#portal-results-list");
const portalResultMeta = document.querySelector("#portal-result-meta");
const portalCalendarTitle = document.querySelector("#portal-calendar-title");
const portalCalendarSummary = document.querySelector("#portal-calendar-summary");
const portalCalendarDays = document.querySelector("#portal-calendar-days");
const portalCalendarPrev = document.querySelector("#portal-calendar-prev");
const portalCalendarNext = document.querySelector("#portal-calendar-next");
const portalCalendarDetailTitle = document.querySelector("#portal-calendar-detail-title");
const portalCalendarDetailCopy = document.querySelector("#portal-calendar-detail-copy");
const portalLiveDate = document.querySelector("#portal-live-date");
const portalLiveTime = document.querySelector("#portal-live-time");
const portalLiveWeather = document.querySelector("#portal-live-weather");
const portalLiveFx = document.querySelector("#portal-live-fx");
const portalMiniUsd = document.querySelector("#portal-mini-usd");
const portalMiniEur = document.querySelector("#portal-mini-eur");
const portalMiniJpy = document.querySelector("#portal-mini-jpy");
const portalMiniMonthLeft = document.querySelector("#portal-mini-month-left");
const portalFxChart = document.querySelector("#portal-fx-chart");
const portalFxAxis = document.querySelector("#portal-fx-axis");
const portalFxYAxis = document.querySelector("#portal-fx-yaxis");
const portalFxSummary = document.querySelector("#portal-fx-summary");
const portalFxNote = document.querySelector("#portal-fx-note");
const portalFxTooltip = document.querySelector("#portal-fx-tooltip");
const portalButtons = document.querySelectorAll("[data-portal-keyword]");
const textWraps = document.querySelectorAll(".text-wrap");
const portalContactTrigger = document.querySelector("#portal-contact-trigger");
const portalContactModal = document.querySelector("#portal-contact-modal");
const portalContactClose = document.querySelector("#portal-contact-close");
const portalContactForm = document.querySelector("#portal-contact-form");
const portalContactStatus = document.querySelector("#portal-contact-status");
const portalCommentTrigger = document.querySelector("#portal-comment-trigger");
const portalCommentThread = document.querySelector("#disqus_thread");
const portalQuickContact = document.querySelector("#portal-quick-contact");
const portalSearchProviders = {
  naver: "https://search.naver.com/search.naver?query=",
  google: "https://www.google.com/search?q=",
};
const portalFxFallbackSeries = [
  {
    key: "usd",
    label: "USD/KRW",
    colorClass: "usd",
    values: [1348.2, 1351.4, 1349.8, 1354.1, 1350.5, 1346.9, 1344.3],
  },
  {
    key: "jpy",
    label: "JPY/KRW (100엔)",
    colorClass: "jpy",
    values: [948.1, 951.6, 949.9, 955.4, 953.2, 950.3, 947.5],
  },
  {
    key: "eur",
    label: "EUR/KRW",
    colorClass: "eur",
    values: [1462.5, 1468.2, 1465.7, 1472.9, 1469.6, 1464.8, 1460.4],
  },
];
let portalFxSeries = portalFxFallbackSeries;
let portalFxLabels = ["04/14", "04/15", "04/16", "04/17", "04/18", "04/19", "04/20"];
let portalCalendarCursor = new Date();
let portalSelectedDateKey = "";
let portalHolidayMap = new Map();
let portalCalendarNotes = {};
const portalDateNotes = {
  "04-07": "주간 정리",
  "04-15": "환율 점검",
  "04-20": "업데이트 확인",
  "04-28": "월말 메모",
};

function openPortalContactModal() {
  if (!(portalContactModal instanceof HTMLElement)) {
    return;
  }

  portalContactModal.hidden = false;
  document.body.classList.add("portal-modal-open");
}

function closePortalContactModal() {
  if (!(portalContactModal instanceof HTMLElement)) {
    return;
  }

  portalContactModal.hidden = true;
  document.body.classList.remove("portal-modal-open");
}

function initDisqus() {
  if (!(portalCommentThread instanceof HTMLElement)) {
    return;
  }

  window.disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = window.location.pathname || "/";
  };

  if (document.querySelector('script[src="https://cyhsearch0804.disqus.com/embed.js"]')) {
    return;
  }

  const script = document.createElement("script");
  script.src = "https://cyhsearch0804.disqus.com/embed.js";
  script.setAttribute("data-timestamp", String(Date.now()));
  (document.head || document.body).appendChild(script);
}

function hideProviderPicker() {
  if (portalProviderPicker instanceof HTMLElement) {
    portalProviderPicker.hidden = true;
  }
}

function handleSearchIntent(query) {
  if (!(portalInput instanceof HTMLInputElement)) {
    return;
  }

  const normalized = query.trim();
  portalInput.value = normalized;

  if (!normalized) {
    hideProviderPicker();
    runPortalSearch("");
    return;
  }

  showProviderPicker(normalized);
  runPortalSearch(normalized);
  document.querySelector(".portal-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showProviderPicker(query) {
  if (!(portalProviderPicker instanceof HTMLElement) || !(portalProviderCopy instanceof HTMLElement)) {
    return;
  }

  portalProviderCopy.textContent = `"${query}" 검색을 어디서 진행할지 선택하세요.`;
  portalProviderPicker.hidden = false;
}

function moveToSearchProvider(provider, query) {
  const normalizedQuery = query.trim();
  const baseUrl = portalSearchProviders[provider];

  if (!normalizedQuery || !baseUrl) {
    return;
  }

  window.location.href = `${baseUrl}${encodeURIComponent(normalizedQuery)}`;
}

function renderCalendar() {
  if (
    !(portalCalendarTitle instanceof HTMLElement) ||
    !(portalCalendarSummary instanceof HTMLElement) ||
    !(portalCalendarDays instanceof HTMLElement) ||
    !(portalCalendarDetailTitle instanceof HTMLElement) ||
    !(portalCalendarDetailCopy instanceof HTMLElement)
  ) {
    return;
  }

  const today = new Date();
  const year = portalCalendarCursor.getFullYear();
  const month = portalCalendarCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const days = [];
  const selectedKey = portalSelectedDateKey || `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const weekdayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  for (let i = 0; i < startWeekday; i += 1) {
    days.push('<div class="portal-calendar-day is-empty" aria-hidden="true"></div>');
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
    const isSelected = dateKey === selectedKey;
    const holidayName = portalHolidayMap.get(dateKey);
    const noteKey = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const noteLabel = portalCalendarNotes[dateKey] || portalDateNotes[noteKey];
    days.push(`
      <button type="button" class="portal-calendar-day${isToday ? " is-today" : ""}${isSelected ? " is-selected" : ""}${holidayName ? " is-holiday" : ""}${noteLabel ? " has-note" : ""}" data-calendar-date="${dateKey}">
        <span>${day}</span>
        <div class="portal-calendar-markers">
          ${holidayName ? '<em class="portal-calendar-marker holiday"></em>' : ""}
          ${noteLabel ? '<em class="portal-calendar-marker note"></em>' : ""}
        </div>
      </button>
    `);
  }

  portalCalendarTitle.textContent = `${year}년 ${month + 1}월`;
  portalCalendarSummary.textContent = `${totalDays}일 구성, 클릭해서 날짜별 상세를 볼 수 있습니다.`;
  portalCalendarDays.innerHTML = days.join("");
  portalSelectedDateKey = selectedKey;

  const [selectedYear, selectedMonth, selectedDay] = selectedKey.split("-").map(Number);
  const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  const selectedHoliday = portalHolidayMap.get(selectedKey);
  const selectedDateKey = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
  const selectedNote = portalCalendarNotes[selectedDateKey] || portalDateNotes[`${String(selectedMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`];
  portalCalendarDetailTitle.textContent = `${selectedYear}년 ${selectedMonth}월 ${selectedDay}일`;
  portalCalendarDetailCopy.textContent = `${weekdayNames[selectedDate.getDay()]}${isWeekend ? " · 주말" : " · 평일"}${selectedHoliday ? ` · 공휴일: ${selectedHoliday}` : ""}${selectedNote ? ` · 메모: ${selectedNote}` : " · 이 날짜 기준 일정이나 메모를 연결할 수 있습니다."}`;

  portalCalendarDays.querySelectorAll("[data-calendar-date]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      portalSelectedDateKey = button.dataset.calendarDate ?? "";
      renderCalendar();
    });
  });

  portalCalendarDetailCopy.onclick = () => {
    const currentKey = portalSelectedDateKey;
    if (!currentKey) {
      return;
    }
    const currentValue = portalCalendarNotes[currentKey] ?? "";
    const nextValue = window.prompt("이 날짜 메모를 입력하세요.", currentValue);
    if (nextValue === null) {
      return;
    }
    if (nextValue.trim()) {
      portalCalendarNotes[currentKey] = nextValue.trim();
    } else {
      delete portalCalendarNotes[currentKey];
    }
    localStorage.setItem("portalCalendarNotes", JSON.stringify(portalCalendarNotes));
    renderCalendar();
  };
}

function buildFxLine(values, width, height, min, max) {
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildFxDots(values, width, height, min, max, colorClass) {
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `<circle class="portal-fx-dot ${colorClass}" data-series="${colorClass}" data-index="${index}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4"></circle>`;
    })
    .join("");
}

function renderFxChart() {
  if (
    !(portalFxChart instanceof HTMLElement) ||
    !(portalFxAxis instanceof HTMLElement) ||
    !(portalFxYAxis instanceof HTMLElement) ||
    !(portalFxSummary instanceof HTMLElement) ||
    !(portalFxNote instanceof HTMLElement)
  ) {
    return;
  }

  const width = 640;
  const height = 240;
  const allValues = portalFxSeries.flatMap((series) => series.values);
  const min = Math.min(...allValues) - 10;
  const max = Math.max(...allValues) + 10;
  const yTicks = 5;
  const tickValues = Array.from({ length: yTicks }, (_, index) => {
    const ratio = 1 - index / (yTicks - 1);
    return min + (max - min) * ratio;
  });
  const gridLines = tickValues
    .map((value, index) => {
      const y = (height / (yTicks - 1)) * index;
      return `
        <line class="portal-fx-grid-line" x1="0" y1="${y.toFixed(2)}" x2="${width}" y2="${y.toFixed(2)}"></line>
        <text class="portal-fx-grid-label" x="8" y="${(y - 8).toFixed(2)}">${value.toFixed(0)}</text>
      `;
    })
    .join("");

  const seriesSvg = portalFxSeries
    .map((series) => {
      const path = buildFxLine(series.values, width, height, min, max);
      const dots = buildFxDots(series.values, width, height, min, max, series.colorClass);
      return `
        <g class="portal-fx-series ${series.colorClass}">
          <path class="portal-fx-path ${series.colorClass}" d="${path}" />
          ${dots}
        </g>
      `;
    })
    .join("");

  portalFxChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="portal-fx-svg portal-fx-svg-main" role="img" aria-label="최근 7일 주요 환율 추이">
      <rect class="portal-fx-grid-bg" x="0" y="0" width="${width}" height="${height}" rx="18"></rect>
      ${gridLines}
      ${seriesSvg}
    </svg>
  `;

  portalFxYAxis.innerHTML = tickValues
    .map((series) => {
      return `<span>${series.toFixed(0)}</span>`;
    })
    .join("");

  portalFxAxis.innerHTML = portalFxLabels.map((label) => `<span>${label}</span>`).join("");

  portalFxSummary.innerHTML = portalFxSeries
    .map((series) => {
      const start = series.values[0];
      const end = series.values[series.values.length - 1];
      const diff = end - start;
      const directionClass = diff <= 0 ? "is-down" : "is-up";
      const directionLabel = diff <= 0 ? "하락" : "상승";

      return `
        <article class="portal-fx-summary-card">
          <div class="portal-fx-series-head">
            <strong>${series.label}</strong>
            <span>${end.toFixed(1)}</span>
          </div>
          <p class="portal-fx-summary-change ${directionClass}">
            최근 7일 ${directionLabel} ${Math.abs(diff).toFixed(1)}
          </p>
        </article>
      `;
    })
    .join("");

  bindFxTooltip();
}

function bindFxTooltip() {
  if (!(portalFxTooltip instanceof HTMLElement) || !(portalFxChart instanceof HTMLElement)) {
    return;
  }

  portalFxChart.querySelectorAll(".portal-fx-dot").forEach((dot) => {
    dot.addEventListener("mouseenter", () => {
      if (!(dot instanceof SVGCircleElement)) {
        return;
      }
      const seriesKey = dot.dataset.series ?? "";
      const pointIndex = Number(dot.dataset.index ?? 0);
      const series = portalFxSeries.find((item) => item.key === seriesKey);
      if (!series) {
        return;
      }
      portalFxTooltip.hidden = false;
      portalFxTooltip.textContent = `${series.label} · ${portalFxLabels[pointIndex]} · ${series.values[pointIndex].toFixed(1)}`;
    });

    dot.addEventListener("mouseleave", () => {
      portalFxTooltip.hidden = true;
    });
  });
}

async function fetchFxSeries(base, label, colorClass, transform = (value) => value) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  const formatDate = (value) => value.toISOString().slice(0, 10);
  const response = await fetch(
    `https://api.frankfurter.dev/v1/${formatDate(start)}..${formatDate(end)}?base=${base}&symbols=KRW`,
  );

  if (!response.ok) {
    throw new Error(`${label} 환율 데이터를 불러오지 못했습니다.`);
  }

  const data = await response.json();
  const entries = Object.entries(data.rates ?? {}).sort(([left], [right]) => left.localeCompare(right));

  return {
    key: colorClass,
    label,
    colorClass,
    values: entries.map(([, rate]) => transform(rate.KRW)),
    labels: entries.map(([date]) => date.slice(5).replace("-", "/")),
    latestDate: data.end_date ?? formatDate(end),
  };
}

async function loadLiveFxChart() {
  if (!(portalFxNote instanceof HTMLElement)) {
    return;
  }

  portalFxNote.textContent = "실제 환율 데이터를 불러오는 중입니다.";

  try {
    const [usd, jpy, eur] = await Promise.all([
      fetchFxSeries("USD", "USD/KRW", "usd"),
      fetchFxSeries("JPY", "JPY/KRW (100엔)", "jpy", (value) => value * 100),
      fetchFxSeries("EUR", "EUR/KRW", "eur"),
    ]);

    portalFxSeries = [usd, jpy, eur];
    portalFxLabels = usd.labels;
    renderFxChart();
    portalFxNote.textContent = `실시간 기준이 아닌 최근 공식 일일 환율입니다. 최신 기준일: ${usd.latestDate}`;
    updateHeroMetrics();
  } catch (error) {
    portalFxSeries = portalFxFallbackSeries;
    portalFxLabels = ["04/14", "04/15", "04/16", "04/17", "04/18", "04/19", "04/20"];
    renderFxChart();
    portalFxNote.textContent =
      error instanceof Error
        ? `${error.message} 기본 샘플 데이터로 표시합니다.`
        : "환율 데이터를 불러오지 못해 기본 샘플 데이터로 표시합니다.";
    updateHeroMetrics();
  }
}

async function loadWeather() {
  if (!(portalLiveWeather instanceof HTMLElement)) {
    return;
  }

  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,apparent_temperature,weather_code&timezone=Asia%2FSeoul");
    if (!response.ok) {
      throw new Error("날씨 정보를 불러오지 못했습니다.");
    }
    const data = await response.json();
    const current = data.current ?? {};
    const weatherMap = {
      0: "맑음",
      1: "대체로 맑음",
      2: "구름 조금",
      3: "흐림",
      45: "안개",
      51: "이슬비",
      61: "비",
      71: "눈",
      80: "소나기",
      95: "뇌우",
    };
    const weatherLabel = weatherMap[current.weather_code] ?? "기상 확인";
    portalLiveWeather.textContent = `${weatherLabel} ${current.temperature_2m ?? "-"}°C`;
  } catch {
    portalLiveWeather.textContent = "서울 날씨 확인 불가";
  }
}

async function loadHolidays(year) {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/KR`);
    if (!response.ok) {
      throw new Error("holiday fetch failed");
    }
    const data = await response.json();
    portalHolidayMap = new Map(data.map((item) => [item.date, item.localName || item.name]));
  } catch {
    portalHolidayMap = new Map();
  }
  renderCalendar();
}

function updateClock() {
  const now = new Date();
  if (portalLiveDate instanceof HTMLElement) {
    portalLiveDate.textContent = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }

  if (portalLiveTime instanceof HTMLElement) {
    portalLiveTime.textContent = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    }) + " KST";
  }

  if (portalMiniMonthLeft instanceof HTMLElement) {
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    portalMiniMonthLeft.textContent = `${lastDay - now.getDate()}일`;
  }
}

function updateHeroMetrics() {
  const usdSeries = portalFxSeries.find((series) => series.key === "usd");
  const eurSeries = portalFxSeries.find((series) => series.key === "eur");
  const jpySeries = portalFxSeries.find((series) => series.key === "jpy");
  if (portalMiniUsd instanceof HTMLElement && usdSeries) {
    portalMiniUsd.textContent = usdSeries.values.at(-1)?.toFixed(1) ?? "-";
  }
  if (portalMiniEur instanceof HTMLElement && eurSeries) {
    portalMiniEur.textContent = eurSeries.values.at(-1)?.toFixed(1) ?? "-";
  }
  if (portalMiniJpy instanceof HTMLElement && jpySeries) {
    portalMiniJpy.textContent = jpySeries.values.at(-1)?.toFixed(1) ?? "-";
  }
  if (portalLiveFx instanceof HTMLElement && usdSeries) {
    const latest = usdSeries.values.at(-1)?.toFixed(1) ?? "-";
    const previous = usdSeries.values.at(-2) ?? usdSeries.values.at(-1) ?? 0;
    const latestValue = usdSeries.values.at(-1) ?? 0;
    const diff = latestValue - previous;
    portalLiveFx.textContent = `USD/KRW ${latest} · ${diff >= 0 ? "+" : ""}${diff.toFixed(1)}`;
  }
}

function syncStickySearchVisibility() {
  if (!(portalStickySearch instanceof HTMLElement)) {
    return;
  }
  portalStickySearch.hidden = window.scrollY < 220;
  portalStickySearch.classList.toggle("is-compact", window.scrollY > 420);
}

function renderPortalResults(items, query = "") {
  if (!portalResultsList || !portalResultMeta) {
    return;
  }

  if (items.length === 0) {
    portalResultMeta.textContent = query ? `"${query}" 검색 결과 없음` : "검색 결과 없음";
    portalResultsList.innerHTML = `
      <article class="portal-result-card portal-result-empty">
        <strong>일치하는 결과가 없습니다.</strong>
        <p>다른 키워드로 다시 검색하거나 추천 검색어를 눌러보세요.</p>
      </article>
    `;
    return;
  }

  portalResultMeta.textContent = query ? `"${query}" 검색 결과 ${items.length}건` : "기본 추천 결과";
  portalResultsList.innerHTML = items
    .map(
      (item) => `
        <article class="portal-result-card">
          <div class="portal-result-top">
            <span class="portal-result-category">${item.category}</span>
          </div>
          <strong>${item.title}</strong>
          <p>${item.description}</p>
        </article>
      `,
    )
    .join("");
}

function runPortalSearch(query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    renderPortalResults(portalSearchData.slice(0, 4));
    return;
  }

  const filtered = portalSearchData.filter((item) => {
    return [item.title, item.description, item.category, ...item.keywords]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });

  renderPortalResults(filtered, query.trim());
}

if (portalForm && portalInput instanceof HTMLInputElement) {
  portalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearchIntent(portalInput.value);
  });
}

if (portalStickySearchForm && portalStickySearchInput instanceof HTMLInputElement) {
  portalStickySearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearchIntent(portalStickySearchInput.value);
  });
}

portalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!(button instanceof HTMLElement) || !(portalInput instanceof HTMLInputElement)) {
      return;
    }

    const keyword = button.dataset.portalKeyword ?? "";
    handleSearchIntent(keyword);
    portalInput.focus();
  });
});

portalProviderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!(button instanceof HTMLButtonElement) || !(portalInput instanceof HTMLInputElement)) {
      return;
    }

    moveToSearchProvider(button.dataset.searchProvider ?? "", portalInput.value);
  });
});

if (portalInput instanceof HTMLInputElement) {
  portalInput.addEventListener("input", () => {
    if (!portalInput.value.trim()) {
      hideProviderPicker();
    }
    if (portalStickySearchInput instanceof HTMLInputElement) {
      portalStickySearchInput.value = portalInput.value;
    }
  });
}

if (portalStickySearchInput instanceof HTMLInputElement && portalInput instanceof HTMLInputElement) {
  portalStickySearchInput.addEventListener("input", () => {
    portalInput.value = portalStickySearchInput.value;
  });
}

if (portalCalendarNext instanceof HTMLButtonElement) {
  portalCalendarNext.addEventListener("click", () => {
    portalCalendarCursor = new Date(portalCalendarCursor.getFullYear(), portalCalendarCursor.getMonth() + 1, 1);
    portalSelectedDateKey = "";
    loadHolidays(portalCalendarCursor.getFullYear());
    renderCalendar();
  });
}

if (portalCalendarPrev instanceof HTMLButtonElement) {
  portalCalendarPrev.addEventListener("click", () => {
    portalCalendarCursor = new Date(portalCalendarCursor.getFullYear(), portalCalendarCursor.getMonth() - 1, 1);
    portalSelectedDateKey = "";
    loadHolidays(portalCalendarCursor.getFullYear());
    renderCalendar();
  });
}

textWraps.forEach((container, lineIndex) => {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const text = container.dataset.text ?? "";
  container.textContent = "";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = char;
    span.style.animationDelay = `${lineIndex * 700 + i * 150}ms`;
    container.appendChild(span);
  });
});

try {
  portalCalendarNotes = JSON.parse(localStorage.getItem("portalCalendarNotes") ?? "{}");
} catch {
  portalCalendarNotes = {};
}

if (portalContactForm && portalContactStatus) {
  portalContactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = portalContactForm.querySelector('button[type="submit"]');
    const defaultLabel = submitButton?.textContent || "문의 보내기";
    const formData = new FormData(portalContactForm);

    portalContactStatus.textContent = "";
    portalContactStatus.className = "portal-contact-status";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "전송 중...";
    }

    try {
      const response = await fetch(portalContactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";

        try {
          const data = await response.json();
          const firstError = Array.isArray(data.errors) ? data.errors[0] : null;

          if (firstError?.message) {
            errorMessage = firstError.message;
          }
        } catch {
          // Ignore JSON parse failures and use the default message.
        }

        throw new Error(errorMessage);
      }

      portalContactForm.reset();
      portalContactStatus.textContent = "제휴 문의가 접수되었습니다.";
      portalContactStatus.classList.add("is-success");
    } catch (error) {
      portalContactStatus.textContent =
        error instanceof Error ? error.message : "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
      portalContactStatus.classList.add("is-error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultLabel;
      }
    }
  });
}

if (portalContactTrigger instanceof HTMLElement) {
  portalContactTrigger.addEventListener("click", openPortalContactModal);
}

if (portalQuickContact instanceof HTMLButtonElement) {
  portalQuickContact.addEventListener("click", openPortalContactModal);
}

if (portalContactClose instanceof HTMLElement) {
  portalContactClose.addEventListener("click", closePortalContactModal);
}

if (portalContactModal instanceof HTMLElement) {
  portalContactModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.hasAttribute("data-contact-close")) {
      closePortalContactModal();
    }
  });
}

if (portalCommentTrigger instanceof HTMLElement) {
  portalCommentTrigger.addEventListener("click", () => {
    const commentSection = document.querySelector("#portal-comments");

    if (commentSection instanceof HTMLElement) {
      commentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePortalContactModal();
  }
});

window.addEventListener("scroll", syncStickySearchVisibility, { passive: true });

renderPortalResults(portalSearchData.slice(0, 4));
renderCalendar();
renderFxChart();
loadLiveFxChart();
loadWeather();
loadHolidays(portalCalendarCursor.getFullYear());
updateClock();
updateHeroMetrics();
syncStickySearchVisibility();
window.setInterval(updateClock, 1000);
initDisqus();
