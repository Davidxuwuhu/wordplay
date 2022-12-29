import Token from "./Token";
import type Node from "./Node";
import TokenType from "./TokenType";
import { BOOLEAN_TYPE_SYMBOL } from "../parser/Tokenizer";
import NativeType from "./NativeType";
import type Translations from "./Translations";
import { TRANSLATE } from "./Translations"
import type TypeSet from "./TypeSet";
import type { NativeTypeName } from "../native/NativeConstants";

export default class BooleanType extends NativeType {

    readonly type: Token;

    constructor(type: Token) {
        super();

        this.type = type;

        this.computeChildren();

    }

    static make() {
        return new BooleanType(new Token(BOOLEAN_TYPE_SYMBOL, TokenType.BOOLEAN_TYPE));
    }

    getGrammar() { 
        return [
            { name: "type", types:[ Token ] },
        ]; 
    }

    clone(original?: Node, replacement?: Node) { 
        return new BooleanType(
            this.replaceChild("type", this.type, original, replacement)
        ) as this; 
    }

    computeConflicts() {}

    acceptsAll(types: TypeSet) { return types.list().every(type => type instanceof BooleanType); }

    getNativeTypeName(): NativeTypeName { return "boolean"; }

    getDescriptions(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "a boolean"
        }
    }


    
    
    
}