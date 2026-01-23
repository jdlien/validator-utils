# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - Unreleased

This was a rewrite that makes significant reductions in code size and enhances performance with minimal functional differences in behavior.

### Bundle Size Reduction

|        | v1.2.8    | v2.0.0   | Reduction |
| ------ | --------- | -------- | --------- |
| Raw    | 11.92 KiB | 8.63 KiB | **-28%**  |
| Gzip   | 4.78 KiB  | 3.62 KiB | **-24%**  |
| Brotli | 4.35 KiB  | 3.27 KiB | **-25%**  |

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

## [1.2.8] - 2026-01-18

### Changed

- Added code annotations for untestable defensive code paths
- Updated dependencies and uncommented canvas tests that now work

## [1.2.7] - 2024-03-04

### Added

- Support for 'noon' in `parseTime()`

## [1.2.6] - 2024-03-04

### Changed

- Significantly improved `parseDateTime()` parsing capabilities

## [1.2.5] - 2023-11-28

### Changed

- Minor internal improvements

## [1.2.4] - 2023-11-28

### Changed

- `parseDateTime()` now only requires a single digit for minutes (e.g., `2:5pm`)

## [1.2.3] - 2023-11-27

### Changed

- Updated exports in index.ts with new functions

## [1.2.2] - 2023-11-27

### Changed

- Build updates

## [1.2.1] - 2023-11-27

### Added

- `parseDateTimeToString()` method for formatting parsed date-times as strings

## [1.2.0] - 2023-11-27

### Added

- `parseDateTime()` method for parsing combined date and time strings
- Times in this format require a colon separating hour and minute, with optional meridiem

## [1.1.6] - 2023-02-27

### Changed

- Added main entry point for test compatibility

## [1.1.5] - 2023-02-26

### Added

- TypeScript type definitions (d.ts file)
- Types added to package.json exports
