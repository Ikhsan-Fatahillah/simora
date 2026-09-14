// Halaman Panduan Penggunaan SIMORA: tiap card membuka halaman detail terpisah.
const PANDUAN_DETAIL_PAGES = {
    pengantar: "screen-pengantar",
    navigasi: "screen-navigasi",
    isi: "screen-isi",
    gamifikasi: "screen-gamifikasi"
};

export function initPanduan() {
    const panduanScreen = document.getElementById("screen-panduan");
    if (!panduanScreen) return;

    const closeAllDetails = () => {
        Object.values(PANDUAN_DETAIL_PAGES).forEach((id) => {
            document.getElementById(id)?.classList.remove("active");
        });
    };

    document.querySelectorAll("[data-panduan]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = PANDUAN_DETAIL_PAGES[btn.getAttribute("data-panduan")];
            if (!target) return;
            panduanScreen.classList.remove("active");
            document.getElementById(target).classList.add("active");
        });
    });

    // Tombol Kembali di tiap halaman detail kembali ke halaman Panduan
    document.querySelectorAll(".btn-panduan-page-back").forEach((btn) => {
        btn.addEventListener("click", () => {
            closeAllDetails();
            panduanScreen.classList.add("active");
        });
    });
}
