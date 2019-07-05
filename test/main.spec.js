const { SvgBlob } = require('../src/main');

describe('SvgBlob', () => {
    document.body.innerHTML =
    '<div>' +
    '  <span id="username" />' +
    '  <button id="button" />' +
    '</div>';
    
    it('creates correctly', () => {
        const a = new SvgBlob('div');
        expect(a).toBe(0);
    });
});