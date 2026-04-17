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
const portalResultsList = document.querySelector("#portal-results-list");
const portalResultMeta = document.querySelector("#portal-result-meta");
const portalButtons = document.querySelectorAll("[data-portal-keyword]");
const textWraps = document.querySelectorAll(".text-wrap");
const portalContactTrigger = document.querySelector("#portal-contact-trigger");
const portalContactModal = document.querySelector("#portal-contact-modal");
const portalContactClose = document.querySelector("#portal-contact-close");
const portalContactForm = document.querySelector("#portal-contact-form");
const portalContactStatus = document.querySelector("#portal-contact-status");
const portalCommentTrigger = document.querySelector("#portal-comment-trigger");
const portalCommentThread = document.querySelector("#disqus_thread");
const portalNaverSearchUrl = "https://search.naver.com/search.naver";

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
  syncPortalBodyScroll();
}

function syncPortalBodyScroll() {
  const hasOpenModal = portalContactModal instanceof HTMLElement && !portalContactModal.hidden;

  document.body.classList.toggle("portal-modal-open", hasOpenModal);
}

function initDisqus() {
  if (!(portalCommentThread instanceof HTMLElement)) {
    return;
  }

  window.disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = window.location.pathname || "/";
  };

  if (document.querySelector('script[src="https://cyhsearch.disqus.com/embed.js"]')) {
    return;
  }

  const script = document.createElement("script");
  script.src = "https://cyhsearch.disqus.com/embed.js";
  script.setAttribute("data-timestamp", String(+new Date()));
  (document.head || document.body).appendChild(script);
}

function openNaverSearch(query) {
  const normalized = query.trim();

  if (!normalized) {
    return;
  }

  const url = `${portalNaverSearchUrl}?query=${encodeURIComponent(normalized)}`;
  window.location.href = url;
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
    openNaverSearch(portalInput.value);
  });
}

portalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!(button instanceof HTMLElement) || !(portalInput instanceof HTMLInputElement)) {
      return;
    }

    const keyword = button.dataset.portalKeyword ?? "";
    portalInput.value = keyword;
    openNaverSearch(keyword);
  });
});

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

renderPortalResults(portalSearchData.slice(0, 4));
initDisqus();
