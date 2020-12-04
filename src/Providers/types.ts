

export interface HttpResponse<T = any> {
    data: T;
    message: string;
    more?: boolean | any;


}
export interface FieldI {

    _id: string;
    placeholder: string;
    name: string;
    info: string;
    top: string;
    left: string;
    width: string;
    fontSize: string;
    textAlign: string;
    hideUI: boolean;

    height: string;
    extended: string;
    default: string;

    fieldIndex: number;
    type: string,
    validators: [
        {
            function: string,
            error: string
        }
    ],
    accept: string,
    options: [
        string

    ],


}
export interface FieldHashI {
    [_id: string]: FieldI
}

export interface FormI {
    _id: string;

    name: string;
    info: string;
    img: string;
    stages: {
        [_id: string]: {
            name: string;
            stage: number;
            type: string;
            info: string;
            fields: {
                [_id: string]: FieldI
            }
        }
    };

    owner_id: string,
    creator: boolean;
    plan: any;

    alreadyApplied: boolean,
    stagesArrangement: {
        [index: string]: string
    },
    tenants: {
        [_id: string]: {
            _id: string,
            name: string
        }
    },
    restrictedUsers: {
        [_id: string]: {
            _id: string,
            name: string
        }
    },

    uiOptions: {
font: string,

        portrait: boolean;
        margin: {
            top: string;
            left: string;
        }

    },
    settings: {
        updateAfterSubmit: boolean;
        requireLogin: boolean,
        published: boolean
    },
    createdOn?: number,
    modifiedOn?: number,

}





export interface TemplateI {
    _id: string;
    img: string;
    name: string;
    fields: { [_id: string]: FieldI }

    createdOn: number | string;
    modifiedOn: number | string;

    version: number | string;



}


export interface UserI {
    name: string;
    phone: string;
    img: string;
    email: string;
    twoFa: boolean;
    creator: boolean;
    applicant: boolean;
    country: string;
    plan: number
}
export interface PlansI {

    [n: number]: {
        title: string;
    }
}


export interface DocumentI {
    _id: string,
    form_id: string,
    form: FormI,
    user_id: string,
    currentStage: number,
    completed: boolean,
    stages: {
        [_id: string]: {
            _id: string,
            stage: number,
            fields: {
                [_id: string]: string
            }

        }
    }




}

