console.log("Script berjalan");
const list = document.getElementById("list");

// ambil semua tugas
function ambilTugas() {
  fetch("/daftar-tugas")
    .then(res => res.json())
    .then(data => {
      list.innerHTML = "";

      data.forEach(tugas => {
        const li = document.createElement("li");

        // 🔑 class selesai dipasang ke li
        li.className = tugas.selesai ? "tugas selesai" : "tugas";

        li.innerHTML = `
          <span>
            ${tugas.nama} (deadline: ${tugas.deadline})
          </span>
          <div>
            <button class="btn" onclick="selesai(${tugas.id})">✔</button>
            <button class="btn" onclick="hapus(${tugas.id})">🗑</button>
          </div>
        `;

        list.appendChild(li);
      });
    });
}

// tambah tugas
function tambahTugas() {
  const nama = document.getElementById("nama").value;
  const deadline = document.getElementById("deadline").value;

  fetch("/tambah-tugas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, deadline })
  }).then(() => ambilTugas());
}

function hapus(id) {
  fetch(`/hapus-tugas/${id}`, { method: "DELETE" })
    .then(() => ambilTugas());
}

function selesai(id) {
  fetch(`/selesai/${id}`, { method: "PUT" })
    .then(() => ambilTugas());
}

// reminder
function cekReminder() {
  fetch("/cek-reminder")
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        let pesan = "⏰ Reminder Tugas H-3:\n\n";
        data.forEach(t => {
          pesan += `• ${t.nama} (deadline ${t.deadline})\n`;
        });
        alert(pesan);
      }
    });
}

// load pertama
ambilTugas();
cekReminder();
