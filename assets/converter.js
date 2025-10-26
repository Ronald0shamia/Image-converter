document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("ptw-dropzone");
    const input = document.getElementById("ptw-input");
    const results = document.getElementById("ptw-results");
    const formatSelect = document.getElementById("ptw-format");
    const widthInput = document.getElementById("ptw-width");
    const heightInput = document.getElementById("ptw-height");
    const qualityInput = document.getElementById("ptw-quality");
    const qualityValue = document.getElementById("ptw-quality-value");

    qualityInput.addEventListener("input", () => {
        qualityValue.textContent = qualityInput.value;
    });

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

        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            const fileURL = URL.createObjectURL(file);
            const originalSizeKB = (file.size / 1024).toFixed(1);
            const format = formatSelect.value;
            const quality = parseFloat(qualityInput.value);
            const width = parseInt(widthInput.value);
            const height = parseInt(heightInput.value);

            const img = document.createElement("img");
            img.src = fileURL;

            const box = document.createElement("div");
            box.className = "ptw-result-box";
            results.appendChild(box);

            img.onload = async () => {
                const convertedBlob = await convertImage(img, format, width, height, quality);
                const newSizeKB = (convertedBlob.size / 1024).toFixed(1);
                const savings = 100 - Math.round((newSizeKB / originalSizeKB) * 100);

                const newImg = document.createElement("img");
                newImg.src = URL.createObjectURL(convertedBlob);

                box.innerHTML = `
                    <div class="ptw-stats">
                        <p><strong>${file.name}</strong></p>
                        <p>Original: ${originalSizeKB} KB (${file.type.replace("image/","").toUpperCase()})</p>
                        <p>Optimiert: ${newSizeKB} KB (${format.toUpperCase()})</p>
                        <p class="ptw-saving">💡 Ersparnis: ${savings > 0 ? savings : 0}%</p>
                    </div>
                `;

                const compare = document.createElement("div");
                compare.className = "ptw-compare";
                compare.appendChild(img);
                compare.appendChild(newImg);
                box.appendChild(compare);

                const link = document.createElement("a");
                link.href = newImg.src;
                link.download = file.name.replace(/\.[^.]+$/, `.${format}`);
                link.textContent = "⬇️ Download optimierte Version";
                link.className = "ptw-download";
                box.appendChild(link);
            };
        }
    }

    function convertImage(image, format, width, height, quality) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = width || image.naturalWidth;
            canvas.height = height || image.naturalHeight;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => resolve(blob), `image/${format}`, quality);
        });
    }
});
