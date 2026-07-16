const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "categories.json");

app.use(express.json());
app.use(express.static(__dirname));

async function readCategories() {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeCategories(categories) {
  await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2), "utf8");
}

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await readCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { name, icon } = req.body;
    const trimmedName = (name || "").trim();

    if (!trimmedName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const categories = await readCategories();
    const newCategory = {
      id: String(Date.now()),
      name: trimmedName,
      icon: (icon || "").trim(),
    };

    categories.push(newCategory);
    await writeCategories(categories);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add category" });
  }
});

app.put("/api/categories/:id", async (req, res) => {
  try {
    const { name, icon } = req.body;
    const trimmedName = (name || "").trim();

    if (!trimmedName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const categories = await readCategories();
    const index = categories.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    categories[index] = {
      ...categories[index],
      name: trimmedName,
      icon: (icon || "").trim(),
    };

    await writeCategories(categories);
    res.json(categories[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const categories = await readCategories();
    const index = categories.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    categories.splice(index, 1);
    await writeCategories(categories);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

app.post("/api/signin", (req, res) => {
  const { username, password } = req.body;
  const trimmedUsername = (username || "").trim();
  const trimmedPassword = (password || "").trim();

  if (!trimmedUsername || !trimmedPassword) {
    return res.status(400).json({
      success: false,
      message: "Please fill in your name or email and password.",
    });
  }

  return res.status(200).json({ success: true, message: "Login successful!" });
});

const TEMPLATE_DIR = path.join(__dirname, "template");

app.get("/category", (req, res) => {
  res.sendFile(path.join(TEMPLATE_DIR, "category.html"));
});

app.get("/add-category", (req, res) => {
  res.sendFile(path.join(TEMPLATE_DIR, "add_category.html"));
});

app.get("/Signin", (req, res) => {
  res.sendFile(path.join(TEMPLATE_DIR, "Signin.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(TEMPLATE_DIR, "index.html"));
});

app.get("/api/categories/:id", async (req, res) => {
  try {
    const categories = await readCategories();
    const category = categories.find((c) => c.id === req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load category" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Category page: http://localhost:${PORT}/template/category.html`);
  console.log(`Signin: http://localhost:${PORT}/template/Signin.html`);
  console.log(`Index: http://localhost:${PORT}/template/index.html`);
  console.log(`Modify category: http://localhost:${PORT}/template/modify_category.html`);
  console.log(`Add category: http://localhost:${PORT}/template/add_category.html`);
  console.log(`Setting: http://localhost:${PORT}/template/setting.html`);
});

