import type FunctionDefinition from "../nodes/FunctionDefinition";
import type StructureDefinition from "../nodes/StructureDefinition";
import Conflict from "./Conflict";


export class Unimplemented extends Conflict {
    readonly structure: StructureDefinition;
    readonly interfaceStructure: StructureDefinition;
    readonly fun: FunctionDefinition;
    
    constructor(structure: StructureDefinition, interfaceStructure: StructureDefinition, fun: FunctionDefinition) {
        super(false);
        this.structure = structure;
        this.interfaceStructure = interfaceStructure;
        this.fun = fun;
    }

    getConflictingNodes() {
        return { primary: this.structure.aliases, secondary: [ this.fun ] };
    }

    getExplanations() { 
        return {
            eng: `Because this structure implements interface ${this.interfaceStructure.getNames()}, it has to implement function ${this.fun.getNames()}.`
        }
    }

}