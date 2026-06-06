// Objek untuk menyimpan fitur yang aktif per user
const activeFeatures = {};

// Function untuk mengatur fitur aktif
function setActiveFitur(userId, fitur) {
  //console.log('setActiveFitur called with userId:', userId, 'fitur:', fitur);
  if (!userId || !fitur) {
    return;
  }

  if (!activeFeatures[userId]) {
    activeFeatures[userId] = [];
  }

  if (!activeFeatures[userId].includes(fitur)) {
    activeFeatures[userId].push(fitur);
  }
}

// Function untuk mendapatkan fitur aktif
function getActiveFitur(userId, fitur) {
  //console.log('getActiveFitur called with userId:', userId, 'fitur:', fitur);
  if (!userId || !fitur) {
    return;
  }

  // Ambil fitur aktif berdasarkan userId
  const activeFitur = activeFeatures[userId];

  if (activeFitur && activeFitur.includes(fitur)) {
    return fitur;
  } else {
    return null;
  }
}

// Function untuk mereset (menghapus) fitur aktif
function resetActiveFitur(userId, fitur) {
  //console.log('resetActiveFitur called with userId:', userId, 'fitur:', fitur);
  if (!userId || !fitur) {
    return;
  }

  // Cek jika fitur aktif dan hapus fitur yang sesuai
  const activeFitur = activeFeatures[userId];

  if (activeFitur && activeFitur.includes(fitur)) {
    activeFeatures[userId] = activeFitur.filter((f) => f !== fitur);
  }
}

export { setActiveFitur, getActiveFitur, resetActiveFitur };
