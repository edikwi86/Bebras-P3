const API_URL = "https://script.google.com/macros/s/AKfycbyHIoxLqpoKmUHkXCvrmiBJxZ8Eaje2a6NabPLYgc98IC-1BaVn9V0Mt7QPn9WclG5c8A/exec";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const nisn = document.getElementById("nisn").value.trim();
  const kodeLogin = document.getElementById("kodeLogin").value.trim();

  if (!/^\d{10}$/.test(nisn)) {
    showMessage("NISN harus terdiri dari 10 digit.", "error");
    return;
  }

  loginButton.disabled = true;
  loginButton.innerHTML = "Memeriksa akun...";
  message.className = "message";
  message.textContent = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        nisn: nisn,
        kodeLogin: kodeLogin
      })
    });

    if (!response.ok) {
      throw new Error("Server memberikan respons " + response.status);
    }

    const result = await response.json();

    if (!result.success) {
      showMessage(result.message || "Login gagal.", "error");
      return;
    }

    tampilkanDashboard(result.siswa);

  } catch (error) {
    console.error("API Error:", error);

    showMessage(
      "Tidak dapat terhubung ke server. Periksa URL Apps Script dan konfigurasi akses API.",
      "error"
    );

  } finally {
    loginButton.disabled = false;
    loginButton.innerHTML =
      '<i class="bi bi-box-arrow-in-right"></i> MASUK KE PORTAL';
  }
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}

function tampilkanDashboard(siswa) {
  document.getElementById("outNisn").textContent = siswa.nisn;
  document.getElementById("outNama").textContent = siswa.nama;
  document.getElementById("outKelas").textContent = siswa.kelas;
  document.getElementById("outUser").textContent = siswa.userBebras;
  document.getElementById("outPassword").textContent = siswa.passwordBebras;

  document.getElementById("loginPanel").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

function logout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("loginPanel").style.display = "block";

  loginForm.reset();
  message.textContent = "";
  message.className = "message";
}

async function copyText(elementId) {
  const value = document.getElementById(elementId).textContent;

  try {
    await navigator.clipboard.writeText(value);
    alert("Informasi berhasil disalin.");
  } catch (error) {
    alert("Tidak dapat menyalin informasi.");
  }
}
