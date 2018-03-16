# IOTA Pico Framework Examples Automation

## Introduction

The IOTA Pico Framework is intended to be a multi-layered set of object oriented JavaScript libraries.

Each layer is fully abstracted allowing you to replace components with your own implementations very easily.

The libraries are written in TypeScript so are all strongly typed. The modules are generated as ES6 so you may need to transpile them when including them for use in older JavaScript eco-systems. The code will run without transpilation in all modern browsers and when used by NodeJs.

## Automation

The update-examples.js script will use [@iota-pico/api-examples-nodejs](https://github.com/iotaeco/iota-pico-api-examples-nodejs) as a source to update all the other example repos.
