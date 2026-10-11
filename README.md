# Carom

Carom is a top-down paddle duel built with the Simple 2D engine. Play against a
reactive AI or challenge a friend locally. Paddle movement adds spin to the ball,
and the gold obstacles make every rally a bank-shot puzzle.

## Install and run

```sh
npm ci
npm run dev
```

Vite prints the local development URL. To create the static production site:

```sh
npm run build
```

The complete site is written to `dist/`; serve that directory from any static
web server.

## Controls

- **Solo:** W/S or the arrow keys move your left paddle; the AI controls right.
- **Versus:** W/S move the left paddle and ↑/↓ move the right paddle.
- **Menus:** W/S or ↑/↓ select, Enter/Space confirm, Escape goes back or pauses.
- **P:** pause or resume. **M:** toggle sound.

Move a paddle as you strike to shape the ball's flight. First to 11 points wins
by two.
