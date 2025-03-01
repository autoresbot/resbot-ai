const config = require('../config');
const axios = require('axios');

// Inisialisasi objek untuk menyimpan history per pengguna
global.conversationHistories = {};

async function GEMINI_TEXT(id_user, prompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${config.GEMINI_API_KEY}`;

    try {
        // Cek apakah ada history untuk user ini, jika tidak buat array baru
        if (!conversationHistories[id_user]) {
            conversationHistories[id_user] = [];
        }

        // Gabungkan history percakapan dengan prompt baru
        const fullPrompt = conversationHistories[id_user].join('\n') + '\nUser: ' + prompt + '\nAI:';

        // Buat requestBody sesuai format yang baru
        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: fullPrompt }]
                }
            ]
        };

        // Generate respons dari model
        const response = await axios.post(API_URL, requestBody);
        const responseText = response.data.candidates[0].content.parts[0].text;

        // Tambahkan prompt dan respons ke history user tersebut
        conversationHistories[id_user].push('User: ' + prompt);
        conversationHistories[id_user].push('AI: ' + responseText);

        // Batasi panjang history untuk mencegah terlalu panjang
        if (conversationHistories[id_user].length > 10) {
            conversationHistories[id_user] = conversationHistories[id_user].slice(-10);  // Simpan hanya 10 percakapan terakhir
        }

        return responseText;
    } catch (error) {
        console.error('Error generating AI content:', error.message || error);

        const panduan = 'https://youtu.be/02oGg3-3a-s?si=ElXoKafRCG9B-7XD';

        const pesan_ERROR = `Jika melihat error ini, berarti apikey gemini terkena limit karena pengguna yang terlalu banyak. Silakan gunakan apikey gemini pribadi.\n\n${panduan}`

        if (error.message && error.message.includes('Too Many Requests')) {
            return pesan_ERROR;
        }

        if (error.message && error.message.includes('status code 429')) {
            return pesan_ERROR;
        }

        // Kembalikan pesan error umum jika error.message tidak ada atau berbeda
        return error.message || 'Terjadi kesalahan pada sistem. Silakan coba lagi nanti.';
    }
}

module.exports = { GEMINI_TEXT };
