// Script to replace all hardcoded localhost URLs with API_URL config
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

const replacements = files.map(file => {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if file has localhost:3000
    if (content.includes('localhost:3000')) {
        // Add import if not present
        if (!content.includes("import API_URL from '../config'")) {
            const importMatch = content.match(/^(import .+\n)+/m);
            if (importMatch) {
                const lastImport = importMatch[0];
                content = content.replace(lastImport, lastImport + "import API_URL from '../config'\n");
                modified = true;
            }
        }

        // Replace all localhost:3000 URLs
        content = content.replace(/['"]http:\/\/localhost:3000/g, '`${API_URL}');
        content = content.replace(/\$\{API_URL\}([^`]+)`/g, (match, path) => {
            return `\${API_URL}${path}\``;
        });
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return file;
    }
    return null;
}).filter(Boolean);

console.log('Updated files:', replacements);
console.log(`Total: ${replacements.length} files updated`);
