import { BehaviourSubject } from './helpers';


let data: any[] = []
const idToRequestHash: any = {

}


export class CollectionsService {
    public static persist() {
        localStorage.setItem('storage', JSON.stringify(data))

    }
    public static load() {
        data = JSON.parse(localStorage.getItem('storage') || "[]")

    }

    public static modifyAll(data: any) {
        collectionsObs.next(data);

    }
    private static setData(d: any) {
        data = d;
    }
    public static generateRequestHash() {
        function folderParse(dd: any[]) {
            dd.forEach(d => {
                if (d.isFolder) {
                    folderParse(d.children || [])
                } else {
                    idToRequestHash[d.id] = d
                }
            })

        }
        folderParse(data)

    }
    public static getRequestHash() {
        return idToRequestHash;



    }
    public static getRequestFromId(tree: string) {

        return idToRequestHash[tree]

    }
    public static treeDataModifier(options: any = {}, tree: string, cb?: any, localCollections?: any[]): any {
        const treeSplit = tree.split('/').filter(_ => _)

        let treeIndex = 0;
        let targetC;


        function treeDataModifierF(cb?: any, localCollections?: any[]): any {
            let lastLoop = false;
            if (treeIndex == (treeSplit.length - 1)) {
                lastLoop = true
            }
            let collectionTree: any[] = localCollections || JSON.parse(JSON.stringify(data));


            if (treeSplit.length == 0) {

                if (cb) {
                    cb(null, collectionTree)

                }
                CollectionsService.setData(collectionTree);
                if (options.emit) {

                    collectionsObs.next(data);
                }
                return { c: null, collectionTree }

            }






            const id = treeSplit[treeIndex];



            for (let c of collectionTree) {
                if (c.id == id) {
                    targetC = c;

                    if (c.isFolder && (treeIndex < (treeSplit.length - 1))) {

                        treeIndex++
                        treeDataModifierF(cb, c.children)


                    }



                    if (cb && lastLoop) {

                        cb(c, collectionTree)

                    }
                    CollectionsService.setData(collectionTree);
                    if (options.emit) {

                        collectionsObs.next(data);
                    }

                    return { c: targetC, collectionTree }

                }
            }


        }

      
        try {
         

            return treeDataModifierF(cb, localCollections)
            //  data = data.[]


        }
        catch (e) {

            return null

        }

    }




}
CollectionsService.load()
CollectionsService.generateRequestHash();

export const collectionsObs = new BehaviourSubject(data)




export default CollectionsService