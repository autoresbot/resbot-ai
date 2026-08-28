/** Mengambil satu elemen acak dari sebuah array. */
function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export { pick };
