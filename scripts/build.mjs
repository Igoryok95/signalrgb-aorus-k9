import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'src/AORUS_K9.js'), 'utf8');
const png = fs.readFileSync(path.join(root, 'assets/aorus-k9.png')).toString('base64');
fs.mkdirSync(path.join(root, 'dist'), {recursive: true});
for (const language of ['en', 'ru']) {
    const suffix = language === 'en' ? '' : '.ru';
    const result = source.replace('"__LOCALE__"', JSON.stringify(language))
        + '\nexport function ImageUrl() { return "data:image/png;base64,' + png + '"; }\n';
    const output = path.join(root, 'dist', 'AORUS_K9_SignalRGB' + suffix + '.js');
    fs.writeFileSync(output, result, 'utf8');
    console.log('Built ' + path.relative(root, output));
}
