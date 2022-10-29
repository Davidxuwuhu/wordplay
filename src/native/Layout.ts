import NameType from "../nodes/NameType";
import StructureDefinition from "../nodes/StructureDefinition";
import { TRANSLATE, WRITE_DOCS } from "../nodes/Translations";
import TypeInput from "../nodes/TypeInput";

export const Layout = new StructureDefinition(
    WRITE_DOCS,
    {
        eng: "Layout",
        "😀": TRANSLATE
    },
    [],
    [],
    []
);
export default Layout;

export const Vertical = new StructureDefinition(
    WRITE_DOCS,
    {
        eng: "Vertical",
        "😀": "⬇"
    },
    [ new TypeInput(new NameType("Layout")) ],
    [],
    []
)