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
  // Match "http://${window.location.hostname}:8000... ending with single quote '
  content = content.replace(/"http:\/\/\$\{window\.location\.hostname\}:8000([^']*)'/g, '`http://${window.location.hostname}:8000$1`');
  
  // Just in case it ends with a double quote (e.g. from a different iteration)
  content = content.replace(/"http:\/\/\$\{window\.location\.hostname\}:8000([^"]*)"/g, '`http://${window.location.hostname}:8000$1`');

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed URLs pass 2');
