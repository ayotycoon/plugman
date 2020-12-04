
export const isProduction = () => {
    if(window.location.host.match('localhost')) {
        return false
    } else {
        return true;
    }
}
export const host = isProduction() ? 'https://inngle.com' : 'http://localhost:8080';
export const clientHost = isProduction() ? 'https://app.inngle.com' : 'http://localhost:3000';

export const CONSTANTS =  {
    TOKEN_EXPIRY: 3600000,
    DEFAULT_FORM_IMAGE: '/assets/default-form.png',
    DEFAULT_USER_IMAGE: '/assets/default-user.svg',
    sizes : {
        A4: {
            title: 'A4',
            width: (420 * 2.655),
            height: (595 * 2.66)
        },
        A5: {
            title: 'A5',
            width: (210 * 2.655),
            height: ((595/2) * 2.66)
        }
    },
    headings : {
        'Heading 1': {
            title: 'Heading 1',
            fontSize: '36px'
        },
        'Heading 2': {
            title: 'Heading 2',
            fontSize: '30px'
        },
        'Heading 3': {
            title: 'Heading 3',
            fontSize: '24px'
        },
        'Heading 4': {
            title: 'Heading 4',
            fontSize: '18px'
        },
        'Heading 5': {
            title: 'Heading 5',
            fontSize: '14px'
        },
        'Heading 6': {
            title: 'Heading 6',
            fontSize: '12px'
        },
        'Normal': {
            title: 'Normal',
            fontSize: ''
        },
    },
    aligns : {
        'Left': {
            title: 'Left'
        },
        'Right': {
            title: 'Right'
        },
        'Center': {
            title: 'Center'
        },
    },
    fonts: {
        
        '0':{ value: '0',text: `Default Font`, link: `` },
        '1': { value: '1', text: `'Montserrat', sans-serif`, link: `https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;1,200;1,300;1,400&display=swap` },
        '2': { value: '2', text: `'Open Sans', sans-serif`, link: `https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;1,300;1,400;1,600&display=swap` },
        '3':{ value:'3', text: `'Mulish', sans-serif`, link: `https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap` },
    }

}

export const VALIDATORS = {
    FULL_NAME: [{
        function: `return arg1.match(/^\\w+\\s+\\w+/)`,
        error: 'Field must contain first name and last name'
    },],
    PHONE: [{
        function: `return arg1.replace(/\\s+/, '').match(/^\\+?(\\d{3,3})?\\d{10,11}$/)`,
        error: 'Field must be a valid phone number'
    },],
    EMAIL: [{
        function: `return arg1.match(/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/)`,
        error: 'Field must be a valid email'
    },],
    PASSWORD: [
        { function: `return arg1.length >= 8`,
         error: 'Password must be 8 chracters or more' },
     
        ]
}