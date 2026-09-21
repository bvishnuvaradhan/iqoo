const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('d:/IQOO/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Revert any of the broken strings to proper backticks
  content = content.replace(/\`\"http:\/\/\$\{window\.location\.hostname\}:8000\`\"/g, '`http://${window.location.hostname}:8000`');
  content = content.replace(/\"http:\/\/\$\{window\.location\.hostname\}:8000\'/g, '`http://${window.location.hostname}:8000`');
  // Also just in case there are any original ones left
  content = content.replace(/'http:\/\/localhost:8000'/g, '`http://${window.location.hostname}:8000`');
  content = content.replace(/"http:\/\/localhost:8000"/g, '`http://${window.location.hostname}:8000`');
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed URLs');
