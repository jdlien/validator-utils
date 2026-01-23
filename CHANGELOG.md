# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - Unreleased

This was a rewrite that makes significant reductions in code size and enhances performance with minimal functional differences in behavior.

### Bundle Size Reduction

|        | v1.2.8    | v2.0.0   | Reduction |
| ------ | --------- | -------- | --------- |
| Raw    | 11.92 KiB | 8.36 KiB | **-30%**  |
| Gzip   | 4.78 KiB  | 3.48 KiB | **-27%**  |
| Brotli | 4.35 KiB  | 3.14 KiB | **-28%**  |

### Changed

- **Email validation simplified**: Now uses a practical regex instead of full RFC 5322 compliance. Quoted local parts like `"john doe"@example.com` are no longer accepted. All standard email formats continue to work.
- **Date parsing rewritten**: The `parseDate()` function now uses streamlined inline logic instead of the multi-pass `guessDateParts()` algorithm. Behavior is equivalent for all common date formats.
- **Date-time parsing expanded**: `parseDateTime()` now accepts ISO basic timestamps like `20210314T150926Z`, ISO basic with offsets like `20210314T1509+0200`, and dot-separated times like `2021-03-14 15.09`.

### Removed

- **`momentToFPFormat()`**: Removed niche Moment.js to Flatpickr format converter. If needed, add this to your project:

  ```typescript
  function momentToFPFormat(format: string): string {
    return format
      .replace(/YYYY/g, 'Y')
      .replace(/YY/g, 'y')
      .replace(/MMMM/g, 'F')
      .replace(/MMM/g, '{3}')
      .replace(/MM/g, '{2}')
      .replace(/M/g, 'n')
      .replace(/DD/g, '{5}')
      .replace(/D/g, 'j')
      .replace(/dddd/g, 'l')
      .replace(/ddd/g, 'D')
      .replace(/dd/g, 'D')
      .replace(/d/g, 'w')
      .replace(/HH/g, '{6}')
      .replace(/H/g, 'G')
      .replace(/hh/g, 'h')
      .replace(/mm/g, 'i')
      .replace(/m/g, 'i')
      .replace(/ss/g, 'S')
      .replace(/s/g, 's')
      .replace(/A/gi, 'K')
      .replace(/\{3\}/g, 'M')
      .replace(/\{2\}/g, 'm')
      .replace(/\{5\}/g, 'd')
      .replace(/\{6\}/g, 'H')
  }
  ```

- **`guessDateParts()`**: Removed complex date inference function. Use `parseDate()` directly instead:

  ```typescript
  // Old: const { year, month, day } = guessDateParts(str)
  // New:
  const d = parseDate(str)
  if (!isNaN(d.getTime())) {
    const parts = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
  }
  ```

- **`guessDatePart()`**: Removed helper function (was only used internally by `guessDateParts()`).

## [1.2.8] - Previous stable release

See git history for changes prior to 2.0.0.
