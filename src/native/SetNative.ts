import Bind from "../nodes/Bind";
import Block from "../nodes/Block";
import BooleanType from "../nodes/BooleanType";
import FunctionDefinition from "../nodes/FunctionDefinition";
import FunctionType from "../nodes/FunctionType";
import NameType from "../nodes/NameType";
import SetType from "../nodes/SetType";
import StructureDefinition from "../nodes/StructureDefinition";
import TypeVariable from "../nodes/TypeVariable";
import List from "../runtime/List";
import Text from "../runtime/Text";
import Set from "../runtime/Set";
import TypeException from "../runtime/TypeException";
import { createNativeConversion, createNativeFunction } from "./NativeBindings";
import { SET_TYPE_VAR_NAMES } from "./NativeConstants";
import NativeHOFSetFilter from "./NativeHOFSetFilter";
import Bool from "../runtime/Bool";
import { TRANSLATE, WRITE, WRITE_DOCS } from "../nodes/Translations";
import type Node from "../nodes/Node";
import type Value from "../runtime/Value";
import type Evaluation from "../runtime/Evaluation";

export default function bootstrapSet() {

    const setFilterHOFType = new FunctionType([], [ 
        Bind.make(
            WRITE_DOCS,
            {
                eng: "value",
                "😀": `${TRANSLATE}value`
            },
            new BooleanType()
        )
    ], new NameType(SET_TYPE_VAR_NAMES.eng));
    
    return StructureDefinition.make(
        {
            eng: WRITE,
            "😀": WRITE
        },
        {
            eng: "set",
            "😀": `${TRANSLATE}set`
        },
        // No interfaces
        [],
        // One type variable
        [ new TypeVariable(SET_TYPE_VAR_NAMES)],
        // No inputs
        [],
        // Include all of the functions defined above.
        new Block([
            createNativeFunction(
                {
                    eng: WRITE,
                    "😀": WRITE
                },
                {
                    eng: "equals",
                    "😀": "="
                }, 
                [], 
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "set",
                        "😀": `${TRANSLATE}1`
                    }, 
                    SetType.make() 
                ) ], 
                new BooleanType(),
                (requestor, evaluation) => {
                        const set = evaluation?.getClosure();
                        const other = evaluation.resolve("set");
                        return !(set instanceof Set && other instanceof Set) ? 
                            new TypeException(evaluation.getEvaluator(), SetType.make(), other) :
                            new Bool(requestor, set.isEqualTo(other));
                    }
            ),
            createNativeFunction(
                {
                    eng: WRITE,
                    "😀": WRITE
                },
                {
                    eng: "not-equal",
                    "😀": "≠"
                },
                [], 
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "set",
                        "😀": `${TRANSLATE}1`
                    }, 
                    SetType.make() 
                ) ], 
                new BooleanType(),
                (requestor, evaluation) => {
                        const set = evaluation?.getClosure();
                        const other = evaluation.resolve("set");
                        return !(set instanceof Set && other instanceof Set) ? 
                            new TypeException(evaluation.getEvaluator(), SetType.make(), other) :
                            new Bool(requestor, !set.isEqualTo(other));
                    }
            ),
            createNativeFunction(
                {
                    eng: WRITE,
                    "😀": WRITE
                }, 
                {
                    eng: "add",
                    "😀": "+"
                },
                [],
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "value",
                        "😀": `${TRANSLATE}value`
                    }, 
                    new NameType(SET_TYPE_VAR_NAMES.eng) 
                ) ], 
                SetType.make(new NameType(SET_TYPE_VAR_NAMES.eng)),
                (requestor, evaluation) => {
                        const set = evaluation?.getClosure();
                        const element = evaluation.resolve("value");
                        if(set instanceof Set && element !== undefined) return set.add(requestor, element);
                        else return new TypeException(evaluation.getEvaluator(), SetType.make(), set);
                    }
            ),
            createNativeFunction(
                {
                    eng: WRITE,
                    "😀": WRITE
                }, 
                {
                    eng: "remove",
                    "😀": "-"
                },
                [], 
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "value",
                        "😀": `${TRANSLATE}1`
                    }, 
                    new NameType(SET_TYPE_VAR_NAMES.eng) 
                ) ], 
                SetType.make(new NameType(SET_TYPE_VAR_NAMES.eng)),
                (requestor, evaluation) => {
                    const set: Evaluation | Value | undefined = evaluation.getClosure();
                    const element = evaluation.resolve("value");
                    if(set instanceof Set && element !== undefined) return set.remove(requestor, element);
                    else return new TypeException(evaluation.getEvaluator(), SetType.make(), set);
                }
            ),            
            createNativeFunction(
                {
                    eng: WRITE,
                    "😀": WRITE
                }, 
                {
                    eng: "union",
                    "😀": "∪"
                },
                [], 
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "set",
                        "😀": `${TRANSLATE}1`
                    }, 
                    SetType.make(new NameType(SET_TYPE_VAR_NAMES.eng)) 
                ) ],
                SetType.make(new NameType(SET_TYPE_VAR_NAMES.eng)),
                (requestor, evaluation) => {
                    const set = evaluation.getClosure();
                    const newSet = evaluation.resolve("set");
                    if(set instanceof Set && newSet instanceof Set) return set.union(requestor, newSet);
                    else return new TypeException(evaluation.getEvaluator(), SetType.make(), set);
                }
            ),
            createNativeFunction(
                {
                    eng: WRITE,
                    "😀": WRITE
                }, 
                {
                    eng: "intersection",
                    "😀": "∩"
                }, 
                [], 
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "set",
                        "😀": `${TRANSLATE}1`
                    }
                ) ], 
                SetType.make(new NameType(SET_TYPE_VAR_NAMES.eng)),
                (requestor, evaluation) => {
                    const set = evaluation.getClosure();
                    const newSet = evaluation.resolve("set");
                    if(set instanceof Set && newSet instanceof Set) return set.intersection(requestor, newSet);
                    else return new TypeException(evaluation.getEvaluator(), SetType.make(), set);
                }
            ),
            createNativeFunction(
                {
                    eng: WRITE,
                    "😀": WRITE
                }, 
                {
                    eng: "difference",
                    "😀": TRANSLATE
                }, 
                [], 
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "set",
                        "😀": `${TRANSLATE}1`
                    }
                ) ], 
                SetType.make(new NameType(SET_TYPE_VAR_NAMES.eng)),
                (requestor, evaluation) => {
                    const set = evaluation.getClosure();
                    const newSet = evaluation.resolve("set");
                    if(set instanceof Set && newSet instanceof Set) return set.difference(requestor, newSet);
                    else return new TypeException(evaluation.getEvaluator(), SetType.make(), set);
                }
            ),
            FunctionDefinition.make(
                {
                    eng: WRITE,
                    "😀": WRITE
                }, 
                {
                    eng: "filter",
                    "😀": TRANSLATE
                }, 
                [], 
                [ Bind.make(
                    {
                        eng: WRITE,
                        "😀": WRITE
                    }, 
                    {
                        eng: "checker",
                        "😀": `${TRANSLATE}1`
                    }, 
                    setFilterHOFType
                ) ],
                new NativeHOFSetFilter(setFilterHOFType),
                SetType.make(new NameType(SET_TYPE_VAR_NAMES.eng))
            ),

            createNativeConversion(WRITE_DOCS, "{}", "''", (requestor: Node, val: Set) => new Text(requestor, val.toString())),
            createNativeConversion(WRITE_DOCS, "{}", "[]", (requestor: Node, val: Set) => new List(requestor, val.values))
        ], false, true)
    );
    
}