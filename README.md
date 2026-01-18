# Validator Utils

## Introduction

This package is a library of utility functions that can be used for validating and sanitizing
strings and numbers, especially for use in forms. This package is the dependency for the [@jdlien/validator package](https://github.com/jdlien/validator).

This package was separated from Validator so that it could be used in other projects without
pulling in the entire Validator package if you only need some of its validation and parsing functions without the form validation and error message functionality.

## Installation

```bash
npm install @jdlien/validator-utils

# or

yarn add @jdlien/validator-utils
```

## Utility Functions

Validator includes several utility functions that may be useful in your own code, so they are exported as part of the module.
If you wish to use these, you may import the functions directly from the module as an object that contains all the functions:

```javascript
import * as validatorUtils from '@jdlien/validator'
// you could assign the functions you need to more convenient variables
const { dateFormat, formatDateTime } = validatorUtils
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
- **isDateInRange**: Determines if a date falls within a specified range (either past or future).
- **isTime**: Determines if a value is a valid time.
- **isEmail**: Determines if a value is a valid email address.
- **parseNANPTel**: Parses a North American phone number string into a standardized format.
- **isNANPTel**: Determines if a value is a valid North American phone number.
- **parseInteger**: Parses an integer string into a standardized format.
- **isNumber**: Determines if a value is a valid number.
- **parseNumber**: Parses a number string into a standardized format.
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

## V2 (Lightweight Build)

V2 is an ultra-lightweight rewrite optimized for minimal bundle size. It is 28% smaller in lines of code and 18% smaller in character count while maintaining compatibility with the vast majority of use cases.

### Breaking Changes in V2

The following functions have been removed from V2 to reduce bundle size. If you need these functions, you can implement them yourself using the code snippets below.

#### Removed Functions

**`momentToFPFormat`** - Converts moment.js format strings to Flatpickr format. If you use Flatpickr, add this to your project:

```typescript
function momentToFPFormat(format: string): string {
  return format
    .replace(/YYYY/g, 'Y').replace(/YY/g, 'y')
    .replace(/MMMM/g, 'F').replace(/MMM/g, '{3}').replace(/MM/g, '{2}').replace(/M/g, 'n')
    .replace(/DD/g, '{5}').replace(/D/g, 'j')
    .replace(/dddd/g, 'l').replace(/ddd/g, 'D').replace(/dd/g, 'D').replace(/d/g, 'w')
    .replace(/HH/g, '{6}').replace(/H/g, 'G').replace(/hh/g, 'h')
    .replace(/mm/g, 'i').replace(/m/g, 'i').replace(/ss/g, 'S').replace(/s/g, 's')
    .replace(/A/gi, 'K')
    .replace(/\{3\}/g, 'M').replace(/\{2\}/g, 'm').replace(/\{5\}/g, 'd').replace(/\{6\}/g, 'H')
}
```

**`guessDateParts`** and **`guessDatePart`** - Use `parseDate()` directly:

```typescript
// Old: const { year, month, day } = guessDateParts(str)
// New:
const d = parseDate(str)
if (isNaN(d.getTime())) throw new Error('Invalid Date')
const parts = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
```

### Other V2 Changes

**Email Validation**: V2 uses a simplified email regex that covers standard email formats. Some obscure RFC 5322 edge cases (like quoted local parts with special characters) may not be validated identically to V1. For most applications, this change has no practical impact.

## Contributing

Install dev dependencies:

```bash
npm install
```

When running Vite, you may get an error like

```
Module did not self-register: '...\node_modules\canvas\build\Release\canvas.node'
```

If that happens, you
need to install the canvas module manually: `bash npm rebuild canvas --update-binary `
