import * as del from "del";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as glob from "glob";

async function deleteFiles(destFolder: string, destGlob: string): Promise<void> {
    try {
        const deletedFiles = await del(path.join(destFolder, destGlob), { force: true });
        deletedFiles.forEach(file => {
            console.log(`Deleted: ${file}`);
        });
    } catch (err) {
        console.error("Error Deleting Files", err);
    }
}

async function copyFiles(srcFolder: string, srcFilesGlob: string, destFolder: string, destExt: string, additionalReplacements?: { [replace: string]: string }): Promise<void> {
    try {
        const globAsync = util.promisify(glob);
        const files = await globAsync(path.join(srcFolder, srcFilesGlob));

        files.forEach(async file => {
            await copyFile(srcFolder, file.replace(srcFolder, ""), destFolder, destExt, additionalReplacements);
        })
    } catch (err) {
        console.error("Error Copying Files", err);
    }
}

async function copyFile(srcFolder: string, srcFile: string, destFolder: string, destExt: string, additionalReplacements: { [replace: string]: string }): Promise<void> {
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
    } catch (err) {
        console.error(err);
    }
}

async function doAll(): Promise<void> {
    const palReplacement = {
        "import { PAL } from \"@iota-pico/pal-nodejs/dist/pal\";": 
        "import { PAL } from \"@iota-pico/pal-browser/dist/pal\";"
    };

    await deleteFiles("../iota-pico-api-examples-browser/src/", "**/*.ts");
    await copyFiles("../iota-pico-api-examples-nodejs/src/api/", "**/!(*.d).ts", "../iota-pico-api-examples-browser/src/api", ".ts", palReplacement);
    await copyFiles("../iota-pico-api-examples-nodejs/src/", "networkConfig.ts", "../iota-pico-api-examples-browser/src", ".ts");
    await copyFiles("../iota-pico-api-examples-nodejs/src/", "typings.d.ts", "../iota-pico-api-examples-browser/src", ".ts");
}

doAll();

