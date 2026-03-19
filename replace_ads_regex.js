const fs = require('fs');
const path = require('path');

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

// Regex to match the old snippet regardless of whitespace/newlines
const adRegex = /<div style="text-align: center; margin: 20px auto; width: 100%; display: flex; justify-content: center;">\s*<script>\s*atOptions = \{\s*'key'\s*:\s*'afeda7cc33106ef3c1c5eb0182d19b54',\s*'format'\s*:\s*'iframe',\s*'height'\s*:\s*250,\s*'width'\s*:\s*300,\s*'params'\s*:\s*\{\}\s*\};\s*<\/script>\s*<script src="https:\/\/www\.highperformanceformat\.com\/afeda7cc33106ef3c1c5eb0182d19b54\/invoke\.js"><\/script>\s*<\/div>/g;

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
    if (adRegex.test(content)) {
        content = content.replace(adRegex, newAdSnippet);
        fs.writeFileSync(file, content, 'utf-8');
        console.log('Regex Updated: ' + file);
        updateCount++;
    } else {
        console.log('Skipped (no match): ' + file);
    }
}

console.log('Finished regex updating. Total files updated: ' + updateCount);
