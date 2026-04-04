const form = document.querySelector("#partnership-form");
const statusMessage = document.querySelector("#form-status");

if (form && statusMessage) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    statusMessage.textContent = "";
    statusMessage.className = "form-status";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "전송 중...";
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
        throw new Error("request_failed");
      }

      form.reset();
      statusMessage.textContent = "문의가 접수되었습니다. 빠르게 검토 후 회신드리겠습니다.";
      statusMessage.classList.add("is-success");
    } catch (error) {
      statusMessage.textContent = "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
      statusMessage.classList.add("is-error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "문의 보내기";
      }
    }
  });
}
