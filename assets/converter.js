document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("ptw-input");
    const results = document.getElementById("ptw-results");
    const preview = document.getElementById("ptw-preview");

    input.addEventListener("change", async (e) => {
        results.innerHTML = "";
        preview.innerHTML = "";

        const files = e.target.files;
        if (!files.length) return;

        for (const file of files) {
            if (file.type !== "image/png") continue;

            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);

            const webpBlob = await convertToWebp(img);
            const webpUrl = URL.createObjectURL(webpBlob);
            const link = document.createElement("a");
            link.href = webpUrl;
            link.download = file.name.replace(".png", ".webp");
            link.textContent = `⬇️ ${file.name.replace(".png", ".webp")}`;
            link.className = "ptw-download";
            results.appendChild(link);
        }
    });

    function convertToWebp(image) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            image.onload = () => {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                ctx.drawImage(image, 0, 0);
                canvas.toBlob(
                    (blob) => resolve(blob),
                    "image/webp",
                    0.9 // Qualität (0-1)
                );
            };
        });
    }
});
