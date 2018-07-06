## 5e Tools

Welcome to the Adventurer's Guild! To continue to the guild website, click [here](5etools.html).

Information past this is generally useful for developers or just hosting a local copy of the website.

- To see the original 5etools page, made by TheGiddyLimit, click [here](https://5etools.com).
- TheGiddyLimit's github repository can be found [here]()

## Running 5etools Locally (Offline Copy)
There are several options for running a local/offline copy of 5etools, including:

**Beginner:** Use Firefox to open the files.

**Intermediate:** When using Chrome (or similar), a command-line switch is required to load some pages locally. On Windows, this can be accomplished by creating a Chrome shortcut and editing the properties of the shortcut to add `--allow-file-access-from-files` to the shortcut `Target`:

![Chrome tutorial](https://raw.githubusercontent.com/TheGiddyLimit/TheGiddyLimit.github.io/master/chrome-tutorial.png "Chrome tutorial")

Be sure to close any running Chrome instances (and kill any remaining Chrome processes as required) before opening the shortcut. A summary of the security implications can be found [here](https://superuser.com/a/873527).

## Dev Notes

### Style Guidelines
- Use tabs over spaces.

### JSON Cleaning
#### Trailing commas
To remove trailing commas in JSON:

Find: (.\*?)(,)(:?\s\*]|\s*})

Replace: $1$3

#### Character replacement
- ’ should be replaced with '
- “ and ” should be replaced with "
- — (em dash) should be replaced with \u2014 (Unicode for em dash)
- – and \u2013 (en dash) should be replaced with \u2014
- • should be not be used unless the JSON in question is not yet covered by the entryRenderer, i.e. should be encoded as a list
- the only Unicode escape sequence allowed is \u2014; all other characters (unless noted above) should be stored as-is

#### Convention for dashes
- - (hyphen) should **only** be used to hyphenate words, e.g. 60-foot and 18th-level
- any whitespace on any side of a \u2014 should be removed

#### Convention for measurement
- Adjectives: a hyphen and the full name of the unit of measure should be used, e.g. dragon exhales acid in a 60-foot line
- Nouns: a space and the short name of the unit of measure (including the trailing period) should be used, e.g. blindsight 60 ft., darkvision 120 ft.
- Time: a slash, /, with no spaces on either side followed by the capitalised unit of time, e.g. 2/Turn, 3/Day

## License

This project is licensed under the terms of the MIT license.
