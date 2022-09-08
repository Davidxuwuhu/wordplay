import type Conflict from "../conflicts/Conflict";
import Token from "./Token";
import Type from "./Type";
import type { ConflictContext } from "./Node";
import { TokenType } from "./Token";

export default class BooleanType extends Type {

    readonly type: Token;

    constructor(type?: Token) {
        super();

        this.type = type ?? new Token("?", [ TokenType.BOOLEAN_TYPE ]);
    }

    computeChildren() {
        return [ this.type ];
    }

    getConflicts(context: ConflictContext): Conflict[] { return []; }

    isCompatible(context: ConflictContext, type: Type) { return type instanceof BooleanType; }

    getNativeTypeName(): string { return "boolean"; }

    toWordplay() { return "•?"; }

}