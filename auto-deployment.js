

// get previous env
const path = require('path')
const { writeFileSync } = require('fs');
const envJson = require('./src/env.json');
const { execSync } = require('child_process');
const commitMessage = process.argv[2];



if (!commitMessage){
    throw "empty commit message"
}

const prevVersion = envJson.version + ''


let newVersion = ''

prevVersion.split('.').forEach((n, i) => {
    if (i < 2) {
        newVersion += n
        newVersion += '.'
    } else {
        newVersion += (parseInt(n) + 1)
    }
})

const newEnv = {
    ...envJson, prod: true, version: newVersion
}

writeFileSync(path.resolve(__dirname, './src/env.json'), JSON.stringify(newEnv));


// run git add
execSync('git add .')
// run commit

execSync(`git commit -m "${commitMessage}"`)
execSync(`git push origin master`)

// switch env back to false

newEnv.prod = false

writeFileSync(path.resolve(__dirname, './src/env.json'), JSON.stringify(newEnv));
