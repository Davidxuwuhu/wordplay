const WhatWord = {
    name: "WhatWord", 
    source: [
`↓ ⌨️
↓ words
\`The game state is a list of guesses and a secret word.\`/eng
\`El estado del juego es una lista de conjeturas y una palabra secreta.\`/spa
\`🧩 = 🤔 + 🤫\`/😀
•Game/eng, 🧩/😀(guesses/eng,🤔/😀•[""] secret/eng, 🤫/😀•"")
(
\tƒ guessesRemaining/eng,🔢/😀() (secret.length() · 2) - guesses.length()
\tƒ status/eng,🚨/😀()
\t\tsecret = "" ? "start"
\t\tguessesRemaining() ≤ 0 ? "lost"
\t\tsecret→[""].all(ƒ(letter•"") guesses.has(letter)) ? "won"
\t\t"playing"
)

start/eng,
🟢/😀: Game([] "")

\`When the keyboard state changes, the game state changes.\`/eng
\`Cuando cambia el estado del teclado, cambia el estado del juego.\`/spa
\`⌨️ + 🤔 + 🤫 → ⚽️\`/😀
state/eng,
⚽️/😀•Game: start ∆ ⌨️
\t\t⌨️.key = "Escape" ? start
\t\t(state.status() ≠ "playing") ∧ (⌨️.key = " ") ∧ ⌨️.down ? Game([] words.random())
\t\t(state.status() = "playing") ∧ ⌨️.down ∧ (⌨️.key.length() = 1) ∧ ¬state.guesses.has(⌨️.key) ? Game(state.guesses.add(⌨️.key) state.secret)
\t\tstate

\`The board is a translation of the secret, accounting for guesses\`/eng
\`El tablero es una traducción del secreto, teniendo en cuenta las conjeturas.\`/spa
\`🤔 + 🤫 → 🔤\`/😀
board/eng,
🔤/😀: 💬(state.secret→[""].translate(ƒ(letter•"") ((state.status() = "lost") ∨ state.guesses.has(letter)) ? letter "_").join(' ') 24pt)

\`The title on the title screen\`/eng
title: 💬("Welcome to WhatWord!" 30pt "Noto Sans" Fade(1000))

\`The rest of the game screen depends on the game status\`/eng
\`El resto de la pantalla del juego depende del estado del juego.\`/spa
\`🚨 + 🔤 → 📺\`/😀
screen/eng,
📺/😀:
\tstate.status() = "start" ? ▣(⬇() title 💬("Press space to begin") 💬("Type letters to guess"))
\tstate.status() = "lost" ?  ▣(⬇() board 💬("You lost. Press space to play again."))
\tstate.status() = "won" ?   ▣(⬇() board 💬("You won, nice job! Press space to play again."))
\t\t\t\t\t\t\t\t\t\t\t\t\t\t ▣(⬇() board 💬("Guesses: \\state.guesses.join(' ')\\" 16pt) 💬("\\state.guessesRemaining()→''\\ remaining" 12pt))

🌎(screen)`,

`\`These are the secret words. Don't tell anyone!\`/eng
\`Estas son las palabras secretas. ¡No se lo digas a nadie!\`/spa
\`🤫\`/😀
↑ words/eng, 🤫🤫🤫/😀: [
\t'kitty'
\t'house'
\t'heat'
\t'farm'
\t'townhouse'
\t'heatwave'
]`
]}

export default WhatWord;