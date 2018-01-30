import * as fs from "fs";
import * as util from "util";
import * as glob from "util";

async function copyFiles(srcSpec: string, destFolder: string) : Promise<void> {

}

copyFiles("../iota-pico-examples-nodejs-ts/src/**/*", "../iota-pico-examples-nodejs-js");