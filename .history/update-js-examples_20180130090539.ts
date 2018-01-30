import * as del from "del";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as glob from "glob";

async function copyFiles(srcFolder: string, srcFilesGlob: string, destFolder: string) : Promise<void> {
    try {
        const deletedFiles = await del(path.join(destFolder, "**/*.js"));
        deletedFiles.forEach(file => {
            console.log(`Delete: ${file}`);
        });
    } catch (err) {
        console.error("Error Deleting Files", err);
    }

    try {
        const globAsync = util.promisify(glob);
        const files = await globAsync(path.join(srcFolder, srcFilesGlob));

        files.forEach(async file => {
            console.log(`Copying file: ${file}`);

            await copyFile(srcFolder, file.replace(srcFolder, ""), destFolder);
        })
    } catch (err) {
        console.error("Error Copying Files", err);
    }
}

async function copyFile(srcFolder: string, srcFile: string, destFolder: string) : Promise<void> {
    try {
        const readFileAsync = util.promisify(fs.readFile);

        const content = await readFileAsync(path.join(srcFolder, srcFile));
    } catch (err) {
        console.error(err);
    }
}

copyFiles("../iota-pico-examples-nodejs-ts/src/", "**/!(*.d).ts", "../iota-pico-examples-nodejs-js/src");