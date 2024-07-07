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
            addLayer: document.getElementById("addLayer"),
            layerControls: document.getElementById("layerControls"),
            audioFile: document.getElementById("audioFile"),
            useMicrophone: document.getElementById("useMicrophone"),
            stopAudio: document.getElementById("stopAudio"),
            audioReactiveMode: document.getElementById("audioReactiveMode"),
            interactionMode: document.getElementById("interactionMode"),
        },


        saveSlots: {
            1: null,
            2: null,
            3: null
        },

        state: {
            animationPaused: false,
            undoStack: [],
            redoStack: [],
            currentConfig: {},
            layers: [],
            audioContext: null,
            analyser: null,
            audioSource: null,
            audioReactiveAnimation: null,
            mousePosition: { x: 0, y: 0 },
        },

        init() {
            this.validateElements();
            this.bindEvents();
            this.loadSavedConfig();
            this.updateDisplayedValues();
            this.initializeParticleInteraction();
            this.initializeLayers();
            this.initializeAudioReactive();
            this.initializeSaveSlots();
            this.initializePerformanceMetrics();
            this.initializeCustomShapeEditor();
            this.initializeControlCustomizer();
        },

        initializeSaveSlots() {
            const saveToSlotBtn = document.getElementById('saveToSlotBtn');
            const loadFromSlotBtn = document.getElementById('loadFromSlotBtn');
            const saveSlotSelect = document.getElementById('saveSlotSelect');
        
            saveToSlotBtn.addEventListener('click', () => this.saveToSlot(saveSlotSelect.value));
            loadFromSlotBtn.addEventListener('click', () => this.loadFromSlot(saveSlotSelect.value));
        },
        
        saveToSlot(slot) {
            this.saveSlots[slot] = this.getCurrentConfig();
            alert(`Configuration saved to slot ${slot}`);
        },

        validateElements() {
            for (const [key, element] of Object.entries(this.elements)) {
                if (!element) {
                    console.error(`Element with ID "${key}" not found. This may cause errors.`);
                }
            }
        },

        loadFromSlot(slot) {
            if (this.saveSlots[slot]) {
                this.applyConfig(this.saveSlots[slot]);
                this.updateBackground();
                alert(`Configuration loaded from slot ${slot}`);
            } else {
                alert(`No configuration saved in slot ${slot}`);
            }
        },
        
        initializePerformanceMetrics() {
            this.fpsCounter = document.getElementById('fpsCounter');
            this.particleCounter = document.getElementById('particleCounter');
            this.lastFrameTime = performance.now();
            this.frameCount = 0;
            this.updatePerformanceMetrics();
        },
        
        updatePerformanceMetrics() {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            this.frameCount++;
        
            if (delta > 1000) {
                const fps = Math.round((this.frameCount * 1000) / delta);
                this.fpsCounter.textContent = `FPS: ${fps}`;
                this.frameCount = 0;
                this.lastFrameTime = now;
            }
        
            const particles = this.elements.preview.querySelectorAll('.twinkle, .float').length;
            this.particleCounter.textContent = `Particles: ${particles}`;
        
            requestAnimationFrame(() => this.updatePerformanceMetrics());
        },
        
        initializeCustomShapeEditor() {
            const openShapeEditorBtn = document.getElementById('openShapeEditorBtn');
            const shapeEditor = document.getElementById('shapeEditor');
            const shapeCanvas = document.getElementById('shapeCanvas');
            const saveCustomShape = document.getElementById('saveCustomShape');
            const ctx = shapeCanvas.getContext('2d');
        
            let isDrawing = false;
            let customShape = [];
        
            openShapeEditorBtn.addEventListener('click', () => {
                shapeEditor.style.display = shapeEditor.style.display === 'none' ? 'block' : 'none';
            });
        
            shapeCanvas.addEventListener('mousedown', startDrawing);
            shapeCanvas.addEventListener('mousemove', draw);
            shapeCanvas.addEventListener('mouseup', stopDrawing);
            shapeCanvas.addEventListener('mouseout', stopDrawing);
        
            saveCustomShape.addEventListener('click', () => {
                const shapeOption = document.createElement('option');
                shapeOption.value = 'custom';
                shapeOption.textContent = 'Custom';
                this.elements.shape.appendChild(shapeOption);
                this.elements.shape.value = 'custom';
                this.updateBackground();
            });
        
            function startDrawing(e) {
                isDrawing = true;
                draw(e);
            }
        
            function draw(e) {
                if (!isDrawing) return;
                const rect = shapeCanvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                customShape.push({x, y});
                
                ctx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                ctx.beginPath();
                ctx.moveTo(customShape[0].x, customShape[0].y);
                for (let i = 1; i < customShape.length; i++) {
                    ctx.lineTo(customShape[i].x, customShape[i].y);
                }
                ctx.closePath();
                ctx.fill();
            }
        
            function stopDrawing() {
                isDrawing = false;
            }
        },
        
        initializeControlCustomizer() {
            const customizeControlsBtn = document.getElementById('customizeControlsBtn');
            const controlCustomizer = document.getElementById('controlCustomizer');
        
            customizeControlsBtn.addEventListener('click', () => {
                controlCustomizer.style.display = controlCustomizer.style.display === 'none' ? 'block' : 'none';
                if (controlCustomizer.style.display === 'block') {
                    this.populateControlCustomizer();
                }
            });
        },
        
        populateControlCustomizer() {
            const controlCustomizer = document.getElementById('controlCustomizer');
            controlCustomizer.innerHTML = '';
        
            const controls = document.querySelectorAll('.control-group');
            controls.forEach((control, index) => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `control-${index}`;
                checkbox.checked = control.style.display !== 'none';
        
                const label = document.createElement('label');
                label.htmlFor = `control-${index}`;
                label.textContent = control.querySelector('label')?.textContent || `Control ${index + 1}`;
        
                checkbox.addEventListener('change', () => {
                    control.style.display = checkbox.checked ? 'block' : 'none';
                });
        
                const div = document.createElement('div');
                div.appendChild(checkbox);
                div.appendChild(label);
                controlCustomizer.appendChild(div);
            });
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
            e.addLayer.addEventListener('click', () => this.addLayer());
            e.generateColorScheme.addEventListener('click', () => this.generateColorScheme());
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
            try {
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
            } catch (error) {
                console.error("Error updating background:", error);
            }
        },

        createAnimation() {
            this.updatePerformanceMetrics();
            try {
                const e = this.elements;
                const animationType = e.animationType.value;
                const count = parseInt(e.elementCount.value);
                const speed = parseFloat(e.animationSpeed.value);
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
                    default:
                        console.warn(`Unknown animation type: ${animationType}`);
                }
            } catch (error) {
                console.error("Error creating animation:", error);
            }
        },

        createParticles(count, speed, shape, animation, container = this.elements.preview, color = "#ffffff", size = 5) {
            try {
                container.innerHTML = ''; // Clear existing particles
                for (let i = 0; i < count; i++) {
                    const particle = document.createElement("div");
                    particle.classList.add(animation);
                    particle.style.position = "absolute";
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.animationDuration = `${Math.random() * speed + 1}s`;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.backgroundColor = color;
        
                    if (shape === 'custom') {
                        const customShape = this.getCustomShape();
                        particle.style.clipPath = customShape;
                    } else {
                        particle.classList.add(shape);
                    }
        
                    container.appendChild(particle);
                }
            } catch (error) {
                console.error("Error creating particles:", error);
            }
        },

        getCustomShape() {
            const shapeCanvas = document.getElementById('shapeCanvas');
            const ctx = shapeCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height);
            const points = [];
        
            for (let y = 0; y < shapeCanvas.height; y++) {
                for (let x = 0; x < shapeCanvas.width; x++) {
                    const index = (y * shapeCanvas.width + x) * 4;
                    if (imageData.data[index + 3] > 0) {
                        points.push(`${x / shapeCanvas.width * 100}% ${y / shapeCanvas.height * 100}%`);
                    }
                }
            }
        
            return `polygon(${points.join(', ')})`;
        },

        createWaves(speed) {
            try {
                const wave = document.createElement("div");
                wave.classList.add("wave");
                wave.style.animationDuration = `${speed * 2}s`;
                this.elements.preview.appendChild(wave);
            } catch (error) {
                console.error("Error creating waves:", error);
            }
        },

        addCustomText() {
            try {
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
            } catch (error) {
                console.error("Error adding custom text:", error);
            }
        },

        toggleGradientOptions() {
            try {
                this.elements.gradientOptions.style.display = 
                    this.elements.gradient.checked ? "block" : "none";
                this.updateBackground();
            } catch (error) {
                console.error("Error toggling gradient options:", error);
            }
        },

        randomizeBackground() {
            try {
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
            } catch (error) {
                console.error("Error randomizing background:", error);
            }
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
            try {
                this.state.animationPaused = !this.state.animationPaused;
                this.elements.pauseBtn.textContent = this.state.animationPaused ? "Play" : "Pause";
                this.updateBackground();
            } catch (error) {
                console.error("Error toggling pause:", error);
            }
        },

        clearBackground() {
            try {
                this.elements.preview.innerHTML = "";
                this.saveState();
            } catch (error) {
                console.error("Error clearing background:", error);
            }
        },

        saveConfig() {
            try {
                const config = this.getCurrentConfig();
                localStorage.setItem("backgroundConfig", JSON.stringify(config));
                alert("Configuration saved successfully!");
            } catch (error) {
                console.error("Error saving configuration:", error);
                alert("Failed to save configuration. Please try again.");
            }
        },

        loadConfig() {
            try {
                const savedConfig = JSON.parse(localStorage.getItem("backgroundConfig"));
                if (savedConfig) {
                    this.applyConfig(savedConfig);
                    this.updateBackground();
                } else {
                    alert("No saved configuration found.");
                }
            } catch (error) {
                console.error("Error loading configuration:", error);
                alert("Failed to load configuration. Please try again.");
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
            try {
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
            } catch (error) {
                console.error("Error applying configuration:", error);
            }
        },

        downloadBackground() {
            try {
                html2canvas(this.elements.preview).then(canvas => {
                    const link = document.createElement("a");
                    link.download = "background.png";
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                });
            } catch (error) {
                console.error("Error downloading background:", error);
                alert("Failed to download background. Please try again.");
            }
        },

        toggleFullscreen() {
            try {
                if (!document.fullscreenElement) {
                    this.elements.preview.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                        alert("Failed to enter fullscreen mode. Please try again.");
                    });
                } else {
                    document.exitFullscreen();
                }
            } catch (error) {
                console.error("Error toggling fullscreen:", error);
            }
        },

        toggleTheme() {
            try {
                document.body.classList.toggle("light-mode");
                const icon = this.elements.themeToggle.querySelector(".material-icons");
                icon.textContent = document.body.classList.contains("light-mode") ? "light_mode" : "dark_mode";
            } catch (error) {
                console.error("Error toggling theme:", error);
            }
        },

        saveState() {
            try {
                const currentState = this.getCurrentConfig();
                this.state.undoStack.push(currentState);
                this.state.redoStack = [];
            } catch (error) {
                console.error("Error saving state:", error);
            }
        },

        undo() {
            try {
                if (this.state.undoStack.length > 1) {
                    this.state.redoStack.push(this.state.undoStack.pop());
                    const previousState = this.state.undoStack[this.state.undoStack.length - 1];
                    this.applyConfig(previousState);
                    this.updateBackground();
                }
            } catch (error) {
                console.error("Error performing undo:", error);
            }
        },

        redo() {
            try {
                if (this.state.redoStack.length > 0) {
                    const nextState = this.state.redoStack.pop();
                    this.state.undoStack.push(nextState);
                    this.applyConfig(nextState);
                    this.updateBackground();
                }
            } catch (error) {
                console.error("Error performing redo:", error);
            }
        },

        generateColorScheme() {
            try {
                const baseHue = Math.floor(Math.random() * 360);
                const scheme = this.calculateColorScheme(baseHue);
                
                this.elements.bgColor.value = scheme.background;
                this.elements.gradientColor1.value = scheme.gradient1;
                this.elements.gradientColor2.value = scheme.gradient2;
                this.elements.textColor.value = scheme.text;
                
                this.updateBackground();
                this.updateParticleColors(scheme.accent1, scheme.accent2);
            } catch (error) {
                console.error("Error generating color scheme:", error);
            }
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
            try {
                const particles = this.elements.preview.querySelectorAll('.twinkle, .float');
                particles.forEach((particle, index) => {
                    particle.style.backgroundColor = index % 2 === 0 ? color1 : color2;
                });
            } catch (error) {
                console.error("Error updating particle colors:", error);
            }
        },

        applyPreset() {
            try {
                const preset = this.elements.presetSelect.value;
                let config;
                switch (preset) {
                    case "nightSky":
                        config = {
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
                        };
                        break;
                    case "ocean":
                        config = {
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
                        };
                        break;
                    case "fire":
                        config = {
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
                        };
                        break;
                    default:
                        console.warn(`Unknown preset: ${preset}`);
                        return;
                }
                this.applyConfig(config);
                this.updateBackground();
            } catch (error) {
                console.error("Error applying preset:", error);
            }
        },

        updateDisplayedValues() {
            try {
                const e = this.elements;
                document.getElementById("fontSizeValue").textContent = `${e.fontSize.value}px`;
                document.getElementById("textPositionXValue").textContent = `${e.textPositionX.value}%`;
                document.getElementById("textPositionYValue").textContent = `${e.textPositionY.value}%`;
            } catch (error) {
                console.error("Error updating displayed values:", error);
            }
        },

        loadSavedConfig() {
            try {
                const savedConfig = JSON.parse(localStorage.getItem("backgroundConfig"));
                if (savedConfig) {
                    this.applyConfig(savedConfig);
                } else {
                    this.randomizeBackground();
                }
                this.updateBackground();
            } catch (error) {
                console.error("Error loading saved config:", error);
                this.randomizeBackground();
            }
        },

        initializeLayers() {
            try {
                this.state.layers = [];
                this.addLayer();
                this.renderLayers();
            } catch (error) {
                console.error("Error initializing layers:", error);
            }
        },

        updateLayerControls() {
            try {
                const layerControls = this.elements.layerControls;
                layerControls.innerHTML = '';

                this.state.layers.forEach((layer, index) => {
                    const layerControl = document.createElement('div');
                    layerControl.className = 'layer-control';
                    layerControl.innerHTML = `
                        <h4>Layer ${index + 1}</h4>
                        <select class="layer-type">
                            <option value="particles" ${layer.type === 'particles' ? 'selected' : ''}>Particles</option>
                            <option value="gradient" ${layer.type === 'gradient' ? 'selected' : ''}>Gradient</option>
                        </select>
                        <select class="blend-mode">
                            <option value="normal" ${layer.blendMode === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="multiply" ${layer.blendMode === 'multiply' ? 'selected' : ''}>Multiply</option>
                            <option value="screen" ${layer.blendMode === 'screen' ? 'selected' : ''}>Screen</option>
                            <option value="overlay" ${layer.blendMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                        </select>
                        <input type="range" class="opacity" min="0" max="1" step="0.1" value="${layer.opacity}">
                        <button class="remove-layer">Remove</button>
                    `;

                    layerControl.querySelector('.layer-type').addEventListener('change', (e) => {
                        layer.type = e.target.value;
                        this.renderLayers();
                    });

                    layerControl.querySelector('.blend-mode').addEventListener('change', (e) => {
                        layer.blendMode = e.target.value;
                        this.renderLayers();
                    });

                    layerControl.querySelector('.opacity').addEventListener('input', (e) => {
                        layer.opacity = parseFloat(e.target.value);
                        this.renderLayers();
                    });

                    layerControl.querySelector('.remove-layer').addEventListener('click', () => {
                        this.state.layers.splice(index, 1);
                        this.updateLayerControls();
                        this.renderLayers();
                    });

                    layerControls.appendChild(layerControl);
                });
            } catch (error) {
                console.error("Error updating layer controls:", error);
            }
        },

        renderLayers() {
            try {
                this.elements.preview.innerHTML = '';

                this.state.layers.forEach((layer, index) => {
                    const layerElement = document.createElement('div');
                    layerElement.className = 'background-layer';
                    layerElement.style.position = 'absolute';
                    layerElement.style.top = '0';
                    layerElement.style.left = '0';
                    layerElement.style.width = '100%';
                    layerElement.style.height = '100%';
                    layerElement.style.mixBlendMode = layer.blendMode;
                    layerElement.style.opacity = layer.opacity;

                    if (layer.type === 'particles') {
                        this.createParticles(layer.particleCount, 5, 'circle', layer.animationType, layerElement, layer.particleColor, layer.particleSize);
                    } else if (layer.type === 'gradient') {
                        layerElement.style.background = `linear-gradient(45deg, ${layer.gradientColor1 || this.getRandomColor()}, ${layer.gradientColor2 || this.getRandomColor()})`;
                    }

                    this.elements.preview.appendChild(layerElement);
                });
            } catch (error) {
                console.error("Error rendering layers:", error);
            }
        },

        addLayer() {
            try {
                const layer = {
                    type: 'particles',
                    blendMode: 'normal',
                    opacity: 1,
                    particleColor: this.getRandomColor(),
                    particleCount: 50,
                    particleSize: 3,
                    animationType: 'float'
                };
                this.state.layers.push(layer);
                this.updateLayerControls();
                this.renderLayers();
            } catch (error) {
                console.error("Error adding layer:", error);
            }
        },

        initializeParticleInteraction() {
            try {
                this.state.mousePosition = { x: 0, y: 0 };
                this.elements.preview.addEventListener('mousemove', (e) => {
                    const rect = this.elements.preview.getBoundingClientRect();
                    this.state.mousePosition.x = e.clientX - rect.left;
                    this.state.mousePosition.y = e.clientY - rect.top;
                });
            
                this.elements.preview.addEventListener('mouseleave', () => {
                    this.state.mousePosition = { x: -1000, y: -1000 };  // Move mouse far away when it leaves
                });
            
                this.startParticleAnimation();
            } catch (error) {
                console.error("Error initializing particle interaction:", error);
            }
        },

        startParticleAnimation() {
            const animateParticles = () => {
                try {
                    const particles = this.elements.preview.querySelectorAll('.twinkle, .float');
                    const interactionMode = this.elements.interactionMode.value;
                    const interactionStrength = 5;  // Adjust this value to change the strength of interaction
            
                    particles.forEach((particle) => {
                        const rect = particle.getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;
            
                        const dx = this.state.mousePosition.x - x;
                        const dy = this.state.mousePosition.y - y;
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
                    } catch (error) {
                        console.error("Error in particle animation:", error);
                    }
                };
            
                animateParticles();
            },
    
            initializeAudioReactive() {
                try {
                    this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.state.analyser = this.state.audioContext.createAnalyser();
                    this.state.analyser.fftSize = 256;
                    this.state.bufferLength = this.state.analyser.frequencyBinCount;
                    this.state.dataArray = new Uint8Array(this.state.bufferLength);
                
                    this.elements.audioFile.addEventListener('change', (e) => this.handleAudioFile(e));
                    this.elements.useMicrophone.addEventListener('click', () => this.useMicrophone());
                    this.elements.stopAudio.addEventListener('click', () => this.stopAudio());
                
                    this.state.audioReactiveAnimation = null;
                } catch (error) {
                    console.error("Error initializing audio reactive features:", error);
                }
            },
    
            handleAudioFile(event) {
                try {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                
                    reader.onload = (e) => {
                        this.state.audioContext.decodeAudioData(e.target.result, (buffer) => {
                            if (this.state.audioSource) {
                                this.state.audioSource.disconnect();
                            }
                            this.state.audioSource = this.state.audioContext.createBufferSource();
                            this.state.audioSource.buffer = buffer;
                            this.state.audioSource.connect(this.state.analyser);
                            this.state.analyser.connect(this.state.audioContext.destination);
                            this.state.audioSource.start(0);
                            this.startAudioReactiveAnimation();
                        });
                    };
                
                    reader.readAsArrayBuffer(file);
                } catch (error) {
                    console.error("Error handling audio file:", error);
                }
            },
    
            useMicrophone() {
                try {
                    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                        .then((stream) => {
                            if (this.state.audioSource) {
                                this.state.audioSource.disconnect();
                            }
                            this.state.audioSource = this.state.audioContext.createMediaStreamSource(stream);
                            this.state.audioSource.connect(this.state.analyser);
                            this.startAudioReactiveAnimation();
                        })
                        .catch((err) => {
                            console.error('Error accessing microphone:', err);
                            alert('Failed to access microphone. Please check your settings and try again.');
                        });
                } catch (error) {
                    console.error("Error using microphone:", error);
                }
            },
    
            stopAudio() {
                try {
                    if (this.state.audioSource) {
                        this.state.audioSource.disconnect();
                    }
                    if (this.state.audioReactiveAnimation) {
                        cancelAnimationFrame(this.state.audioReactiveAnimation);
                    }
                } catch (error) {
                    console.error("Error stopping audio:", error);
                }
            },
    
            startAudioReactiveAnimation() {
                const animate = () => {
                    try {
                        this.state.analyser.getByteFrequencyData(this.state.dataArray);
                        this.updateBackgroundBasedOnAudio();
                        this.state.audioReactiveAnimation = requestAnimationFrame(animate);
                    } catch (error) {
                        console.error("Error in audio reactive animation:", error);
                    }
                };
                animate();
            },
    
            updateBackgroundBasedOnAudio() {
                try {
                    const mode = this.elements.audioReactiveMode.value;
                    const particles = this.elements.preview.querySelectorAll('.twinkle, .float');
                    
                    switch (mode) {
                        case 'particles':
                            this.updateParticleSizes(particles);
                            break;
                        case 'color':
                            this.updateBackgroundColor();
                            break;
                        case 'wave':
                            this.updateWaveForm(particles);
                            break;
                        default:
                            console.warn(`Unknown audio reactive mode: ${mode}`);
                    }
                } catch (error) {
                    console.error("Error updating background based on audio:", error);
                }
            },
    
            updateParticleSizes(particles) {
                try {
                    particles.forEach((particle, index) => {
                        const value = this.state.dataArray[index % this.state.bufferLength];
                        const scale = 1 + (value / 256) * 2;  // Scale between 1x and 3x
                        particle.style.transform = `scale(${scale})`;
                    });
                } catch (error) {
                    console.error("Error updating particle sizes:", error);
                }
            },
    
            updateBackgroundColor() {
                try {
                    const bassValue = this.state.dataArray[0];  // Low frequency
                    const midValue = this.state.dataArray[Math.floor(this.state.bufferLength / 2)];  // Mid frequency
                    const trebleValue = this.state.dataArray[this.state.bufferLength - 1];  // High frequency
                    
                    const color = `rgb(${bassValue}, ${midValue}, ${trebleValue})`;
                    this.elements.preview.style.backgroundColor = color;
                } catch (error) {
                    console.error("Error updating background color:", error);
                }
            },
    
            updateWaveForm(particles) {
                try {
                    particles.forEach((particle, index) => {
                        const value = this.state.dataArray[index % this.state.bufferLength];
                        const yPos = (value / 256) * 100;  // Convert to percentage
                        particle.style.top = `${yPos}%`;
                    });
                } catch (error) {
                    console.error("Error updating wave form:", error);
                }
            },
        };
    
        app.init();
    });
