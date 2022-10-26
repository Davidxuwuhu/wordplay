import Alias from "../nodes/Alias";
import Bind from "../nodes/Bind";
import Dimension from "../nodes/Dimension";
import MeasurementLiteral from "../nodes/MeasurementLiteral";
import MeasurementType from "../nodes/MeasurementType";
import StructureDefinition from "../nodes/StructureDefinition";
import { TRANSLATE, WRITE_DOCS } from "../nodes/Translations";
import Unit from "../nodes/Unit";
import { parseBind, tokens } from "../parser/Parser";

const Place = new StructureDefinition(
    WRITE_DOCS,
    {
        eng: "Place",
        "😀": TRANSLATE
    },
    [],
    [],
    [
        new Bind(
            WRITE_DOCS,
            undefined,
            {
                eng: "x",
                "😀": TRANSLATE
            },
            new MeasurementType(undefined, new Unit(undefined, [ new Dimension("px") ]))
        ),
        new Bind(
            WRITE_DOCS,
            undefined,
            {
                eng: "y",
                "😀": TRANSLATE
            },
            new MeasurementType(undefined, new Unit(undefined, [ new Dimension("px") ]))
        )
    ]
);

export default Place;