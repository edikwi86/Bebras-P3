const SHEET_NAME = "DataSiswa";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Portal Akun Bebras | SMPK 3 PENABUR")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function loginSiswa(nisn, kodeLogin) {
  try {
    nisn = String(nisn || "").trim();
    kodeLogin = String(kodeLogin || "").trim();

    if (!/^\d{10}$/.test(nisn) || !kodeLogin) {
      return {
        success: false,
        message: "NISN atau kode login tidak valid."
      };
    }

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) throw new Error("Sheet tidak ditemukan.");

    const data = sheet.getDataRange().getDisplayValues();

    if (data.length < 2) {
      return {
        success: false,
        message: "Data siswa belum tersedia."
      };
    }

    const headers = data[0].map(h =>
      h.trim().toLowerCase()
    );

    const getCol = name => headers.indexOf(name.toLowerCase());

    const c = {
      nisn: getCol("NISN"),
      nama: getCol("Nama Siswa"),
      kelas: getCol("Kelas"),
      user: getCol("User Bebras"),
      password: getCol("Password Bebras"),
      kode: getCol("Kode Login"),
      status: getCol("Status Akun")
    };

    if (Object.values(c).some(i => i === -1)) {
      throw new Error("Periksa kembali nama header Google Sheets.");
    }

    const siswa = data.slice(1).find(row =>
      row[c.nisn].trim() === nisn
    );

    if (!siswa ||
        siswa[c.kode].trim() !== kodeLogin) {
      return {
        success: false,
        message: "NISN atau kode login salah."
      };
    }

    if (siswa[c.status].trim().toLowerCase() !== "aktif") {
      return {
        success: false,
        message: "Akun Anda belum aktif. Hubungi administrator sekolah."
      };
    }

    return {
      success: true,
      siswa: {
        nisn: siswa[c.nisn],
        nama: siswa[c.nama],
        kelas: siswa[c.kelas],
        userBebras: siswa[c.user],
        passwordBebras: siswa[c.password]
      }
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Terjadi kesalahan sistem. Silakan coba kembali."
    };
  }
}