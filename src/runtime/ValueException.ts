import type Translations from "../nodes/Translations";
import { TRANSLATE } from "../nodes/Translations";
import Exception from "./Exception";
import type Evaluator from "./Evaluator";

export default class ValueException extends Exception {

    constructor(evaluator: Evaluator) {
        super(evaluator);
    }

    getExplanations(): Translations {
        return {
            eng: `Expected a value on the stack after executing ${this.step?.node.toWordplay()}, but there wasn't one.`,
            "😀": `${TRANSLATE} 🫙`
        }
    };

}