import Bind from "../nodes/Bind";
import BooleanType from "../nodes/BooleanType";
import Expression from "../nodes/Expression";
import type FunctionType from "../nodes/FunctionType";
import MeasurementType from "../nodes/MeasurementType";
import NameType from "../nodes/NameType";
import SetType from "../nodes/SetType";
import type Type from "../nodes/Type";
import Action from "../runtime/Action";
import Bool from "../runtime/Bool";
import Evaluation from "../runtime/Evaluation";
import type Evaluator from "../runtime/Evaluator";
import Finish from "../runtime/Finish";
import FunctionValue from "../runtime/FunctionValue";
import Measurement from "../runtime/Measurement";
import Set from "../runtime/Set";
import Start from "../runtime/Start";
import type Step from "../runtime/Step";
import TypeException from "../runtime/TypeException";
import type Value from "../runtime/Value";
import HOF from "./HOF";
import { SET_TYPE_VAR_NAME } from "./NativeConstants";

export default class NativeHOFSetFilter extends HOF {

    readonly hofType: FunctionType;
    constructor(hofType: FunctionType) {
        super();        
        this.hofType = hofType;
    }

    computeChildren() { return [] };
    computeType(): Type { return new SetType(new NameType(SET_TYPE_VAR_NAME)); }

    compile(): Step[] { 
        return [
            new Start(this),
            // Initialize an iterator and an empty list in this scope.
            new Action(this, 
                {
                    "eng": "Initialize an index and new set."
                }, 
                evaluator => {
                    evaluator.bind("index", new Measurement(1));
                    evaluator.bind("set", new Set([]));
                    return undefined;
                }),
            new Action(this, 
                {
                    "eng": "Check the next set value."
                },
                evaluator => {
                    const index = evaluator.resolve("index");
                    const set = evaluator.getEvaluationContext()?.getContext();
                    // If the index is past the last index of the list, jump to the end.
                    if(!(index instanceof Measurement)) return new TypeException(evaluator, new MeasurementType(), index);
                    else if(!(set instanceof Set)) return new TypeException(evaluator, new SetType(), set);
                    else {
                        if(index.greaterThan(set.size()).bool)
                            evaluator.jump(1);
                        // Otherwise, apply the given translator function to the current list value.
                        else {
                            const checker = evaluator.resolve("checker");
                            const setValue = set.values[index.num.toNumber() - 1];
                            if(checker instanceof FunctionValue && 
                                checker.definition.expression instanceof Expression && 
                                checker.definition.inputs[0] instanceof Bind) {
                                const bindings = new Map<string, Value>();
                                // Bind the list value
                                (checker.definition.inputs[0] as Bind).getNames().forEach(n =>  bindings.set(n, setValue));
                                // Apply the translator function to the value
                                evaluator.startEvaluation(new Evaluation(
                                    evaluator, 
                                    checker.definition, 
                                    checker.definition.expression, 
                                    checker.context, 
                                    bindings
                                ));
                            }
                            else return new TypeException(evaluator, this.hofType, checker);
                        }
                    }
                }),
            // Save the translated value and then jump to the conditional.
            new Action(this, 
                {
                    "eng": "Include the value if it matched."
                },
                evaluator => {

                    // Get the boolean from the function evaluation.
                    const include = evaluator.popValue(new BooleanType());
                    if(!(include instanceof Bool)) return include;

                    // Get the current index.
                    const index = evaluator.resolve("index");
                    if(!(index instanceof Measurement))
                        return new TypeException(evaluator, new MeasurementType(), index);

                    const set = evaluator.getEvaluationContext()?.getContext();
                    if(!(set instanceof Set))
                        return new TypeException(evaluator, new SetType(), set);

                    // If the include decided yes, append the value.
                    const newSet = evaluator.resolve("set");
                    if(newSet instanceof Set) {
                        if(include.bool) {
                            const setValue = set.values[index.num.toNumber() - 1];
                            evaluator.bind("set", newSet.add(setValue));
                        }
                    }
                    else return new TypeException(evaluator, new SetType(), newSet);

                    // Increment the counter
                    evaluator.bind("index", index.add(new Measurement(1)));

                    // Jump to the conditional
                    evaluator.jump(-2);

                    return undefined;
                }),
            new Finish(this)
        ];
    }

    getStartExplanations() {
        return {
            "eng": "Go through each value in the set and see if it matches."
        }
    }

    getFinishExplanations() {
        return {
            "eng": "Evaluate to the new set."
        }
    }

    evaluate(evaluator: Evaluator): Value | undefined {
        // Evaluate to the filtered list.
        return evaluator.resolve("set");
    }

}