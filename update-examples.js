"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const del = require("del");
const fs = require("fs");
const path = require("path");
const util = require("util");
const glob = require("glob");
async function deleteFiles(destFolder, destGlob) {
    try {
        const deletedFiles = await del(path.join(destFolder, destGlob), { force: true });
        deletedFiles.forEach(file => {
            console.log(`Deleted: ${file}`);
        });
    }
    catch (err) {
        console.error("Error Deleting Files", err);
    }
}
async function copyFiles(srcFolder, srcFilesGlob, destFolder, destExt, additionalReplacements) {
    try {
        const globAsync = util.promisify(glob);
        const files = await globAsync(path.join(srcFolder, srcFilesGlob));
        files.forEach(async (file) => {
            await copyFile(srcFolder, file.replace(srcFolder, ""), destFolder, destExt, additionalReplacements);
        });
    }
    catch (err) {
        console.error("Error Copying Files", err);
    }
}
async function copyFile(srcFolder, srcFile, destFolder, destExt, additionalReplacements) {
    try {
        console.log(`Copying: ${srcFile}`);
        const readFileAsync = util.promisify(fs.readFile);
        const writeFileAsync = util.promisify(fs.writeFile);
        const contentBuffer = await readFileAsync(path.join(srcFolder, srcFile));
        let content = contentBuffer.toString();
        if (additionalReplacements) {
            Object.keys(additionalReplacements)
                .forEach(key => {
                content = content.replace(new RegExp(key, "g"), additionalReplacements[key]);
            });
        }
        await writeFileAsync(path.join(destFolder, srcFile.replace(".ts", destExt)), content);
    }
    catch (err) {
        console.error(err);
    }
}
async function doAll() {
    const palReplacement = {
        "import { PAL } from \"@iota-pico/pal-nodejs/dist/pal\";": "import { PAL } from \"@iota-pico/pal-browser/dist/pal\";"
    };
    await deleteFiles("../iota-pico-api-examples-browser/src/", "**/*.ts");
    await copyFiles("../iota-pico-api-examples-nodejs/src/api/", "**/!(*.d).ts", "../iota-pico-api-examples-browser/src/api", ".ts", palReplacement);
    await copyFiles("../iota-pico-api-examples-nodejs/src/", "networkConfig.ts", "../iota-pico-api-examples-browser/src", ".ts");
    await copyFiles("../iota-pico-api-examples-nodejs/src/", "typings.d.ts", "../iota-pico-api-examples-browser/src", ".ts");
}
doAll();
