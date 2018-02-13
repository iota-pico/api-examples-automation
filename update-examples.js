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
async function copyFiles(srcFolder, srcFilesGlob, destFolder, destExt, removeTypes, additionalReplacements) {
    try {
        const globAsync = util.promisify(glob);
        const files = await globAsync(path.join(srcFolder, srcFilesGlob));
        files.forEach(async (file) => {
            await copyFile(srcFolder, file.replace(srcFolder, ""), destFolder, destExt, removeTypes, additionalReplacements);
        });
    }
    catch (err) {
        console.error("Error Copying Files", err);
    }
}
async function copyFile(srcFolder, srcFile, destFolder, destExt, removeTypes, additionalReplacements) {
    try {
        console.log(`Copying: ${srcFile}`);
        const readFileAsync = util.promisify(fs.readFile);
        const writeFileAsync = util.promisify(fs.writeFile);
        const contentBuffer = await readFileAsync(path.join(srcFolder, srcFile));
        let content = contentBuffer.toString();
        if (removeTypes) {
            content = content.replace(/(\):.*){/g, ") {");
            content = content.replace(/: INetworkEndPoint/g, "");
            content = content.replace(/: number\[\]/g, "");
            content = content.replace(/: number/g, "");
            content = content.replace(/: string\[\]/g, "");
            content = content.replace(/: string/g, "");
            content = content.replace(/: any\[\]/g, "");
            content = content.replace(/: any/g, "");
        }
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
    await deleteFiles("../iota-pico-examples-nodejs-js/src/", "**/*.js");
    await copyFiles("../iota-pico-examples-nodejs-ts/src/api/", "**/!(*.d).ts", "../iota-pico-examples-nodejs-js/src/api", ".js", true, palReplacement);
    await copyFiles("../iota-pico-examples-nodejs-ts/src/", "index.ts", "../iota-pico-examples-nodejs-js/src", ".js", true);
    await copyFiles("../iota-pico-examples-nodejs-ts/src/", "networkConfig.ts", "../iota-pico-examples-nodejs-js/src", ".js", true);
    await deleteFiles("../iota-pico-examples-browser-ts/src/", "**/*.ts");
    await copyFiles("../iota-pico-examples-nodejs-ts/src/api/", "**/!(*.d).ts", "../iota-pico-examples-browser-ts/src/api", ".ts", false, palReplacement);
    await copyFiles("../iota-pico-examples-nodejs-ts/src/", "networkConfig.ts", "../iota-pico-examples-browser-ts/src", ".ts", false);
    await copyFiles("../iota-pico-examples-nodejs-ts/src/", "typings.d.ts", "../iota-pico-examples-browser-ts/src", ".ts", false);
    await deleteFiles("../iota-pico-examples-browser-js/src/", "**/*.js");
    await deleteFiles("../iota-pico-examples-browser-js/", "index.html");
    await deleteFiles("../iota-pico-examples-browser-js/src/", "**/*.html");
    await copyFiles("../iota-pico-examples-nodejs-ts/src/api/", "**/!(*.d).ts", "../iota-pico-examples-browser-js/src/api", ".js", true, palReplacement);
    await copyFiles("../iota-pico-examples-nodejs-ts/src/", "networkConfig.ts", "../iota-pico-examples-browser-js/src", ".js", true);
    await copyFiles("../iota-pico-examples-browser-ts/", "config.js", "../iota-pico-examples-browser-js/", ".js", false);
    await copyFiles("../iota-pico-examples-browser-ts/", "index.html", "../iota-pico-examples-browser-js/", ".html", false, { "TypeScript": "JavaScript" });
    await copyFiles("../iota-pico-examples-browser-ts/src/", "**/*.html", "../iota-pico-examples-browser-js/src/", ".html", false);
}
doAll();
