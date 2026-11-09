import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

for (const language of ['en', 'ru']) {
    const suffix = language === 'en' ? '' : '.ru';
    const source = fs.readFileSync(new URL('../dist/AORUS_K9_SignalRGB' + suffix + '.js', import.meta.url), 'utf8');
    let clock = 1000, lastCommand = 0, readOffset = 0, writeOffset = 0, outputReports = 0, frameRate = 0;
    let table = Array(512).fill(0), preparing, canvas = [120, 80, 40], brightness = 50;
    table[511] = 0xa5;
    preparing = table.slice();
    const packets = [], painted = new Map();
    let sampleOverride = null;
    const context = vm.createContext({Date: {now: () => clock}, device: {
        send_report(packet, length) {
            assert.equal(length, 9); assert.equal(packet.length, 9); assert.equal(packet[0], 0);
            assert.equal(packet.reduce((sum, value) => sum + value, 0) & 255, 255);
            lastCommand = packet[1];
            if (lastCommand === 0x92) readOffset = 0;
            if (lastCommand === 0x12) {writeOffset = 0; preparing = table.slice();}
            packets.push(Array.from(packet)); return 9;
        },
        get_report() {return [0, lastCommand, 0, 0, 0, 0, 0, 0, 0];},
        pause(ms) {clock += ms;},
        read(_, length) {assert.equal(length, 65); const data = [0, ...table.slice(readOffset, readOffset + 64)]; readOffset += 64; return data;},
        getLastReadSize() {return 65;},
        write(packet, length) {
            assert.equal(length, 65); assert.equal(packet.length, 65); assert.equal(packet[0], 0);
            for (let i = 0; i < 64; i++) preparing[writeOffset + i] = packet[i + 1];
            writeOffset += 64; outputReports++;
            if (writeOffset === 512) table = preparing.slice();
            return 65;
        },
        getBrightness() {return brightness;},
        color(x, y) {
            assert.ok(x >= 0 && x < 45 && y >= 0 && y < 14);
            return sampleOverride ? sampleOverride(x, y) : painted.get(x + ',' + y) || canvas;
        },
        setFrameRateTarget(fps) {frameRate = fps;}, log() {}
    }});
    const module = new vm.SourceTextModule(source, {context});
    await module.link(() => {throw new Error('Unexpected external import');}); await module.evaluate();
    const plugin = module.namespace;
    assert.equal(plugin.Publisher(), 'Igoryok95'); assert.equal(plugin.VendorId(), 0x1044); assert.equal(plugin.ProductId(), 0x7a35);
    assert.equal(plugin.Validate({interface: 0, usage_page: 0xff02, usage: 1}), true);
    assert.equal(plugin.Validate({interface: 2, usage_page: 1, usage: 6}), false);
    const names = Array.from(plugin.LedNames()), positions = Array.from(plugin.LedPositions(), value => Array.from(value));
    assert.equal(names.length, 105); assert.equal(new Set(names).size, 105);
    assert.equal(new Set(positions.map(value => value.join(','))).size, 105);
    assert.ok(names.includes('Fn') && names.includes('Win Lock'));
    const image = Buffer.from(plugin.ImageUrl().split(',')[1], 'base64');
    assert.equal(image.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(image.readUInt32BE(16), 1000); assert.equal(image.readUInt32BE(20), 1000); assert.equal(image[25], 6);
    const params = Array.from(plugin.ControllableParameters());
    for (const parameter of params) context[parameter.property] = parameter.default;
    const values = params.find(parameter => parameter.property === 'LightingMode').values;
    const tick = () => {clock += 100; plugin.Render();};
    const selectMode = index => {context.LightingMode = values[index]; plugin.onLightingModeChanged(); tick();};
    plugin.Initialize(); assert.equal(frameRate, 120); plugin.Render();
    assert.equal(packets.at(-1)[1], 0x20); assert.equal(outputReports, 0);

    sampleOverride = (x, y) => x === 22 && y === 6 ? [255, 0, 0] : [0, 255, 255]; tick();
    assert.deepEqual(packets.at(-1), [0, 0x20, 0, 0, 255, 0, 0, 0, 0xe0]); sampleOverride = null;
    tick(); const afterChange = packets.length; tick(); assert.equal(packets.length, afterChange);
    context.forcedColor = '#00ff00'; selectMode(1);
    assert.deepEqual(packets.at(-1), [0, 0x20, 0, 0, 0, 128, 0, 0, 0x5f]);

    selectMode(2); assert.equal(frameRate, 10);
    for (let i = 0; i < 15; i++) tick();
    for (const slot of [0, 15, 20, 21, 27, 95, 100, 101, 107]) assert.deepEqual(table.slice(slot * 3, slot * 3 + 3), canvas);
    const beforePaint = outputReports; painted.set('6,6', [0, 255, 0]);
    for (let i = 0; i < 15; i++) tick();
    assert.equal(outputReports - beforePaint, 8);
    assert.deepEqual(table.slice(60, 63), [0, 255, 0]); assert.deepEqual(table.slice(45, 48), canvas);
    assert.equal(table[511], 0xa5);
    const beforeAnimation = outputReports;
    for (let i = 0; i < 40; i++) {canvas = [i + 1, 40, 80]; tick();}
    assert.equal(outputReports, beforeAnimation);
    for (let i = 0; i < 15; i++) tick(); assert.equal(outputReports - beforeAnimation, 8);

    for (const [index, value] of [[3, 3], [4, 2], [5, 6], [6, 7]]) {
        selectMode(index);
        assert.deepEqual(packets.at(-1).slice(1, 8), [8, 0, value, 8, 15, 6, value === 3 ? 2 : 0]);
        const count = packets.length; for (let i = 0; i < 10; i++) tick(); assert.equal(packets.length, count);
    }
    selectMode(7); assert.deepEqual(packets.at(-1), [0, 0x20, 0, 0, 0, 0, 0, 0, 0xdf]);
    context.shutdownColor = '#ffffff'; plugin.Shutdown(true);
    assert.deepEqual(packets.at(-1), [0, 0x20, 0, 0, 0, 0, 0, 0, 0xdf]);
    console.log('PASS [' + language + ']: HID isolation, packets, image, gamut, static painting, animation suppression, four firmware effects, brightness, shutdown');
}
