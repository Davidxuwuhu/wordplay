import Bind from "../nodes/Bind";
import BooleanType from "../nodes/BooleanType";
import Expression from "../nodes/Expression";
import type FunctionType from "../nodes/FunctionType";
import ListType from "../nodes/ListType";
import MeasurementType from "../nodes/MeasurementType";
import NameType from "../nodes/NameType";
import type Translations from "../nodes/Translations";
import type Type from "../nodes/Type";
import Action from "../runtime/Action";
import Bool from "../runtime/Bool";
import Evaluation from "../runtime/Evaluation";
import type Evaluator from "../runtime/Evaluator";
import Finish from "../runtime/Finish";
import FunctionValue from "../runtime/FunctionValue";
import List from "../runtime/List";
import Measurement from "../runtime/Measurement";
import Start from "../runtime/Start";
import type Step from "../runtime/Step";
import TypeException from "../runtime/TypeException";
import type Value from "../runtime/Value";
import HOF from "./HOF";
import { LIST_TYPE_VAR_NAME } from "./NativeConstants";

export default class NativeHOFListMap extends HOF {

    readonly hofType: FunctionType;
    constructor(hofType: FunctionType) {
        super();        
        this.hofType = hofType;
    }

    computeChildren() { return [] };
    computeType(): Type { return new ListType(new NameType(LIST_TYPE_VAR_NAME)); }

    compile(): Step[] { 
        return [
            new Start(this),
            // Initialize an iterator and an empty list in this scope.
            new Action(this, 
                {
                    "😀": "TODO",
                    eng: "Initialize an index and new list."
                },
                evaluator => {
                    evaluator.bind("index", new Measurement(1));
                    evaluator.bind("list", new List([]));
                    return undefined;
                }
            ),
            new Action(this, 
                {
                    "😀": "TODO",
                    eng: "Apply the checker to the next list item."
                },
                evaluator => {
                    const index = evaluator.resolve("index");
                    const list = evaluator.getEvaluationContext()?.getContext();
                    // If the index is past the last index of the list, jump to the end.
                    if(!(index instanceof Measurement)) return new TypeException(evaluator, new MeasurementType(), index);
                    else if(!(list instanceof List)) return new TypeException(evaluator, new ListType(), list);
                    else {
                        if(index.greaterThan(list.length()).bool)
                            evaluator.jump(1);
                        // Otherwise, apply the given translator function to the current list value.
                        else {
                            const include = evaluator.resolve("include");
                            const listValue = list.get(index);
                            if(include instanceof FunctionValue && 
                                include.definition.expression instanceof Expression && 
                                include.definition.inputs[0] instanceof Bind) {
                                const bindings = new Map<string, Value>();
                                // Bind the list value
                                (include.definition.inputs[0] as Bind).getNames().forEach(n => bindings.set(n, listValue));
                                // Apply the translator function to the value
                                evaluator.startEvaluation(new Evaluation(
                                    evaluator, 
                                    include.definition, 
                                    include.definition.expression, 
                                    include.context, 
                                    bindings
                                ));
                            }
                            else return new TypeException(evaluator, this.hofType, index);
                        }
                    }
                }
            ),
            // Save the translated value and then jump to the conditional.
            new Action(this, 
                {
                    "😀": "TODO",
                    eng: "If it matches, include it, then move to the next list item."
                },
                evaluator => {

                    // Get the boolean from the function evaluation.
                    const include = evaluator.popValue(new BooleanType());
                    if(!(include instanceof Bool)) return include;

                    // Get the current index.
                    const index = evaluator.resolve("index");
                    if(!(index instanceof Measurement))
                        return new TypeException(evaluator, new MeasurementType(), index);

                    const list = evaluator.getEvaluationContext()?.getContext();
                    if(!(list instanceof List))
                        return new TypeException(evaluator, new ListType(), list);

                    // If the include decided yes, append the value.
                    const newList = evaluator.resolve("list");
                    if(!(newList instanceof List)) return new TypeException(evaluator, new ListType(), newList);
                    else if(!(include instanceof Bool)) return new TypeException(evaluator, new BooleanType(), include);
                    else {
                        if(include.bool) {
                            const listValue = list.get(index);
                            evaluator.bind("list", newList.append(listValue));
                        }
                    }

                    // Increment the counter
                    evaluator.bind("index", index.add(new Measurement(1)));

                    // Jump to the conditional
                    evaluator.jump(-2);

                    return undefined;
                }
            ),
            new Finish(this)
        ];
    }

    evaluate(evaluator: Evaluator): Value | undefined {
        // Evaluate to the filtered list.
        return evaluator.resolve("list");
    }

    getStartExplanations(): Translations {
        return {
            "😀": "TODO",
            eng: "Make a list of matching items."
        }
    }

    getFinishExplanations(): Translations {
        return {
            "😀": "TODO",
            eng: "Evaluate to the new filtered list!"
        }
    }

}