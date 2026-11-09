/* AORUS K9 Optical SignalRGB plugin. Copyright (c) 2026 Igoryok95.
 * SPDX-License-Identifier: MIT
 * HID key names are SignalRGB identifiers required for LED painting.
 */
const language = "__LOCALE__";
const locales = {
    "en": {
        "name": "AORUS K9 Optical",
        "publisher": "Igoryok95",
        "source": "Lighting mode",
        "sourceHelp": "Use uniform SignalRGB effects or keyboard firmware animations. For static per-key painting, use a solid or paused canvas; colors are written once after they settle.",
        "uniform": "SignalRGB effect: uniform color",
        "solid": "Fixed uniform color",
        "perKey": "Static per-key colors",
        "hardwareWave": "Keyboard: rainbow wave",
        "hardwarePulse": "Keyboard: breathing",
        "hardwareRipple": "Keyboard: ripple on keypress",
        "hardwareReactive": "Keyboard: reactive keys",
        "off": "Off",
        "color": "Fixed / firmware color",
        "colorHelp": "Used by fixed color, breathing, ripple, and reactive effects.",
        "hardwareSpeed": "Firmware animation speed",
        "hardwareSpeedHelp": "Firmware effects run inside the keyboard independently of SignalRGB canvas animation.",
        "speedFast": "Fast",
        "speedSlow": "Slow",
        "shutdown": "Shutdown color",
        "shutdownHelp": "Applied when SignalRGB exits. Lights turn off when the system sleeps.",
        "ready": "K9 ready: uniform effects, static per-key colors, and firmware effects. Live per-key streaming is disabled.",
        "badAck": "K9 did not acknowledge command {command}.",
        "badRead": "K9 returned an incomplete color table.",
        "badWrite": "K9 did not accept a complete lighting packet.",
        "recovery": "Reconnecting K9 lighting after an error: {error}",
        "stats": "K9 update statistics",
        "metrics": "Log update statistics",
        "metricsHelp": "Log changed-frame counts and write durations every 10 seconds.",
        "logo": "AORUS logo"
    },
    "ru": {
        "name": "AORUS K9 Optical",
        "publisher": "Igoryok95",
        "source": "Режим подсветки",
        "sourceHelp": "Общий цвет SignalRGB или встроенные эффекты K9. Для раскраски отдельных клавиш выберите постоянный или приостановленный эффект: цвета записываются один раз после стабилизации.",
        "uniform": "Эффект SignalRGB: общий цвет",
        "solid": "Постоянный общий цвет",
        "perKey": "Поклавишная раскраска: статичные цвета",
        "hardwareWave": "Встроенная радуга клавиатуры",
        "hardwarePulse": "Встроенная пульсация клавиатуры",
        "hardwareRipple": "Встроенная волна от нажатия",
        "hardwareReactive": "Встроенная реакция нажатий",
        "off": "Выключено",
        "color": "Постоянный цвет / цвет встроенного эффекта",
        "colorHelp": "Используется для постоянного цвета, пульсации, волны и реакции нажатий.",
        "hardwareSpeed": "Скорость встроенной анимации",
        "hardwareSpeedHelp": "Эффект рассчитывается самой клавиатурой независимо от анимации холста SignalRGB.",
        "speedFast": "Быстро",
        "speedSlow": "Медленно",
        "shutdown": "Цвет при выходе",
        "shutdownHelp": "Применяется при закрытии SignalRGB. При переходе в сон подсветка выключается.",
        "ready": "K9 готова: общий цвет, статичная поклавишная раскраска и встроенные эффекты. Потоковая поклавишная анимация отключена.",
        "badAck": "K9 не подтвердила команду {command}.",
        "badRead": "K9 вернула неполную таблицу цветов.",
        "badWrite": "K9 не приняла полный пакет подсветки.",
        "recovery": "Повторное подключение подсветки K9 после ошибки: {error}",
        "stats": "Статистика обновлений K9",
        "metrics": "Записывать статистику обновлений",
        "metricsHelp": "Раз в 10 секунд записывает число изменившихся кадров и время их отправки.",
        "logo": "Логотип AORUS"
    }
};
function t(key, params = {}) {
    let result = locales[language][key] || key;
    for (const name of Object.keys(params)) result = result.split("{" + name + "}").join(String(params[name]));
    return result;
}

export function Name() { return t("name"); }
export function VendorId() { return 0x1044; }
export function ProductId() { return 0x7a35; }
export function Publisher() { return t("publisher"); }
export function Type() { return "hid"; }
export function DeviceType() { return "keyboard"; }
export function Size() { return [45, 14]; }
export function DefaultPosition() { return [10, 70]; }
export function DefaultScale() { return 5.0; }
export function Validate(endpoint) {
    return endpoint.interface === 0 && endpoint.usage_page === 0xff02 && endpoint.usage === 1;
}
export function ConflictingProcesses() { return ["AORUS.exe", "RGBFusion.exe", "OpenRGB.exe"]; }

const columns = [
    ["Esc", "`", "Tab", "Caps Lock", "Left Shift", "Left Ctrl"],
    [null, null, null, null, null, "Left Win"],
    ["F1", "1", "Q", "A", "Z", "Left Alt"],
    ["F2", "2", "W", "S", "X", null],
    ["F3", "3", "E", "D", "C", null],
    ["F4", "4", "R", "F", "V", "Space"],
    [null, "5", "T", "G", "B", null],
    ["F5", "6", "Y", "H", "N", null],
    ["F6", "7", "U", "J", "M", null],
    ["F7", "8", "I", "K", ",", null],
    ["F8", "9", "O", "L", ".", "Right Alt"],
    ["F9", "0", "P", ";", "/", "Win Lock"],
    ["F10", "-", "[", "'", null, null],
    ["F11", "=", "]", null, null, "Fn"],
    ["F12", "Backspace", "\\", "Enter", "Right Shift", "Right Ctrl"],
    ["Print Screen", "Insert", "Del", null, null, "Left Arrow"],
    ["Scroll Lock", "Home", "End", null, "Up Arrow", "Down Arrow"],
    ["Pause Break", "Page Up", "Page Down", null, null, "Right Arrow"],
    [null, "NumLock", "Num 7", "Num 4", "Num 1", "Num 0"],
    [null, "Num /", "Num 8", "Num 5", "Num 2", null],
    [null, "Num *", "Num 9", "Num 6", "Num 3", "Num ."],
    [null, "Num -", null, "Num +", null, "Num Enter"]
];
const keys = [];
for (let column = 0; column < columns.length; column++) {
    for (let row = 0; row < 6; row++) {
        const name = columns[column][row];
        if (name) keys.push({name, slot: column * 6 + row, position: [column * 2, row === 0 ? 0 : row * 2 + 2]});
    }
}
keys.push({name: t("logo"), slot: 108, position: [40, 0]});
export function LedNames() { return keys.map(key => key.name); }
export function LedPositions() { return keys.map(key => key.position); }

const modes = ["uniform", "solid", "perKey", "hardwareWave", "hardwarePulse", "hardwareRipple", "hardwareReactive", "off"];
const firmwareModes = {hardwareWave: 3, hardwarePulse: 2, hardwareRipple: 6, hardwareReactive: 7};

export function ControllableParameters() {
    return [
        {property: "LightingMode", group: "lighting", label: t("source"), description: t("sourceHelp"), type: "combobox", values: modes.map(mode => t(mode)), default: t("uniform")},
        {property: "forcedColor", group: "lighting", label: t("color"), description: t("colorHelp"), type: "color", min: "0", max: "360", default: "#009bde"},
        {property: "hardwareSpeed", group: "lighting", label: t("hardwareSpeed"), description: t("hardwareSpeedHelp"), type: "combobox", values: [t("speedFast"), t("speedSlow")], default: t("speedSlow")},
        {property: "shutdownColor", group: "lighting", label: t("shutdown"), description: t("shutdownHelp"), type: "color", min: "0", max: "360", default: "#000000"},
        {property: "debugMetrics", group: "settings", label: t("metrics"), description: t("metricsHelp"), type: "boolean", default: "0"}
    ];
}

let colorTable = null;
let lastData = null;
let hardwareMode = null;
let connected = false;
let retryAt = 0;
let lastFrameAt = 0;
let staticCandidate = null;
let candidateSince = 0;
let lastTableWriteAt = -1000;
let statsAt = 0;
let sentFrames = 0;
let sentMilliseconds = 0;
let maxWriteMilliseconds = 0;

function setting(name, fallback) {
    if (name === "LightingMode") return typeof LightingMode === "undefined" ? fallback : LightingMode;
    if (name === "forcedColor") return typeof forcedColor === "undefined" ? fallback : forcedColor;
    if (name === "hardwareSpeed") return typeof hardwareSpeed === "undefined" ? fallback : hardwareSpeed;
    if (name === "shutdownColor") return typeof shutdownColor === "undefined" ? fallback : shutdownColor;
    if (name === "debugMetrics") return typeof debugMetrics === "undefined" ? fallback : debugMetrics;
    return fallback;
}
function activeMode() {
    const selected = setting("LightingMode", t("uniform"));
    return modes.find(mode => t(mode) === selected) || "uniform";
}
function featurePacket(command, values = []) {
    const packet = [0, command].concat(values);
    while (packet.length < 8) packet.push(0);
    if (packet.length !== 8) throw new Error(t("badWrite"));
    packet.push((255 - packet.reduce((sum, value) => sum + value, 0)) & 255);
    return packet;
}
function sendFeature(command, values = [], acknowledge = true) {
    const result = device.send_report(featurePacket(command, values), 9);
    if (typeof result === "number" && result < 0) throw new Error(t("badWrite"));
    if (!acknowledge) return;
    device.pause(100);
    const deadline = Date.now() + 250;
    do {
        const response = device.get_report([0], 9);
        if (response && response.length >= 9 && response[1] === command) return;
        device.pause(2);
    } while (Date.now() < deadline);
    throw new Error(t("badAck", {command: command.toString(16)}));
}
function readTable() {
    sendFeature(0x82);
    sendFeature(0x92, [0, 0, 8]);
    const data = [];
    for (let chunk = 0; chunk < 8; chunk++) {
        // SignalRGB includes the zero report ID in its input arrays and byte count.
        const packet = device.read([], 65, 250);
        if (!packet || device.getLastReadSize() !== 65 || packet.length < 65 || packet[0] !== 0) throw new Error(t("badRead"));
        data.push(...packet.slice(1, 65));
    }
    return data;
}
function writeTable(data) {
    sendFeature(0x12, [0, 0, 8]);
    for (let chunk = 0; chunk < 8; chunk++) {
        const result = device.write([0].concat(data.slice(chunk * 64, (chunk + 1) * 64)), 65);
        if (typeof result === "number" && result < 0) throw new Error(t("badWrite"));
        device.pause(5);
    }
    sendFeature(0x08, [0, 0x33, 0x0b, 0x1e, 1, 1]);
    hardwareMode = "keys";
    colorTable = data.slice();
    lastData = data.slice();
    lastTableWriteAt = Date.now();
}
function enterUniformMode() {
    // Captured static/off setup stops any running firmware animation.
    sendFeature(0x14, [0, 6, 0, 0, 0, 0]);
    sendFeature(0x08, [0, 1, 0x0a, 0x1e, 6, 0]);
    hardwareMode = "uniform";
}
function writeUniform(rgb) {
    if (hardwareMode !== "uniform") enterUniformMode();
    sendFeature(0x20, [0, 0, rgb[0], rgb[1], rgb[2], 0], false);
    lastData = rgb.slice();
}
function writeHardware(mode) {
    const rgb = mode === "hardwareWave" ? [255, 0, 0] : hexToRgb(setting("forcedColor", "#009bde"));
    const speed = setting("hardwareSpeed", t("speedSlow")) === t("speedFast") ? 3 : 8;
    const brightness = Math.round(30 * Math.max(0, Math.min(100, device.getBrightness())) / 100);
    const signature = [mode, speed, brightness].concat(rgb);
    if (equal(lastData, signature) && hardwareMode === "firmware") return false;
    sendFeature(0x14, [0, 6, rgb[0], rgb[1], rgb[2], 0]);
    sendFeature(0x08, [0, firmwareModes[mode], speed, brightness, 6, mode === "hardwareWave" ? 2 : 0]);
    hardwareMode = "firmware";
    lastData = signature;
    return true;
}
function hexToRgb(hex) {
    const value = String(hex).replace(/^#/, "");
    if (!/^[0-9a-f]{6}$/i.test(value)) return [0, 0, 0];
    return [0, 2, 4].map(offset => parseInt(value.slice(offset, offset + 2), 16));
}
function forcedRgb(hex) {
    const brightness = Math.max(0, Math.min(100, device.getBrightness())) / 100;
    return hexToRgb(hex).map(value => Math.round(value * brightness));
}
function buildTable() {
    const data = colorTable.slice();
    for (const key of keys) {
        const color = device.color(key.position[0], key.position[1]);
        for (let channel = 0; channel < 3; channel++) data[key.slot * 3 + channel] = color[channel];
    }
    return data;
}
function equal(a, b) { return a !== null && a.length === b.length && a.every((value, index) => value === b[index]); }
function resetFrameState() {
    lastData = null;
    staticCandidate = null;
    candidateSince = 0;
    lastFrameAt = 0;
    device.setFrameRateTarget(activeMode() === "uniform" ? 120 : 10);
}
export function onLightingModeChanged() { resetFrameState(); }
export function onBrightnessChanged() { staticCandidate = null; candidateSince = 0; lastData = null; }

function recordFailure(error) {
    connected = false;
    hardwareMode = null;
    lastData = null;
    retryAt = Date.now() + 5000;
    device.log(t("recovery", {error: String(error)}), {toFile: true});
}
export function Initialize() {
    connected = false;
    try {
        device.pause(300);
        colorTable = readTable();
        hardwareMode = null;
        connected = true;
        resetFrameState();
        statsAt = Date.now();
        sentFrames = 0;
        sentMilliseconds = 0;
        maxWriteMilliseconds = 0;
        device.log(t("ready"), {toFile: true});
    } catch (error) { recordFailure(error); }
}
export function Render() {
    if (!connected) {
        if (Date.now() < retryAt) return;
        Initialize();
        if (!connected) return;
    }
    const mode = activeMode();
    if (mode === "uniform") {
        const remaining = lastFrameAt + 1000 / 60 - Date.now();
        if (remaining > 0) device.pause(Math.ceil(remaining));
    }
    const started = Date.now();
    lastFrameAt = started;
    let written = false;
    try {
        if (firmwareModes[mode] !== undefined) written = writeHardware(mode);
        else if (mode === "perKey") {
            if (hardwareMode !== "keys") {
                writeTable(colorTable);
                written = true;
            }
            const data = buildTable();
            if (!equal(staticCandidate, data)) {
                staticCandidate = data;
                candidateSince = Date.now();
            } else if (Date.now() - candidateSince >= 500 && Date.now() - lastTableWriteAt >= 1000 && !equal(lastData, data)) {
                writeTable(data);
                written = true;
            }
        } else {
            // A single point preserves the effect's gamut; a spatial average does not.
            const rgb = mode === "off" ? [0, 0, 0] : mode === "solid" ? forcedRgb(setting("forcedColor", "#009bde")) : device.color(22, 6);
            if (hardwareMode !== "uniform" || !equal(lastData, rgb)) {
                writeUniform(rgb);
                written = true;
            }
        }
        if (written) {
            const elapsed = Date.now() - started;
            sentFrames++;
            sentMilliseconds += elapsed;
            maxWriteMilliseconds = Math.max(maxWriteMilliseconds, elapsed);
        }
        if (Date.now() - statsAt >= 10000) {
            const metrics = setting("debugMetrics", false);
            if (metrics === true || metrics === 1 || metrics === "1") device.log(JSON.stringify({message: t("stats"), mode, frames: sentFrames, elapsed_ms: Date.now() - statsAt, mean_write_ms: sentFrames ? sentMilliseconds / sentFrames : 0, max_write_ms: maxWriteMilliseconds}), {toFile: true});
            statsAt = Date.now();
            sentFrames = 0;
            sentMilliseconds = 0;
            maxWriteMilliseconds = 0;
        }
    } catch (error) { recordFailure(error); }
}
export function Shutdown(systemSuspending) {
    if (!connected) return;
    try {
        const color = systemSuspending ? [0, 0, 0] : hexToRgb(setting("shutdownColor", "#000000"));
        if (hardwareMode === "firmware") enterUniformMode();
        sendFeature(0x20, [0, 0, color[0], color[1], color[2], 0], false);
    } catch (error) { device.log(t("recovery", {error: String(error)}), {toFile: true}); }
    connected = false;
}
