const signinBtn = document.getElementById("signinBtn");
const usernameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const successBanner = document.getElementById("successBanner");

signinBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    alert("Please fill in your name or email and password.");
    return;
  }

  try {
    const response = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      successBanner.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 2000);
    } else {
      alert(data.message || "Authentication failed.");
    }
  } catch (error) {
    console.error("Error connecting to server:", error);
    alert("Server error. Please run npm start and try again.");
  }
});
