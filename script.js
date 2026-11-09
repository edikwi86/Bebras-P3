const API_URL = "https://script.google.com/macros/s/AKfycbx2PJACZaVIFccjPXij3F6LyJuhboCcIZAWy3Np0Wm3bgfj2GOT-aU4P1fAWLfVuU-DyQ/exec";

async function loginSiswa(nisn, kodeLogin) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ nisn, kodeLogin })
  });

  return await response.json();
}