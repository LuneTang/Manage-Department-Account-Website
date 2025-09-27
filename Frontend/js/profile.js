document.addEventListener("DOMContentLoaded", function () {
    // --- Đã sửa lại logic lấy token và userId theo đúng code gốc của bạn ---
    const token = sessionStorage.getItem("authToken");
    console.log(token);
    const userId = JSON.parse(sessionStorage.getItem("userInfo"))?.id;

    // Nếu không có token hoặc userId, chuyển hướng về trang đăng nhập
    if (!token || !userId) {
        // Xóa thông tin cũ để tránh lỗi
        sessionStorage.clear();
        window.location.href = "./login-page.html";
        return;
    }

    // Khai báo các biến DOM element
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const usernameInput = document.getElementById("username");
    const oldPasswordInput = document.getElementById("old-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    
    const updateProfileButton = document.getElementById("update-profile-button");
    const editButtonsContainer = document.getElementById("edit-buttons");
    const cancelUpdateButton = document.getElementById("cancel-update");
    const saveUpdateButton = document.getElementById("save-update");
    
    const profileForm = document.getElementById("profile-form");
    const spinner = document.getElementById("loading-spinner");
    const messageContainer = document.getElementById("message-container");

    const API_BASE_URL = "http://localhost:8080/api/v1";

    // --- CÁC HÀM XỬ LÝ (Không thay đổi) ---

    // Hàm hiển thị thông báo
    function showMessage(message, isError = false) {
        const alertClass = isError ? "alert-danger" : "alert-success";
        messageContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
        setTimeout(() => {
            messageContainer.innerHTML = "";
        }, 4000);
    }

    // Hàm reset các trường lỗi
    function clearValidationErrors() {
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
    }

    // Hàm hiển thị lỗi cho một input cụ thể
    function setValidationError(inputElement, message) {
        inputElement.classList.add('is-invalid');
        const feedbackElement = inputElement.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement.textContent = message;
        }
    }

    // Hàm fetch và hiển thị thông tin user
    async function fetchAndDisplayUserProfile() {
        spinner.style.display = 'block';
        try {
            const response = await fetch(`${API_BASE_URL}/view/accounts/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                     sessionStorage.clear();
                     window.location.href = "./login-page.html";
                }
                throw new Error("Failed to fetch user data.");
            }

            const user = await response.json();
            
            const fullName = user.fullName || "";
            const nameParts = fullName.split(' ').filter(part => part.length > 0);
            const lastName = nameParts.length > 1 ? nameParts.pop() : "";
            const firstName = nameParts.join(' ');

            firstNameInput.value = firstName;
            lastNameInput.value = lastName;
            emailInput.value = user.email || "";
            usernameInput.value = user.username || "";

        } catch (error) {
            showMessage(error.message, true);
        } finally {
            spinner.style.display = 'none';
        }
    }
    
    // (Các hàm còn lại giữ nguyên như code bạn đã cung cấp)
    
    function enableEditMode() {
      firstNameInput.disabled = false;
      lastNameInput.disabled = false;
      emailInput.disabled = false;
      oldPasswordInput.disabled = false;
      newPasswordInput.disabled = false;
      confirmPasswordInput.disabled = false;

      updateProfileButton.classList.add('d-none');
      editButtonsContainer.classList.remove('d-none');
    }

    function disableEditMode() {
      fetchAndDisplayUserProfile(); 
      
      firstNameInput.disabled = true;
      lastNameInput.disabled = true;
      emailInput.disabled = true;
      oldPasswordInput.disabled = true;
      newPasswordInput.disabled = true;
      confirmPasswordInput.disabled = true;
      oldPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmPasswordInput.value = "";

      updateProfileButton.classList.remove('d-none');
      editButtonsContainer.classList.add('d-none');
      clearValidationErrors();
    }

    function validatePassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    }

    async function handleFormSubmit(event) {
      event.preventDefault();
      clearValidationErrors();
      spinner.style.display = 'block';

      let infoUpdated = false;
      let passwordUpdated = false;

      const updateInfoPayload = {
          id: userId,
          firstName: firstNameInput.value.trim(),
          lastName: lastNameInput.value.trim(),
          email: emailInput.value.trim()
      };

      try {
          const response = await fetch(`${API_BASE_URL}/accounts/update-by-employee`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updateInfoPayload)
          });
          if (response.ok) {
              infoUpdated = true;
          } else {
             const errorData = await response.json();
             showMessage(`Info update failed: ${errorData.message || 'Unknown error'}`, true);
          }
      } catch (error) {
          showMessage(`Info update failed: ${error.message}`, true);
      }

      const newPassword = newPasswordInput.value;
      const oldPassword = oldPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (newPassword || oldPassword) {
          let isValid = true;
          if (!oldPassword) {
              setValidationError(oldPasswordInput, "Old password is required to change password.");
              isValid = false;
          }
           if (newPassword !== confirmPassword) {
              setValidationError(confirmPasswordInput, "Passwords do not match.");
              isValid = false;
          }
          if (newPassword && !validatePassword(newPassword)) {
              setValidationError(newPasswordInput, "Password must be at least 8 characters, with uppercase, lowercase, number, and special character.");
              isValid = false;
          }

          if (isValid) {
              const updatePasswordPayload = {
                  id: userId,
                  oldPassword: oldPassword,
                  newPassword: newPassword
              };
              try {
                  const response = await fetch(`${API_BASE_URL}/accounts/update-password`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(updatePasswordPayload)
                  });

                  if (response.ok) {
                      passwordUpdated = true;
                  } else {
                      const errorData = await response.json();
                      setValidationError(oldPasswordInput, errorData.message || "Incorrect old password.");
                  }
              } catch (error) {
                   showMessage(`Password update failed: ${error.message}`, true);
              }
          }
      }

      spinner.style.display = 'none';

      if(infoUpdated || passwordUpdated) {
          let successMessage = [];
          if (infoUpdated) successMessage.push("Profile information updated.");
          if (passwordUpdated) successMessage.push("Password changed successfully.");
          showMessage(successMessage.join(" "));
          disableEditMode();
      }
    }

    // --- GÁN SỰ KIỆN ---
    updateProfileButton.addEventListener("click", enableEditMode);
    cancelUpdateButton.addEventListener("click", disableEditMode);
    profileForm.addEventListener("submit", handleFormSubmit);
    
    // --- KHỞI CHẠY ---
    fetchAndDisplayUserProfile();
});