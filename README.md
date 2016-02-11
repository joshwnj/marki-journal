# marki-journal

POC for a marki-style journal.

## General ideas

- content is divided into notes (free-form) and topics (structured).
- the goal is to make it easy & fast to take notes, and gradually refactor them into topics.

## Run the example

```
./bin/jr-build.js ./example
ecstatic example/dist/
```

And then open <http://localhost:8000/topics>

## How do links work?

You can link to any heading by using the heading text in a reference link. So `[Cool Topic][]` finds the document with the level-1 heading "Cool Topic" and links to it. Eg. `[Cool Topic](topics/cool-topic.md)`.

Note: if there is no matching topic found we get a build error.
Also Note: it doesn't matter what the filename of the document is, everything is based on headings.

### Linking to a subheading

Linking to a subheading is similar. We always start with the h1, followed by the text of any subheading (the depth of the subheading doesn't matter). Separated by a slash.

- `[Cool Topic/An introduction][]` links to any subheading of "Cool Topic"
- `[./Ways to be cool][]` links to any subheading of the current document.

## Requirenents

- nodejs >= 4

## Can I Use It?

Sure, I'd love more feedback. Only caveat at this point is that the internals are almost guaranteed to change, as the idea develops.
