const usernameInput = document.getElementById("username-login");
const passwordInput = document.getElementById("password-login");
const loginButton = document.getElementById("login-button");
const rememberMe = document.getElementById("remember-me");
const error_username = document.getElementById("error-message-username");
const error_password = document.getElementById("error-message-password");
const loadingSpinner = document.getElementById("loading-spinner");
const heading = document.getElementById("heading");
let lockIcons = document.querySelectorAll(".bxs-lock-alt");
let unlockIcons = document.querySelectorAll(".bxs-lock-open-alt");

if (sessionStorage.getItem("authToken")) {
  window.location.href = "../pages/home-page.html";
}

usernameInput.addEventListener("input", () => {
  if (usernameInput.value.length > 50) {
    usernameInput.style.borderColor = "red";
    usernameInput.focus();
    usernameInput.style.boxShadow = "none";
    error_username.textContent = "Username cannot exceed 50 characters!";
    error_username.style.display = "block";
  } else {
    usernameInput.style.borderColor = "inherit";
    usernameInput.style.boxShadow = "1px 1px 10px cyan";
    error_username.style.display = "none";
  }
});

passwordInput.addEventListener("input", () => {
  if (passwordInput.value !== "") {
    passwordInput.style.borderColor = "inherit";
    passwordInput.style.boxShadow = "1px 1px 10px cyan";
    error_password.style.display = "none";
  }
});

loginButton.addEventListener("click", function (event) {
  event.preventDefault();

  let isValid = true;

  if (usernameInput.value === "") {
    usernameInput.style.boxShadow = "none";
    usernameInput.style.borderColor = "red";
    usernameInput.focus();
    error_username.textContent = "Username cannot be empty!";
    error_username.style.display = "block";
    isValid = false;
  }

  if (passwordInput.value === "") {
    passwordInput.style.borderColor = "red";
    passwordInput.style.boxShadow = "none";
    passwordInput.focus();
    error_password.textContent = "Password cannot be empty!";
    error_password.style.display = "block";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  loadingSpinner.style.display = "block";
  const loginData = {
    username: usernameInput.value,
    password: passwordInput.value,
    rememberMe: rememberMe.checked,
  };

  fetch(`http://localhost:8080/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        loadingSpinner.style.display = "none";
        if (data.error.username) {
          error_username.textContent = data.error.username;
          error_username.style.display = "block";
        }

        if (data.error.password) {
          loadingSpinner.style.display = "none";
          error_password.textContent = data.error.password;
          error_password.style.display = "block";
        }
      } else if (data.detailMessage) {
        loadingSpinner.style.display = "none";
        error_username.textContent =
          data.detailMessage || "Login failed. Please try again.";
        error_username.style.display = "block";
      } else {
        // Success case
        loadingSpinner.style.display = "none";
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: data.id,
            fullName: data.fullName,
            departmentName: data.departmentName,
            role: data.role,
          })
        );
        window.location.href = "../pages/home-page.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    });
});

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
