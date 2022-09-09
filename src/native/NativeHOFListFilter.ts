import Bind from "../nodes/Bind";
import Expression from "../nodes/Expression";
import ListType from "../nodes/ListType";
import NameType from "../nodes/NameType";
import type { ConflictContext } from "../nodes/Node";
import type Type from "../nodes/Type";
import Bool from "../runtime/Bool";
import Evaluation from "../runtime/Evaluation";
import type Evaluator from "../runtime/Evaluator";
import Exception, { ExceptionKind } from "../runtime/Exception";
import Finish from "../runtime/Finish";
import FunctionValue from "../runtime/FunctionValue";
import List from "../runtime/List";
import Measurement from "../runtime/Measurement";
import Action from "../runtime/Start";
import type Step from "../runtime/Step";
import type Value from "../runtime/Value";

export default class NativeHOFListMap extends Expression {

    computeChildren() { return [] };
    computeType(context: ConflictContext): Type { return new ListType(new NameType("T")); }

    compile(context: ConflictContext): Step[] { 
        return [
            // Initialize an iterator and an empty list in this scope.
            new Action(this, evaluator => {
                evaluator.bind("index", new Measurement(1));
                evaluator.bind("list", new List([]));
                return undefined;
            }),
            new Action(this, evaluator => {
                const index = evaluator.resolve("index");
                const list = evaluator.getEvaluationContext()?.getContext();
                // If the index is past the last index of the list, jump to the end.
                if(index instanceof Measurement && list instanceof List) {
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
                        else return new Exception(this, ExceptionKind.EXPECTED_TYPE)
                    }
                }
                else return new Exception(this, ExceptionKind.EXPECTED_TYPE);
                return undefined;
            }),
            // Save the translated value and then jump to the conditional.
            new Action(this, evaluator => {

                // Get the boolean from the function evaluation.
                const include = evaluator.popValue();
                if(!(include instanceof Bool))
                    return new Exception(this, ExceptionKind.EXPECTED_TYPE);

                // Get the current index.
                const index = evaluator.resolve("index");
                if(!(index instanceof Measurement))
                    return new Exception(this, ExceptionKind.EXPECTED_TYPE);

                const list = evaluator.getEvaluationContext()?.getContext();
                if(!(list instanceof List))
                    return new Exception(this, ExceptionKind.EXPECTED_TYPE);

                // If the include decided yes, append the value.
                const newList = evaluator.resolve("list");
                if(newList instanceof List && include instanceof Bool) {
                    if(include.bool) {
                        const listValue = list.get(index);
                        evaluator.bind("list", newList.append(listValue));
                    }
                }
                else return new Exception(this, ExceptionKind.EXPECTED_TYPE);

                // Increment the counter
                evaluator.bind("index", index.add(new Measurement(1)));

                // Jump to the conditional
                evaluator.jump(-2);

                return undefined;
            }),
            new Finish(this)
        ];
    }

    evaluate(evaluator: Evaluator): Value | undefined {
        // Evaluate to the filtered list.
        return evaluator.resolve("list");
    }

}