const emailInput = document.getElementById("email-input");
const resetButton = document.getElementById("reset-button");
const errorEmail = document.getElementById("error-message-email");
const loadingSpinner = document.getElementById("loading-spinner");
const translate = document.getElementById("google_translate_element");
const setting = document.getElementById("setting");
const heading = document.getElementById("heading");

window.onload = function () {
  detectLang();
};

emailInput.addEventListener("input", () => {
  if (emailInput.value !== "" || emailInput.value.length > 50) {
    emailInput.style.borderColor = "inherit";
    emailInput.style.boxShadow = "1px 1px 10px cyan";
    errorEmail.style.display = "none";
  }
});

resetButton.addEventListener("click", function (event) {
  event.preventDefault();

  if (emailInput.value === "") {
    emailInput.style.borderColor = "red";
    emailInput.focus();
    emailInput.style.boxShadow = "none";
    errorEmail.textContent = "Email cannot be empty!";
    errorEmail.style.display = "block";
  } else {
    loadingSpinner.style.display = "block";
    const email = emailInput.value;

    fetch(`http://localhost:8080/api/v1/auth/forgot-password/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Reset link sent to:", email);
          errorEmail.style.color = "lightgreen";
          errorEmail.textContent =
            "Check email or spam for link reset password !";
          errorEmail.style.display = "block";
          loadingSpinner.style.display = "none";
          setTimeout(() => {
            window.location.href = "../pages/login-page.html";
            errorEmail.style.color = "red";
            errorEmail.style.display = "none";
          }, 3000);
        } else {
          return response.text().then((text) => {
            loadingSpinner.style.display = "none";
            errorEmail.textContent = text || "Failed to send reset link.";
            errorEmail.style.display = "block";
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        loadingSpinner.style.display = "none";
        errorEmail.textContent = "Failed to send reset link. Please try again.";
        errorEmail.style.display = "block";
      });
  }
});
