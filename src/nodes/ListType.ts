import { LIST_NATIVE_TYPE_NAME, LIST_TYPE_VAR_NAMES } from "../native/NativeConstants";
import { LIST_CLOSE_SYMBOL, LIST_OPEN_SYMBOL } from "../parser/Tokenizer";
import type Context from "./Context";
import NativeType from "./NativeType";
import type Node from "./Node";
import Token from "./Token";
import TokenType from "./TokenType";
import Type from "./Type";
import { getPossibleTypeReplacements } from "../transforms/getPossibleTypes";
import type Transform from "../transforms/Transform"
import TypePlaceholder from "./TypePlaceholder";
import Replace from "../transforms/Replace";
import type Translations from "./Translations";
import { TRANSLATE } from "./Translations"

export default class ListType extends NativeType {

    readonly open: Token;
    readonly type?: Type;
    readonly close: Token;

    constructor(type?: Type, open?: Token, close?: Token) {
        super();

        this.open = open ?? new Token(LIST_OPEN_SYMBOL, TokenType.LIST_OPEN);
        this.type = type;
        this.close = close ?? new Token(LIST_CLOSE_SYMBOL, TokenType.LIST_CLOSE);

        this.computeChildren();

    }

    getGrammar() { 
        return [
            { name: "open", types:[ Token ] },
            { name: "type", types:[ Type, undefined ] },
            { name: "close", types:[ Token ] },
        ];
    }

    replace(original?: Node, replacement?: Node) { 
        return new ListType(
            this.replaceChild("type", this.type, original, replacement),
            this.replaceChild("open", this.open, original, replacement),
            this.replaceChild("close", this.close, original, replacement)
        ) as this; 
    }

    computeConflicts() {}

    accepts(type: Type, context: Context): boolean {
        return type instanceof ListType && 
            (
                // If this list type has no type specified, any will do.
                this.type === undefined || 
                // If the given type has no type specified, any will do
                type.type === undefined ||
                this.type.accepts(type.type, context)
            );
    }

    getNativeTypeName(): string { return LIST_NATIVE_TYPE_NAME; }

    resolveTypeVariable(name: string): Type | undefined { 
        return Object.values(LIST_TYPE_VAR_NAMES).includes(name) ? this.type : undefined;
    };

    getDescriptions(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "A list type"
        }
    }

    getChildReplacement(child: Node, context: Context): Transform[] | undefined { 
        if(child === this.type)
            return getPossibleTypeReplacements(child, context);
    }
    getInsertionBefore() { return undefined; }
    getInsertionAfter() { return undefined; }
    getChildRemoval(child: Node, context: Context): Transform | undefined {
        if(child === this.type) return new Replace(context, child, new TypePlaceholder());
    }
}