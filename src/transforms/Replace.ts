import type { Edit } from '../editor/util/Commands';
import Transform from './Transform';
import Node from '../nodes/Node';
import Caret from '../editor/util/Caret';
import type LanguageCode from '../translations/LanguageCode';
import Refer from './Refer';
import type Context from '../nodes/Context';
import type Translation from '../translations/Translation';

export default class Replace<NodeType extends Node> extends Transform {
    readonly parent: Node;
    readonly node: Node;
    readonly replacement: NodeType | Refer | undefined;

    constructor(
        context: Context,
        parent: Node,
        node: Node,
        replacement: NodeType | Refer | undefined
    ) {
        super(context);

        this.parent = parent;
        this.node = node;
        this.replacement = replacement;
    }

    getEdit(lang: LanguageCode[]): Edit | undefined {
        const [replacement, newParent] = this.getEditedNode(lang);

        // Get the position of the node we're replacing.
        const position = this.context.source.getNodeFirstPosition(this.node);
        if (position === undefined) return;

        // Replace the child in the parent, pretty printing it, then clone the program with the new parent, and create a new source from it.
        const newSource = this.context.source.withProgram(
            // Replace the parent with the new parent
            this.context.source.expression.replace(this.parent, newParent),
            // Preserve the space before the old parent
            this.context.source.spaces.withReplacement(this.node, replacement)
        );

        let newCaretPosition =
            replacement !== undefined
                ? replacement.getFirstPlaceholder() ??
                  newSource.getNodeLastPosition(replacement)
                : position;
        if (newCaretPosition === undefined) return;

        // Return the new source and place the caret after the replacement.
        return [newSource, new Caret(newSource, newCaretPosition ?? position)];
    }

    getEditedNode(lang: LanguageCode[]): [Node | undefined, Node] {
        // Get or create the replacement with the original node's space.
        const replacement = this.getNewNode(lang);
        const newParent = this.parent.replace(this.node, replacement);
        return [replacement, newParent];
    }

    getNewNode(languages: LanguageCode[]) {
        if (this.replacement instanceof Node) return this.replacement;

        return this.replacement?.getNode(languages);
    }

    getDescription(translation: Translation): string {
        let node =
            this.replacement instanceof Refer
                ? this.replacement.getNode([translation.language])
                : this.getNewNode([translation.language]);
        return translation.transform.replace(
            node?.getDescription(translation, this.context)
        );
    }

    equals(transform: Transform) {
        return (
            transform instanceof Replace &&
            this.node === transform.node &&
            ((this.replacement instanceof Node &&
                transform.replacement instanceof Node &&
                this.replacement.equals(transform.replacement)) ||
                (this.replacement instanceof Refer &&
                    transform.replacement instanceof Refer &&
                    this.replacement.equals(transform.replacement)))
        );
    }
}
