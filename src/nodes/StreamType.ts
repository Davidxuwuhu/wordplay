import type { NativeTypeName } from '../native/NativeConstants';
import { STREAM_SYMBOL } from '../parser/Tokenizer';
import type Context from './Context';
import type { Replacement } from './Node';
import Token from './Token';
import TokenType from './TokenType';
import type Translations from './Translations';
import { TRANSLATE } from './Translations';
import Type from './Type';
import type TypeSet from './TypeSet';

export const STREAM_NATIVE_TYPE_NAME = 'stream';

export default class StreamType extends Type {
    readonly stream: Token;
    readonly type: Type;

    constructor(stream: Token, type: Type) {
        super();

        this.stream = stream;
        this.type = type;

        this.computeChildren();
    }

    static make(type: Type) {
        return new StreamType(
            new Token(STREAM_SYMBOL, TokenType.STREAM_TYPE),
            type
        );
    }

    getGrammar() {
        return [
            { name: 'stream', types: [Token] },
            { name: 'type', types: [Type] },
        ];
    }

    computeConflicts() {}

    acceptsAll(types: TypeSet, context: Context): boolean {
        return types
            .list()
            .every(
                (type) =>
                    type instanceof StreamType &&
                    this.type.accepts(type.type, context)
            );
    }

    getNativeTypeName(): NativeTypeName {
        return 'stream';
    }

    clone(replace?: Replacement) {
        return new StreamType(
            this.replaceChild('stream', this.stream, replace),
            this.replaceChild('type', this.type, replace)
        ) as this;
    }

    getDescriptions(): Translations {
        return {
            '😀': TRANSLATE,
            eng: 'A stream type',
        };
    }
}
