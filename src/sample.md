# Markdown Editor Demo

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

The above does not work when exporting HTML. Marked.js treats indentation as list nesting:

1. Plan the project
   1. Write the code
      1. Test the application
2. Release the final version

### Task List

Unsupported.

## Raw HTML

Raw HTML elements are rendered. Mouse-over to see their borders. Examples:

`<pre>`

<pre>abc edt
wef
weawf
</pre>
<p></p>

`<div>`

<div style="padding: 12px; border: 1px solid #888; border-radius: 4px;">
 <strong>HTML block</strong>
 <p>This section tests whether your Markdown renderer supports inline HTML.</p>
</div>

## Mathematical Expressions

Inline math: $E = mc^2$

Block math:

$$
QoL = \int_{birth}^{death} \frac{Pleasure}{Pain}dt
$$

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
Be careful!
:::

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
npm install
npm run dev
npm run build
```

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

## Text Formatting

This is a paragraph with **bold** text, *italic* text, ~~strikethrough~~, and `inline code`.

You can also combine formatting: ***bold and italic***.

Here is a [link](https://commonmark.org/help) to the Markdown Guide.

## Link

[Google](https://example.com)

Image link <a href="https://placehold.co/18"><img src="https://placehold.co/18"></a>

[Local file of an absolute path](</Library/WebServer/share/httpd/manual/images/build_a_mod_3.png>) is clickable.

[Local file of a relative path](<./Untitled2.md>) is clickable when this markdown file is saved on the disk.

This does not work in CodeMirror \[![Alt text](https://placehold.co/300x200)](https://google.com). Check https://codemirror-live-markdown.vercel.app.

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

A local images of a relative path appears when this markdown file is saved on the disk.

![local](<./Untitled.assets/lfs/paste-2026-10-22T05-29-43.065Z.png>)

Images can also be rendered as block elements.

<a href="https://placehold.co/100"><img src="https://placehold.co/100" style="display:block;"></a>

## Empty Line

Empty lines are rendered with a half line height. You can make a vertical space by pressing Enter key many times.








We use empty lines as margins between paragraphs. An empty line is also used to make a margin between a heading and the next line of text, because a heading cannot have margins above or below it. Margins interfere with pointer-to-document position mapping if they alter the geometry CodeMirror expects. As a result, clicking on a line won't work as expected if lines have margins.

When exporting HTML, contiguous empty lines are handled as one empty line, which is a paragraph separator.

## Escaping Special Characters

Use a backslash to display Markdown characters literally:

\*This text is not italic.\*

\# This is not a heading.

\`This is not inline code.\`

## Footnotes

Unsupported. The below does not work.

Here is a sentence with a footnote reference.[^1]

[^1]: This is the footnote content.

## Extra

Trailing space 

Missspell

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


End of sample document.

Happy writing! ✍️


012345678901234567890123456789012345678901234567890123456789
