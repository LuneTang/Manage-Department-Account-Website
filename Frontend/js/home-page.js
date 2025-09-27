let username = document.getElementById("user");

if (!token) {
  window.location.href = "../pages/login-page.html";
}

const userInfo = sessionStorage.getItem("userInfo");

if (userInfo) {
  const user = JSON.parse(userInfo);

  username.textContent = user.fullName + "☘️";
} else {
  console.log("No user information found in sessionStorage.");
}

if (sessionStorage.getItem("authToken")) {
  history.pushState(null, document.title, location.href);
  window.addEventListener("popstate", function (event) {
    history.pushState(null, document.title, location.href);
  });
}
