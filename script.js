document.addEventListener('DOMContentLoaded', function() {
    // Color configurations
    const colors = [
        { id: 'red',    name: 'Red',    rgb: { r: 255, g: 0,   b: 0   }, glow: '0 0 15px 5px rgba(255, 0, 0, 0.7)' },
        { id: 'orange', name: 'Orange', rgb: { r: 255, g: 165, b: 0   }, glow: '0 0 15px 5px rgba(255, 165, 0, 0.7)' },
        { id: 'yellow', name: 'Yellow', rgb: { r: 255, g: 255, b: 0   }, glow: '0 0 15px 5px rgba(255, 255, 0, 0.7)' },
        { id: 'green',  name: 'Green',  rgb: { r: 0,   g: 255, b: 0   }, glow: '0 0 15px 5px rgba(0, 255, 0, 0.7)' },
        { id: 'blue',   name: 'Blue',   rgb: { r: 0,   g: 0,   b: 255 }, glow: '0 0 15px 5px rgba(0, 0, 255, 0.7)' },
        { id: 'indigo', name: 'Indigo', rgb: { r: 75,  g: 0,   b: 130 }, glow: '0 0 15px 5px rgba(75, 0, 130, 0.7)' },
        { id: 'violet', name: 'Violet', rgb: { r: 238, g: 130, b: 238 }, glow: '0 0 15px 5px rgba(238, 130, 238, 0.7)' }
    ];

    // Cache DOM elements
    const elements = {
        surface: document.querySelector('.surface'),
        resultDisplay: document.getElementById('result-display'),
        toggles: {},
        beams: {}
    };

    // Initialize elements
    colors.forEach(color => {
        elements.toggles[color.id] = document.getElementById(`${color.id}-toggle`);
        elements.beams[color.id] = {
            incoming: document.getElementById(`in-${color.id}`),
            reflected: document.getElementById(`out-${color.id}`)
        };
    });

    // State management
    const state = {
        activeColors: colors.map(c => c.id), // Semua warna aktif awal
        lastUpdate: 0,
        frameRate: 30 // 30 FPS untuk animasi halus
    };

    // Event listeners with debouncing
    colors.forEach(color => {
        elements.toggles[color.id].addEventListener('change', () => {
            const now = Date.now();
            if (now - state.lastUpdate > 1000 / state.frameRate) {
                state.lastUpdate = now;
                state.activeColors = colors
                    .filter(c => elements.toggles[c.id].checked)
                    .map(c => c.id);
                updateSimulation();
            }
        });
    });

    // Main function
    function updateSimulation() {
        updateBeams();
        updateSurface();
        updateResultDisplay();
    }

    function updateBeams() {
        colors.forEach(color => {
            const isActive = state.activeColors.includes(color.id);
            elements.beams[color.id].reflected.style.opacity = isActive ? '0.8' : '0';
            elements.beams[color.id].reflected.style.boxShadow = isActive ? color.glow : 'none';
        });
    }

    function updateSurface() {
        // Reset surface
        elements.surface.className = 'surface';
        elements.surface.style.cssText = '';
        
        const activeColors = colors.filter(c => state.activeColors.includes(c.id));
        const count = activeColors.length;

        // If all colors are reflected or no colors at all
        if (count === colors.length) {
            elements.surface.classList.add('white');
            return;
        }
        if (count === 0) {
            elements.surface.classList.add('black');
            return;
        }

        // Hitung warna campuran
        const mixedColor = activeColors.reduce((acc, color) => {
            acc.r += color.rgb.r;
            acc.g += color.rgb.g;
            acc.b += color.rgb.b;
            return acc;
        }, { r: 0, g: 0, b: 0 });

        mixedColor.r = Math.round(mixedColor.r / count);
        mixedColor.g = Math.round(mixedColor.g / count);
        mixedColor.b = Math.round(mixedColor.b / count);

        // Efek kek pendar-pendar
        const colorStr = `rgb(${mixedColor.r},${mixedColor.g},${mixedColor.b})`;
        elements.surface.style.backgroundColor = colorStr;
        elements.surface.style.boxShadow = `0 0 25px 10px rgba(${mixedColor.r},${mixedColor.g},${mixedColor.b},0.5)`;
        
        // Transition
        elements.surface.style.transition = 'background-color 0.3s, box-shadow 0.3s';
    }

    function updateResultDisplay() {
        const activeColors = colors.filter(c => state.activeColors.includes(c.id));
        const count = activeColors.length;
        
        if (count === colors.length) {
            elements.resultDisplay.textContent = 'All colors reflected (White Light)';
            elements.resultDisplay.style.cssText = 'background-color: white; color: black;';
            return;
        }
        if (count === 0) {
            elements.resultDisplay.textContent = 'All colors absorbed (Black)';
            elements.resultDisplay.style.cssText = 'background-color: black; color: white;';
            return;
        }

        const mixedColor = activeColors.reduce((acc, color) => {
            acc.r += color.rgb.r;
            acc.g += color.rgb.g;
            acc.b += color.rgb.b;
            return acc;
        }, { r: 0, g: 0, b: 0 });

        const colorStr = `rgb(${
            Math.round(mixedColor.r / count)
        },${
            Math.round(mixedColor.g / count)
        },${
            Math.round(mixedColor.b / count)
        })`;

        // Text contrast
        const brightness = (mixedColor.r * 299 + mixedColor.g * 587 + mixedColor.b * 114) / (1000 * count);
        const textColor = brightness > 0.5 ? 'black' : 'white';

        elements.resultDisplay.textContent = `Reflecting: ${activeColors.map(c => c.name).join(', ')}`;
        elements.resultDisplay.style.cssText = `
            background-color: ${colorStr};
            color: ${textColor};
            box-shadow: 0 0 15px 5px ${colorStr.replace(')', ', 0.5)')};
            transition: all 0.3s ease;
        `;
    }

    // Initialization
    colors.forEach(color => {
        elements.toggles[color.id].checked = true;
    });
    updateSimulation();
});