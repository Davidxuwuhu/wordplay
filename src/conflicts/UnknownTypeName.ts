import type NameType from "../nodes/NameType";
import type Translations from "../nodes/Translations";
import Conflict from "./Conflict";


export class UnknownTypeName extends Conflict {
    readonly name: NameType;

    constructor(name: NameType) {
        super(false);
        this.name = name;
    }

    getConflictingNodes() { 
        return { primary: [ this.name ] }; 
    }

    getExplanations(): Translations { 
        return {
            "😀": "TODO",
            eng: `I don't know what type I am!`
        }
    }

}
