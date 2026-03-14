const fs = require('fs');
const path = require('path');

const oldAdSnippet = `
<div style="text-align: center; margin: 20px auto; width: 100%; display: flex; justify-content: center;">
<script>
  atOptions = {
    'key' : 'afeda7cc33106ef3c1c5eb0182d19b54',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/afeda7cc33106ef3c1c5eb0182d19b54/invoke.js"></script>
</div>
`;

// It has the same number of newlines initially to exact-match the replacement
const newAdSnippet = `
<div style="text-align: center; margin: 20px auto; width: 100%; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
  <div>
    <script>
      atOptions = {
        'key' : 'afeda7cc33106ef3c1c5eb0182d19b54',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/afeda7cc33106ef3c1c5eb0182d19b54/invoke.js"></script>
  </div>
  <div>
    <script>
      atOptions = {
        'key' : 'afeda7cc33106ef3c1c5eb0182d19b54',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/afeda7cc33106ef3c1c5eb0182d19b54/invoke.js"></script>
  </div>
  <div>
    <script>
      atOptions = {
        'key' : 'afeda7cc33106ef3c1c5eb0182d19b54',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/afeda7cc33106ef3c1c5eb0182d19b54/invoke.js"></script>
  </div>
  <div>
    <script>
      atOptions = {
        'key' : 'afeda7cc33106ef3c1c5eb0182d19b54',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/afeda7cc33106ef3c1c5eb0182d19b54/invoke.js"></script>
  </div>
</div>
`;

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = findHtmlFiles(process.cwd());
let updateCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes(oldAdSnippet)) {
    content = content.split(oldAdSnippet).join(newAdSnippet);
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Updated: ' + file);
    updateCount++;
  } else {
    console.log('Skipped (no match): ' + file);
  }
}

console.log('Finished updating ad placements. Total files updated: ' + updateCount);
