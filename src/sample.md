# Markdown Editor Demo

## 5. Code Blocks

Inline code example: `console.log("Hello, world!");`

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


Trailing space 


## 3. Lists

Unordered List

- Apples
- Bananas
- Oranges
- Mandarin oranges
- Blood oranges
 - Grapes

Ordered List

1. Plan the project
2. Write the code
3. Test the application
4. Release the final version

Task List

Unsupported.



Welcome to your Markdown editor! This sample file demonstrates common Markdown features so you can test both editing and preview rendering.

<a href="https://google.com"><img src="https://placehold.co/20"></a> image <span>aaa</span>

<a href="https://google.com"><img src="https://placehold.co/100"></a>

[test](./Untitled3.md)

![](<./Untitled.assets/lfs/paste-2026-10-22T05-29-43.065Z.png>)




This does not work in CodeMirror \[![Alt text](https://placehold.co/600)](https://google.com). https://codemirror-live-markdown.vercel.app

<div><a href="https://google.com"><img src="https://placehold.co/100"></a></div>


## 1. Text Formatting

This is a paragraph with **bold** text, *italic* text, ~~strikethrough~~, and `inline code`.

You can also combine formatting: ***bold and italic***.

Here is a [link](https://commonmark.org/help) to the Markdown Guide.

# 2. Headings

This sample file demonstrates

# Heading 1

This sample file demonstrates

## Heading 2

This sample file demonstrates

### Heading 3

This sample file demonstrates

#### Heading 4

This sample file demonstrates

##### Heading 5

This sample file demonstrates

###### Heading 6

## 4. Blockquotes

> Markdown is a lightweight markup language that you can use to add formatting elements to plaintext documents.

Nested blockquotes:

> This is the first level.
>> This is a nested blockquote.
>>
>> It can contain multiple paragraphs.


## 6. Tables

Unsupported. Tables should be created using an external tool and rendered using `<img>` tags. Use SVG.

## 7. Horizontal Rules

Content above the divider.

---

Content below the divider.

## 8. Images

![Placeholder image](https://placehold.co/800)

![local](./Untitled.assets/lfs/sample.png)

Figure 1: An example image in a Markdown document.

<img src="https://placehold.co/800">

## 9. Links and References

Automatic URL: https://example.com

Email link: hello@example.com

[link label](https://example.com)

[Local file](./Untitled.assets/lfs/sample.png)

## 10. Escaping Special Characters

Use a backslash to display Markdown characters literally:

\*This text is not italic.\*

\# This is not a heading.

\`This is not inline code.\`

## 11. Mathematical Expressions

Inline math (if supported): $E = mc^2$

Block math (if supported):

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

12. Footnotes

Unsupported.

Here is a sentence with a footnote reference.[^1]

[^1]: This is the footnote content.

13. HTML

<div style="padding: 12px; border: 1px solid #888; border-radius: 8px;">
 <strong>HTML block</strong>
 <p>This section tests whether your Markdown renderer supports inline HTML.</p>
</div>

## 14. Long Paragraph Test

Markdown is designed to be easy to read in its plain-text form while also being easy to convert into structured HTML. A good Markdown editor should preserve line breaks appropriately, handle long paragraphs without breaking the layout, render links and inline formatting correctly, and support a comfortable editing experience across different screen sizes. This paragraph is intentionally long to test wrapping, scrolling, and preview layout.

End of sample document.

Happy writing! ✍️