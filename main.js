document.addEventListener("DOMContentLoaded", () => {
    const app = {
        elements: {
            preview: document.getElementById("preview"),
            bgColor: document.getElementById("bgColor"),
            bgImage: document.getElementById("bgImage"),
            gradient: document.getElementById("gradient"),
            gradientOptions: document.getElementById("gradientOptions"),
            gradientColor1: document.getElementById("gradientColor1"),
            gradientColor2: document.getElementById("gradientColor2"),
            animationType: document.getElementById("animationType"),
            animationSpeed: document.getElementById("animationSpeed"),
            elementCount: document.getElementById("elementCount"),
            shape: document.getElementById("shape"),
            customText: document.getElementById("customText"),
            textColor: document.getElementById("textColor"),
            fontSize: document.getElementById("fontSize"),
            fontFamily: document.getElementById("fontFamily"),
            textPositionX: document.getElementById("textPositionX"),
            textPositionY: document.getElementById("textPositionY"),
            textShadow: document.getElementById("textShadow"),
            presetSelect: document.getElementById("presetSelect"),
            randomizeBtn: document.getElementById("randomizeBtn"),
            pauseBtn: document.getElementById("pauseBtn"),
            clearBtn: document.getElementById("clearBtn"),
            saveBtn: document.getElementById("saveBtn"),
            loadBtn: document.getElementById("loadBtn"),
            downloadBtn: document.getElementById("downloadBtn"),
            fullscreenBtn: document.getElementById("fullscreenBtn"),
            themeToggle: document.getElementById("themeToggle"),
            undoBtn: document.getElementById("undoBtn"),
            redoBtn: document.getElementById("redoBtn"),
            fab: document.getElementById("fab"),
            generateColorScheme: document.getElementById("generateColorScheme"),
        },
        initializeParticleInteraction() {
            this.mousePosition = { x: 0, y: 0 };
            this.elements.preview.addEventListener('mousemove', (e) => {
                const rect = this.elements.preview.getBoundingClientRect();
                this.mousePosition.x = e.clientX - rect.left;
                this.mousePosition.y = e.clientY - rect.top;
            });
        
            this.elements.preview.addEventListener('mouseleave', () => {
                this.mousePosition = { x: -1000, y: -1000 };  // Move mouse far away when it leaves
            });
        
            this.startParticleAnimation();
        },
        startParticleAnimation() {
            const animateParticles = () => {
                const particles = this.elements.preview.querySelectorAll('.twinkle, .float');
                const interactionMode = this.elements.interactionMode.value;
                const interactionStrength = 5;  // Adjust this value to change the strength of interaction
        
                particles.forEach((particle) => {
                    const rect = particle.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
        
                    const dx = this.mousePosition.x - x;
                    const dy = this.mousePosition.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
        
                    if (distance < 100) {  // Interaction radius
                        let angle = Math.atan2(dy, dx);
                        
                        switch (interactionMode) {
                            case 'attract':
                                particle.style.transform = `translate(${dx / interactionStrength}px, ${dy / interactionStrength}px)`;
                                break;
                            case 'repel':
                                particle.style.transform = `translate(${-dx / interactionStrength}px, ${-dy / interactionStrength}px)`;
                                break;
                            case 'swirl':
                                angle += Math.PI / 2;  // Perpendicular to the radius
                                particle.style.transform = `translate(${Math.cos(angle) * distance / interactionStrength}px, ${Math.sin(angle) * distance / interactionStrength}px)`;
                                break;
                            default:
                                particle.style.transform = 'translate(0, 0)';
                        }
                    } else {
                        particle.style.transform = 'translate(0, 0)';
                    }
                });
        
                requestAnimationFrame(animateParticles);
            };
        
            animateParticles();
        },
        state: {
            animationPaused: false,
            undoStack: [],
            redoStack: [],
            currentConfig: {}
        },
        init() {
            this.bindEvents();
            this.loadSavedConfig();
            this.updateDisplayedValues();
        },
        bindEvents() {
            const e = this.elements;
            
            e.bgColor.addEventListener("input", () => this.updateBackground());
            e.bgImage.addEventListener("change", () => this.updateBackground());
            e.gradient.addEventListener("change", () => this.toggleGradientOptions());
            e.gradientColor1.addEventListener("input", () => this.updateBackground());
            e.gradientColor2.addEventListener("input", () => this.updateBackground());
            e.animationType.addEventListener("change", () => this.updateBackground());
            e.animationSpeed.addEventListener("input", () => this.updateBackground());
            e.elementCount.addEventListener("input", () => this.updateBackground());
            e.shape.addEventListener("change", () => this.updateBackground());
            e.customText.addEventListener("input", () => this.updateBackground());
            e.textColor.addEventListener("input", () => this.updateBackground());
            e.fontSize.addEventListener("input", () => {
                this.updateDisplayedValues();
                this.updateBackground();
            });
            this.elements.generateColorScheme.addEventListener('click', () => this.generateColorScheme());
            e.fontFamily.addEventListener("change", () => this.updateBackground());
            e.textPositionX.addEventListener("input", () => {
                this.updateDisplayedValues();
                this.updateBackground();
            });
            e.textPositionY.addEventListener("input", () => {
                this.updateDisplayedValues();
                this.updateBackground();
            });
            e.textShadow.addEventListener("change", () => this.updateBackground());
            e.presetSelect.addEventListener("change", () => this.applyPreset());
            
            e.randomizeBtn.addEventListener("click", () => this.randomizeBackground());
            e.pauseBtn.addEventListener("click", () => this.togglePause());
            e.clearBtn.addEventListener("click", () => this.clearBackground());
            e.saveBtn.addEventListener("click", () => this.saveConfig());
            e.loadBtn.addEventListener("click", () => this.loadConfig());
            e.downloadBtn.addEventListener("click", () => this.downloadBackground());
            e.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
            e.themeToggle.addEventListener("click", () => this.toggleTheme());
            e.undoBtn.addEventListener("click", () => this.undo());
            e.redoBtn.addEventListener("click", () => this.redo());
            e.fab.addEventListener("click", () => this.randomizeBackground());

            document.addEventListener("keydown", (event) => {
                if (event.ctrlKey && event.key === "z") this.undo();
                if (event.ctrlKey && event.key === "y") this.redo();
            });
        },
        updateBackground() {
            const e = this.elements;
            const preview = e.preview;
            
            preview.style.backgroundColor = "";
            preview.style.backgroundImage = "";
            preview.innerHTML = "";

            if (e.bgImage.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    preview.style.backgroundImage = `url(${event.target.result})`;
                };
                reader.readAsDataURL(e.bgImage.files[0]);
            } else if (e.gradient.checked) {
                preview.style.backgroundImage = `linear-gradient(45deg, ${e.gradientColor1.value}, ${e.gradientColor2.value})`;
            } else {
                preview.style.backgroundColor = e.bgColor.value;
            }

            if (!this.state.animationPaused) {
                this.createAnimation();
            }

            if (e.customText.value) {
                this.addCustomText();
            }

            this.saveState();
        },
        createAnimation() {
            const e = this.elements;
            const animationType = e.animationType.value;
            const count = e.elementCount.value;
            const speed = e.animationSpeed.value;
            const shape = e.shape.value;

            switch (animationType) {
                case "stars":
                    this.createParticles(count, speed, shape, "twinkle");
                    break;
                case "waves":
                    this.createWaves(speed);
                    break;
                case "particles":
                    this.createParticles(count, speed, shape, "float");
                    break;
            }
        },
        createParticles(count, speed, shape, animation) {
            for (let i = 0; i < count; i++) {
                const particle = document.createElement("div");
                particle.classList.add(shape, animation);
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDuration = `${Math.random() * speed + 1}s`;
                particle.style.width = `${Math.random() * 5 + 2}px`;
                particle.style.height = particle.style.width;
                particle.style.backgroundColor = this.getRandomColor();
                this.elements.preview.appendChild(particle);
            }
        },
        createWaves(speed) {
            const wave = document.createElement("div");
            wave.classList.add("wave");
            wave.style.animationDuration = `${speed * 2}s`;
            this.elements.preview.appendChild(wave);
        },
        addCustomText() {
            const e = this.elements;
            const textElement = document.createElement("div");
            textElement.classList.add("custom-text");
            textElement.innerText = e.customText.value;
            textElement.style.color = e.textColor.value;
            textElement.style.fontSize = `${e.fontSize.value}px`;
            textElement.style.fontFamily = e.fontFamily.value;
            textElement.style.left = `${e.textPositionX.value}%`;
            textElement.style.top = `${e.textPositionY.value}%`;
            
            if (e.textShadow.checked) {
                textElement.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
            }

            this.elements.preview.appendChild(textElement);
        },
        toggleGradientOptions() {
            this.elements.gradientOptions.style.display = 
                this.elements.gradient.checked ? "block" : "none";
            this.updateBackground();
        },
        randomizeBackground() {
            const e = this.elements;
            e.bgColor.value = this.getRandomColor();
            e.gradientColor1.value = this.getRandomColor();
            e.gradientColor2.value = this.getRandomColor();
            e.animationType.value = this.getRandomOption(e.animationType);
            e.animationSpeed.value = this.getRandomValue(1, 10);
            e.elementCount.value = this.getRandomValue(10, 200);
            e.shape.value = this.getRandomOption(e.shape);
            e.customText.value = this.getRandomText();
            e.textColor.value = this.getRandomColor();
            e.fontSize.value = this.getRandomValue(12, 72);
            e.fontFamily.value = this.getRandomOption(e.fontFamily);
            e.textPositionX.value = this.getRandomValue(0, 100);
            e.textPositionY.value = this.getRandomValue(0, 100);
            e.textShadow.checked = Math.random() < 0.5;
            e.gradient.checked = Math.random() < 0.5;
            this.toggleGradientOptions();
            this.updateDisplayedValues();
            this.updateBackground();
        },
        getRandomColor() {
            return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        },
        getRandomValue(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getRandomOption(selectElement) {
            const options = selectElement.options;
            return options[Math.floor(Math.random() * options.length)].value;
        },
        getRandomText() {
            const texts = ["Hello World", "Animated Background", "Custom Text", "Creative Design"];
            return texts[Math.floor(Math.random() * texts.length)];
        },
        togglePause() {
            this.state.animationPaused = !this.state.animationPaused;
            this.elements.pauseBtn.textContent = this.state.animationPaused ? "Play" : "Pause";
            this.updateBackground();
        },
        clearBackground() {
            this.elements.preview.innerHTML = "";
            this.saveState();
        },
        saveConfig() {
            const config = this.getCurrentConfig();
            localStorage.setItem("backgroundConfig", JSON.stringify(config));
            alert("Configuration saved successfully!");
        },
        loadConfig() {
            const savedConfig = JSON.parse(localStorage.getItem("backgroundConfig"));
            if (savedConfig) {
                this.applyConfig(savedConfig);
                this.updateBackground();
            } else {
                alert("No saved configuration found.");
            }
        },
        getCurrentConfig() {
            const e = this.elements;
            return {
                bgColor: e.bgColor.value,
                gradient: e.gradient.checked,
                gradientColor1: e.gradientColor1.value,
                gradientColor2: e.gradientColor2.value,
                animationType: e.animationType.value,
                animationSpeed: e.animationSpeed.value,
                elementCount: e.elementCount.value,
                shape: e.shape.value,
                customText: e.customText.value,
                textColor: e.textColor.value,
                fontSize: e.fontSize.value,
                fontFamily: e.fontFamily.value,
                textPositionX: e.textPositionX.value,
                textPositionY: e.textPositionY.value,
                textShadow: e.textShadow.checked
            };
        },
        applyConfig(config) {
            const e = this.elements;
            Object.keys(config).forEach(key => {
                if (key === "gradient") {
                    e[key].checked = config[key];
                    this.toggleGradientOptions();
                } else if (e[key]) {
                    e[key].value = config[key];
                }
            });
            this.updateDisplayedValues();
        },
        downloadBackground() {
            html2canvas(this.elements.preview).then(canvas => {
                const link = document.createElement("a");
                link.download = "background.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        },
        toggleFullscreen() {
            if (!document.fullscreenElement) {
                this.elements.preview.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        },
        toggleTheme() {
            document.body.classList.toggle("light-mode");
            const icon = this.elements.themeToggle.querySelector(".material-icons");
            icon.textContent = document.body.classList.contains("light-mode") ? "light_mode" : "dark_mode";
        },
        saveState() {
            const currentState = this.getCurrentConfig();
            this.state.undoStack.push(currentState);
            this.state.redoStack = [];
        },
        undo() {
            if (this.state.undoStack.length > 1) {
                this.state.redoStack.push(this.state.undoStack.pop());
                const previousState = this.state.undoStack[this.state.undoStack.length - 1];
                this.applyConfig(previousState);
                this.updateBackground();
            }
        },
        redo() {
            if (this.state.redoStack.length > 0) {
                const nextState = this.state.redoStack.pop();
                this.state.undoStack.push(nextState);
                this.applyConfig(nextState);
                this.updateBackground();
            }
        },
        generateColorScheme() {
            const baseHue = Math.floor(Math.random() * 360);
            const scheme = this.calculateColorScheme(baseHue);
            
            this.elements.bgColor.value = scheme.background;
            this.elements.gradientColor1.value = scheme.gradient1;
            this.elements.gradientColor2.value = scheme.gradient2;
            this.elements.textColor.value = scheme.text;
            
            // Update the background
            this.updateBackground();
            
            // Update particle colors
            this.updateParticleColors(scheme.accent1, scheme.accent2);
        },
        calculateColorScheme(baseHue) {
            const toHex = (hsl) => {
                const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
                return `#${(1 << 24 | rgb[0] << 16 | rgb[1] << 8 | rgb[2]).toString(16).slice(1)}`;
            };
        
            return {
                background: toHex([baseHue, 50, 10]),
                gradient1: toHex([baseHue, 60, 20]),
                gradient2: toHex([(baseHue + 30) % 360, 70, 30]),
                text: toHex([baseHue, 20, 90]),
                accent1: toHex([(baseHue + 120) % 360, 70, 50]),
                accent2: toHex([(baseHue + 240) % 360, 70, 50])
            };
        },
        hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        },
        updateParticleColors(color1, color2) {
            const particles = this.elements.preview.querySelectorAll('.twinkle, .float');
            particles.forEach((particle, index) => {
                particle.style.backgroundColor = index % 2 === 0 ? color1 : color2;
            });
        },
        applyPreset() {
            const preset = this.elements.presetSelect.value;
            switch (preset) {
                case "nightSky":
                    this.applyConfig({
                        bgColor: "#000033",
                        gradient: true,
                        gradientColor1: "#000033",
                        gradientColor2: "#191970",
                        animationType: "stars",
                        animationSpeed: "3",
                        elementCount: "150",
                        shape: "star",
                        customText: "Night Sky",
                        textColor: "#ffffff",
                        fontSize: "48",
                        fontFamily: "Arial",
                        textPositionX: "50",
                        textPositionY: "50",
                        textShadow: true
                    });
                    break;
                case "ocean":
                    this.applyConfig({
                        bgColor: "#00008B",
                        gradient: true,
                        gradientColor1: "#00008B",
                        gradientColor2: "#4169E1",
                        animationType: "waves",
                        animationSpeed: "7",
                        elementCount: "50",
                        shape: "circle",
                        customText: "Ocean Waves",
                        textColor: "#ffffff",
                        fontSize: "36",
                        fontFamily: "Verdana",
                        textPositionX: "50",
                        textPositionY: "30",
                        textShadow: true
                    });
                    break;
                case "fire":
                    this.applyConfig({
                        bgColor: "#8B0000",
                        gradient: true,
                        gradientColor1: "#8B0000",
                        gradientColor2: "#FF4500",
                        animationType: "particles",
                        animationSpeed: "8",
                        elementCount: "100",
                        shape: "triangle",
                        customText: "Fire",
                        textColor: "#FFD700",
                        fontSize: "60",
                        fontFamily: "Times New Roman",
                        textPositionX: "50",
                        textPositionY: "70",
                        textShadow: true
                    });
                    break;
            }
            this.updateBackground();
        },
        updateDisplayedValues() {
            const e = this.elements;
            document.getElementById("fontSizeValue").textContent = `${e.fontSize.value}px`;
            document.getElementById("textPositionXValue").textContent = `${e.textPositionX.value}%`;
            document.getElementById("textPositionYValue").textContent = `${e.textPositionY.value}%`;
        },
        loadSavedConfig() {
            const savedConfig = JSON.parse(localStorage.getItem("backgroundConfig"));
            if (savedConfig) {
                this.applyConfig(savedConfig);
            } else {
                this.randomizeBackground();
            }
            this.updateBackground();
        }
    };

    app.init();
});