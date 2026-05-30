const fs = require('fs');
const content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');
const tag = (t) => (content.match(new RegExp(t, 'g')) || []).length;
console.log('<div count:', tag('<div'));
console.log('</div> count:', tag('</div>'));
