const backLink = document.getElementById("backLink");
const iconInput = document.getElementById("iconInput");
const nameInput = document.getElementById("nameInput");
const previewName = document.getElementById("previewName");
const previewIcon = document.getElementById("previewIcon");
const submitAddBtn = document.getElementById("submitAddBtn");
const formMessage = document.getElementById("formMessage");

const params = new URLSearchParams(window.location.search);
const prefilledName = params.get("name");

if (prefilledName) {
  nameInput.value = prefilledName;
  previewName.textContent = prefilledName;
}

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

nameInput.addEventListener("input", updatePreview);
iconInput.addEventListener("input", updatePreview);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAddBtn.click();
});

iconInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAddBtn.click();
});

submitAddBtn.addEventListener("click", async () => {
  hideMessage();

  const name = nameInput.value.trim();
  const icon = iconInput.value.trim();

  if (!name) {
    showMessage("Please enter a category name.");
    nameInput.focus();
    return;
  }

  submitAddBtn.disabled = true;
  submitAddBtn.textContent = "Adding...";

  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || "Failed to add category.");
      submitAddBtn.disabled = false;
      submitAddBtn.textContent = "Add";
      return;
    }

    window.location.href = "./category.html";
  } catch {
    showMessage("Could not reach the server. Run npm start and try again.");
    submitAddBtn.disabled = false;
    submitAddBtn.textContent = "Add";
  }
});

updatePreview();
