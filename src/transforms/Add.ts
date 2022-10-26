import type { Edit } from "../editor/Commands";
import Transform from "./Transform";
import Node from "../nodes/Node";
import type Source from "../models/Source";
import type LanguageCode from "../nodes/LanguageCode";
import type Refer from "./Refer";
import Caret from "../models/Caret";

export default class Add<NodeType extends Node> extends Transform {

    readonly parent: Node;
    readonly position: number;
    readonly child: NodeType | Refer<NodeType>;
    readonly field: string;

    constructor(source: Source, position: number, parent: Node, field: string, child: NodeType | Refer<NodeType>) {
        super(source);

        this.parent = parent;
        this.position = position;
        this.field = field;
        this.child = child;

    }

    getNewNode(languages: LanguageCode[]): Node {
        return this.child instanceof Node ? this.child : this.child[0](this.child[1].getTranslation(languages));
    }

    getEdit(languages: LanguageCode[]): Edit {
        
        // Make the new node
        const newNode = this.getPrettyNewNode(languages);

        // Clone the parent
        const newParent = this.parent.clone(true, this.field, newNode);

        // Save the path to the new node
        const newNodePath = newNode.getPath();

        // Clone the source with the new parent.
        const newSource = this.source.withProgram(this.source.program.clone(false, this.parent, newParent));
        const finalNewNodePath = [ ...newParent.getPath(), ...newNodePath ];

        // Resolve the new node's clone.
        const finalNewNode = newSource.program.resolvePath(finalNewNodePath);
        if(finalNewNode === undefined) return;

        let newCaretPosition: Node | number | undefined = newSource.getNodeLastIndex(finalNewNode);
        if(newCaretPosition === undefined) return;

        const firstPlaceholder = finalNewNode.getFirstPlaceholder();
        if(firstPlaceholder) newCaretPosition = firstPlaceholder;
        
        return [ newSource, new Caret(newSource, newCaretPosition)];

    }

    getDescription(languages: LanguageCode[]): string {
        const node = this.getPrettyNewNode(languages);
        const descriptions = {
            eng: "Add " + node.getDescriptions().eng,
            "😀": "Add " + node.getDescriptions()["😀"],
        };
        return descriptions[languages.find(lang => lang in descriptions) ?? "eng"];
    }

    equals(transform: Transform) {
        return transform instanceof Add && this.parent === transform.parent && (
            (this.child instanceof Node && transform.child instanceof Node && this.child === transform.child) || 
            (Array.isArray(this.child) && Array.isArray(transform.child) && this.child[1] === transform.child[1])
        );
    }

}