import type { NativeTypeName } from '../native/NativeConstants';
import type Translation from '../translations/Translation';
import Type from './Type';

export default class AnyType extends Type {
    constructor() {
        super();
    }

    getGrammar() {
        return [];
    }

    acceptsAll() {
        return true;
    }

    getNativeTypeName(): NativeTypeName {
        return 'any';
    }

    computeConflicts() {}

    getNodeTranslation(translation: Translation) {
        return translation.types.AnyType;
    }

    toWordplay() {
        return '*';
    }

    clone() {
        return this;
    }
}
