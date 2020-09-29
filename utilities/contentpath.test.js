const constructContentPath = require('./contentpath');

test('No input returns root', () => {
    expect(constructContentPath()).toBe('/')
});

test('Root returns root', () => {
    expect(constructContentPath('/')).toBe('/')
});

test('One value results in one path dir', () => {
    expect(constructContentPath('ketchup')).toBe('/ketchup/')
});

test('Two values result in two path dirs', () => {
    expect(constructContentPath('ketchup', 'mustard')).toBe('/ketchup/mustard/')
});