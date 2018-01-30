import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as glob from "glob";

async function copyFiles(srcFolder: string, srcFilesGlob: string, destFolder: string) : Promise<void> {
    const globAsync = util.promisify(glob);

    try {
        const files = await globAsync(path.join(srcFolder, srcFilesGlob)_);

        files.forEach(file => {
            console.log(`Copying file ${file}`);
        })
    } catch (err) {
        console.error(err);
    }
}

copyFiles("../iota-pico-examples-nodejs-ts/src/", "**/!(*.d).ts", "../iota-pico-examples-nodejs-js/src");