import type Conflict from "../conflicts/Conflict";
import { UnparsableConflict } from "../conflicts/UnparsableConflict";
import type { NativeTypeName } from "../native/NativeConstants";
import type Transform from "../transforms/Transform";
import Node from "./Node";
import type Translations from "./Translations";
import { TRANSLATE } from "./Translations";
import Type from "./Type";

export default class UnparsableType extends Type {

    readonly unparsables: Node[];

    constructor(nodes: Node[]) {
        super();

        this.unparsables = nodes;

    }

    acceptsAll(): boolean { return false; }

    getNativeTypeName(): NativeTypeName { return "unparsable"; }

    getGrammar() {
        return [
            { name: "unparsables", types: [[ Node ]] }
        ];
    }

    computeConflicts(): void | Conflict[] {
        return [ new UnparsableConflict(this) ];
    }

    replace(original?: Node, replacement?: Node): this {
        return new UnparsableType(
            this.replaceChild("unparsables", this.unparsables, original, replacement),
        ) as this; 
    }

    getDescriptions(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "unparsable code"
        }
    }

    getChildReplacement(): Transform[] | undefined { return undefined; }
    getInsertionBefore(): Transform[] | undefined { return undefined; }
    getInsertionAfter(): Transform[] | undefined { return undefined; }
    getChildRemoval(): Transform | undefined { return undefined; }




}