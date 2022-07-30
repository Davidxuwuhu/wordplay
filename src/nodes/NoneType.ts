import type Conflict from "../parser/Conflict";
import type Alias from "./Alias";
import type ConversionDefinition from "./ConversionDefinition";
import type { ConflictContext } from "./Node";
import type Token from "./Token";
import Type from "./Type";

export default class NoneType extends Type {

    readonly none?: Token;
    readonly aliases: Alias[];

    constructor(aliases: Alias[], none?: Token) {
        super();

        this.none = none;
        this.aliases = aliases;
    }

    getChildren() {
        return this.none === undefined ? [ ...this.aliases ] : [ this.none, ...this.aliases ];
    }

    getConflicts(context: ConflictContext): Conflict[] { return []; }

    isCompatible(context: ConflictContext, type: Type): boolean { 
        // No if it's not a none type.
        if(!(type instanceof NoneType)) return false;
        // Yes if there are no aliases for either.
        if(this.aliases.length === 0 && type.aliases.length === 0) return true;
        // Otherwise, yes if they have an intersecting alias.
        return this.aliases.find(a => type.aliases.find(b => a.isCompatible(b)) !== undefined) !== undefined;
    }

    getConversion(context: ConflictContext, type: Type): ConversionDefinition | undefined {
        // TODO Define conversions from booleans to other types
        // TODO Look for custom conversions that extend the Boolean type
        return undefined;
    }

    toWordplay(): string {
        return "•!" + this.aliases.map(a => a.getName());
    }

}