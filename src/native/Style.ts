import { TRANSLATE } from "../nodes/Translations";
import { parseStructure, tokens } from "../parser/Parser";

const Style = parseStructure(tokens(
`•Style/eng,👗/😀(
    font/eng,🔡/😀•"Noto Sans"•"Noto Emoji"•"Arial"•"Courier New"•"Times New Roman"•"Verdana"•"Comic Sans MS": "Noto Sans"
    weight/eng,${TRANSLATE}weight/😀•1•2•3•4•5•6•7•8•9: 4
    size/eng,📏/😀•#pt:12pt
)`));

export default Style;