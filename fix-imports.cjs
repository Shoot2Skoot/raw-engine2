const fs = require('fs');
const path = require('path');

const types = [
  'GameConfig', 'Sheet', 'GridLayout', 'Position', 'ImageLayout', 'Hotspot', 'Mark',
  'Tool', 'CheckboxMark', 'NumberMark', 'ColorMark', 'CircleMark', 'SymbolMark',
  'TextMark', 'GameState', 'DiceState', 'CardState', 'ActionHistory', 'GameAction',
  'MarkConstraints', 'Rectangle', 'Circle', 'Polygon', 'HotspotShape', 'MarkType'
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  types.forEach(type => {
    const regex1 = new RegExp(`import \\{ (${type}[^}]*) \\}`, 'g');
    const regex2 = new RegExp(`import \\{ ([^}]*${type}[^}]*) \\}`, 'g');

    // Check if we need to fix this import
    if (content.match(regex1) && !content.includes(`import type { ${type}`)) {
      content = content.replace(regex1, `import type { $1 }`);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fixFile(filePath);
    }
  });
}

walkDir('./src');
console.log('Done!');
