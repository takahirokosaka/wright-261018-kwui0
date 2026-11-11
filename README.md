# Wright
Yet another WYSIWYG Markdown editor

## Target Audience

It’s me. But this app might also be helpful to others who want to write Markdown with a simple editor.

I wanted to replace Typora, the best wysiwyg Markdown editor I know, for two reasons: 1) It’s not open source, so I cannot customize it; and 2) its three-user license is not enough for me.

So far this app is built only for macOS. Most of the code should work on Linux and Windows too. If you find this app useful on either platform, please fork this repo.

I’ve been using this app since the end of October 2026.
## Features

- No vault (filesystem-based like TextEdit or NotePad)
- Clutter-free UI
- No unintentional normalization (your Markdown source is the only source of truth)
- HTML element rendering (with DOM cleansing and no JavaScript, for security)
- Customizable CSS (by editing `~/.wright.css`)
- Pasting images
  - by dragging and dropping from Finder, or
  - from the clipboard (PNG only, for pasting screen captures)
- Exporting to HTML (a single file containing CSS and math SVGs)
- Highlighting (`=={red} text==`)

For supported Markdown syntax, please refer to `sample.md`, which is accessible from Help > Demo in the menu bar.

## Time Budget

I plan to spend one hour per week on this app for maintenance.

## Dependencies

This software is built primarily with [Tauri 2.0](https://tauri.app) and [CodeMirror](https://codemirror.net). For other dependencies, please see [`package.json`](<./package.json>) and [`./src-tauri/Cargo.toml`](<./src-tauri/Cargo.toml>). I appreciate the creators of these libraries, fonts, and tools.

## Development

- `pnpm tauri dev`
- `pnpm tauri build`

The developer console (Cmd+Option+i) is available on the production builds. This is intentional, for users who want to customize the CSS.

## Known Issues

The app’s window may hang when it encountered an unusually exotic combination of nested Markdown syntax. If this happened, close the window, fix the problem with TextEdit, and reopen the document.

Please note that the lack of a feature you want isn’t an issue. This editor is intentionally kept minimal.
## TODOs

**Test**

There’s no systematic testing for now. If I don’t get hit by a bus, someday I’ll be telling a machine agent like this:

> Explore this Markdown editor. Find usability problems, visual defects, broken interactions, crashes, and unexpected behavior. Explore freely without a predefined test script.

rather than manually preparing test scripts.

**Remove Spell Checking**

Why can’t we use the operating system’s spell checker?

**Math**

Fix the rendering cache. It grows indefinitely.

**Documentation**

- Encourage the use of macOS keyboard shortcuts (Ctrl+A, Ctrl+E, etc.) Without mastering them, using this app would be unproductive.
- Explain how to use smart quotes
- How to customize CSS (e.g., to use a different set of fonts)

**Replace Regular Expressions with DOM-based HTML Parsers**

## License

GPL-3.0

## Copyright

© 2026- Takahiro Kosaka