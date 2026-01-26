# Validator Utils

## Introduction

The Validator Utils package is a lightweight (~15KB or ~5KB gzipped) library of utility functions that can validate and sanitize
dates, times, strings, numbers, and more. This is especially useful in forms. This package is the sole dependency for the [@jdlien/validator package](https://github.com/jdlien/validator).

This package was separated from Validator so that it could be used in other projects without
pulling in the entire Validator package if you only need some of its validation and parsing functions without the form validation and error message functionality.

## Installation

```bash
npm install @jdlien/validator-utils

# or

yarn add @jdlien/validator-utils

# or

pnpm add @jdlien/validator-utils
```

## Utility Functions

Validator includes several utility functions that may be useful in your own code, so they are exported as part of the module.
If you're using a bundler:

```javascript
import { parseDate, formatDateTime } from '@jdlien/validator-utils'
```

If you're using CommonJS:

```javascript
const { parseDate, formatDateTime } = require('@jdlien/validator-utils')
```

If you prefer to access the utilities as a single object:

```javascript
import * as validatorUtils from '@jdlien/validator-utils'
// you could assign the functions you need to more convenient variables
const { parseDate, formatDateTime } = validatorUtils
```

If you are not using a bundler, you can load a UMD or ESM build directly:

```html
<!-- UMD (global validatorUtils) -->
<script src="https://unpkg.com/@jdlien/validator-utils/dist/validator-utils.js"></script>
<script>
  const { parseDate, formatDateTime } = validatorUtils
</script>

<!-- ESM (module) -->
<script type="module">
  import { parseDate, formatDateTime } from 'https://unpkg.com/@jdlien/validator-utils/dist/validator-utils.mjs'
</script>
```

Here is a list of the utility functions:

- **isFormControl**: Determines if an element is an HTML input, select, or textarea element.
- **isType**: Checks if an element has a type or data-type attribute matching one of the passed values.
- **momentToFPFormat**: Converts a moment.js-style format string to the flatpickr format.
- **monthToNumber**: Converts month string or number to a zero-based month number (January == 0).
- **yearToFull**: Converts a year string or number to a 4-digit year.
- **parseDate**: Parses a date string or Date object into a Date object.
- **parseTime**: Parses a time string into an object with hour, minute, and second properties.
- **parseTimeToString**: Parses a time string into a formatted string.
- **formatDateTime**: Formats a date string or Date object into a string with a specified format.
- **parseDateToString**: Parses a date string or Date object into a formatted string with the specified moment.js-style date format.
- **isDate**: Determines if a value is a valid date.
- **isDateInRange**: Determines if a date falls within a specified range. Supports keywords (`past`, `future`, `today`), specific date ranges (`2023-01-01:2023-12-31`), open-ended ranges (`:2025-12-31`, `2020-01-01:`), relative offsets (`-30d:+30d`, `-1y:`, `:+6m`), and date-time bounds (`2024-01-01T12:00:2024-01-01T14:00`).
- **parseRelativeDate**: Parses a relative date offset (e.g., `-30d`, `+2w`, `30d`, `-6m`, `+1y`) into a Date object.
- **isTime**: Determines if a value is a valid time.
- **isEmail**: Determines if a value is a valid email address.
- **parseNANPTel**: Parses a North American phone number string into a standardized format.
- **isNANPTel**: Determines if a value is a valid North American phone number.
- **parseInteger**: Parses an integer string into a standardized format.
- **isNumber**: Determines if a value is a valid number.
- **parseNumber**: Parses a number string into a standardized format.
- **parseBytes**: Parses a human-readable byte size (e.g., "1.5 MB", "2GiB") into bytes.
- **formatBytes**: Formats a byte count as a human-readable string (e.g., "1.5 MB", "512 B").
- **isInteger**: Determines if a value is a valid integer.
- **parseUrl**: Parses a URL string into a standardized format.
- **isUrl**: Determines if a value is a valid URL.
- **parseZip**: Parses a zip code string into a standardized format.
- **isZip**: Determines if a value is a valid zip code.
- **parsePostalCA**: Parses a Canadian postal code string into a standardized format.
- **isPostalCA**: Determines if a value is a valid Canadian postal code.
- **isColor**: Determines if a value is a valid color.
- **parseColor**: Parses a color string into a standardized format.
- **normalizeValidationResult**: Normalizes a validation result (like a boolean or string) into an object with a valid property and a messages array of strings.

## Contributing

Install dev dependencies:

```bash
pnpm install
```

Run tests with coverage (100% required for release):

```bash
pnpm coverage
```

Build the project for testing/release:

```bash
pnpm build
```
