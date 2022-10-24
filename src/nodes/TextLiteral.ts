import Expression from "./Expression";
import TextType from "./TextType";
import Token from "./Token";
import type Type from "./Type";
import type Node from "./Node";
import type Value from "../runtime/Value";
import Text from "../runtime/Text";
import type Step from "../runtime/Step";
import Finish from "../runtime/Finish";
import Language from "./Language";
import type Bind from "./Bind";
import type Context from "./Context";
import type { TypeSet } from "./UnionType";
import TokenType from "./TokenType";
import { getPossibleLanguages } from "../transforms/getPossibleLanguages";
import Add from "../transforms/Add";
import Replace from "../transforms/Replace";
import type Transform from "../transforms/Transform";
import { getPossiblePostfix } from "../transforms/getPossibleExpressions";
import Remove from "../transforms/Remove";
import type Translations from "./Translations";

export default class TextLiteral extends Expression {
    
    readonly text: Token;
    readonly format?: Language;

    constructor(text?: Token, format?: Language) {
        super();
        this.text = text ?? new Token('""', TokenType.TEXT);
        this.format = format;
    }

    computeChildren() { return this.format !== undefined ? [ this.text, this.format ] : [ this.text ]; }
    computeConflicts() {}

    computeType(): Type {
        return new TextType(undefined, this.format);
    }

    compile(): Step[] {
        return [ new Finish(this) ];
    }
    
    evaluate(): Value {
        // Remove the opening and optional closing quote symbols.
        const lastChar = this.text.text.toString().length === 0 ? undefined : this.text.text.toString().charAt(this.text.text.toString().length - 1);
        const lastCharIsQuote = lastChar === undefined ? false : ["』", "」", "»", "›", "'", "’", "”", '"'].includes(lastChar);    
        return new Text(this.text.text.toString().substring(1, this.text.text.toString().length - (lastCharIsQuote ? 1 : 0)), this.format === undefined ? undefined : this.format.getLanguage());
    }

    clone(pretty: boolean=false, original?: Node | string, replacement?: Node) { 
        return new TextLiteral(
            this.cloneOrReplaceChild(pretty, [ Token ], "text", this.text, original, replacement), 
            this.cloneOrReplaceChild(pretty, [ Language, undefined ], "format", this.format, original, replacement)
        ) as this; 
    }

    evaluateTypeSet(bind: Bind, original: TypeSet, current: TypeSet, context: Context) { bind; original; context; return current; }

    getChildReplacement(child: Node, context: Context) {
    
        const project = context.source.getProject();
        // Formats can be any Language tags that are used in the project.
        if(project !== undefined && child === this.format)
            return getPossibleLanguages(project).map(lang => new Replace(context.source, child, new Language(lang)));

    }
    
    getInsertionBefore() { return undefined; }
    
    getInsertionAfter(context: Context, position: number): Transform[] | undefined { 
        
        const project = context.source.getProject();

        // Formats can be any Language tags that are used in the project.
        return [
            ...getPossiblePostfix(context, this, this.getType(context)),
            ...(project !== undefined && this.format === undefined ? 
                getPossibleLanguages(project).map(lang => new Add(context.source, position, this, "format", new Language(lang))) :
                []
            )
        ];

    }

    getChildRemoval(child: Node, context: Context): Transform | undefined {
        if(child === this.format) return new Remove(context.source, this, child);
    }

    getDescriptions(): Translations {
        return {
            "😀": "TODO",
            eng: "Text"
        }
    }

    getStartExplanations(): Translations { return this.getFinishExplanations(); }

    getFinishExplanations(): Translations {
        return {
            "😀": "TODO",
            eng: "Evaluate to this text!"
        }
    }

}