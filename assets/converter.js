document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("ptw-dropzone");
    const input = document.getElementById("ptw-input");
    const results = document.getElementById("ptw-results");
    const formatSelect = document.getElementById("ptw-format");
    const widthInput = document.getElementById("ptw-width");
    const heightInput = document.getElementById("ptw-height");
    const keepRatioInput = document.getElementById("ptw-keep-ratio");
    const removeBgInput = document.getElementById("ptw-remove-bg");
    const qualityInput = document.getElementById("ptw-quality");
    const qualityValue = document.getElementById("ptw-quality-value");

    if (!dropzone || !input || !results || !formatSelect || !widthInput || !heightInput || !qualityInput || !qualityValue) {
        return;
    }

    qualityInput.addEventListener("input", () => {
        qualityValue.textContent = `${Math.round(parseFloat(qualityInput.value) * 100)}%`;
    });

    dropzone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropzone.classList.remove("dragover");
        handleFiles(event.dataTransfer.files);
    });

    input.addEventListener("change", (event) => handleFiles(event.target.files));

    async function handleFiles(files) {
        const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
        results.innerHTML = "";

        if (!imageFiles.length) {
            results.appendChild(createErrorBox("Bitte waehle mindestens eine gueltige Bilddatei aus."));
            return;
        }

        for (const file of imageFiles) {
            const box = createLoadingBox(file.name);
            results.appendChild(box);

            try {
                const originalUrl = URL.createObjectURL(file);
                const originalImage = await loadImage(originalUrl);
                const settings = getConversionSettings(originalImage);
                const convertedBlob = await convertImage(originalImage, settings);

                if (!convertedBlob) {
                    throw new Error("Der Browser konnte dieses Bild nicht konvertieren.");
                }

                const convertedUrl = URL.createObjectURL(convertedBlob);
                renderResultBox(box, {
                    file,
                    originalUrl,
                    convertedUrl,
                    convertedBlob,
                    format: settings.format,
                    dimensions: settings.dimensions,
                    changedFormatForTransparency: settings.changedFormatForTransparency
                });
            } catch (error) {
                box.className = "ptw-result-box is-error";
                box.innerHTML = `<p class="ptw-error">${escapeHtml(file.name)} konnte nicht verarbeitet werden. ${escapeHtml(error.message)}</p>`;
            }
        }
    }

    function createLoadingBox(fileName) {
        const box = document.createElement("div");
        box.className = "ptw-result-box is-loading";
        box.innerHTML = `<p class="ptw-status">${escapeHtml(fileName)} wird konvertiert...</p>`;
        return box;
    }

    function createErrorBox(message) {
        const box = document.createElement("div");
        box.className = "ptw-result-box is-error";
        box.innerHTML = `<p class="ptw-error">${escapeHtml(message)}</p>`;
        return box;
    }

    function getConversionSettings(image) {
        const removeBackground = removeBgInput ? removeBgInput.checked : false;
        const selectedFormat = formatSelect.value;
        const format = removeBackground && selectedFormat === "jpeg" ? "png" : selectedFormat;
        const quality = parseFloat(qualityInput.value);
        const requestedWidth = parseInt(widthInput.value, 10);
        const requestedHeight = parseInt(heightInput.value, 10);
        const keepRatio = keepRatioInput ? keepRatioInput.checked : true;
        const dimensions = calculateDimensions(image.naturalWidth, image.naturalHeight, requestedWidth, requestedHeight, keepRatio);

        return {
            format,
            quality,
            dimensions,
            removeBackground,
            changedFormatForTransparency: removeBackground && selectedFormat !== format
        };
    }

    function calculateDimensions(originalWidth, originalHeight, requestedWidth, requestedHeight, keepRatio) {
        const hasWidth = Number.isFinite(requestedWidth) && requestedWidth > 0;
        const hasHeight = Number.isFinite(requestedHeight) && requestedHeight > 0;

        if (!keepRatio) {
            return {
                width: hasWidth ? requestedWidth : originalWidth,
                height: hasHeight ? requestedHeight : originalHeight
            };
        }

        if (hasWidth && !hasHeight) {
            return {
                width: requestedWidth,
                height: Math.max(1, Math.round((requestedWidth / originalWidth) * originalHeight))
            };
        }

        if (!hasWidth && hasHeight) {
            return {
                width: Math.max(1, Math.round((requestedHeight / originalHeight) * originalWidth)),
                height: requestedHeight
            };
        }

        if (hasWidth && hasHeight) {
            const ratio = Math.min(requestedWidth / originalWidth, requestedHeight / originalHeight);
            return {
                width: Math.max(1, Math.round(originalWidth * ratio)),
                height: Math.max(1, Math.round(originalHeight * ratio))
            };
        }

        return {
            width: originalWidth,
            height: originalHeight
        };
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Die Datei konnte nicht als Bild geladen werden."));
            image.src = src;
        });
    }

    function convertImage(image, settings) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (!context) {
                resolve(null);
                return;
            }

            canvas.width = settings.dimensions.width;
            canvas.height = settings.dimensions.height;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            if (settings.removeBackground) {
                removeImageBackground(context, canvas.width, canvas.height);
            }

            canvas.toBlob((blob) => resolve(blob), `image/${settings.format}`, settings.quality);
        });
    }

    function removeImageBackground(context, width, height) {
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        const background = getEstimatedBackgroundColor(data, width, height);
        const tolerance = 54;
        const fadeRange = 28;

        for (let index = 0; index < data.length; index += 4) {
            const distance = colorDistance(data[index], data[index + 1], data[index + 2], background);

            if (distance <= tolerance) {
                data[index + 3] = 0;
            } else if (distance <= tolerance + fadeRange) {
                const alphaRatio = (distance - tolerance) / fadeRange;
                data[index + 3] = Math.round(data[index + 3] * alphaRatio);
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    function getEstimatedBackgroundColor(data, width, height) {
        const samplePoints = [
            [0, 0],
            [width - 1, 0],
            [0, height - 1],
            [width - 1, height - 1],
            [Math.floor(width / 2), 0],
            [Math.floor(width / 2), height - 1],
            [0, Math.floor(height / 2)],
            [width - 1, Math.floor(height / 2)]
        ];

        const colorGroups = samplePoints.map(([x, y]) => {
            const index = ((y * width) + x) * 4;
            return {
                r: data[index],
                g: data[index + 1],
                b: data[index + 2],
                matches: 0
            };
        });

        for (const color of colorGroups) {
            color.matches = colorGroups.filter((candidate) => colorDistance(candidate.r, candidate.g, candidate.b, color) < 36).length;
        }

        colorGroups.sort((a, b) => b.matches - a.matches);
        return colorGroups[0];
    }

    function colorDistance(red, green, blue, target) {
        return Math.sqrt(
            ((red - target.r) ** 2) +
            ((green - target.g) ** 2) +
            ((blue - target.b) ** 2)
        );
    }

    function renderResultBox(box, result) {
        const originalSizeKB = result.file.size / 1024;
        const convertedSizeKB = result.convertedBlob.size / 1024;
        const savings = Math.max(0, Math.round(100 - ((convertedSizeKB / originalSizeKB) * 100)));
        const outputName = result.file.name.replace(/\.[^.]+$/, `.${result.format}`);

        box.className = "ptw-result-box";
        box.innerHTML = `
            <div class="ptw-stats">
                <div class="ptw-file-name">${escapeHtml(result.file.name)}</div>
                <div class="ptw-meta">Original: ${formatKB(originalSizeKB)} KB</div>
                <div class="ptw-meta">Neu: ${formatKB(convertedSizeKB)} KB</div>
                <div class="ptw-saving">Ersparnis: ${savings}%</div>
            </div>
            <div class="ptw-compare">
                <div class="ptw-preview">
                    <span>Original</span>
                    <img src="${result.originalUrl}" alt="Originalbild ${escapeHtml(result.file.name)}">
                </div>
                <div class="ptw-preview">
                    <span>${getResultLabel(result)}</span>
                    <img src="${result.convertedUrl}" alt="Konvertiertes Bild ${escapeHtml(result.file.name)}">
                </div>
            </div>
            <div class="ptw-actions">
                <a class="ptw-download" href="${result.convertedUrl}" download="${escapeHtml(outputName)}">Optimierte Version herunterladen</a>
            </div>
        `;
    }

    function getResultLabel(result) {
        const transparencyNote = result.changedFormatForTransparency ? " - PNG fuer Transparenz" : "";
        return `${result.format.toUpperCase()} - ${result.dimensions.width} x ${result.dimensions.height}px${transparencyNote}`;
    }

    function formatKB(value) {
        return value.toFixed(value >= 100 ? 0 : 1);
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#039;"
        }[character]));
    }
});
