const API_URL = "https://script.google.com/macros/s/AKfycbx2PJACZaVIFccjPXij3F6LyJuhboCcIZAWy3Np0Wm3bgfj2GOT-aU4P1fAWLfVuU-DyQ/exec";

async function loginSiswa(nisn, kodeLogin) {
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

    const hasil = await response.json();

    return hasil;

  } catch (error) {
    console.error("Kesalahan koneksi:", error);

    return {
      success: false,
      message: "Tidak dapat terhubung ke server. Periksa koneksi API."
    };
  }
}
