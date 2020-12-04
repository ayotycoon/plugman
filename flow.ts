const flow = [
    {
        env: 'nodejs',
        language: [
            {name: 'javascript'},
            {name: 'typescript'},
        ],
        dependencies: [{
            name:'express',
            version: '1.0.1',
            envVersion: '*',
            tag: 'web',
            level: 1,
            isDevDependency: false
        }]


    }]

export default flow;