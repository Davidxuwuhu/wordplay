import type Bind from '../nodes/Bind';
import type Token from '../nodes/Token';
import type Translation from '../translations/Translation';
import Conflict from './Conflict';

export class MisplacedShare extends Conflict {
    readonly bind: Bind;
    readonly share: Token;
    constructor(bind: Bind, share: Token) {
        super(false);

        this.bind = bind;
        this.share = share;
    }

    getConflictingNodes() {
        return { primary: this.share, secondary: [] };
    }

    getPrimaryExplanation(translation: Translation) {
        return translation.conflict.MisplacedShare.primary;
    }

    getSecondaryExplanation() {
        return undefined;
    }
}
