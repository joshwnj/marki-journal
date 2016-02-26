# [](#notes)Notes

[links / topics are rendered with an incoming links section at the end]: links.md#topics-are-rendered-with-an-incoming-links-section-at-the-end

## [](#notes-are-optional)Notes are optional

Notes come into play when using "journal mode". This means you have a `topics/` directory for organising info, and a `notes/` directory for comments or untructured notes waiting to be refactored.

You can run in "docs mode" which means you just need to specify a single directory containing topics.

[links / topics are rendered with an incoming links section at the end]: links.md#topics-are-rendered-with-an-incoming-links-section-at-the-end

## [](#notes-cant-be-linked-to)Notes can't be linked to

Because we link to headings, and headings are optional for notes.

One of the intended use-cases for notes is to comment on a topic. When a note contains a link to a topic it will appear in the topic as a cross reference: [Links / Topics are rendered with an incoming links section at the end][]

[links / topics are rendered with an incoming links section at the end]: links.md#topics-are-rendered-with-an-incoming-links-section-at-the-end

## [](#cross-referenced-notes-are-named-and-ordered-by-date)Cross-referenced notes are named and ordered by date

A note can contain a yaml frontmatter block, like:

    ---
    date: Mon Feb 08 2016 08:27:02 GMT+1100 (AEDT)
    ---

When notes appear in the incoming links section at the end of a topic, we use the date to order and describe the link. Newest comments first.

Notes with no date metadata will appear at the end of the list and use their filename as the link text.

[links / topics are rendered with an incoming links section at the end]: links.md#topics-are-rendered-with-an-incoming-links-section-at-the-end
null