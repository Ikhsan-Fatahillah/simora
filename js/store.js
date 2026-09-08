/**
 * SIMORA - State Management (localStorage)
 */

export const DEFAULT_STATE = {
    auth: {
        isLoggedIn: false,
        hasCompletedOnboarding: false
    },
    user: {
        level: 1,
        xp: 0,
        xpNeeded: 100,
        streak: 3
    },
    tests: {
        beginner: {
            id: "beginner",
            title: "Beginner",
            desc: "Menguji kompetensi TP-01: Pendefinisian variabel, deklarasi konstanta, serta pemahaman tipe data primitif.",
            difficulty: "Mudah",
            rewardXp: 50,
            status: "unlocked", // unlocked, locked, completed
            score: null,
            date: null,
            questions: [
                {
                    q: "Manakah sintaks pendeklarasian variabel di JavaScript yang bernilai konstan?",
                    options: ["const pi = 3.14;", "let pi = 3.14;", "var pi = 3.14;", "pi := 3.14;"],
                    answer: 0,
                    explain: "'const' digunakan untuk mendeklarasikan variabel bernilai tetap (konstan) yang nilainya tidak dapat diubah setelah inisialisasi."
                },
                {
                    q: "Manakah nilai yang bertipe data Boolean?",
                    options: ["'true'", "true", "1", "null"],
                    answer: 1,
                    explain: "Tipe data Boolean hanya memiliki dua nilai literal: true atau false (tanpa tanda kutip)."
                },
                {
                    q: "Tipe data apakah yang dihasilkan dari kode berikut: let nama = 'SIMORA';?",
                    options: ["Number", "Boolean", "String", "Object"],
                    answer: 2,
                    explain: "Karakter yang diapit tanda kutip tunggal atau ganda didefinisikan sebagai tipe data String."
                }
            ]
        },
        practice: {
            id: "practice",
            title: "Practice",
            desc: "Latihan membuat notula dari simulasi rapat secara bertahap.",
            difficulty: "Sedang",
            rewardXp: 0,
            status: "locked",
            score: null,
            date: null,
            questions: []
        },
        "practice-l1": {
            id: "practice-l1",
            title: "Latihan 1",
            desc: "Latihan pertama: memahami definisi, fungsi, dan unsur-unsur notula rapat.",
            difficulty: "Mudah",
            rewardXp: 25,
            passThreshold: 75,
            status: "unlocked",
            score: null,
            date: null,
            questions: [
                {
                    q: "Apa yang dimaksud dengan notula rapat?",
                    options: ["Daftar hadir peserta rapat", "Catatan singkat mengenai jalannya rapat beserta keputusan yang diambil", "Undangan resmi untuk mengadakan rapat", "Susunan acara rapat"],
                    answer: 1,
                    explain: "Notula adalah catatan singkat mengenai jalannya rapat, termasuk hal-hal yang dibicarakan dan diputuskan."
                },
                {
                    q: "Manakah fungsi utama notula rapat?",
                    options: ["Sebagai hiasan administrasi kantor", "Sebagai bukti bahwa rapat telah dilaksanakan", "Sebagai pengganti undangan rapat", "Sebagai daftar gaji karyawan"],
                    answer: 1,
                    explain: "Notula berfungsi sebagai bukti bahwa rapat telah diadakan sekaligus pegangan bersama dalam pelaksanaan keputusan."
                },
                {
                    q: "Berikut ini yang BUKAN merupakan fungsi notula rapat adalah...",
                    options: ["Dokumen resmi pembahasan dan keputusan rapat", "Alat evaluasi pencapaian tujuan rapat", "Bahan pertimbangan untuk rapat selanjutnya", "Pembatas ruang rapat"],
                    answer: 3,
                    explain: "Notula berfungsi sebagai dokumen resmi, bukti rapat, pegangan bersama, bahan pertimbangan, dan alat evaluasi — bukan pembatas ruang rapat."
                }
            ]
        },
        "practice-l2": {
            id: "practice-l2",
            title: "Latihan 2",
            desc: "Latihan kedua: mengidentifikasi unsur-unsur/format notula rapat yang baik.",
            difficulty: "Sedang",
            rewardXp: 30,
            passThreshold: 75,
            status: "locked",
            score: null,
            date: null,
            questions: [
                {
                    q: "Bagian mana yang wajib ada dalam format notula rapat?",
                    options: ["Hari/tanggal, waktu, tempat, dan peserta rapat", "Jumlah peserta undangan yang tidak hadir", "Warna pakaian ketua rapat", "Riwayat pendidikan notulis"],
                    answer: 0,
                    explain: "Format notula memuat identitas rapat seperti hari/tanggal, waktu, tempat, peserta, agenda, serta hasil dan keputusan rapat."
                },
                {
                    q: "Apa yang dimaksud dengan kuorum dalam rapat?",
                    options: ["Jumlah minimal peserta agar rapat sah", "Pengambilan keputusan lewat suara terbanyak", "Penundaan sementara jalannya rapat", "Catatan singkat jalannya rapat"],
                    answer: 0,
                    explain: "Kuorum adalah jumlah minimal peserta yang harus hadir agar rapat dianggap sah."
                },
                {
                    q: "Istilah yang tepat untuk pengambilan keputusan lewat suara terbanyak adalah...",
                    options: ["Kuorum", "Voting", "Skorsing", "Notulensi"],
                    answer: 1,
                    explain: "Voting adalah pengambilan keputusan melalui suara terbanyak."
                }
            ]
        },
        "practice-l3": {
            id: "practice-l3",
            title: "Latihan 3",
            desc: "Latihan ketiga: menyusun notula rapat berdasarkan jalannya rapat.",
            difficulty: "Sedang",
            rewardXp: 30,
            passThreshold: 75,
            status: "locked",
            score: null,
            date: null,
            questions: [
                {
                    q: "Dalam mencatat jalannya rapat, hal yang paling penting dicatat adalah...",
                    options: ["Seluruh ucapan pembicara kata demi kata", "Inti pembicaraan, keputusan, dan hal-hal penting", "Candaan peserta rapat", "Jam kedatangan setiap peserta"],
                    answer: 1,
                    explain: "Notulis cukup mencatat inti pembicaraan, fokus pada hal penting dan keputusan — bukan kata demi kata."
                },
                {
                    q: "Sikap yang harus dimiliki seorang notulis saat rapat adalah...",
                    options: ["Memihak pendapat teman", "Objektif dan netral", "Berbicara paling banyak", "Meninggalkan rapat lebih awal"],
                    answer: 1,
                    explain: "Notulis harus tetap objektif dan netral, tidak memihak salah satu pendapat."
                },
                {
                    q: "Setelah rapat selesai, langkah notulis selanjutnya adalah...",
                    options: ["Langsung pulang tanpa mencatat apa pun", "Merapikan catatan menjadi notula yang jelas dan mudah dipahami", "Mengirim undangan rapat baru", "Menghapus seluruh catatan rapat"],
                    answer: 1,
                    explain: "Setelah rapat, notulis merapikan catatan menjadi notula yang jelas, dengan keputusan dan kesimpulan yang tegas."
                }
            ]
        },
        expert: {
            id: "expert",
            title: "Expert",
            desc: "Kuis Point Rush: uji kemampuan membuat notula rapat lewat 10 soal pilihan ganda dengan simulasi ujian akhir dan durasi rapat yang lebih panjang.",
            difficulty: "Sulit",
            rewardXp: 120,
            passThreshold: 70,
            status: "locked",
            score: null,
            date: null,
            questions: [
                {
                    q: "Apa pengertian notula rapat yang paling tepat?",
                    options: [
                        "Undangan resmi untuk menghadiri rapat",
                        "Catatan singkat mengenai jalannya rapat serta hal yang dibicarakan dan diputuskan",
                        "Daftar hadir peserta rapat",
                        "Laporan keuangan hasil rapat"
                    ],
                    answer: 1
                },
                {
                    q: "Notula berfungsi sebagai bukti bahwa rapat telah dilaksanakan. Apa manfaat lain dari fungsi ini?",
                    options: [
                        "Menjadi tolok ukur/manometer kesuksesan rapat",
                        "Mengganti kehadiran peserta yang tidak hadir",
                        "Menentukan siapa yang menjadi ketua rapat",
                        "Menjadi undangan rapat berikutnya"
                    ],
                    answer: 0
                },
                {
                    q: "Berikut ini yang BUKAN termasuk fungsi notula rapat adalah…",
                    options: [
                        "Dokumen resmi pembahasan dan keputusan rapat",
                        "Alat evaluasi pencapaian tujuan rapat",
                        "Menentukan gaji karyawan yang hadir",
                        "Pegangan bersama pelaksanaan keputusan rapat"
                    ],
                    answer: 2
                },
                {
                    q: "Notula sangat diperlukan supaya semua keputusan rapat dapat dijadikan pegangan bersama untuk…",
                    options: [
                        "Pelaksanaan tindak lanjut rapat",
                        "Menentukan siapa yang salah dalam rapat",
                        "Menilai kinerja notulis",
                        "Mengganti agenda rapat berikutnya"
                    ],
                    answer: 0
                },
                {
                    q: "Hal yang perlu dilakukan notulis SEBELUM rapat berlangsung adalah…",
                    options: [
                        "Membacakan hasil rapat",
                        "Memperoleh informasi latar belakang materi yang akan dibahas",
                        "Menandatangani notula",
                        "Membagikan dokumen ke peserta"
                    ],
                    answer: 1
                },
                {
                    q: "Istilah \"skorsing\" dalam rapat berarti…",
                    options: [
                        "Jumlah minimal peserta agar rapat sah",
                        "Penundaan sementara jalannya rapat",
                        "Cara pengambilan keputusan lewat suara terbanyak",
                        "Instruksi pimpinan atas suatu dokumen"
                    ],
                    answer: 1
                },
                {
                    q: "Kenapa notulis perlu memahami istilah/bahasa teknis yang dibahas dalam rapat?",
                    options: [
                        "Supaya bisa jadi pemimpin rapat berikutnya",
                        "Agar tidak salah mencatat maksud pembicaraan dan keputusan rapat",
                        "Agar terlihat lebih profesional di depan peserta",
                        "Supaya rapat selesai lebih cepat"
                    ],
                    answer: 1
                },
                {
                    q: "Apa nama bagi orang yang menjadi pembuat notula rapat?",
                    options: ["Notuler", "Notulis", "Notulen", "Sekretaris"],
                    answer: 1
                },
                {
                    q: "Apa yang sebaiknya dilakukan notulis setelah rapat selesai?",
                    options: [
                        "Membiarkan catatan apa adanya tanpa dirapikan",
                        "Merapikan catatan menjadi notula yang jelas dan memastikan keputusan tertulis tegas",
                        "Menghapus catatan karena sudah tidak diperlukan",
                        "Menunggu notulis lain untuk menyelesaikannya"
                    ],
                    answer: 1
                },
                {
                    q: "Notula ditandatangani oleh pihak-pihak berikut, KECUALI…",
                    options: [
                        "Ketua rapat",
                        "Notulis",
                        "Sekretaris",
                        "Seluruh peserta rapat tanpa terkecuali"
                    ],
                    answer: 3
                }
            ]
        }
    }
};

const DEFAULT_STORAGE_KEY = "simora_atp_state";

// Kunci penyimpanan per akun: progres satu siswa tidak bocor ke siswa lain.
export function stateKeyFor(username) {
    return username ? `simora_state_${username}` : DEFAULT_STORAGE_KEY;
}

export function loadState(key = DEFAULT_STORAGE_KEY) {
    const stored = localStorage.getItem(key);
    const state = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_STATE));

    // Backward compatibility safety check
    if (!state.auth) {
        state.auth = JSON.parse(JSON.stringify(DEFAULT_STATE.auth));
    }

    // Pastikan struktur tests selalu lengkap (backward compatibility)
    if (!state.tests) {
        state.tests = {};
    }
    for (const key of Object.keys(DEFAULT_STATE.tests)) {
        if (!state.tests[key]) {
            state.tests[key] = JSON.parse(JSON.stringify(DEFAULT_STATE.tests[key]));
        }
    }

    // Latihan 1 selalu berstatus Tersedia (tidak perlu menunggu Beginner)
    if (state.tests["practice-l1"] && state.tests["practice-l1"].status === "locked") {
        state.tests["practice-l1"].status = "unlocked";
    }

    // Expert langsung dapat diakses (mode pengembangan/testing)
    if (state.tests.expert && state.tests.expert.status === "locked") {
        state.tests.expert.status = "unlocked";
    }

    // Backward compat: soal Expert versi lama (3 soal pemrograman) → 10 soal notula baru
    const expertDefault = DEFAULT_STATE.tests.expert;
    if (state.tests.expert && state.tests.expert.questions &&
        state.tests.expert.questions.length !== expertDefault.questions.length) {
        state.tests.expert.questions = JSON.parse(JSON.stringify(expertDefault.questions));
    }

    // Auto-repair state hasil testing yang tidak konsisten:
    // 1) Beginner adalah prasyarat latihan 1 → bila Latihan 1 selesai, Beginner otomatis dianggap selesai.
    if (state.tests["practice-l1"]?.status === "completed" &&
        state.tests.beginner?.status !== "completed") {
        state.tests.beginner.status = "completed";
    }
    // 2) Expert hanya bisa tuntas bila seluruh tahap sebelumnya selesai → bila tidak, kembalikan ke unlocked.
    const chainDone = ["beginner", "practice-l1", "practice-l2", "practice-l3"]
        .every(id => state.tests[id]?.status === "completed");
    if (state.tests.expert?.status === "completed" && !chainDone) {
        state.tests.expert.status = "unlocked";
    }

    return state;
}

export function saveState(state, key = DEFAULT_STORAGE_KEY) {
    localStorage.setItem(key, JSON.stringify(state));
}
