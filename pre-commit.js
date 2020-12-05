

// get previous env
const path = require('path')
const { writeFileSync } = require('fs');
const envJson = require('./src/env.json')


const prevVersion = envJson.version + ''

function replaceAt(str, index, ch) {
    return str.replace(/./g, (c, i) => i == index ? ch : c);
}







let newVersion = ''

prevVersion.split('.').forEach((n, i) => {
    if(i <2){
        newVersion+=n
        newVersion+='.'
    }else {
        newVersion += (parseInt(n)+1)
    }
})

const newEnv = {
    ...envJson, version: newVersion
}

writeFileSync(path.resolve(__dirname,'./src/env.json'), JSON.stringify(newEnv));

console.log('increased version as a bug fix')