const fs = require('fs');
const path = require('path');

const adSnippet = `
<div style="text-align: center; margin: 20px auto; width: 100%; display: flex; justify-content: center;">
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

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    
    // Inject at the top: after </header> or </h1>
    if (content.includes('</header>')) {
        content = content.replace('</header>', '</header>' + adSnippet);
    } else if (content.includes('</h1>')) {
        content = content.replace('</h1>', '</h1>' + adSnippet);
    }

    // Inject at the bottom: before <footer> or </body>
    if (content.includes('<footer>')) {
        content = content.replace('<footer>', adSnippet + '<footer>');
    } else if (content.includes('</body>')) {
        content = content.replace('</body>', adSnippet + '</body>');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated: ' + filePath);
    } else {
        console.log('Skipped (no injection points found): ' + filePath);
    }
}

const htmlFiles = findHtmlFiles(process.cwd());
for (const file of htmlFiles) {
    processFile(file);
}

console.log('Finished processing HTML files.');
