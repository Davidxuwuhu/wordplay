import type Conflict from '../conflicts/Conflict';
import Expression from './Expression';
import Token from './Token';
import type Type from './Type';
import type Evaluator from '../runtime/Evaluator';
import type Step from '../runtime/Step';
import Finish from '../runtime/Finish';
import Start from '../runtime/Start';
import type Context from './Context';
import type Bind from './Bind';
import { NOT_SYMBOL } from '../parser/Symbols';
import type TypeSet from './TypeSet';
import FunctionException from '../runtime/FunctionException';
import FunctionDefinition from './FunctionDefinition';
import NotAFunction from '../conflicts/NotAFunction';
import Evaluation from '../runtime/Evaluation';
import getConcreteExpectedType from './Generics';
import type Value from '../runtime/Value';
import UnknownNameType from './UnknownNameType';
import type { Replacement } from './Node';
import type Translation from '../translations/Translation';
import StartEvaluation from '../runtime/StartEvaluation';

export default class UnaryOperation extends Expression {
    readonly operator: Token;
    readonly operand: Expression;

    constructor(operator: Token, operand: Expression) {
        super();

        this.operator = operator;
        this.operand = operand;

        this.computeChildren();
    }

    getGrammar() {
        return [
            { name: 'operator', types: [Token] },
            { name: 'operand', types: [Expression] },
        ];
    }

    clone(replace?: Replacement) {
        return new UnaryOperation(
            this.replaceChild('operator', this.operator, replace),
            this.replaceChild('operand', this.operand, replace)
        ) as this;
    }

    getOperator() {
        return this.operator.text.toString();
    }

    getFunction(context: Context) {
        // Find the function on the left's type.
        const expressionType =
            this.operand instanceof Expression
                ? this.operand.getType(context)
                : undefined;
        const fun = expressionType?.getDefinitionOfNameInScope(
            this.getOperator(),
            context
        );
        return fun instanceof FunctionDefinition ? fun : undefined;
    }

    computeConflicts(context: Context): Conflict[] {
        const conflicts = [];

        // Find the function on the left's type.
        const fun = this.getFunction(context);

        // Did we find nothing?
        if (fun === undefined)
            conflicts.push(
                new NotAFunction(
                    this,
                    this.operator,
                    this.operand.getType(context)
                )
            );

        return conflicts;
    }

    computeType(context: Context): Type {
        const fun = this.getFunction(context);
        return fun !== undefined
            ? getConcreteExpectedType(fun, undefined, this, context)
            : new UnknownNameType(
                  this,
                  this.operator,
                  this.operand.getType(context)
              );
    }

    getDependencies(context: Context): Expression[] {
        const fun = this.getFunction(context);
        return [
            this.operand,
            ...(fun === undefined || !(fun.expression instanceof Expression)
                ? []
                : [fun.expression]),
        ];
    }

    compile(context: Context): Step[] {
        return [
            new Start(this),
            ...this.operand.compile(context),
            new StartEvaluation(this),
            new Finish(this),
        ];
    }

    startEvaluation(evaluator: Evaluator) {
        // Get the value of the operand.
        const value = evaluator.popValue(this);

        const fun = value
            .getType(evaluator.getCurrentContext())
            .getDefinitionOfNameInScope(
                this.getOperator(),
                evaluator.getCurrentContext()
            );
        if (
            !(fun instanceof FunctionDefinition) ||
            !(fun.expression instanceof Expression)
        )
            return new FunctionException(
                evaluator,
                this,
                value,
                this.getOperator()
            );

        // Start the function's expression.
        evaluator.startEvaluation(
            new Evaluation(evaluator, this, fun, value, new Map())
        );
    }

    evaluate(evaluator: Evaluator, prior: Value | undefined): Value {
        if (prior) return prior;

        // Return the value computed
        return evaluator.popValue(this);
    }

    /**
     * Logical negations take the set complement of the current set from the original.
     * */
    evaluateTypeSet(
        bind: Bind,
        original: TypeSet,
        current: TypeSet,
        context: Context
    ) {
        // We only manipulate possible types for logical negation operators.
        if (this.operator.getText() !== NOT_SYMBOL) return current;

        // Get the possible types of the operand.
        const possible = this.operand.evaluateTypeSet(
            bind,
            original,
            current,
            context
        );

        // Return the difference between the original types and the possible types,
        return original.difference(possible, context);
    }

    getStart() {
        return this.operator;
    }
    getFinish() {
        return this.operator;
    }

    getDescription(translation: Translation, context: Context) {
        // Find the function on the left's type.
        const fun = this.getFunction(context);
        return fun && fun.docs
            ? fun.docs.getTranslation([translation.language])
            : translation.expressions.UnaryOperation.description;
    }

    getNodeTranslation(translation: Translation) {
        return translation.expressions.UnaryOperation;
    }

    getStartExplanations(translation: Translation) {
        return translation.expressions.UnaryOperation.start;
    }

    getFinishExplanations(translation: Translation) {
        return translation.expressions.UnaryOperation.finish;
    }
}
