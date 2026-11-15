---
footer: foot foot foot あいうえお
---

<div class="two-columns">

# Wright Markdown Editor Demo

Markdown is a lightweight text formatting language. It lets you format plain text using simple symbols instead of HTML. It's commonly used in GitHub, README files, documentation, blogs, and chat applications.

This editor does *not* normalize your markdown source code. Your source is kept as it is.

## Paragraphs

In Markdown, paragraphs are separated by one blank line (two newline characters).

It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.

The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features.

:::info
You can learn Markdown by switching to Source Mode with `Cmd/Ctrl+;`.
:::

# Heading 1

The headings use a condensed font, tight line spacing, and a top margin that scales with their font size.

## Heading 2

A small, curious fox wandered through the quiet garden at dusk.

### Heading 3

Rain tapped gently against the windows as the city lights began to glow.

#### Heading 4

A paper airplane glided across the room and landed beside the open book.

##### Heading 5

Every sunrise brings a new opportunity to learn, grow, and make life a little more beautiful.

###### Heading 6

The stars shine brightest in the darkest skies, reminding us that hope can always be found in difficult times.

## Lists

### Unordered List

- Apples
- Bananas
- Oranges
- Mandarin oranges
- Blood oranges
  - Grapes
    - Fruit

### Ordered List

1. Plan the project
  2. Write the code
    3. Test the application
4. Release the final version

The above isn't a proper nesting and does not work when exporting HTML. This editor uses [`marked`](https://github.com/markedjs/marked) internally for exporting HTML, and `marked` treats indentation as list nesting. The below works:

1. Plan the project
   1. Write the code
      1. Test the application
2. Release the final version
3. abc
4. def
5. abc
6. def
7. abc
8. def
9. abc
10. def
11. abc

### Exporting HTML (Shift-Cmd/Ctrl-E)

The exported HTML contains a style sheet in the `<head>` tag. This style sheet makes the exported HTML look similar to this editor's screen.

This editor does not support printing or exporting to other formats, because when exporting/printing, you would probably need formatting or preprocessing that is beyond the scope of this editor (such as adding a footer to each page.) For converting your writing to a PDF file, the easiest way is opening the resultant HTML in a Chrome-based browser and printing the page. On Mac, Safari cannot handle paged media properly. If you are a more advanced user, use [WeasyPrint](https://weasyprint.org), which can convert HTML to PDF more properly than browsers.

## Admonitions

:::note
This is a note.
:::

:::tip Custom title
This is a tip.
:::

:::danger
This is a dangerous operation.
:::

:::warning
- Be careful!
- Keep calm!
:::

## Long URLs

Long URLs are line-wrapped.

https://www.example.com/products/electronics/computers/laptops/high-performance-gaming-laptop/model-2026/specifications/detailed-technical-information/processor/intel-core-ultra-series/memory/64gb-ddr5-storage/2tb-nvme-ssd/graphics/nvidia-geforce-rtx-series/advanced-display-settings/ultra-high-resolution-4k-oled-screen

https://www.example.com/products_electronics_computers_laptops_highperformancegaminglaptop_model2026_specifications_detailedtechnicalinformation_processordetails_intelcoreultraseries_memoryconfiguration

## Word Counting

The window title shows word counting. It is based on rendered HTML, not the markdown source. URLs count as one word.

### Task List

- [ ] Unsupported.

## Text Formatting

This is a paragraph with **bold** text, *italic* text, ~~strikethrough~~, and `inline code`.

You can also combine formatting: ***bold and italic***.

## Link

Here is a [link](https://commonmark.org/help) to the Markdown Guide. To open a link `Cmd/Ctrl+Click`.

[Local file of an absolute path](</Library/WebServer/share/httpd/manual/images/build_a_mod_3.png>) is clickable. If you drag & drop a file from Finder (macOS) when the current document is not saved on disk, an absolute path is embedded.

[Local file of a relative path](<./Untitled2.md>) is clickable when this markdown file is saved on the disk. If the current file is saved on disk, you'll see a relative link.

## Blockquotes

> Markdown is a lightweight markup language that you can use to add formatting elements to plaintext documents.

Nested blockquotes:

> This is the first level.
>
>> This is a nested blockquote. To include multiple paragraphs, please use `<span><br></span>` on the next new line and then make a line starting with `>>`.
>> <span><br></span>
>>
>> This is the second paragraph.
>>> It can contain multiple paragraphs. It can contain multiple paragraphs.

## Font

You can use your favorite fonts by installing them in `~/Library/Application Support/com.takahirokosaka.wright/fonts`. You also need to write `~/Library/Application Support/com.takahirokosaka.wright/custom.css`:

```css
@font-face {
    font-family: "Inter";
    src: url("wright://font/Inter-VariableFont_opsz,wght.ttf") format("truetype");
    font-weight: 100 900;
	 font-style: normal;
}

@font-face {
    font-family: "Inter";
    src: url("wright://font/GoogleSansCode-Italic-VariableFont_MONO,wght.ttf") format("truetype");
    font-weight: 100 900;
	 font-style: italic;
}

:root {
	font-family: "Inter", sans-serif;
}
```

## Table

Unsupported. Simple tables can be drawn using ASCII art. More complex tables and formatting usually require a spreadsheet. Paste them as an SVG.

<div class="page-break"></div>

<pre>
┌───────┬─────┬────────┐
│ Name  │ Age │ City   │
├───────┼─────┼────────┤
│ Alice │  25 │ Tokyo  │
│ Bob   │  30 │ Osaka  │
│ Carol │  28 │ Nagoya │
└───────┴─────┴────────┘
</pre>

<div class="page-break"></div>

</div>
<div class="full-width">

## Highlight

==Highlight Default Yellow (Cmd/Ctrl+Shift+H)== =={red}Red== =={orange}Orange== =={green}Green== =={blue}Blue== =={purple}Purple== =={pink}Pink== =={gray}Gray==

Gray can be used for collaborative editing (Cmd/Ctrl+Shift+M, M is for mute).

## Horizontal Rule

Content above the divider.

---

Content below the divider.

</div>
<div class="two-columns">

## Images

Large images shrink to the width.

![Placeholder image](https://placehold.co/2000)

A local images of an absolute path:

![Local aboluste](</Library/WebServer/share/httpd/manual/images/build_a_mod_3.png>)

Drag & drop an image file from Finder. As below, a relative path appears if this markdown file is saved on the disk. Put `!` just before the image tag to make the image appear.

![local](<./Untitled.assets/lfs/paste-2026-10-22T05-29-43.065Z.png>)

If you copy an image file in Finder and paste it on this editor, the image is copied to the asset folder of the current markdown document. This asset folder can be configured in `~/.wright.conf`.

Images can also be rendered as block elements:

<a href="https://placehold.co/100"><img src="https://placehold.co/100" style="display:block;"></a>

## Empty Line

You can make a vertical space by pressing Enter key many times.








Outside this editor, however, contiguous empty lines are handled as one empty line in markdown. Do not rely on this style of making a space!

## Escaping Special Characters

Use a backslash to display Markdown characters literally:

\*This text is not italic.\*

\# This is not a heading.

\`This is not inline code.\`

\$This is not a math expression.\$ In code fences there's no need to escape \$:

```shell
$1 $2
```

## Footnotes

Unsupported. The below does not work.

Here is a sentence with a footnote reference.[^1]

[^1]: This is the footnote content.

## Raw HTML

Raw HTML elements are rendered. Mouse-over to see their borders. Examples:

Image link: <a href="https://placehold.co/18"><img src="https://placehold.co/18"></a>

`<pre>`:

<pre>abc edt
wef
weawf
</pre>

`<div>`:

<div style="padding: 12px; border: 1px solid #888; border-radius: .1rem;">
 <strong>HTML block</strong>
 <p>This section tests whether your Markdown renderer supports inline HTML. HTML blocks are not editable in the visual mode. Please switch to the source mode to edit them.</p>
</div>

An empty line after `<div>` can be used to prevent rendering `<div>`. This is useful if you want to add special attributes in exported HTML.

```html
<div class="two-columns">

abc
</div>
```

<div class="two-columns">

See the source (`Cmd/Ctrl+;`) of this line.
</div>

:::danger ⚠️ Important
Executing arbitrary JavaScript code is not allowed. Allowing remote JavaScript execution in this application is particularly dangerous because compromised scripts could expose your documents and potentially access, modify, or delete files on your computer.
:::

## Mathematical Expressions

This editor uses MathJax (because it can export math expressions to SVGs. Rendered SVGs are cached and the editor doesn't repeat rendering on every key typing somewhere else. TODO: Clean up the cache.) Exported HTMLs have these SVGs embedded.

Inline math: $E = mc^2$

Block math (use left/right arrow keys to navigate):

$$
QoL = \int_{birth}^{death} \frac{Pleasure}{Pain}dt
$$

## Code Blocks

Inline code example: `console.log("Hello, world!");`

```
text
```

```ts
interface User {
  id: number;
  name: string;
  active: boolean;
}

const user: User = {
  id: 1,
  name: "Alice",
  active: true,
};

function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(greet(user));
```

```shell
pnpm install
pnpm run dev
```

## Front Matter

`footer` is embedded in an exported HTML as a CSS variable, so that it can be used by an HTML-to-PDF converter. Other attributes are unsupported for now.

## Sharing

File > Export HTML generates `<filename>.html` and `<filename>.assets/styles.css`. Select `<filename>.html`, `<filename>.md`, and `<filename>.assets` on Finder, right-click, then choose Compress. Now you have a single archive file. If you want to sign on it, you can (using an external tool such as [GPG Suite](https://gpgtools.org/)).

`<filename>.assets` contains all styles and fonts used in the document, so if the receiving party has Wright, they can edit and comment on the markdown file in your compressed archive file.

## Extra

Trailing space 

Missspell café あいうえお

“Curly” ‘Quote’ highlighted

## Editor Config

On the menu bar, find "Settings..." under "Wright". This opens the app's config folder (`~/Library/Application Support/com.takahirokosaka.wright`). At first it contains empty `config.toml`, `custom.css`, and `fonts` folder.

<div class="terminal"><span style="color: var(--ansi-bright-magenta);">~</span><span style="color: var(--ansi-bright-blue);"> %</span> <span style="color: var(--ansi-green);">cat</span> <span style="text-decoration: underline;">config.toml</span>
[window]
width = 684
height = 1082
&nbsp;
[editor]
assets_suffix = &quot;media/lfs&quot;
</div>

## Custom Style Sheet

`~/Library/Application Support/com.takahirokosaka.wright/custom.css`

JavaScript development console is enabled in the production build so that you can inspect elements and stylize them. The default css (`styles-default.css`) can be found in the git repository of this editor. Start by copying it as `custom.css` then edit it as you like.



The End.

Happy writing! ✍️



012345678901234567890123456789012345678901234567890123456789

</div>