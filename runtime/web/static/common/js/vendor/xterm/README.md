# Vendored xterm.js runtime

This directory vendors the browser runtime used by `@rcarmo/piclaw-addon-lite-term` so low-spec Piclaw deployments do not depend on core Ghostty/WASM assets.

Vendored packages:

- `@xterm/xterm` 6.1.0-beta.315
- `@xterm/addon-attach` 0.12.0
- `@xterm/addon-canvas` 0.7.0
- `@xterm/addon-clipboard` 0.2.0
- `@xterm/addon-fit` 0.11.0
- `@xterm/addon-image` 0.9.0
- `@xterm/addon-ligatures` 0.10.0
- `@xterm/addon-progress` 0.2.0
- `@xterm/addon-search` 0.16.0
- `@xterm/addon-serialize` 0.14.0
- `@xterm/addon-unicode-graphemes` 0.4.0
- `@xterm/addon-unicode11` 0.9.0
- `@xterm/addon-web-links` 0.12.0
- `@xterm/addon-webgl` 0.19.0

All are MIT licensed by the xterm.js authors. Piclaw provides the terminal font assets; this add-on only vendors xterm runtime code and CSS.

Core upgrade provenance:

- `xterm.mjs` and `xterm.css` are unmodified copies of `lib/xterm.mjs` and `css/xterm.css` from the official [`@xterm/xterm@6.1.0-beta.315` npm tarball](https://registry.npmjs.org/@xterm/xterm/-/xterm-6.1.0-beta.315.tgz).
- Upstream commit: `991857a1b1cacf06f9531ba74a6e927a7a6398bb`.
- npm integrity: `sha512-w7MeKxi6vbxE3IOFRiwgugkM6FZonE9gF9KyJ0OiE5HbYZOm38bz+CTGZg3+wqA6porJnHfjzX1KaihInP+iWg==`.
- Includes the upstream native touch-scrolling fix ([#5563](https://github.com/xtermjs/xterm.js/pull/5563)). Existing add-on versions are unchanged.
