// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const resetButton = document.getElementById("reset-button");
const loadingSpinner = document.getElementById("loading-spinner");
const translate = document.getElementById("google_translate_element");
const setting = document.getElementById("setting");
const heading = document.getElementById("heading");

let errorMessage = document.getElementById("error-message");
let lockIcons = document.querySelectorAll(".bxs-lock-alt");
let unlockIcons = document.querySelectorAll(".bxs-lock-open-alt");

lockIcons.forEach((lockIcon) => {
  lockIcon.addEventListener("click", (event) => {
    let input = event.target.closest(".input-box").querySelector("input");
    lockIcon.style.display = "none";
    input.type = "text";
    let unlockIcon = event.target
      .closest(".input-box")
      .querySelector(".bxs-lock-open-alt");
    unlockIcon.style.display = "block";
  });
});

unlockIcons.forEach((unlockIcon) => {
  unlockIcon.addEventListener("click", (event) => {
    let input = event.target.closest(".input-box").querySelector("input");
    unlockIcon.style.display = "none";
    input.type = "password";
    let lockIcon = event.target
      .closest(".input-box")
      .querySelector(".bxs-lock-alt");
    lockIcon.style.display = "block";
  });
});

resetButton.addEventListener("click", function (event) {
  event.preventDefault();

  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (newPassword === "") {
    errorMessage.textContent = "New password cannot be empty.";
    errorMessage.style.display = "block";
    newPasswordInput.focus();
    newPasswordInput.style.boxShadow = "none";
    newPasswordInput.style.border = "1px solid red";
    return;
  }

  if (confirmPassword === "") {
    errorMessage.textContent = "Confirm password cannot be empty.";
    errorMessage.style.display = "block";
    confirmPasswordInput.focus();
    confirmPasswordInput.style.boxShadow = "none";
    confirmPasswordInput.style.border = "1px solid red";
    return;
  }

  if (newPassword !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match.";
    errorMessage.style.display = "block";
    newPasswordInput.style.boxShadow = "none";
    newPasswordInput.style.border = "1px solid red";
    confirmPasswordInput.style.boxShadow = "none";
    confirmPasswordInput.style.border = "1px solid red";
    return;
  }

  loadingSpinner.style.display = "block";
  const resetData = {
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  };

  fetch(`http://localhost:8080/api/v1/auth/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetData),
  })
    .then((response) => {
      // Check Content-Type header
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json().then((data) => ({ data, isJson: true }));
      } else {
        return response.text().then((text) => ({ data: text, isJson: false }));
      }
    })
    .then(({ data, isJson }) => {
      // Handle response whether it's JSON or plain text
      const message = isJson ? data.message : data;
      errorMessage.style.top = "-5rem";
      errorMessage.style.left = "60px";
      errorMessage.style.color = "lightgreen";
      errorMessage.textContent = message + "Wait for redirect to login page...";
      errorMessage.style.display = "block";

      if (message === "Password reset successfully.") {
        setTimeout(() => {
          loadingSpinner.style.display = "none";
          window.location.href = "../pages/login-page.html";
        }, 3000);
      }
    })
    .catch((error) => {
      loadingSpinner.style.display = "none";
      console.error("Error:", error);
      errorMessage.textContent = "Failed to reset password. Please try again.";
      errorMessage.style.display = "block";
    });
});

newPasswordInput.addEventListener("input", () => {
  errorMessage.style.display = "none";
  newPasswordInput.style.border = "white";
  newPasswordInput.style.boxShadow = "1px 1px 10px cyan";
});

confirmPasswordInput.addEventListener("input", () => {
  errorMessage.style.display = "none";
  confirmPasswordInput.style.border = "white";
  confirmPasswordInput.style.boxShadow = "1px 1px 10px cyan";
});
