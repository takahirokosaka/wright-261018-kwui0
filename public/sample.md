---
footer: foot foot foot あいうえお
---

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

Fonts you want to use must be installed on your operating system. You can also render Material Symbols icons if you install them: <span class="material-symbols-outlined" >search</span>.

## Table

Unsupported. Simple tables can be drawn using ASCII art. More complex tables and formatting usually require a spreadsheet. Paste them as an SVG.

<pre>
┌───────┬─────┬────────┐
│ Name  │ Age │ City   │
├───────┼─────┼────────┤
│ Alice │  25 │ Tokyo  │
│ Bob   │  30 │ Osaka  │
│ Carol │  28 │ Nagoya │
└───────┴─────┴────────┘
</pre>

## Highlight

==Highlight Default Yellow (Cmd/Ctrl+Shift+H)== =={red}Red== =={orange}Orange== =={green}Green== =={blue}Blue== =={purple}Purple== =={pink}Pink== =={gray}Gray==

Gray can be used for collaborative editing (Cmd/Ctrl+Shift+M, M is for mute).

## Horizontal Rule

Content above the divider.

---

Content below the divider.

## Images

Large images shrink to the width.

![Placeholder image](https://placehold.co/2000)

A local images of an absolute path:

![Local aboluste](</Library/WebServer/share/httpd/manual/images/build_a_mod_3.png>)

Drag & drop an image file from Finder. As below, a relative path appears if this markdown file is saved on the disk. Put `!` just before the image tag to make the image appear.

![local](<./Untitled.assets/lfs/paste-2026-10-22T05-29-43.065Z.png>)

Images can also be rendered as block elements.

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
 <p>This section tests whether your Markdown renderer supports inline HTML.</p>
</div>

## Mathematical Expressions

This editor uses MathJax (because it can export math expressions to SVGs. Rendered SVGs are cached and the editor doesn't repeat rendering on every key typing somewhere else. TODO: Clean up the cache.) Exported HTMLs have these SVGs embedded.

Inline math: $E = mc^2$

Block math:

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

<div class="terminal"><span style="color: rgb(255,95,215); font-weight: 700;">takahiro</span><span style="font-weight: 700;">@</span><span style="color: rgb(80,250,123); font-weight: 700;">dc1</span><span style="font-weight: 700;">:~ </span><span style="color: rgb(189,147,249); font-weight: 700;">%</span> <span style="color: rgb(80,250,123); text-decoration: underline;">sudo</span> <span style="color: rgb(80,250,123);">samba-tool</span> domain backup online --server=dc1 --targetdir=/backup/ad
<span style="color: rgb(255,95,215); font-weight: 700;">takahiro</span><span style="font-weight: 700;">@</span><span style="color: rgb(80,250,123); font-weight: 700;">dc1</span><span style="font-weight: 700;">:~ </span><span style="color: rgb(189,147,249); font-weight: 700;">%</span> <span style="color: rgb(241,250,140);">for</span> i in {0..9}; <span style="color: rgb(241,250,140);">do</span> <span style="color: rgb(80,250,123);">echo</span> -n <span style="color: rgb(241,250,140);">&#39;aaaaaaaaaaaaaaaaaaaa &#39;</span>; <span style="color: rgb(241,250,140);">done</span>
aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa <span style="font-weight: 700; filter: invert(100%);">%</span>                             <span style="color: rgb(255,95,215); font-weight: 700;">takahiro</span><span style="font-weight: 700;">@</span><span style="color: rgb(80,250,123); font-weight: 700;">dc1</span><span style="font-weight: 700;">:~ </span><span style="color: rgb(189,147,249); font-weight: 700;">%</span>
</div>

## Front Matter

`footer` is embedded in an exported HTML as a CSS variable, so that it can be used by an HTML-to-PDF converter. Other attributes are unsupported for now.

## Extra

Trailing space 

Missspell café あいうえお

<pre class="terminal">
<span style="color: rgb(255,146,208);">~</span><span style="color: rgb(202,169,255);"> %</span> <span style="color: rgb(80,250,123);">date</span> | <span style="color: rgb(80,250,123);">figlet</span> | <span style="color: rgb(80,250,123);">lolcat</span>
<span style="color: rgb(58,254,71);"> </span><span style="color: rgb(61,254,67);">_</span><span style="color: rgb(65,254,63);">_</span><span style="color: rgb(68,254,60);">_</span><span style="color: rgb(72,254,56);">_</span><span style="color: rgb(76,254,53);">_</span><span style="color: rgb(80,253,49);"> </span><span style="color: rgb(84,253,46);"> </span><span style="color: rgb(88,252,43);"> </span><span style="color: rgb(92,251,40);"> </span><span style="color: rgb(96,250,37);"> </span><span style="color: rgb(100,249,34);">_</span><span style="color: rgb(104,247,31);"> </span><span style="color: rgb(109,246,28);"> </span><span style="color: rgb(113,244,26);"> </span><span style="color: rgb(117,242,23);"> </span><span style="color: rgb(121,241,21);">_</span><span style="color: rgb(125,239,19);">_</span><span style="color: rgb(130,236,16);">_</span><span style="color: rgb(134,234,14);"> </span><span style="color: rgb(138,232,13);"> </span><span style="color: rgb(142,229,11);"> </span><span style="color: rgb(146,227,9);"> </span><span style="color: rgb(151,224,8);"> </span><span style="color: rgb(155,221,6);"> </span><span style="color: rgb(159,218,5);"> </span><span style="color: rgb(163,215,4);">_</span><span style="color: rgb(167,212,3);"> </span><span style="color: rgb(171,209,2);"> </span><span style="color: rgb(175,206,2);"> </span><span style="color: rgb(179,202,1);"> </span><span style="color: rgb(183,199,1);"> </span><span style="color: rgb(187,195,1);">_</span><span style="color: rgb(190,192,1);">_</span><span style="color: rgb(194,188,1);">_</span><span style="color: rgb(197,184,1);">_</span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);"> </span><span style="color: rgb(208,173,2);">_</span><span style="color: rgb(211,169,3);">_</span><span style="color: rgb(214,165,4);">_</span><span style="color: rgb(217,161,5);">_</span><span style="color: rgb(220,157,6);">_</span><span style="color: rgb(223,152,7);"> </span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);"> </span><span style="color: rgb(231,140,12);">_</span><span style="color: rgb(233,136,14);"> </span><span style="color: rgb(236,131,16);">_</span><span style="color: rgb(238,127,18);"> </span><span style="color: rgb(240,123,20);"> </span><span style="color: rgb(242,119,22);"> </span><span style="color: rgb(243,114,25);">_</span><span style="color: rgb(245,110,27);"> </span><span style="color: rgb(247,106,30);">_</span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);"> </span><span style="color: rgb(250,94,38);"> </span><span style="color: rgb(251,90,41);">_</span><span style="color: rgb(252,86,45);">_</span><span style="color: rgb(253,82,48);">_</span><span style="color: rgb(254,78,51);">_</span><span style="color: rgb(254,74,55);"> </span><span style="color: rgb(254,70,58);"> </span><span style="color: rgb(254,66,62);"> </span><span style="color: rgb(254,63,65);">_</span><span style="color: rgb(254,59,69);">_</span><span style="color: rgb(254,55,73);"> </span><span style="color: rgb(254,52,77);"> </span><span style="color: rgb(253,49,81);"> </span>
<span style="color: rgb(68,254,60);">|</span><span style="color: rgb(72,254,56);"> </span><span style="color: rgb(76,254,53);"> </span><span style="color: rgb(80,253,49);">_</span><span style="color: rgb(84,253,46);">_</span><span style="color: rgb(88,252,43);">_</span><span style="color: rgb(92,251,40);">|</span><span style="color: rgb(96,250,37);"> </span><span style="color: rgb(100,249,34);">_</span><span style="color: rgb(104,247,31);">_</span><span style="color: rgb(109,246,28);">(</span><span style="color: rgb(113,244,26);">_</span><span style="color: rgb(117,242,23);">)</span><span style="color: rgb(121,241,21);"> </span><span style="color: rgb(125,239,19);"> </span><span style="color: rgb(130,236,16);">/</span><span style="color: rgb(134,234,14);"> </span><span style="color: rgb(138,232,13);">_</span><span style="color: rgb(142,229,11);"> </span><span style="color: rgb(146,227,9);">\</span><span style="color: rgb(151,224,8);"> </span><span style="color: rgb(155,221,6);"> </span><span style="color: rgb(159,218,5);">_</span><span style="color: rgb(163,215,4);">_</span><span style="color: rgb(167,212,3);">_</span><span style="color: rgb(171,209,2);">|</span><span style="color: rgb(175,206,2);"> </span><span style="color: rgb(179,202,1);">|</span><span style="color: rgb(183,199,1);">_</span><span style="color: rgb(187,195,1);"> </span><span style="color: rgb(190,192,1);"> </span><span style="color: rgb(194,188,1);">|</span><span style="color: rgb(197,184,1);">_</span><span style="color: rgb(201,180,1);">_</span><span style="color: rgb(204,177,2);">_</span><span style="color: rgb(208,173,2);"> </span><span style="color: rgb(211,169,3);">\</span><span style="color: rgb(214,165,4);">|</span><span style="color: rgb(217,161,5);">_</span><span style="color: rgb(220,157,6);">_</span><span style="color: rgb(223,152,7);">_</span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);">/</span><span style="color: rgb(231,140,12);"> </span><span style="color: rgb(233,136,14);"> </span><span style="color: rgb(236,131,16);">/</span><span style="color: rgb(238,127,18);"> </span><span style="color: rgb(240,123,20);">/</span><span style="color: rgb(242,119,22);"> </span><span style="color: rgb(243,114,25);">|</span><span style="color: rgb(245,110,27);">_</span><span style="color: rgb(247,106,30);">/</span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);">/</span><span style="color: rgb(250,94,38);"> </span><span style="color: rgb(251,90,41);">|</span><span style="color: rgb(252,86,45);">_</span><span style="color: rgb(253,82,48);">|</span><span style="color: rgb(254,78,51);"> </span><span style="color: rgb(254,74,55);">_</span><span style="color: rgb(254,70,58);">_</span><span style="color: rgb(254,66,62);">_</span><span style="color: rgb(254,63,65);">|</span><span style="color: rgb(254,59,69);"> </span><span style="color: rgb(254,55,73);">/</span><span style="color: rgb(254,52,77);"> </span><span style="color: rgb(253,49,81);">/</span><span style="color: rgb(252,45,85);">_</span><span style="color: rgb(252,42,89);"> </span><span style="color: rgb(251,39,93);"> </span>
<span style="color: rgb(80,253,49);">|</span><span style="color: rgb(84,253,46);"> </span><span style="color: rgb(88,252,43);">|</span><span style="color: rgb(92,251,40);">_</span><span style="color: rgb(96,250,37);"> </span><span style="color: rgb(100,249,34);">|</span><span style="color: rgb(104,247,31);"> </span><span style="color: rgb(109,246,28);">&#39;</span><span style="color: rgb(113,244,26);">_</span><span style="color: rgb(117,242,23);">_</span><span style="color: rgb(121,241,21);">|</span><span style="color: rgb(125,239,19);"> </span><span style="color: rgb(130,236,16);">|</span><span style="color: rgb(134,234,14);"> </span><span style="color: rgb(138,232,13);">|</span><span style="color: rgb(142,229,11);"> </span><span style="color: rgb(146,227,9);">|</span><span style="color: rgb(151,224,8);"> </span><span style="color: rgb(155,221,6);">|</span><span style="color: rgb(159,218,5);"> </span><span style="color: rgb(163,215,4);">|</span><span style="color: rgb(167,212,3);">/</span><span style="color: rgb(171,209,2);"> </span><span style="color: rgb(175,206,2);">_</span><span style="color: rgb(179,202,1);">_</span><span style="color: rgb(183,199,1);">|</span><span style="color: rgb(187,195,1);"> </span><span style="color: rgb(190,192,1);">_</span><span style="color: rgb(194,188,1);">_</span><span style="color: rgb(197,184,1);">|</span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);"> </span><span style="color: rgb(208,173,2);"> </span><span style="color: rgb(211,169,3);">_</span><span style="color: rgb(214,165,4);">_</span><span style="color: rgb(217,161,5);">)</span><span style="color: rgb(220,157,6);"> </span><span style="color: rgb(223,152,7);">|</span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);">|</span><span style="color: rgb(231,140,12);">_</span><span style="color: rgb(233,136,14);"> </span><span style="color: rgb(236,131,16);">\</span><span style="color: rgb(238,127,18);"> </span><span style="color: rgb(240,123,20);"> </span><span style="color: rgb(242,119,22);">|</span><span style="color: rgb(243,114,25);"> </span><span style="color: rgb(245,110,27);">|</span><span style="color: rgb(247,106,30);"> </span><span style="color: rgb(248,102,33);">(</span><span style="color: rgb(249,98,35);">_</span><span style="color: rgb(250,94,38);">)</span><span style="color: rgb(251,90,41);"> </span><span style="color: rgb(252,86,45);">|</span><span style="color: rgb(253,82,48);"> </span><span style="color: rgb(254,78,51);">(</span><span style="color: rgb(254,74,55);">_</span><span style="color: rgb(254,70,58);">)</span><span style="color: rgb(254,66,62);">_</span><span style="color: rgb(254,63,65);">_</span><span style="color: rgb(254,59,69);">_</span><span style="color: rgb(254,55,73);"> </span><span style="color: rgb(254,52,77);">\</span><span style="color: rgb(253,49,81);">|</span><span style="color: rgb(252,45,85);"> </span><span style="color: rgb(252,42,89);">&#39;</span><span style="color: rgb(251,39,93);">_</span><span style="color: rgb(250,36,97);"> </span><span style="color: rgb(248,33,101);">\</span><span style="color: rgb(247,30,105);"> </span>
<span style="color: rgb(92,251,40);">|</span><span style="color: rgb(96,250,37);"> </span><span style="color: rgb(100,249,34);"> </span><span style="color: rgb(104,247,31);">_</span><span style="color: rgb(109,246,28);">|</span><span style="color: rgb(113,244,26);">|</span><span style="color: rgb(117,242,23);"> </span><span style="color: rgb(121,241,21);">|</span><span style="color: rgb(125,239,19);"> </span><span style="color: rgb(130,236,16);"> </span><span style="color: rgb(134,234,14);">|</span><span style="color: rgb(138,232,13);"> </span><span style="color: rgb(142,229,11);">|</span><span style="color: rgb(146,227,9);"> </span><span style="color: rgb(151,224,8);">|</span><span style="color: rgb(155,221,6);"> </span><span style="color: rgb(159,218,5);">|</span><span style="color: rgb(163,215,4);">_</span><span style="color: rgb(167,212,3);">|</span><span style="color: rgb(171,209,2);"> </span><span style="color: rgb(175,206,2);">|</span><span style="color: rgb(179,202,1);"> </span><span style="color: rgb(183,199,1);">(</span><span style="color: rgb(187,195,1);">_</span><span style="color: rgb(190,192,1);">_</span><span style="color: rgb(194,188,1);">|</span><span style="color: rgb(197,184,1);"> </span><span style="color: rgb(201,180,1);">|</span><span style="color: rgb(204,177,2);">_</span><span style="color: rgb(208,173,2);"> </span><span style="color: rgb(211,169,3);"> </span><span style="color: rgb(214,165,4);"> </span><span style="color: rgb(217,161,5);">/</span><span style="color: rgb(220,157,6);"> </span><span style="color: rgb(223,152,7);">_</span><span style="color: rgb(226,148,9);">_</span><span style="color: rgb(228,144,10);">/</span><span style="color: rgb(231,140,12);"> </span><span style="color: rgb(233,136,14);">_</span><span style="color: rgb(236,131,16);">_</span><span style="color: rgb(238,127,18);">_</span><span style="color: rgb(240,123,20);">)</span><span style="color: rgb(242,119,22);"> </span><span style="color: rgb(243,114,25);">|</span><span style="color: rgb(245,110,27);"> </span><span style="color: rgb(247,106,30);">|</span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);">|</span><span style="color: rgb(250,94,38);"> </span><span style="color: rgb(251,90,41);">|</span><span style="color: rgb(252,86,45);">_</span><span style="color: rgb(253,82,48);">|</span><span style="color: rgb(254,78,51);"> </span><span style="color: rgb(254,74,55);">|</span><span style="color: rgb(254,70,58);"> </span><span style="color: rgb(254,66,62);">|</span><span style="color: rgb(254,63,65);">_</span><span style="color: rgb(254,59,69);"> </span><span style="color: rgb(254,55,73);">_</span><span style="color: rgb(254,52,77);">_</span><span style="color: rgb(253,49,81);">_</span><span style="color: rgb(252,45,85);">)</span><span style="color: rgb(252,42,89);"> </span><span style="color: rgb(251,39,93);">|</span><span style="color: rgb(250,36,97);"> </span><span style="color: rgb(248,33,101);">(</span><span style="color: rgb(247,30,105);">_</span><span style="color: rgb(245,28,109);">)</span><span style="color: rgb(244,25,113);"> </span><span style="color: rgb(242,23,118);">|</span>
<span style="color: rgb(104,247,31);">|</span><span style="color: rgb(109,246,28);">_</span><span style="color: rgb(113,244,26);">|</span><span style="color: rgb(117,242,23);"> </span><span style="color: rgb(121,241,21);"> </span><span style="color: rgb(125,239,19);">|</span><span style="color: rgb(130,236,16);">_</span><span style="color: rgb(134,234,14);">|</span><span style="color: rgb(138,232,13);"> </span><span style="color: rgb(142,229,11);"> </span><span style="color: rgb(146,227,9);">|</span><span style="color: rgb(151,224,8);">_</span><span style="color: rgb(155,221,6);">|</span><span style="color: rgb(159,218,5);"> </span><span style="color: rgb(163,215,4);"> </span><span style="color: rgb(167,212,3);">\</span><span style="color: rgb(171,209,2);">_</span><span style="color: rgb(175,206,2);">_</span><span style="color: rgb(179,202,1);">_</span><span style="color: rgb(183,199,1);">/</span><span style="color: rgb(187,195,1);"> </span><span style="color: rgb(190,192,1);">\</span><span style="color: rgb(194,188,1);">_</span><span style="color: rgb(197,184,1);">_</span><span style="color: rgb(201,180,1);">_</span><span style="color: rgb(204,177,2);">|</span><span style="color: rgb(208,173,2);">\</span><span style="color: rgb(211,169,3);">_</span><span style="color: rgb(214,165,4);">_</span><span style="color: rgb(217,161,5);">|</span><span style="color: rgb(220,157,6);"> </span><span style="color: rgb(223,152,7);">|</span><span style="color: rgb(226,148,9);">_</span><span style="color: rgb(228,144,10);">_</span><span style="color: rgb(231,140,12);">_</span><span style="color: rgb(233,136,14);">_</span><span style="color: rgb(236,131,16);">_</span><span style="color: rgb(238,127,18);">|</span><span style="color: rgb(240,123,20);">_</span><span style="color: rgb(242,119,22);">_</span><span style="color: rgb(243,114,25);">_</span><span style="color: rgb(245,110,27);">_</span><span style="color: rgb(247,106,30);">/</span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);"> </span><span style="color: rgb(250,94,38);">|</span><span style="color: rgb(251,90,41);">_</span><span style="color: rgb(252,86,45);">|</span><span style="color: rgb(253,82,48);">_</span><span style="color: rgb(254,78,51);">(</span><span style="color: rgb(254,74,55);">_</span><span style="color: rgb(254,70,58);">)</span><span style="color: rgb(254,66,62);">_</span><span style="color: rgb(254,63,65);">|</span><span style="color: rgb(254,59,69);">_</span><span style="color: rgb(254,55,73);">(</span><span style="color: rgb(254,52,77);">_</span><span style="color: rgb(253,49,81);">)</span><span style="color: rgb(252,45,85);">_</span><span style="color: rgb(252,42,89);">_</span><span style="color: rgb(251,39,93);">_</span><span style="color: rgb(250,36,97);">_</span><span style="color: rgb(248,33,101);">/</span><span style="color: rgb(247,30,105);"> </span><span style="color: rgb(245,28,109);">\</span><span style="color: rgb(244,25,113);">_</span><span style="color: rgb(242,23,118);">_</span><span style="color: rgb(240,20,122);">_</span><span style="color: rgb(238,18,126);">/</span><span style="color: rgb(236,16,130);"> </span>
<span style="color: rgb(117,242,23);"> </span><span style="color: rgb(121,241,21);"> </span><span style="color: rgb(125,239,19);"> </span><span style="color: rgb(130,236,16);"> </span><span style="color: rgb(134,234,14);"> </span><span style="color: rgb(138,232,13);"> </span><span style="color: rgb(142,229,11);"> </span><span style="color: rgb(146,227,9);"> </span><span style="color: rgb(151,224,8);"> </span><span style="color: rgb(155,221,6);"> </span><span style="color: rgb(159,218,5);"> </span><span style="color: rgb(163,215,4);"> </span><span style="color: rgb(167,212,3);"> </span><span style="color: rgb(171,209,2);"> </span><span style="color: rgb(175,206,2);"> </span><span style="color: rgb(179,202,1);"> </span><span style="color: rgb(183,199,1);"> </span><span style="color: rgb(187,195,1);"> </span><span style="color: rgb(190,192,1);"> </span><span style="color: rgb(194,188,1);"> </span><span style="color: rgb(197,184,1);"> </span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);"> </span><span style="color: rgb(208,173,2);"> </span><span style="color: rgb(211,169,3);"> </span><span style="color: rgb(214,165,4);"> </span><span style="color: rgb(217,161,5);"> </span><span style="color: rgb(220,157,6);"> </span><span style="color: rgb(223,152,7);"> </span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);"> </span><span style="color: rgb(231,140,12);"> </span><span style="color: rgb(233,136,14);"> </span><span style="color: rgb(236,131,16);"> </span><span style="color: rgb(238,127,18);"> </span><span style="color: rgb(240,123,20);"> </span><span style="color: rgb(242,119,22);"> </span><span style="color: rgb(243,114,25);"> </span><span style="color: rgb(245,110,27);"> </span><span style="color: rgb(247,106,30);"> </span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);"> </span><span style="color: rgb(250,94,38);"> </span><span style="color: rgb(251,90,41);"> </span><span style="color: rgb(252,86,45);"> </span><span style="color: rgb(253,82,48);"> </span><span style="color: rgb(254,78,51);"> </span><span style="color: rgb(254,74,55);"> </span><span style="color: rgb(254,70,58);"> </span><span style="color: rgb(254,66,62);"> </span><span style="color: rgb(254,63,65);"> </span><span style="color: rgb(254,59,69);"> </span><span style="color: rgb(254,55,73);"> </span><span style="color: rgb(254,52,77);"> </span><span style="color: rgb(253,49,81);"> </span><span style="color: rgb(252,45,85);"> </span><span style="color: rgb(252,42,89);"> </span><span style="color: rgb(251,39,93);"> </span><span style="color: rgb(250,36,97);"> </span><span style="color: rgb(248,33,101);"> </span><span style="color: rgb(247,30,105);"> </span><span style="color: rgb(245,28,109);"> </span><span style="color: rgb(244,25,113);"> </span><span style="color: rgb(242,23,118);"> </span><span style="color: rgb(240,20,122);"> </span><span style="color: rgb(238,18,126);"> </span><span style="color: rgb(236,16,130);"> </span><span style="color: rgb(234,14,135);"> </span><span style="color: rgb(231,12,139);"> </span><span style="color: rgb(229,11,143);"> </span>
<span style="color: rgb(130,236,16);"> </span><span style="color: rgb(134,234,14);">_</span><span style="color: rgb(138,232,13);"> </span><span style="color: rgb(142,229,11);"> </span><span style="color: rgb(146,227,9);"> </span><span style="color: rgb(151,224,8);">_</span><span style="color: rgb(155,221,6);"> </span><span style="color: rgb(159,218,5);">_</span><span style="color: rgb(163,215,4);">_</span><span style="color: rgb(167,212,3);">_</span><span style="color: rgb(171,209,2);">_</span><span style="color: rgb(175,206,2);">_</span><span style="color: rgb(179,202,1);"> </span><span style="color: rgb(183,199,1);">_</span><span style="color: rgb(187,195,1);">_</span><span style="color: rgb(190,192,1);">_</span><span style="color: rgb(194,188,1);">_</span><span style="color: rgb(197,184,1);"> </span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);"> </span><span style="color: rgb(208,173,2);">_</span><span style="color: rgb(211,169,3);">_</span><span style="color: rgb(214,165,4);">_</span><span style="color: rgb(217,161,5);">_</span><span style="color: rgb(220,157,6);"> </span><span style="color: rgb(223,152,7);"> </span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);">_</span><span style="color: rgb(231,140,12);">_</span><span style="color: rgb(233,136,14);">_</span><span style="color: rgb(236,131,16);"> </span><span style="color: rgb(238,127,18);">_</span><span style="color: rgb(240,123,20);">_</span><span style="color: rgb(242,119,22);">_</span><span style="color: rgb(243,114,25);">_</span><span style="color: rgb(245,110,27);"> </span><span style="color: rgb(247,106,30);"> </span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);">_</span><span style="color: rgb(250,94,38);">_</span><span style="color: rgb(251,90,41);"> </span><span style="color: rgb(252,86,45);"> </span><span style="color: rgb(253,82,48);"> </span>
<span style="color: rgb(142,229,11);">|</span><span style="color: rgb(146,227,9);"> </span><span style="color: rgb(151,224,8);">|</span><span style="color: rgb(155,221,6);"> </span><span style="color: rgb(159,218,5);">|</span><span style="color: rgb(163,215,4);"> </span><span style="color: rgb(167,212,3);">|</span><span style="color: rgb(171,209,2);">_</span><span style="color: rgb(175,206,2);"> </span><span style="color: rgb(179,202,1);"> </span><span style="color: rgb(183,199,1);"> </span><span style="color: rgb(187,195,1);">_</span><span style="color: rgb(190,192,1);">/</span><span style="color: rgb(194,188,1);"> </span><span style="color: rgb(197,184,1);">_</span><span style="color: rgb(201,180,1);">_</span><span style="color: rgb(204,177,2);">_</span><span style="color: rgb(208,173,2);">|</span><span style="color: rgb(211,169,3);"> </span><span style="color: rgb(214,165,4);">|</span><span style="color: rgb(217,161,5);">_</span><span style="color: rgb(220,157,6);">_</span><span style="color: rgb(223,152,7);">_</span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);">\</span><span style="color: rgb(231,140,12);"> </span><span style="color: rgb(233,136,14);">/</span><span style="color: rgb(236,131,16);"> </span><span style="color: rgb(238,127,18);">_</span><span style="color: rgb(240,123,20);"> </span><span style="color: rgb(242,119,22);">\</span><span style="color: rgb(243,114,25);">_</span><span style="color: rgb(245,110,27);">_</span><span style="color: rgb(247,106,30);">_</span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);">\</span><span style="color: rgb(250,94,38);"> </span><span style="color: rgb(251,90,41);">/</span><span style="color: rgb(252,86,45);"> </span><span style="color: rgb(253,82,48);">/</span><span style="color: rgb(254,78,51);">_</span><span style="color: rgb(254,74,55);"> </span><span style="color: rgb(254,70,58);"> </span>
<span style="color: rgb(155,221,6);">|</span><span style="color: rgb(159,218,5);"> </span><span style="color: rgb(163,215,4);">|</span><span style="color: rgb(167,212,3);"> </span><span style="color: rgb(171,209,2);">|</span><span style="color: rgb(175,206,2);"> </span><span style="color: rgb(179,202,1);">|</span><span style="color: rgb(183,199,1);"> </span><span style="color: rgb(187,195,1);">|</span><span style="color: rgb(190,192,1);"> </span><span style="color: rgb(194,188,1);">|</span><span style="color: rgb(197,184,1);">|</span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);">|</span><span style="color: rgb(208,173,2);"> </span><span style="color: rgb(211,169,3);"> </span><span style="color: rgb(214,165,4);"> </span><span style="color: rgb(217,161,5);"> </span><span style="color: rgb(220,157,6);"> </span><span style="color: rgb(223,152,7);"> </span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);">_</span><span style="color: rgb(231,140,12);">_</span><span style="color: rgb(233,136,14);">)</span><span style="color: rgb(236,131,16);"> </span><span style="color: rgb(238,127,18);">|</span><span style="color: rgb(240,123,20);"> </span><span style="color: rgb(242,119,22);">|</span><span style="color: rgb(243,114,25);"> </span><span style="color: rgb(245,110,27);">|</span><span style="color: rgb(247,106,30);"> </span><span style="color: rgb(248,102,33);">|</span><span style="color: rgb(249,98,35);">_</span><span style="color: rgb(250,94,38);">_</span><span style="color: rgb(251,90,41);">)</span><span style="color: rgb(252,86,45);"> </span><span style="color: rgb(253,82,48);">|</span><span style="color: rgb(254,78,51);"> </span><span style="color: rgb(254,74,55);">&#39;</span><span style="color: rgb(254,70,58);">_</span><span style="color: rgb(254,66,62);"> </span><span style="color: rgb(254,63,65);">\</span><span style="color: rgb(254,59,69);"> </span>
<span style="color: rgb(167,212,3);">|</span><span style="color: rgb(171,209,2);"> </span><span style="color: rgb(175,206,2);">|</span><span style="color: rgb(179,202,1);">_</span><span style="color: rgb(183,199,1);">|</span><span style="color: rgb(187,195,1);"> </span><span style="color: rgb(190,192,1);">|</span><span style="color: rgb(194,188,1);"> </span><span style="color: rgb(197,184,1);">|</span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);">|</span><span style="color: rgb(208,173,2);">|</span><span style="color: rgb(211,169,3);"> </span><span style="color: rgb(214,165,4);">|</span><span style="color: rgb(217,161,5);">_</span><span style="color: rgb(220,157,6);">_</span><span style="color: rgb(223,152,7);">_</span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);"> </span><span style="color: rgb(231,140,12);"> </span><span style="color: rgb(233,136,14);">/</span><span style="color: rgb(236,131,16);"> </span><span style="color: rgb(238,127,18);">_</span><span style="color: rgb(240,123,20);">_</span><span style="color: rgb(242,119,22);">/</span><span style="color: rgb(243,114,25);">|</span><span style="color: rgb(245,110,27);"> </span><span style="color: rgb(247,106,30);">|</span><span style="color: rgb(248,102,33);">_</span><span style="color: rgb(249,98,35);">|</span><span style="color: rgb(250,94,38);"> </span><span style="color: rgb(251,90,41);">/</span><span style="color: rgb(252,86,45);"> </span><span style="color: rgb(253,82,48);">_</span><span style="color: rgb(254,78,51);">_</span><span style="color: rgb(254,74,55);">/</span><span style="color: rgb(254,70,58);">|</span><span style="color: rgb(254,66,62);"> </span><span style="color: rgb(254,63,65);">(</span><span style="color: rgb(254,59,69);">_</span><span style="color: rgb(254,55,73);">)</span><span style="color: rgb(254,52,77);"> </span><span style="color: rgb(253,49,81);">|</span>
<span style="color: rgb(179,202,1);"> </span><span style="color: rgb(183,199,1);">\</span><span style="color: rgb(187,195,1);">_</span><span style="color: rgb(190,192,1);">_</span><span style="color: rgb(194,188,1);">_</span><span style="color: rgb(197,184,1);">/</span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);"> </span><span style="color: rgb(208,173,2);">|</span><span style="color: rgb(211,169,3);">_</span><span style="color: rgb(214,165,4);">|</span><span style="color: rgb(217,161,5);"> </span><span style="color: rgb(220,157,6);">\</span><span style="color: rgb(223,152,7);">_</span><span style="color: rgb(226,148,9);">_</span><span style="color: rgb(228,144,10);">_</span><span style="color: rgb(231,140,12);">_</span><span style="color: rgb(233,136,14);">|</span><span style="color: rgb(236,131,16);"> </span><span style="color: rgb(238,127,18);">|</span><span style="color: rgb(240,123,20);">_</span><span style="color: rgb(242,119,22);">_</span><span style="color: rgb(243,114,25);">_</span><span style="color: rgb(245,110,27);">_</span><span style="color: rgb(247,106,30);">_</span><span style="color: rgb(248,102,33);">|</span><span style="color: rgb(249,98,35);">\</span><span style="color: rgb(250,94,38);">_</span><span style="color: rgb(251,90,41);">_</span><span style="color: rgb(252,86,45);">_</span><span style="color: rgb(253,82,48);">/</span><span style="color: rgb(254,78,51);">_</span><span style="color: rgb(254,74,55);">_</span><span style="color: rgb(254,70,58);">_</span><span style="color: rgb(254,66,62);">_</span><span style="color: rgb(254,63,65);">_</span><span style="color: rgb(254,59,69);">|</span><span style="color: rgb(254,55,73);">\</span><span style="color: rgb(254,52,77);">_</span><span style="color: rgb(253,49,81);">_</span><span style="color: rgb(252,45,85);">_</span><span style="color: rgb(252,42,89);">/</span><span style="color: rgb(251,39,93);"> </span>
<span style="color: rgb(190,192,1);"> </span><span style="color: rgb(194,188,1);"> </span><span style="color: rgb(197,184,1);"> </span><span style="color: rgb(201,180,1);"> </span><span style="color: rgb(204,177,2);"> </span><span style="color: rgb(208,173,2);"> </span><span style="color: rgb(211,169,3);"> </span><span style="color: rgb(214,165,4);"> </span><span style="color: rgb(217,161,5);"> </span><span style="color: rgb(220,157,6);"> </span><span style="color: rgb(223,152,7);"> </span><span style="color: rgb(226,148,9);"> </span><span style="color: rgb(228,144,10);"> </span><span style="color: rgb(231,140,12);"> </span><span style="color: rgb(233,136,14);"> </span><span style="color: rgb(236,131,16);"> </span><span style="color: rgb(238,127,18);"> </span><span style="color: rgb(240,123,20);"> </span><span style="color: rgb(242,119,22);"> </span><span style="color: rgb(243,114,25);"> </span><span style="color: rgb(245,110,27);"> </span><span style="color: rgb(247,106,30);"> </span><span style="color: rgb(248,102,33);"> </span><span style="color: rgb(249,98,35);"> </span><span style="color: rgb(250,94,38);"> </span><span style="color: rgb(251,90,41);"> </span><span style="color: rgb(252,86,45);"> </span><span style="color: rgb(253,82,48);"> </span><span style="color: rgb(254,78,51);"> </span><span style="color: rgb(254,74,55);"> </span><span style="color: rgb(254,70,58);"> </span><span style="color: rgb(254,66,62);"> </span><span style="color: rgb(254,63,65);"> </span><span style="color: rgb(254,59,69);"> </span><span style="color: rgb(254,55,73);"> </span><span style="color: rgb(254,52,77);"> </span><span style="color: rgb(253,49,81);"> </span><span style="color: rgb(252,45,85);"> </span><span style="color: rgb(252,42,89);"> </span><span style="color: rgb(251,39,93);"> </span><span style="color: rgb(250,36,97);"> </span><span style="color: rgb(248,33,101);"> </span><span style="color: rgb(247,30,105);"> </span>
<span style="color: rgb(255,146,208);">~</span><span style="color: rgb(202,169,255);"> %</span>
</pre>


The End.

Happy writing! ✍️


012345678901234567890123456789012345678901234567890123456789
