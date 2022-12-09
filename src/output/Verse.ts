import { TRANSLATE, WRITE_DOCS } from "../nodes/Translations";
import Structure from "../runtime/Structure";
import type Value from "../runtime/Value";
import Group, { type RenderContext } from "./Group";
import { toFont } from "./Phrase";
import Fonts, { SupportedFontsType } from "../native/Fonts";
import Color from "./Color";
import Place, { toPlace } from "./Place";
import type Translations from "../nodes/Translations";
import toStructure from "../native/toStructure";
import Measurement from "../runtime/Measurement";
import Decimal from "decimal.js";
import { toGroup } from "./toGroups";
import { toColor } from "./Color";

export const VerseType = toStructure(`
    •Verse/eng,🌎/😀•Group(
        group/eng,${TRANSLATE}phrases/😀•Group
        font/eng,${TRANSLATE}font/😀${SupportedFontsType}: "Noto Sans"
        foreground/eng,${TRANSLATE}fore/😀•Color: Color(0 0 0°)
        background/eng,${TRANSLATE}back/😀•Color: Color(100 0 0°)
        focus/eng,${TRANSLATE}focus•Place: Place(0 0 0)
        tilt/eng,${TRANSLATE}tilt•#°: 0°
    )
`);

export default class Verse extends Group {

    readonly group: Group;
    readonly font: string;
    readonly background: Color;
    readonly foreground: Color;
    readonly focus: Place;
    readonly tilt: Decimal;

    constructor(value: Value, group: Group, font: string, background: Color, foreground: Color, focus: Place, tilt: Decimal) {

        super(value);

        this.group = group;
        this.font = font;
        this.background = background;
        this.foreground = foreground;
        this.focus = focus;
        this.tilt = tilt;

        Fonts.loadFamily(this.font);

    }

    getWidth(context: RenderContext): Decimal { return this.group.getWidth(context); }
    getHeight(context: RenderContext): Decimal { return this.group.getHeight(context); }

    getGroups(): Group[] {
        return [ this.group ];
    }

    /** 
     * A Verse is a Group that lays out a list of phrases according to their specified places,
     * or if the phrases */
    getPlaces(context: RenderContext): [Group, Place][] {
        // Center the group in the verse, and offset by the focus.
        return [
            [ 
                this.group, 
                new Place(this.value, 
                    this.group.getWidth(context).div(2).neg().sub(this.focus.x), 
                    this.group.getHeight(context).div(2).neg().sub(this.focus.y), 
                    new Decimal(0)
                ) 
            ]
        ];
    }

    getBackground(): Color | undefined {
        return undefined;
    }

    getDescriptions(): Translations {
        return WRITE_DOCS
    }

}

export function toVerse(value: Value): Verse | undefined {

    if(!(value instanceof Structure)) return undefined;

    if(value.type === VerseType) {
        const group = toGroup(value.resolve("group"));
        const font = toFont(value.resolve("font"));
        const background = toColor(value.resolve("background"));
        const foreground = toColor(value.resolve("foreground"));
        const focus = toPlace(value.resolve("focus"));
        const tilt = toDecimal(value.resolve("tilt"));
        return group && font && background && foreground && focus && tilt ? new Verse(value, group, font, background, foreground, focus, tilt) : undefined;
    }
     // Try converting it to a group.
    else {
        const group = toGroup(value);
        return group === undefined ? undefined : 
            new Verse(
                value, 
                group, 
                "Noto Sans",
                new Color(value, new Decimal(100), new Decimal(0), new Decimal(0)), 
                new Color(value, new Decimal(0), new Decimal(0), new Decimal(0)),
                new Place(value, new Decimal(0), new Decimal(0), new Decimal(0)),
                new Decimal(0)
            );
    }

}

export function toDecimal(value: Value | undefined): Decimal | undefined {

    return value instanceof Measurement ? value.num : undefined;

}