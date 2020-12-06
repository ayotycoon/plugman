

// get previous env
const path = require('path')
const { writeFileSync } = require('fs');
const envJson = require('./src/env.json')





const newEnv = {
    ...envJson, prod:false
}

writeFileSync(path.resolve(__dirname,'./src/env.json'), JSON.stringify(newEnv));

console.log('increased version as a bug fix')