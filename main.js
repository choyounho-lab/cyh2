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
