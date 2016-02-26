# [](#links)Links

## [](#link-to-a-topic-with-a-reference-link-containing-the-heading-text)Link to a topic with a reference link containing the heading text

A markdown "reference link" like `[Some heading][]`, if no reference is provided, will be automatically linked to the topic with the h1 of "Some heading".

## [](#link-to-a-topics-subheading-with-a-specially-formatted-reference-link)Link to a topic's subheading with a specially formatted reference link

Given an h1 of "Some heading" and a subheading with text "Here is the subheading", we can link to the subheading with `[Some heading/Here is the subheading][]`

To link to a subheading of the current topic we can do `[./Another subheading][]`

## [](#broken-links-cause-a-build-error)Broken links cause a build error

## [](#topics-are-rendered-with-an-incoming-links-section-at-the-end)Topics are rendered with an incoming links section at the end

This is a list of links to any other topic that linked to this one, so that we can see & navigate cross-references.

## [](#dont-display-the-incoming-links-section-if-there-is-nothing-linking-to-the-topic)Don't display the incoming links section if there is nothing linking to the topic
null