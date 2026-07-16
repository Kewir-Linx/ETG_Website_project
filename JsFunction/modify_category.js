const iconInput = document.getElementById("iconInput");
const nameInput = document.getElementById("nameInput");
const previewName = document.getElementById("previewName");
const previewIcon = document.getElementById("previewIcon");
const submitModifyBtn = document.getElementById("submitModifyBtn");
const formMessage = document.getElementById("formMessage");

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

function showMessage(text) {
  formMessage.textContent = text;
  formMessage.classList.remove("hidden");
}

function hideMessage() {
  formMessage.classList.add("hidden");
}

function updatePreview() {
  const name = nameInput.value.trim();
  previewName.textContent = name || "Catergory";

  const icon = iconInput.value.trim();
  if (icon) {
    previewIcon.src = icon;
    previewIcon.alt = "category icon";
    previewIcon.onerror = () => {
      previewIcon.src = "../icon/Frame 1000004748 (1).svg";
    };
  } else {
    previewIcon.src = "../icon/Frame 1000004748 (1).svg";
    previewIcon.onerror = null;
  }
}

async function loadCategory() {
  if (!categoryId) {
    showMessage("No category selected. Returning to category list.");
    setTimeout(() => {
      window.location.href = "./category.html";
    }, 1500);
    return;
  }

  try {
    const res = await fetch(`/api/categories/${categoryId}`);
    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || "Category not found.");
      setTimeout(() => {
        window.location.href = "./category.html";
      }, 1500);
      return;
    }

    nameInput.value = data.name || "";
    iconInput.value = data.icon || "";
    updatePreview();
  } catch {
    showMessage("Could not reach the server. Run npm start and try again.");
  }
}

async function saveCategory() {
  hideMessage();

  const name = nameInput.value.trim();
  const icon = iconInput.value.trim();

  if (!name) {
    showMessage("Please enter a category name.");
    nameInput.focus();
    return;
  }

  if (!categoryId) {
    showMessage("No category selected.");
    return;
  }

  submitModifyBtn.disabled = true;
  submitModifyBtn.textContent = "Saving...";

  try {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || "Failed to update category.");
      submitModifyBtn.disabled = false;
      submitModifyBtn.textContent = "Add";
      return;
    }

    window.location.href = "./category.html";
  } catch {
    showMessage("Could not reach the server. Run npm start and try again.");
    submitModifyBtn.disabled = false;
    submitModifyBtn.textContent = "Add";
  }
}

nameInput.addEventListener("input", updatePreview);
iconInput.addEventListener("input", updatePreview);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitModifyBtn.click();
});

iconInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitModifyBtn.click();
});

submitModifyBtn.addEventListener("click", saveCategory);

loadCategory();
