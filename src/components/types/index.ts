export interface CollectionRequest {



    id: number;
    name: string;
    description: string;
    event: string;
    type: "emit" | "listen" | "emit-and-listen";
    emitBody: string;
    listenerBody: string;
    script: string;
    isFolder: false;
    isFolderOpened: false;




}

export interface CollectionFolder {



    id: number
    name: string;
    isFolder: boolean;
    isFolderOpened?: boolean;
    children: CollectionRequest[]




}