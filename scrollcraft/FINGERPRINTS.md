# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| `planeta-pizza` | **Vitrine e balcão** (new: one pinned showcase, hard cut to a working counter in normal flow, the visitor's order ticket as the ending; bans pan, scrub, any pin after the showcase, kinetic or parallax in the counter) | Counter chrome: fixed red bar with logo, a live open/closed sign and one order action ("Fazer pedido", with item count); on phones the action moves to a fixed bottom order bar. Sticky category tabs with scroll-spy inside the counter | Pinned layered assembly on a red seamless ground: a dough ball at p=0 with the promise as a two-line kinetic h1 on a greet cue, far ingredient props on parallax, near blurred props (desktop only) | `pin` (3.3vh, 3.0 phone, 2.2 reduced) > `flow` > `flow`+`reveal`, 3 engine acts, ~6.1vh desktop / 6.5vh phone; zero scrub, zero video, one bespoke `--sc-p` CSS choreography of 9 image layers and ~20 falling sprites | The order ticket: the same comanda that printed in the showcase, now printing the visitor's own lines, total and one button, footer inside the close; no spotlight, no magnet | **A comanda que se imprime**: a thermal ticket prints one line per ingredient as each layer lands, then a red rubber stamp slams MELHOR PREÇO onto it at the peak; below the fold every Adicionar prints onto the same ticket | Hard-light graphic flat lay: deep tomato red seamless `#B8141B`, flour white counter `#FFF8F1`, red as ground and accent; Bricolage Grotesque + Geist (Mono for the ticket) | 4600 |



---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

Claimed by `planeta-pizza` (first build: nothing to clear):

- **Grammar:** vitrine e balcão (showcase, then counter).
- **Nav:** counter chrome with a live open/closed sign and a persistent order action that skips the film.
- **Hero:** a product that assembles itself in layers under a pinned stage, from raw ingredient to finished object.
- **Close:** the visitor's own order ticket.
- **Signature:** a self-printing receipt plus a rubber-stamp peak. Nobody else may take receipt printing or stamping as the bespoke move.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
