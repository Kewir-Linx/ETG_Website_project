const categoryContainer = document.getElementById("categoryContainer");
const addBtn = document.getElementById("addBtn");
const categoryInput = document.getElementById("categoryInput");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function createCategoryCard(category) {
  const card = document.createElement("div");
  card.className =
    "text-white bg-[#009E8E1A] p-2 border border-green-400 rounded-lg flex justify-between items-center";
  card.dataset.id = category.id;

  const nameEl = document.createElement("div");
  nameEl.className = "px-2";
  nameEl.textContent = category.name;

  const actions = document.createElement("div");
  actions.className = "flex p-4 gap-2";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className =
    "bg-[#F2A20B] cursor-pointer shadow-xl shadow-black rounded-sm p-2";
  editBtn.innerHTML =
    '<img src="../icon/edit-02.svg" alt="edit">';
  editBtn.addEventListener("click", () => {
    window.location.href = `./modify_category.html?id=${encodeURIComponent(category.id)}`;
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className =
    "bg-[#D51119] shadow-xl shadow-black rounded-sm p-2 cursor-pointer";
  deleteBtn.innerHTML =
    '<img src="../icon_2/delete-01.svg" alt="delete">';
  deleteBtn.addEventListener("click", async () => {
    if (!confirm(`Delete "${category.name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await loadCategories();
    } catch {
      alert("Could not delete category. Please try again.");
    }
  });

  actions.append(editBtn, deleteBtn);
  card.append(nameEl, actions);
  return card;
}

async function loadCategories() {
  try {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Failed to fetch");
    const categories = await res.json();
    renderCategories(categories);
  } catch {
    categoryContainer.innerHTML =
      '<p class="text-center col-span-3 text-red-300">Could not load categories. Start the server with npm start.</p>';
  }
}

function renderCategories(categories) {
  categoryContainer.innerHTML = "";

  if (categories.length === 0) {
    categoryContainer.innerHTML =
      '<p class="text-center col-span-3 text-white/70">No categories yet. Click Add to create one.</p>';
    return;
  }

  categories.forEach((category) => {
    categoryContainer.appendChild(createCategoryCard(category));
  });
}

addBtn.addEventListener("click", () => {
  const draftName = categoryInput.value.trim();
  const url = draftName
    ? `./add_category.html?name=${encodeURIComponent(draftName)}`
    : "./add_category.html";
  window.location.href = url;
});

categoryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

loadCategories();
 