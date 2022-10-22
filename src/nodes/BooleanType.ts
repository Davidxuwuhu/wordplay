import Token from "./Token";
import type Type from "./Type";
import type Node from "./Node";
import TokenType from "./TokenType";
import { BOOLEAN_NATIVE_TYPE_NAME } from "../native/NativeConstants";
import { BOOLEAN_TYPE_SYMBOL } from "../parser/Tokenizer";
import NativeType from "./NativeType";
import type Transform from "../transforms/Transform";

export default class BooleanType extends NativeType {

    readonly type: Token;

    constructor(type?: Token) {
        super();

        this.type = type ?? new Token(BOOLEAN_TYPE_SYMBOL, TokenType.BOOLEAN_TYPE);
    }

    clone(pretty: boolean=false, original?: Node | string, replacement?: Node) { 
        return new BooleanType(
            this.cloneOrReplaceChild(pretty, [ Token ], "type", this.type, original, replacement)
        ) as this; 
    }

    computeChildren() { return [ this.type ]; }
    computeConflicts() {}

    accepts(type: Type) { return type instanceof BooleanType; }

    getNativeTypeName(): string { return BOOLEAN_NATIVE_TYPE_NAME; }

    getDescriptions() {
        return {
            eng: "A boolean type"
        }
    }

    getChildReplacement(): Transform[] | undefined { return undefined; }
    getInsertionBefore(): Transform[] | undefined { return undefined; }
    getInsertionAfter(): Transform[] | undefined { return undefined; }
    getChildRemoval(): Transform | undefined { return undefined; }
    
}