const db = require('./db');


describe('Check for parameters ', () => {
  test('Save: Empty params', () => {
    return expect(db.save()).rejects.toThrow('db.save: Missing parameters');
  });
  test('Load: Empty params', () => {
    return expect(db.load()).rejects.toThrow('db.load: Missing parameters');
  });
  test('Update: Empty params', () => {
    return expect(db.update()).rejects.toThrow('db.update: Missing parameters');
  });
  test('Delete: Empty params', () => {
    return expect(db.delete()).rejects.toThrow('db.delete: Missing parameters');
  });
});
