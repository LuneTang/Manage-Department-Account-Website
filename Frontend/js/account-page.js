document.addEventListener("DOMContentLoaded", function () {
  const filterByDepartment = document.getElementById("filter-by-department");
  const filterByRole = document.getElementById("filter-by-role");
  const role = JSON.parse(sessionStorage.getItem("userInfo"))?.role;
  const search = document.getElementById("search-account-input");
  const asc = document.getElementById("asc");
  const desc = document.getElementById("desc");
  const tableBody = document.getElementById("table-body");
  const prevButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");
  const pageInfo = document.getElementById("page-info");
  const sidebarToggle = document.querySelector(".toggle-btn");
  const selectAll = document.getElementById("select-all");

  let isAsc = false;
  let isDesc = false;

  let message = document.getElementById("message");

  if (!token) {
    window.location.href = "../pages/login-page.html";
  }

  sidebarToggle.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("hide-sidebar");
    document.getElementById("main-content").classList.toggle("reposition");
    document.getElementById("funcs").classList.toggle("slide");
    document.getElementById("section").classList.toggle("show");
  });

  let isSelectedAll = false;
  selectAll.addEventListener("change", () => {
    isSelectedAll = selectAll.checked;
    const checkboxes = tableBody.querySelectorAll(".account-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isSelectedAll;
    });
  });

  function fetchListDepartmentName(place) {
    fetch(`http://localhost:8080/api/v1/view/departments/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error && Array.isArray(data)) {
          data.forEach((o) => {
            const option = document.createElement("option");
            option.value = o.name;
            option.textContent = o.name;
            option.setAttribute("data-id", o.id);
            place.appendChild(option);
          });
        } else {
          message.style.color = "red";
          message.textContent = "Department name dropdown not found";
          setTimeout(() => {
            message.textContent = "";
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error fetching department names:", error);
      });
  }

  fetchListDepartmentName(filterByDepartment);
  // Load table, search, filter

  let currentPage = 1;
  let totalPages = 2;

  // Fetch account list
  async function fetchAccounts(url, page) {
    loadingSpinner.style.display = "block";

    try {
      const response = await fetch(`${url}pageNumber=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await response.json();
      loadingSpinner.style.display = "none";
      return data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }

  // Load account list into table
  async function loadAccounts(url, page) {
    const data = await fetchAccounts(url, page);

    if (data && data.content) {
      renderTableRows(data.content);
      totalPages = data.totalPages;
      updatePagination();
    }
  }

  // Create row for table
  function renderTableRows(accounts) {
    tableBody.innerHTML = "";
    accounts.forEach((account) => {
      const row = document.createElement("tr");
      let isChecked = isSelectedAll;
      row.innerHTML = `
          <td><input type="checkbox" data-id="${
            account.id
          }" class="account-checkbox" ${isChecked ? "checked" : ""}></td>
          <td>${account.username}</td>
          <td>${account.fullName}</td>
          <td>${account.role}</td>
          <td>${account.departmentName}</td>
          <td>${account.createdDate}</td>
          <td>
            <div class="actions">
                <i data-id="${account.id}" data-dep-id="${
        account.departmentId
      }" data-email="${account.email}" id="edit-acc" class="fas fa-pen"></i>
                <i data-id="${
                  account.id
                }" id="delete-acc" class="fas fa-delete-left"></i>
            </div>
          </td>
        `;
      tableBody.appendChild(row);
    });
  }

  function updatePagination() {
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  loadAccounts(`${accountViewUrl}?`, currentPage);

  // Handle Pagination Buttons
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      reloadTable();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      reloadTable();
    }
  });

  // Handle Filters, Search

  function reloadTable() {
    let url = accountViewUrl;
    const params = [];

    // Add search filter
    const searchValue = search.value.trim();
    if (searchValue) {
      params.push(`search=${encodeURIComponent(searchValue)}`);
    }

    // Add type filter
    const selectedDepartment = filterByDepartment.value;
    const selectedRole = filterByRole.value;

    if (selectedDepartment && selectedDepartment !== "None") {
      params.push(`departmentName=${encodeURIComponent(selectedDepartment)}`);
    }

    if (selectedRole && selectedRole !== "None") {
      params.push(`role=${encodeURIComponent(selectedRole)}`);
    }

    // Add sort
    if (isAsc) {
      params.push("sort=createdDate,asc");
    }
    if (isDesc) {
      params.push("sort=createdDate,desc");
    }

    // Construct final URL
    if (params.length > 0) {
      url += `?${params.join("&")}&`;
    } else {
      url += "?";
    }

    loadAccounts(url, currentPage);
  }

  // Event Listeners for Filters and Search
  filterByDepartment.addEventListener("change", () => {
    currentPage = 1;
    reloadTable();
  });

  filterByRole.addEventListener("change", () => {
    currentPage = 1;
    reloadTable();
  });

  search.addEventListener("input", () => {
    currentPage = 1;
    reloadTable();
  });

  // Sort by total member
  asc.addEventListener("click", () => {
    asc.style.color = "#007bff";
    desc.style.color = "lightsteelblue";
    isAsc = true;
    isDesc = false;
    currentPage = 1;
    reloadTable();
  });

  desc.addEventListener("click", () => {
    desc.style.color = "#007bff";
    asc.style.color = "lightsteelblue";
    isDesc = true;
    isAsc = false;
    currentPage = 1;
    reloadTable();
  });

  // ============================= Create account part
  const addAccount = document.getElementById("add-account");
  const newFirstName = document.getElementById("in-cre-acc-first-name");
  const newLastName = document.getElementById("in-cre-acc-last-name");
  const newEmail = document.getElementById("in-cre-acc-email");
  const roleNewAcc = document.getElementById("role-cre-acc-form");
  const departmentNewAcc = document.getElementById("department-cre-acc-form");
  const closeCreAccFormBtn = document.getElementById("close-cre-acc");
  const doneCreAccBtn = document.getElementById("done-cre-acc");
  const errorMessageFirstName = document.getElementById("error-first-name");
  const errorMessageLastName = document.getElementById("error-last-name");
  const errorMessageEmail = document.getElementById("error-email");
  const errOverall = document.getElementById("err");

  $(".wrapper-cre-acc-form").fadeOut("fast");

  function openCreForm() {
    $(".forms").css("z-index", "1");
    $(".wrapper-cre-acc-form").fadeIn("fast");
    fetchListDepartmentName(departmentNewAcc);
  }

  // Function to close the form/modal
  function closeCreForm() {
    newFirstName.value = "";
    newLastName.value = "";
    newEmail.value = "";
    roleNewAcc.value = "None";
    departmentNewAcc.value = "None";

    errorMessageFirstName.textContent = "";
    errorMessageLastName.textContent = "";
    errorMessageEmail.textContent = "";
    errOverall.textContent = "";
    loadingSpinner.style.display = "none";

    $(".forms").css("z-index", "-1");

    $(".wrapper-cre-acc-form").fadeOut("fast");
  }

  addAccount.addEventListener("click", () => {
    if (role.toLowerCase() === "admin") {
      openCreForm();
    } else {
      message.textContent = "You do not have permission to create account.";
      setTimeout(() => {
        message.textContent = "";
      }, 2000);
    }
  });

  closeCreAccFormBtn.addEventListener("click", () => closeCreForm());

  newFirstName.addEventListener("input", () => {
    if (newFirstName.value.length > 50) {
      newFirstName.style.borderColor = "red";
      newFirstName.style.boxShadow = "none";
      errorMessageFirstName.textContent = "Name cannot over 50 characters.";
    } else {
      newFirstName.style.borderColor = "inherit";
      newFirstName.style.boxShadow = "1px 1px 10px cyan";
      errorMessageFirstName.textContent = "";
    }
  });

  newLastName.addEventListener("input", () => {
    if (newLastName.value.length > 50) {
      newLastName.style.borderColor = "red";
      newLastName.style.boxShadow = "none";
      errorMessageLastName.textContent = "Name cannot over 50 characters.";
    } else {
      newLastName.style.borderColor = "inherit";
      newLastName.style.boxShadow = "1px 1px 10px cyan";
      errorMessageLastName.textContent = "";
    }
  });

  newEmail.addEventListener("input", () => {
    if (newEmail.value.length > 100) {
      newEmail.style.borderColor = "red";
      newEmail.style.boxShadow = "none";
      errorMessageEmail.textContent = "Email cannot over 100 characters.";
    } else {
      newEmail.style.borderColor = "inherit";
      newEmail.style.boxShadow = "1px 1px 10px cyan";
      errorMessageEmail.textContent = "";
    }
  });

  roleNewAcc.addEventListener("change", () => {
    if (roleNewAcc.value !== "None") {
      roleNewAcc.style.border = "inherit";
    }
  });

  departmentNewAcc.addEventListener("change", () => {
    if (departmentNewAcc.value !== "None") {
      departmentNewAcc.style.border = "inherit";
    }
  });

  function createPassword() {
    const minLength = 6;
    const length = 12;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%#*?&";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "@$!%#*?&";

    let password = "";

    // Ensure we have at least one of each required character type
    password +=
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password +=
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += numberChars[Math.floor(Math.random() * numberChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password with random characters
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    // Shuffle the password to ensure the required characters are not in a fixed order
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // If the generated password is shorter than the required length, we add random characters
    if (password.length < minLength) {
      while (password.length < minLength) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
    }

    return password;
  }

  function createUsername() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%#*?&";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "@$!%#*?&";
    let length = 2;
    let username = "";

    // Ensure we have at least one of each required character type
    username +=
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    username +=
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    username += numberChars[Math.floor(Math.random() * numberChars.length)];
    username += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the username with random characters
    for (let i = username.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      username += chars[randomIndex];
    }

    // Shuffle the username to ensure the required characters are not in a fixed order
    username = username
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return `user${username}`;
  }

  function createAccount() {
    // Reset error messages and styles
    resetErrorStyles();

    if (!newFirstName.value) {
      showError(
        newFirstName,
        errorMessageFirstName,
        "First name cannot be null !"
      );
      return;
    }
    if (!newLastName.value) {
      showError(
        newLastName,
        errorMessageLastName,
        "Last name cannot be null !"
      );
      return;
    }
    if (!newEmail.value) {
      showError(newEmail, errorMessageEmail, "Email cannot be null !");
      return;
    }

    if (roleNewAcc.value === "None") {
      roleNewAcc.style.border = "1px solid red";
      return;
    }

    // Set default department if not selected
    if (departmentNewAcc.value === "None") {
      departmentNewAcc.style.border = "1px solid red";
      return;
    }

    // Ensure dataId is set before sending the request
    const selectedOption = departmentNewAcc.selectedOptions[0];
    const dataId = parseInt(selectedOption.getAttribute("data-id"), 10);

    if (!dataId) {
      errOverall.textContent = "Department ID is missing.";
      return;
    }

    const requestBody = {
      username: createUsername(),
      firstName: newFirstName.value.trim(),
      lastName: newLastName.value.trim(),
      email: newEmail.value.trim(),
      password: createPassword(),
      departmentId: dataId,
      role: roleNewAcc.value.toUpperCase(),
    };

    loadingSpinner.style.display = "block";

    fetch(`${accountUrl}/admin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data.error) {
          console.log("dataerro" + data.error);
          loadingSpinner.style.display = "none";
          handleErrorResponse(data);
          return;
        } else {
          closeCreForm();
        }
      })
      .catch((error) => {
        console.error("Error creating account: ", error);
        errOverall.textContent = "An error occurred while creating account.";
        loadingSpinner.style.display = "none";
      });
  }

  // Helper function to reset error styles
  function resetErrorStyles() {
    newFirstName.style.border = "";
    newFirstName.style.boxShadow = "";
    errorMessageFirstName.textContent = "";
    newLastName.style.border = "";
    newLastName.style.boxShadow = "";
    errorMessageLastName.textContent = "";
    newEmail.style.border = "";
    newEmail.style.boxShadow = "";
    errorMessageEmail.textContent = "";
    roleNewAcc.style.border = "";
    errOverall.textContent = "";
  }

  // Helper function to display error message
  function showError(inputElement, errorElement, message) {
    inputElement.focus();
    inputElement.style.border = "1px solid red";
    inputElement.style.boxShadow = "none";
    errorElement.textContent = message;
  }

  // Handle error response based on server response
  function handleErrorResponse(data) {
    if (data.error) {
      if (data.error.firstName) {
        showError(newFirstName, errorMessageFirstName, data.error.firstName);
      }

      if (data.error.lastName) {
        showError(newLastName, errorMessageLastName, data.error.lastName);
      }

      if (data.error.email) {
        showError(newEmail, errorMessageEmail, data.error.email);
      }

      let errMessage = "";
      if (data.error.username) {
        errMessage = data.error.username;
      }

      if (data.error.password) {
        errMessage += data.error.password;
      }

      if (data.error.departmentId) {
        errMessage += data.error.departmentId;
      }

      errOverall.textContent = errMessage;
    } else if (data.detailMessage) {
      console.log(data.detailMessage);
    }
  }

  doneCreAccBtn.addEventListener("click", () => createAccount());

  // =============== Edit Account part

  $(".wrapper-edt-acc-form").fadeOut("fast");

  const editAccRole = document.getElementById("role-edt-acc-form");
  const editAccDepId = document.getElementById("department-edt-acc-form");
  const closeEdtAccFormBtn = document.getElementById("close-edt-acc");
  const doneEdtAccBtn = document.getElementById("done-edt-acc");
  const edtErrOverall = document.getElementById("edt-err");
  const fullNameInfo = document.getElementById("full-name-info");
  const emailInfo = document.getElementById("email-info");

  let selectedItems = new Set();
  let accId = 0;
  let roleAcc = "";

  function openEdtForm() {
    $(".forms").css("z-index", "1");
    $(".wrapper-edt-acc-form").fadeIn("fast");
  }

  function closeEdtForm() {
    loadingSpinner.style.display = "none";
    $(".forms").css("z-index", "-1");
    $(".wrapper-edt-acc-form").fadeOut("fast");
  }

  if (tableBody) {
    tableBody.addEventListener("click", (e) => {
      if (role.toLowerCase() === "admin") {
        if (e.target.classList.contains("fa-pen")) {
          fetchListDepartmentName(editAccDepId);
          const row = e.target.closest("tr");
          const fullName = row.querySelector("td:nth-child(3)").textContent;
          roleAcc = row.querySelector("td:nth-child(4)").textContent;
          const email = e.target.getAttribute("data-email");
          accId = parseInt(e.target.getAttribute("data-id"), 10);
          editAccDepId.value = row.querySelector("td:nth-child(5)").textContent;
          editAccount(roleAcc.toUpperCase(), fullName, email);
        } else if (e.target.classList.contains("fa-delete-left")) {
          const row = e.target.closest("tr");
          const id = parseInt(e.target.getAttribute("data-id"), 10);
          selectedItems.add(id);

          const checkbox = row.querySelector(".account-checkbox");
          if (checkbox) {
            checkbox.checked = true;
          }

          updateDeleteFormTitle();
          openDelForm();
        }
      } else {
        message.textContent =
          "You do not have permission to edit or delete account.";
        setTimeout(() => {
          message.textContent = "";
        }, 2000);
      }
    });
  }

  function editAccount(roleAcc, fullName, email) {
    openEdtForm();
    editAccRole.value = roleAcc;
    fullNameInfo.value = fullName;
    emailInfo.value = email;
    // editAccDepId.value = depName;
  }

  editAccRole.addEventListener("change", () => {
    if (editAccRole.value !== "None") {
      editAccRole.style.border = "inherit";
    }
  });

  editAccDepId.addEventListener("change", () => {
    if (editAccDepId.value !== "None") {
      editAccDepId.style.border = "inherit";
    }
  });

  function updateAccount(accId) {
    if (editAccRole.value === "None") {
      editAccRole.style.border = "1px solid red";
      return;
    }

    if (editAccDepId.value === "None") {
      editAccDepId.style.border = "1px solid red";
      return;
    }

    loadingSpinner.style.display = "block";
    const requestBody = {
      id: accId,
      departmentId:
        editAccDepId.options[editAccDepId.selectedIndex].getAttribute(
          "data-id"
        ),
      role: editAccRole.value.trim(),
    };

    fetch(`${accountUrl}/update-by-admin`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        loadingSpinner.style.display = "none";
        if (!data.error || !data.detailMessage) {
          loadingSpinner.style.display = "none";
          loadAccounts(`${accountViewUrl}?`, currentPage);
          closeEdtForm();
        } else {
          loadingSpinner.style.display = "none";
          edtErrOverall.textContent = data.detailMessage || "An error occured.";
        }
      })
      .catch((error) => {
        console.error("Error updating account", error);
      });
  }

  doneEdtAccBtn.addEventListener("click", () => updateAccount(accId));

  closeEdtAccFormBtn.addEventListener("click", () => closeEdtForm());

  //================= Delete Account part
  const deleteAll = document.getElementById("delete-all-selected");
  const delAllBtn = document.getElementById("del-all-acc");
  const cancel = document.getElementById("cancel");

  $(".wrapper-del-acc-form").fadeOut("fast");
  function openDelForm() {
    // Display the form when button is clicked
    $(".forms").css("z-index", "1");
    $(".wrapper-del-acc-form").fadeIn("fast");
  }

  // Function to close the form/modal
  function closeDelForm() {
    $(".forms").css("z-index", "-1");
    $(".wrapper-del-acc-form").fadeOut("fast");
  }

  // Utility function to update the delete form title
  function updateDeleteFormTitle() {
    document.getElementById(
      "title-del-acc"
    ).textContent = `Delete ${selectedItems.size} department(s)?`;
  }

  // Event listener for individual checkbox changes
  tableBody.addEventListener("change", (event) => {
    if (event.target.classList.contains("account-checkbox")) {
      const itemId = event.target.dataset.id;

      if (event.target.checked) {
        selectedItems.add(itemId);
      } else {
        selectedItems.delete(itemId);
      }

      // Update the title with the current count
      updateDeleteFormTitle();
    }
  });

  // Event listener for the delete button
  deleteAll.addEventListener("click", () => {
    if (role.toLowerCase() === "admin") {
      const checkedCheckboxes = document.querySelectorAll(
        ".account-checkbox:checked"
      );

      if (checkedCheckboxes.length === 0) {
        message.textContent = "Please select at least one account to delete !";
        setTimeout(() => {
          message.textContent = "";
        }, 2000);
        return;
      }

      selectedItems.clear();

      checkedCheckboxes.forEach((checkbox) => {
        selectedItems.add(parseInt(checkbox.dataset.id, 10));
      });

      updateDeleteFormTitle();

      openDelForm();
    } else {
      message.textContent = "You do not have permission to delete account.";
      setTimeout(() => {
        message.textContent = "";
      }, 2000);
    }
  });

  // Event listener for the cancel button
  cancel.addEventListener("click", () => {
    const checkboxes = tableBody.querySelectorAll(".account-checkbox");
    checkboxes.forEach((checkbox) => {
      selectAll.checked = false;
      selectAllChecked = false;
      checkbox.checked = false;
    });

    // Clear the selected items
    selectedItems.clear();

    // Reset the title
    updateDeleteFormTitle();

    closeDelForm();
  });

  function deleteSelectedItems() {
    const idsToDelete = Array.from(selectedItems);

    fetch("http://localhost:8080/api/v1/accounts/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: idsToDelete }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.error) {
          message.textContent = data.error.ids || data.detailMessage;

          setTimeout(() => {
            message.textContent = "";
          });
        } else {
          selectedItems.clear();
          loadAccounts(`${accountViewUrl}?`, currentPage);
          closeDelForm();
        }
      })
      .catch((error) => console.error("Error deleting items:", error));
  }

  delAllBtn.addEventListener("click", () => deleteSelectedItems());
});
