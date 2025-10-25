// File: main.js (Sudah disinkronkan dengan perbaikan sebelumnya)
let aktif = false;
const audio = document.getElementById('audio')
function disableScroll() {
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    window.onscroll = function () {
      window.scrollTo(scrollTop, scrollLeft);
    }

    document.body.style.overflow = 'hidden';
  }

function buka() {
  window.onscroll = function () {};
  document.body.style.overflow = 'auto';
  
  // Scroll hanya jika tidak dari autoload
  if (!aktif) {
    // Memastikan Section #true ditampilkan sebelum scroll
    const trueSection = document.getElementById('true');
    if (trueSection) {
        trueSection.classList.remove('hidden');
        trueSection.scrollIntoView({behavior: 'smooth'});
    }
  }
  audio.loop = true;
  audio.play();
  aktif = true;

  const button = document.getElementById('button1');
  if (button) {
    button.style.display = 'none';
  }
}
document.body.style.overflowY = 'hidden'; // prevent scroll awal

disableScroll()
// untuk mendapatkan url //
const urlParams = new URLSearchParams(window.location.search);
const nama = urlParams.get('n') || '';
const pronoun = urlParams.get('p') || '';
const namaContainer = document.querySelector('.nama');
namaContainer.innerText = `${pronoun} ${nama},`.replace(/ ,$/, '');


// Mendeteksi apakah pengguna mengakses dari desktop
function isDesktop() {
  return window.innerWidth > 1024; // Ubah nilai 1024 sesuai dengan lebar layar desktop yang ingin Anda tentukan
}

// Mengarahkan pengguna ke halaman lain jika mengakses dari desktop
function redirectIfDesktop() {
  // Hanya lakukan redirect jika tidak ada parameter 'n' (nama undangan)
  // Anda mungkin ingin menonaktifkan fitur ini agar undangan tetap bisa dibuka di desktop.
  // if (isDesktop() && !nama) {
  //     window.location.href = "halaman-lain.html"; // Ganti "halaman-lain.html" dengan URL halaman yang ingin Anda arahkan
  // }
}

// Panggil fungsi untuk memeriksa apakah perlu diarahkan jika mengakses dari desktop
// redirectIfDesktop();


// slide show

const slides = [
  'img/foto5.JPG',
  'img/foto6.JPG',
  'img/foto7.JPG'
];

let index = 0;
const slide1 = document.getElementById('slide1');
const slide2 = document.getElementById('slide2');

slide1.classList.add('active');
slide1.src = slides[0];
slide2.src = slides[1];

setInterval(() => {
  index = (index + 1) % slides.length;
  const next = slides[index];
  
  if (slide1.classList.contains('active')) {
    slide2.src = next;
    slide2.classList.add('active');
    slide1.classList.remove('active');
  } else {
    slide1.src = next;
    slide1.classList.add('active');
    slide2.classList.remove('active');
  }
}, 3000);

// Slideshow untuk #true
const trueSlides = [
  'img/foto4.JPG',
  'img/foto5.JPG',
  'img/foto6.JPG'
];

let currentTrue = 0;
const true1 = document.getElementById('slide1-true');
const true2 = document.getElementById('slide2-true');

// Set gambar awal
true1.src = trueSlides[0];
true2.src = trueSlides[1];
true1.classList.add('active');

setInterval(() => {
  currentTrue = (currentTrue + 1) % trueSlides.length;
  const nextTrue = trueSlides[currentTrue];

  if (true1.classList.contains('active')) {
    true2.src = nextTrue;
    true2.classList.add('active');
    true1.classList.remove('active');
  } else {
    true1.src = nextTrue;
    true1.classList.add('active');
    true2.classList.remove('active');
  }
}, 5000);

// ⛔ Ganti dengan konfigurasi Firebase milikmu
const firebaseConfig = {
  apiKey: "AIzaSyC8wFaKkmaIjl5dlAGzNmuWGgL29_2rpSc",
  authDomain: "kadman-4bf7f.firebaseapp.com",
  databaseURL: "https://kadman-4bf7f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kadman-4bf7f",
  storageBucket: "kadman-4bf7f.appspot.com",
  messagingSenderId: "626009341692",
  appId: "1:626009341692:web:c9b5f4a2f7f315d0c72179"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const form = document.getElementById('formKomen');
const daftarKomen = document.getElementById('daftarKomen');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = document.getElementById('namaKomen').value.trim();
  const isi = document.getElementById('isiKomen').value.trim();
  const hadir = document.getElementById('konfirmasiHadir').value;
  
  if (!nama || !isi) {
    alert('Nama dan komentar tidak boleh kosong!');
    return;
  }

  const komenBaru = {
    nama,
    isi,
    hadir,
    waktu: new Date().toISOString()
  };

  db.ref('komentar').push(komenBaru)
    .then(() => form.reset())
    .catch(error => console.error("Error adding comment: ", error));
});

// Load existing comments
db.ref('komentar').on('child_added', (snap) => {
  const komen = snap.val();
  const id = snap.key;
  tampilkanKomen(komen, id);
});


// MENGHAPUS INLINE STYLE di tampilkanKomen
function tampilkanKomen(komen, id) {
  const div = document.createElement('div');
  // Gunakan kelas kustom yang sudah didefinisikan di <style> HTML (mengganti inline style)
  div.classList.add('komen-item'); 
  div.id = `komen-${id}`;

  div.innerHTML = `
    <h4>${komen.nama} 
      <span class="text-sm text-gray-500 font-normal">
        (${komen.hadir})
      </span>
    </h4>
    <p class="mb-2">${komen.isi}</p>
    <small class="text-xs text-gray-400">${new Date(komen.waktu).toLocaleString()}</small><br>
    <button onclick="tampilFormBalas('${id}')" class="text-xs mt-1 text-indigo-600 hover:text-indigo-800 transition duration-200">Balas</button>
    <div id="balasan-${id}" class="ml-5 mt-2"></div>
  `;

  daftarKomen.prepend(div);

  // Load existing replies
  const refBalasan = db.ref(`komentar/${id}/balasan`);
  refBalasan.on('child_added', (snap) => {
    const balasan = snap.val();
    tambahBalasanKeDOM(id, balasan);
  });
}

// MENGHAPUS INLINE STYLE di tambahBalasanKeDOM
function tambahBalasanKeDOM(idKomen, balasan) {
  const target = document.getElementById(`balasan-${idKomen}`);
  if (!target) return;

  const b = document.createElement('div');
  // Mengganti inline style dengan kelas Tailwind
  b.classList.add('mt-2', 'pt-2', 'border-l-2', 'border-gray-300', 'pl-3');

  b.innerHTML = `
    <strong class="text-blue-500">${balasan.nama}</strong> 
    <span class="font-normal text-gray-500 text-sm">
      (${balasan.hadir})
    </span>: ${balasan.isi}<br>
    <small class="text-xs text-gray-400">${new Date(balasan.waktu).toLocaleString()}</small>
  `;
  target.appendChild(b, true);
  target.scrollIntoView({ behavior: 'smooth' });
}


function tampilFormBalas(idKomen) {
  // Check if form already exists
  const existingForm = document.querySelector(`#balasan-${idKomen} form`);
  if (existingForm) {
    existingForm.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const tempat = document.getElementById(`balasan-${idKomen}`);
  // MENGHAPUS INLINE STYLE pada form dan elemen di dalamnya
  const formHTML = `
    <form onsubmit="kirimBalasan(event, '${idKomen}')" class="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <input type="text" id="namaBalas-${idKomen}" placeholder="Nama" required class="w-2/5 p-1 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500" />
      <input type="text" id="isiBalas-${idKomen}" placeholder="Tulis balasan..." required class="w-1/2 p-1 border border-gray-300 rounded-lg text-sm ml-2 focus:ring-indigo-500" />
      
      <div class="my-2 text-gray-700 text-sm">
        <span class="text-sm mr-2 font-semibold">Konfirmasi Kehadiran:</span>
        <label class="mr-3">
          <input type="radio" name="hadirBalas-${idKomen}" value="Hadir" checked> Hadir
        </label>
        <label>
          <input type="radio" name="hadirBalas-${idKomen}" value="Tidak Hadir"> Tidak Hadir
        </label>
      </div>
      
      <button type="submit" class="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition duration-200">Kirim</button>
      <button type="button" onclick="this.parentNode.remove()" class="ml-2 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition duration-200">Batal</button>
    </form>
  `;
  
  // Add form to the top of replies section
  tempat.insertAdjacentHTML('afterbegin', formHTML);
  document.getElementById(`namaBalas-${idKomen}`).focus();
}

function kirimBalasan(e, idKomen) {
  e.preventDefault();
  const nama = document.getElementById(`namaBalas-${idKomen}`).value.trim();
  const isi = document.getElementById(`isiBalas-${idKomen}`).value.trim();
  const hadir = document.querySelector(`input[name="hadirBalas-${idKomen}"]:checked`).value;
  
  if (!nama || !isi) {
    alert('Nama dan balasan tidak boleh kosong!');
    return;
  }

  const balasan = {
    nama,
    isi,
    hadir, // Add attendance status to reply
    waktu: new Date().toISOString()
  };

  db.ref(`komentar/${idKomen}/balasan`).push(balasan)
    .then(() => {
      // Remove the form after successful submission
      const form = e.target;
      form.remove();
    })
    .catch(error => console.error("Error adding reply: ", error));
}


//animasi weding

// Tunggu sampai seluruh dokumen dimuat
document.addEventListener('DOMContentLoaded', function () {
  const weding = document.querySelector('.weding');

  function cekScroll() {
    if (!weding) return;
    const rect = weding.getBoundingClientRect();

    // Jika elemen masuk ke viewport (layar)
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      weding.classList.add('active');
    } else {
      // Kalau mau animasi ulang saat scroll bolak-balik, aktifkan baris di bawah
      // weding.classList.remove('active');
    }
  }

  // Jalankan saat pertama kali load
  cekScroll();

  // Jalankan setiap kali scroll
  window.addEventListener('scroll', cekScroll);
});


//foto t rue love

document.addEventListener('DOMContentLoaded', function () {
  const loveEl = document.querySelector('.lovetext1');

  function cekScrollLove() {
    if (!loveEl) return;
    const rect = loveEl.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      loveEl.classList.add('active');
    }
  }

  // Cek saat awal load
  cekScrollLove();

  // Cek setiap scroll
  window.addEventListener('scroll', cekScrollLove);
});


//album

  const images = document.querySelectorAll('.gallery-container img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.close');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  let currentIndex = 0;

  const showImage = (index) => {
    lightboxImg.src = images[index].src;
    lightbox.style.display = 'flex';
    currentIndex = index;
  };

  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      showImage(index);
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });

  // Optional: close popup on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.style.display = 'none';
    }
  });

  // PERBAIKAN DAN EKSTENSI ANIMASI FADE-UP KUSTOM UNTUK SEMUA ELEMEN DENGAN KELAS .slide-up
  document.addEventListener('DOMContentLoaded', function() {
    // Memilih SEMUA elemen yang memiliki kelas 'slide-up' di seluruh dokumen
    // Ini memastikan quotes di #kata-kata, teks di #love, dan elemen lain yang Anda tambahkan di HTML akan teranimasi
    const elementsToAnimate = document.querySelectorAll('.slide-up');
  
    function checkSlide() {
      elementsToAnimate.forEach(el => {
        // Mendapatkan posisi elemen relatif ke viewport
        const slideInAt = (window.scrollY + window.innerHeight) - el.offsetHeight / 3;
        // Mendapatkan batas bawah elemen
        const elementBottom = el.offsetTop + el.offsetHeight;
        
        // Memeriksa apakah elemen sudah 1/3 terlihat
        const isHalfShown = slideInAt > el.offsetTop;
        // Memeriksa apakah elemen belum terlewat
        const isNotScrolledPast = window.scrollY < elementBottom;
        
        if (isHalfShown && isNotScrolledPast) {
          el.classList.add('active');
        } else {
          // Opsi: Hilangkan komentar baris ini jika Anda ingin animasi terulang saat scroll ke atas
          // el.classList.remove('active');
        }
      });
    }
  
    // Cek awal
    checkSlide();
    
    // Dengarkan event scroll
    window.addEventListener('scroll', checkSlide);
  });
// Menghapus scroll lock jika ada