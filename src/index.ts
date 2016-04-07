import fs from 'fs'
import express from './bootstrap/express'
//全局 promise
global.Promise = require('bluebird');

export default class {
    constructor() {

    }
    
    run(opt:any){
        this.config = this.init_config(opt)
    }
    async init_config(config:any){
        console.log(config)
    }
}

 