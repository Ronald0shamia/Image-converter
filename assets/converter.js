document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("ptw-dropzone");
    const input = document.getElementById("ptw-input");
    const results = document.getElementById("ptw-results");
    const preview = document.getElementById("ptw-preview");

    // Drag & Drop Events
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        handleFiles(e.dataTransfer.files);
    });

    input.addEventListener("change", (e) => handleFiles(e.target.files));

    async function handleFiles(files) {
        results.innerHTML = "";
        preview.innerHTML = "";

        for (const file of files) {
            if (file.type !== "image/png") continue;

            const fileBox = document.createElement("div");
            fileBox.className = "ptw-file";
            fileBox.innerHTML = `<strong>${file.name}</strong><div class="ptw-progress"><div class="ptw-progress-bar"></div></div>`;
            results.appendChild(fileBox);

            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = "100px";
            img.style.margin = "5px";
            preview.appendChild(img);

            const progressBar = fileBox.querySelector(".ptw-progress-bar");
            let progress = 0;

            const simulateProgress = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;
                if (progress >= 90) clearInterval(simulateProgress);
            }, 100);

            const webpBlob = await convertToWebp(img);
            progressBar.style.width = "100%";

            const webpUrl = URL.createObjectURL(webpBlob);
            const link = document.createElement("a");
            link.href = webpUrl;
            link.download = file.name.replace(".png", ".webp");
            link.textContent = "⬇️ Download WEBP";
            link.className = "ptw-download";
            fileBox.appendChild(link);
        }
    }

    function convertToWebp(image) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            image.onload = () => {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                ctx.drawImage(image, 0, 0);
                canvas.toBlob((blob) => resolve(blob), "image/webp", 0.9);
            };
        });
    }
});
