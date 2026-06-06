import Youtube from 'youtube-search-api';

async function searchSong(query) {
  try {
    // Mengambil daftar video dari hasil pencarian
    const result = await Youtube.GetListByKeyword(query, false);

    // Memeriksa apakah ada hasil
    if (result.items && result.items.length > 0) {
      const firstVideo = result.items[0]; // Mengambil video pertama dari hasil pencarian

      // Menyusun objek songInfo dengan data yang dibutuhkan
      const songInfo = {
        title: firstVideo.title,
        image: firstVideo.thumbnail.thumbnails[0].url, // Mengambil URL thumbnail
        url: `https://www.youtube.com/watch?v=${firstVideo.id}`, // URL video
      };
      return songInfo; // Mengembalikan objek songInfo
    }

    // Jika tidak ada hasil pencarian, kembalikan null
    return null;
  } catch (error) {
    console.error('Error searching song:', error);
    return null;
  }
}

export { searchSong };
