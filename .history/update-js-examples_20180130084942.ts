import * as fs from "fs";
import * as util from "util";
import * as glob from "glob";

async function copyFiles(srcSpec: string, destFolder: string) : Promise<void> {
    const globAsync = util.promisify(glob);

    try {
        const files = await globAsync(srcSpec);

        files.forEach(files => {
            console.log(`Copying file ${file}`);
        })
    } catch (err) {
        console.error(err);
    }
}

copyFiles("../iota-pico-examples-nodejs-ts/src/**/*", "../iota-pico-examples-nodejs-js");