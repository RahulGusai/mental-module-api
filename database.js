const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE company_codes (id INTEGER PRIMARY KEY, code TEXT)');
  db.run('INSERT INTO company_codes (code) VALUES (?)', 'random321');
});

module.exports = db;
