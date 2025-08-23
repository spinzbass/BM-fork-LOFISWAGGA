/** Updates the version number in the metadata.
 * This updates the version number in the metadata to the version specified in package.json.
 * @since 0.0.6
*/

import fs from 'fs';
import { consoleStyle } from './utils.js';

console.log(`${consoleStyle.BLUE}Starting update-version...${consoleStyle.RESET}`);

// Get the current version number
const manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf-8'))
const currVersion = manifest.version

console.log(`${consoleStyle.GREEN}Read version from manifest.json.${consoleStyle.RESET} Version: ${consoleStyle.MAGENTA}${currVersion}${consoleStyle.RESET}`)

// Update the version number
const versionNums = manifest.version.split('.'); // Split the version numbers into individual strings
const lastSegment = versionNums[versionNums.length-1].split("-"); // Other than numbers, the version can optionally end with a hyphen and identifier
lastSegment[0] = Number(lastSegment[0])+1;  // Add one to the last version number position
versionNums[versionNums.length-1] = lastSegment.join("-") // Join the last number and identifier back into one string
manifest.version = versionNums.join('.'); // Combine the version numbers back into a whole string

fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest));
console.log(`${consoleStyle.GREEN}Updated userscript version.${consoleStyle.RESET} Version: ${consoleStyle.MAGENTA}${manifest.version}${consoleStyle.RESET}`);