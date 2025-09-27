const registerForm = document.getElementById("register-button");

const loadingSpinner = document.getElementById("loading-spinner");

const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

const error = document.getElementById("error");
const errorFirstName = document.getElementById("error-first-name");
const errorLastName = document.getElementById("error-last-name");
const errorEmail = document.getElementById("error-email");
const errorUsername = document.getElementById("error-username");
const errorPassword = document.getElementById("error-password");
const errorConfirmPassword = document.getElementById("error-confirm-password");
const heading = document.getElementById("heading");

const maxLength = {
  firstName: 50,
  lastName: 50,
  email: 100,
  username: 50,
};

const inputs = [
  {
    input: firstNameInput,
    error: errorFirstName,
    maxLength: maxLength.firstName,
  },
  { input: lastNameInput, error: errorLastName, maxLength: maxLength.lastName },
  { input: emailInput, error: errorEmail, maxLength: maxLength.email },
  { input: usernameInput, error: errorUsername, maxLength: maxLength.username },
  { input: passwordInput, error: errorPassword },
  { input: confirmPasswordInput, error: errorConfirmPassword },
];

inputs.forEach(({ input, error, maxLength }) => {
  input.addEventListener("input", () => {
    if (!input.value || input.value.length <= (maxLength || Infinity)) {
      error.classList.remove("show");
      input.style.border = "1px solid white";
    }
    if (input.value.length > (maxLength || Infinity)) {
      error.textContent = `This field cannot exceed ${maxLength} characters`;
      error.classList.add("show");
      input.style.border = "1px solid red";
    }
  });
});

registerForm.addEventListener("click", function (event) {
  event.preventDefault();

  let isValid = true;

  inputs.forEach(({ input, error, maxLength }) => {
    if (!input.value) {
      error.textContent = "This field is required";
      error.classList.add("show");
      input.style.border = "1px solid red";
      isValid = false;
    } else if (input.value.length > (maxLength || Infinity)) {
      error.textContent = `This field cannot exceed ${maxLength} characters`;
      error.classList.add("show");
      input.style.border = "1px solid red";
      isValid = false;
    }
  });

  if (passwordInput.value !== confirmPasswordInput.value) {
    errorPassword.textContent = "Passwords do not match";
    errorPassword.classList.add("show");
    errorConfirmPassword.textContent = "Passwords do not match";
    errorConfirmPassword.classList.add("show");
    passwordInput.style.border = "1px solid red";
    confirmPasswordInput.style.border = "1px solid red";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  loadingSpinner.style.display = "block";
  const registrationData = {
    username: usernameInput.value,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  fetch("http://localhost:8080/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationData),
  })
    .then(async (response) => {
      if (response.ok) {
        error.textContent = "Register successfully ! Redirect login...";
        error.style.color = "lightgreen";
        error.classList.add("show");
        document.getElementById("registration-form").reset();
        inputs.forEach(({ input, error }) => {
          input.style.border = "1px solid white";
          error.classList.remove("show");
        });
        setTimeout(() => {
          window.location.href = "../pages/login-page.html";
          error.classList.remove("show");
          loadingSpinner.style.display = "none";
        }, 1500);
      } else {
        const errorResponse = await response.json();
        if (errorResponse.error) {
          if (errorResponse.error.email) {
            loadingSpinner.style.display = "none";
            errorEmail.textContent = errorResponse.error.email;
            errorEmail.classList.add("show");
            emailInput.style.border = "1px solid red";
          }
          if (errorResponse.error.password) {
            loadingSpinner.style.display = "none";
            errorPassword.textContent = errorResponse.error.password;
            errorPassword.classList.add("show");
            passwordInput.style.border = "1px solid red";
          }
          if (errorResponse.error.username) {
            loadingSpinner.style.display = "none";
            errorUsername.textContent = errorResponse.error.username;
            errorUsername.classList.add("show");
            usernameInput.style.border = "1px solid red";
          }
        } else {
          error.textContent =
            errorResponse.detailMessage || "Registration failed.";
          error.classList.add("show");
          setTimeout(() => {
            loadingSpinner.style.display = "none";
            error.classList.remove("show");
          }, 5000);
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      error.textContent = "Registration failed. Please try again.";
      error.classList.add("show");
      loadingSpinner.style.display = "none";
    });
});

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
