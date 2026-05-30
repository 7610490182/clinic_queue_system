const fs = require('fs');
const text = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');
const count = (s) => (text.match(new RegExp(s, 'g')) || []).length;
console.log('braces', count('{'), count('}'), 'parens', count('\\('), count('\\)'), 'brackets', count('\\['), count('\\]'));