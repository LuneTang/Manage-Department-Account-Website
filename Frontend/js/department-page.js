document.addEventListener("DOMContentLoaded", function () {
  const filter = document.getElementById("filter-type");
  const role = JSON.parse(sessionStorage.getItem("userInfo"))?.role;
  const minCreatedDate = document.getElementById("min-value");
  const maxCreatedDate = document.getElementById("max-value");
  const search = document.getElementById("search-input");
  const asc = document.getElementById("asc");
  const desc = document.getElementById("desc");
  const tableBody = document.getElementById("table-body");
  const prevButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");
  const pageInfo = document.getElementById("page-info");
  const sidebarToggle = document.querySelector(".toggle-btn");
  const addDepartment = document.getElementById("add-department");

  let isAsc = false;
  let isDesc = false;

  let message = document.getElementById("message");
  let currentPage = 1;
  let totalPages = 2;

  if (!token) {
    window.location.href = "../pages/login-page.html";
  }

  sidebarToggle.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("hide-sidebar");
    document.getElementById("main-content").classList.toggle("reposition");
    document.getElementById("funcs").classList.toggle("slide");
    document.getElementById("section").classList.toggle("show");
  });

  // Fetch department types
  function fetchDepartmentTypes(departmentViewUrl, where) {
    fetch(`${departmentViewUrl}/listType`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          if (where) {
            data.forEach((type) => {
              const option = document.createElement("option");
              option.value = type;
              option.textContent = type;
              where.appendChild(option);
            });
          } else {
            message.style.color = "red";
            message.textContent = "Department type dropdown not found";
            setTimeout(() => {
              message.style.color = "transparent";
            }, 2000);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching department types:", error);
      });
  }

  fetchDepartmentTypes(departmentViewUrl, filter);

  let selectAll = document.getElementById("select-all");

  let selectAllChecked = false;

  selectAll.addEventListener("change", () => {
    selectAllChecked = selectAll.checked;
    const checkboxes = tableBody.querySelectorAll(".department-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllChecked;
    });
  });

  // Load table, search, filter

  // Fetch department list
  async function fetchDepartments(url, page) {
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
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();
      loadingSpinner.style.display = "none";
      return data;
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  // Load department list into table
  async function loadDepartments(url, page) {
    const data = await fetchDepartments(url, page);

    if (data && data.content) {
      renderTableRows(data.content);
      totalPages = data.totalPages;
      updatePagination();
    }
  }

  // Create row for table
  function renderTableRows(departments) {
    tableBody.innerHTML = ""; // Clear previous rows
    departments.forEach((department) => {
      const isChecked = selectAllChecked;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="department-checkbox" data-id=${
          department.id
        } ${isChecked ? "checked" : ""}></td>
        <td>${department.name}</td>
        <td>${department.type}</td>
        <td>${department.id}</td>
        <td>${department.totalMember}</td>
        <td>${department.createdDate}</td>
        <td>
          <div class="actions">
              <i id="edit-dep" class="fas fa-pen"></i>
              <i id="delete-dep" class="fas fa-delete-left"></i>
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

  loadDepartments(`${departmentViewUrl}?`, currentPage);

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

  // Handle Filters, Search, and Date Range
  let formattedMinValue = "";
  let formattedMaxValue = "";

  function formatDateToDDMMYYYY(dateInput) {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      return null;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  function reloadTable() {
    let url = departmentViewUrl;
    const params = [];

    // Add search filter
    const searchValue = search.value.trim();
    if (searchValue) {
      params.push(`search=${encodeURIComponent(searchValue)}`);
    }

    // Add type filter
    const selectedType = filter.value;
    if (selectedType && selectedType !== "None") {
      params.push(`type=${encodeURIComponent(selectedType)}`);
    }

    // Add date range filters
    if (formattedMinValue) {
      params.push(`minCreatedDate=${formattedMinValue}`);
    }
    if (formattedMaxValue) {
      params.push(`maxCreatedDate=${formattedMaxValue}`);
    }

    // Add sort
    if (isAsc) {
      params.push("sort=totalMember,asc");
    }
    if (isDesc) {
      params.push("sort=totalMember,desc");
    }

    // Construct final URL
    if (params.length > 0) {
      url += `?${params.join("&")}&`;
    } else {
      url += "?";
    }

    // Load filtered/searched data starting from the first page
    loadDepartments(url, currentPage);
  }

  // Event Listeners for Filters and Search
  filter.addEventListener("change", () => {
    currentPage = 1; // Reset to the first page
    reloadTable();
  });

  minCreatedDate.addEventListener("change", () => {
    formattedMinValue = formatDateToDDMMYYYY(minCreatedDate.value);
    currentPage = 1; // Reset to the first page
    reloadTable();
  });

  maxCreatedDate.addEventListener("change", () => {
    formattedMaxValue = formatDateToDDMMYYYY(maxCreatedDate.value);
    currentPage = 1; // Reset to the first page
    reloadTable();
  });

  search.addEventListener("input", () => {
    currentPage = 1; // Reset to the first page
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

  // =====================Create department part
  const newDepName = document.getElementById("in-cre-dep-name");
  const typeNewDep = document.getElementById("type-cre-dep-form");
  const tableCreDepBody = document.getElementById("table-body-cre-dep");
  const prevListAccCreDepBtn = document.getElementById("prev-cre-dep-btn");
  const nextListAccCreDepBtn = document.getElementById("next-cre-dep-btn");
  const closeCreDepFormBtn = document.getElementById("close-cre-dep");
  const doneCreDepBtn = document.getElementById("done-cre-dep");
  const errorMessage = document.getElementById("form-cre-dep-message");

  let selectAllAccCreDep = document.getElementById("select-acc-cre-dep");
  let selectAllAccChecked = false;

  let currentCrePage = 1;
  let totalCrePages = 2;

  $(".wrapper-cre-dep-form").fadeOut("fast");
  function openCreForm() {
    // Display the form when button is clicked
    $(".forms").css("z-index", "1");
    $(".wrapper-cre-dep-form").fadeIn("fast");
  }

  // Function to close the form/modal
  function closeCreForm() {
    newDepName.value = "";
    typeNewDep.value = "None";

    selectAllAccCreDep.checked = false;
    const checkboxes = document.querySelectorAll(".account-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    errorMessage.textContent = "";
    loadingSpinner.style.display = "none";

    $(".forms").css("z-index", "-1");

    $(".wrapper-cre-dep-form").fadeOut("fast");
  }

  addDepartment.addEventListener("click", () => {
    if (role.toLowerCase() === "admin") {
      openCreForm();
    } else {
      message.textContent = "You do not have permission to create department.";
      setTimeout(() => {
        message.textContent = "";
      }, 2000);
    }
  });

  selectAllAccCreDep.addEventListener("change", () => {
    selectAllAccChecked = selectAllAccCreDep.checked;
    const checkboxes = tableCreDepBody.querySelectorAll(".account-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllAccChecked;
    });
  });

  let pageListAccCreDepInfo = document.getElementById(
    "paging-cre-dep-account-form"
  );
  let creUrl = `${accountViewUrl}/undef?`;

  fetchDepartmentTypes(departmentViewUrl, typeNewDep);

  // Fetch account list
  async function fetchAccountsCreDep(url, page) {
    loadingSpinner.style.display = "block";

    try {
      const response = await fetch(
        `${url}pageNumber=${page}&size=8`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
  async function loadAccountsCreDep(url, page) {
    const data = await fetchAccountsCreDep(url, page);

    if (data && data.content) {
      renderTableRowsAcc(data.content);
      totalCrePages = data.totalPages;
      updateListAccCreDepPagination();
    }
  }

  // Create row for table
  function renderTableRowsAcc(accounts) {
    tableCreDepBody.innerHTML = ""; // Clear previous rows
    accounts.forEach((account) => {
      const isChecked = selectAllAccChecked;
      const row = document.createElement("tr");
      row.innerHTML = `
          <td><input type="checkbox" class="account-checkbox" ${
            isChecked ? "checked" : ""
          }></td>
          <td>${account.fullName}</td>
          <td>${account.username}</td>
          <td>${account.role}</td>
          <td>${account.createdDate}</td>
        `;
      tableCreDepBody.appendChild(row);
    });
  }

  function updateListAccCreDepPagination() {
    pageListAccCreDepInfo.textContent = `${currentCrePage} / ${totalCrePages}`;
    prevListAccCreDepBtn.disabled = currentCrePage === 1;
    nextListAccCreDepBtn.disabled = currentCrePage === totalCrePages;
  }

  // Handle Pagination Buttons
  prevListAccCreDepBtn.addEventListener("click", () => {
    if (currentCrePage > 1) {
      currentCrePage--;
      loadAccountsCreDep(creUrl, currentCrePage);
    }
  });

  nextListAccCreDepBtn.addEventListener("click", () => {
    if (currentCrePage < totalCrePages) {
      currentCrePage++;
      loadAccountsCreDep(creUrl, currentCrePage);
    }
  });

  loadingSpinner.style.display = "block";
  loadAccountsCreDep(creUrl, currentCrePage);
  loadingSpinner.style.display = "none";

  newDepName.addEventListener("input", () => {
    if (newDepName.value.length > 50) {
      newDepName.focus();
      newDepName.style.borderColor = "red";
      newDepName.style.boxShadow = "none";
      errorMessage.textContent = "Name cannot over 50 characters.";
      errorMessage.style.display = "block";
    } else {
      newDepName.style.borderColor = "inherit";
      newDepName.style.boxShadow = "1px 1px 10px cyan";
      errorMessage.style.display = "none";
    }
  });

  typeNewDep.addEventListener("change", function () {
    if (typeNewDep.value !== "None") {
      typeNewDep.style.border = "inherit";
    }
  });

  function createDepartment() {
    // Get the values from input fields and selected accounts
    const departmentName = newDepName.value.trim();
    const departmentType = typeNewDep.value;
    const selectedAccounts = Array.from(
      document.querySelectorAll(".account-checkbox:checked")
    ).map((checkbox) => {
      const row = checkbox.closest("tr");
      const username = row.querySelector("td:nth-child(3)").textContent.trim();
      return { username };
    });

    // Validate inputs
    if (!departmentName) {
      newDepName.focus();
      newDepName.style.border = "1px solid red";
      newDepName.style.boxShadow = "none";
      errorMessage.textContent = "Department name cannot be null !";
      return;
    }

    if (departmentType === "None") {
      typeNewDep.style.border = "1px solid red";
      return;
    }

    if (selectedAccounts.length === 0) {
      $("#title-acc-cre-dep").css("color", "red");
      return;
    }

    const payload = {
      name: departmentName,
      type: departmentType,
      accounts: selectedAccounts,
    };

    // Show loading spinner
    loadingSpinner.style.display = "block";

    fetch(departmentUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.text())
      .then((data) => {
        try {
          if (data.error) {
            loadingSpinner.style.display = "none";
            errorMessage.textContent =
              data.error?.name ||
              data.detailMessage ||
              "An unknown error occurred.";
            Object.assign(errorMessage.style, {
              top: "5.5rem",
              left: "23rem",
              fontSize: "16px",
              color: "red",
            });
          } else {
            loadingSpinner.style.display = "none";
          }
        } catch (error) {
          loadingSpinner.style.display = "none";
          errorMessage.textContent =
            "An error occurred while processing the server response.";
          Object.assign(errorMessage.style, {
            top: "5.5rem",
            left: "23rem",
            fontSize: "16px",
            color: "red",
          });
        }

        // Reset the form or close the modal
        closeCreForm();
      })
      .catch((error) => {
        console.error("Error creating department:", error);
        alert("An error occurred while creating the department.");
        loadingSpinner.style.display = "none"; // Hide loading spinner in case of error
      });
  }

  closeCreDepFormBtn.addEventListener("click", () => {
    closeCreForm();
  });

  doneCreDepBtn.addEventListener("click", createDepartment);

  // ===================== Edit Department Part

  $(".wrapper-edt-dep-form").fadeOut("fast");

  const editDepName = document.getElementById("in-edt-dep-name");
  const editTypeDep = document.getElementById("type-edt-dep-form");
  const tableDepBody = document.querySelector(".department-table tbody");
  const tableEdtBody = document.getElementById("table-body-edt-dep");
  const prevListAccEdtDepBtn = document.getElementById("prev-edt-dep-btn");
  const nextListAccEdtDepBtn = document.getElementById("next-edt-dep-btn");
  const closeEdtDepFormBtn = document.getElementById("close-edt-dep");
  const doneEdtDepBtn = document.getElementById("done-edt-dep");
  const errorEdtMessage = document.getElementById("form-edt-dep-message");

  let selectAllEdtCheckbox = document.getElementById("select-acc-edt-dep");
  let selectAllAccEdtChecked = false;
  let currentEdtPage = 1;
  let totalEdtPages = 2;
  let depId = 0;

  selectAllEdtCheckbox.addEventListener("change", () => {
    selectAllAccEdtChecked = selectAllEdtCheckbox.checked;
    const checkboxesEdt = tableEdtBody.querySelectorAll(
      ".edt-account-checkbox"
    );
    checkboxesEdt.forEach((checkbox) => {
      checkbox.checked = selectAllAccEdtChecked;
    });
  });

  function openEdtForm() {
    // Display the form when button is clicked
    $(".forms").css("z-index", "1");

    $(".wrapper-edt-dep-form").fadeIn("fast");
  }

  // Function to close the form/modal
  function closeEdtForm() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    loadingSpinner.style.display = "none";

    selectAllEdtCheckbox.checked = false;
    selectAllAccEdtChecked = false;
    const checkboxesEdt = document.querySelectorAll(".edt-account-checkbox");
    checkboxesEdt.forEach((checkbox) => {
      checkbox.checked = false;
    });
    $(".forms").css("z-index", "-1");

    $(".wrapper-edt-dep-form").fadeOut("fast");
  }

  let pageListAccEdtDepInfo = document.getElementById(
    "paging-edt-dep-account-form"
  );

  fetchDepartmentTypes(departmentViewUrl, editTypeDep);

  if (tableDepBody) {
    tableDepBody.addEventListener("click", (e) => {
      if (role.toLowerCase() === "admin") {
        if (e.target.classList.contains("fa-pen")) {
          const row = e.target.closest("tr");
          const name = row.querySelector("td:nth-child(2)").textContent;
          const type = row.querySelector("td:nth-child(3)").textContent;
          depId = row.querySelector("td:nth-child(4)").textContent;

          editDepartment(name, type.toUpperCase());
        } else if (e.target.classList.contains("fa-delete-left")) {
          const row = e.target.closest("tr");

          const departmentId = row
            .querySelector("td:nth-child(4)")
            .textContent.trim();
          selectedItems.add(parseInt(departmentId, 10));

          const checkbox = row.querySelector(".department-checkbox");
          if (checkbox) {
            checkbox.checked = true;
          }

          updateDeleteFormTitle();
          openDelForm();
        }
      } else {
        message.textContent =
          "You do not have permission to edit or delete department.";
        setTimeout(() => {
          message.textContent = "";
        }, 2000);
      }
    });
  } else {
    console.error("Table body not found");
  }

  // Fetch account list
  async function fetchEdtAccounts(url, page) {
    loadingSpinner.style.display = "block";

    try {
      const response = await fetch(
        `${url}pageNumber=${page}&size=8`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
  async function loadEdtAccounts(url, page) {
    const data = await fetchEdtAccounts(url, page);

    if (data && data.content) {
      renderEdtTableRows(data.content);
      totalEdtPages = data.totalPages;
      updateEdtPagination();
    }
  }

  // Create row for table
  function renderEdtTableRows(accounts) {
    tableEdtBody.innerHTML = "";
    accounts.forEach((account) => {
      const isChecked = selectAllAccEdtChecked;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="edt-account-checkbox" ${
          isChecked ? "checked" : ""
        } data-id="${account.id}" data-username="${account.username}"></td>
        <td>${account.fullName}</td>
        <td>${account.username}</td>
        <td>${account.role}</td>
        <td>${account.createdDate}</td>
      `;
      tableEdtBody.appendChild(row);
    });
  }

  function updateEdtPagination() {
    pageListAccEdtDepInfo.textContent = `${currentEdtPage} / ${totalEdtPages}`;
    prevListAccEdtDepBtn.disabled = currentEdtPage === 1;
    nextListAccEdtDepBtn.disabled = currentEdtPage === totalEdtPages;
  }

  // Handle Pagination Buttons
  prevListAccEdtDepBtn.addEventListener("click", () => {
    if (currentEdtPage > 1) {
      currentEdtPage--;
      loadEdtAccounts(creUrl, currentEdtPage);
    }
  });

  nextListAccEdtDepBtn.addEventListener("click", () => {
    if (currentEdtPage < totalEdtPages) {
      currentEdtPage++;
      loadEdtAccounts(creUrl, currentEdtPage);
    }
  });

  // Function to close the form/modal
  function editDepartment(name, type) {
    openEdtForm();
    editDepName.value = name;
    editTypeDep.value = type;
    loadEdtAccounts(creUrl, currentEdtPage);
  }

  editDepName.addEventListener("input", () => {
    if (editDepName.value.length > 50) {
      editDepName.focus();
      editDepName.style.borderColor = "red";
      editDepName.style.boxShadow = "none";
      errorEdtMessage.textContent = "Name cannot over 50 characters.";
    } else {
      editDepName.style.borderColor = "inherit";
      editDepName.style.boxShadow = "1px 1px 10px cyan";
      errorEdtMessage.textContent = "";
    }
  });

  editTypeDep.addEventListener("change", function () {
    if (editTypeDep.value !== "None") {
      editTypeDep.style.border = "inherit";
      errorEdtMessage.textContent = "";
    }
  });

  function updateDepartment(requestBody) {
    // Validate inputs
    if (editDepName.value === "") {
      editDepName.focus();
      editDepName.style.border = "1px solid red";
      editDepName.style.boxShadow = "none";
      errorEdtMessage.textContent = "Department name cannot be null !";
      return;
    }

    if (editTypeDep.value === "None") {
      editTypeDep.style.border = "1px solid red";
      return;
    }

    // Make the PUT request
    fetch("http://localhost:8080/api/v1/departments/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.error) {
          loadingSpinner.style.display = "none";
          errorEdtMessage.textContent =
            data.detailMessage || "An unknown error occurred.";
          Object.assign(errorEdtMessage.style, {
            left: "5rem",
            fontSize: "16px",
            color: "red",
            display: "block",
          });
        } else {
          loadingSpinner.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error updating department:", error);
      });

    closeEdtForm();
  }

  // Function to handle checkbox change
  function handleCheckboxChange() {
    const checkboxes = tableEdtBody.querySelectorAll(".edt-account-checkbox");
    const selectedAccounts = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const accId = parseInt(checkbox.getAttribute("data-id"), 10);
        const accUsername = checkbox.getAttribute("data-username");

        selectedAccounts.push({ id: accId, username: accUsername });
      }
    });

    return selectedAccounts;
  }

  tableEdtBody.addEventListener("change", (e) => {
    if (e.target.classList.contains("edt-account-checkbox")) {
      handleCheckboxChange();
    }
  });

  doneEdtDepBtn.addEventListener("click", async () => {
    const selectedAccounts = handleCheckboxChange();
    const requestBody = {
      id: parseInt(depId, 10),
      name: editDepName.value,
      type: editTypeDep.value,
      accounts: selectedAccounts,
    };
    console.log(requestBody);
    try {
      await updateDepartment(requestBody);
      selectAllAccEdtChecked = false;
      loadDepartments(`${departmentViewUrl}?`, currentEdtPage);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  });

  closeEdtDepFormBtn.addEventListener("click", () => closeEdtForm());

  // =========================== Delete
  const deleteAll = document.getElementById("delete-all-selected");
  const cancel = document.getElementById("cancel");
  const delAllBtn = document.getElementById("del-all-dep");
  let selectedItems = new Set();

  $(".wrapper-del-dep-form").fadeOut("fast");
  function openDelForm() {
    // Display the form when button is clicked
    $(".forms").css("z-index", "1");
    $(".wrapper-del-dep-form").fadeIn("fast");
  }

  // Function to close the form/modal
  function closeDelForm() {
    $(".forms").css("z-index", "-1");
    $(".wrapper-del-dep-form").fadeOut("fast");
  }

  // Utility function to update the delete form title
  function updateDeleteFormTitle() {
    document.getElementById(
      "title-del-dep"
    ).textContent = `Delete ${selectedItems.size} department(s)?`;
  }

  // Event listener for individual checkbox changes
  tableBody.addEventListener("change", (event) => {
    if (event.target.classList.contains("department-checkbox")) {
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
        ".department-checkbox:checked"
      );

      if (checkedCheckboxes.length === 0) {
        message.textContent =
          "Please select at least one department to delete !";
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
      message.textContent = "You do not have permission to delete department.";
      setTimeout(() => {
        message.textContent = "";
      }, 2000);
    }
  });

  // Event listener for the cancel button
  cancel.addEventListener("click", () => {
    const checkboxes = tableBody.querySelectorAll(".department-checkbox");
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

    fetch("http://localhost:8080/api/v1/departments/delete", {
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
          loadDepartments(`${departmentViewUrl}?`, currentPage);
          closeDelForm();
        }
      })
      .catch((error) => console.error("Error deleting items:", error));
  }

  delAllBtn.addEventListener("click", () => deleteSelectedItems());
});
