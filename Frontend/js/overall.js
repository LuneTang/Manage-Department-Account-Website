const logoutButton = document.getElementById("logout-button");
const text = document.getElementById("logout");
const loadingSpinner = document.getElementById("loading-spinner");
const token = sessionStorage.getItem("authToken");

logoutButton.addEventListener("click", () => {
  loadingSpinner.style.display = "block";
  fetch("http://localhost:8080/api/v1/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        loadingSpinner.style.display = "none";
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userInfo");
        window.location.href = "../pages/login-page.html";
      } else {
        loadingSpinner.style.display = "none";
        alert("Failed to logout. Please try again.");
      }
    })
    .catch((error) => {
      loadingSpinner.style.display = "none";
      console.error("Error logging out:", error);
      alert("An unexpected error occurred. Please try again.");
    });
});
