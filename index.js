const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  return Array.isArray(data) ? data : [];
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let daftarTugas = loadData();

console.log("INIT:", daftarTugas, Array.isArray(daftarTugas));

app.post("/tambah-tugas", (req, res) => {
  console.log("SEBELUM PUSH:", daftarTugas, Array.isArray(daftarTugas));

  daftarTugas.push({
    id: Date.now(),
    nama: req.body.nama,
    deadline: req.body.deadline,
    selesai: false
  });

  saveData(daftarTugas);

  console.log("SETELAH PUSH:", daftarTugas);
  res.json({ success: true });
});

app.get("/daftar-tugas", (req, res) => {
  res.json(daftarTugas);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server jalan di semua interface pada port", PORT);
});

app.get("/cek-reminder", (req, res) => {
  const hariIni = new Date();
  const reminder = [];

  daftarTugas.forEach(tugas => {
    const deadline = new Date(tugas.deadline + "T00:00:00");
    const selisihHari = Math.ceil(
      (deadline - hariIni) / (1000 * 60 * 60 * 24)
    );

    if (selisihHari === 3 && !tugas.reminded) {
      tugas.reminded = true;
      reminder.push(tugas);
    }
  });

  saveData(daftarTugas);
  res.json(reminder);
});

app.delete("/hapus-tugas/:id", (req, res) => {
  console.log("REQ HAPUS:", req.params.id);
  daftarTugas = daftarTugas.filter(t => t.id !== Number(req.params.id));
  saveData(daftarTugas);
  res.json({ success: true });
});

app.put("/selesai/:id", (req, res) => {
  console.log("REQ SELESAI:", req.params.id);
  const tugas = daftarTugas.find(t => t.id === Number(req.params.id));
  if (tugas) tugas.selesai = !tugas.selesai;
  saveData(daftarTugas);
  res.json({ success: true });
});

