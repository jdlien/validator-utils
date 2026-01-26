# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-01-26

### Added

- **ESM, CommonJS, and UMD builds**: Now ships three module formats for maximum compatibility
  - `validator-utils.mjs` (ESM) - for modern bundlers and `import` statements
  - `validator-utils.cjs` (CommonJS) - for `require()` in Node.js
  - `validator-utils.js` (UMD) - for `<script>` tags and CDNs (exposes `window.validatorUtils`)
- **Proper `exports` field**: Conditional exports for seamless ESM/CJS resolution
- **CDN support**: `unpkg` and `jsdelivr` fields for direct browser usage

### Bundle Sizes

|        | ESM       | CJS      | UMD      |
| ------ | --------- | -------- | -------- |
| Raw    | 11.54 KiB | 9.11 KiB | 9.13 KiB |
| Gzip   | 4.06 KiB  | 3.73 KiB | 3.83 KiB |

## [2.0.0] - 2026-01-23

This was a rewrite that makes significant reductions in code size and enhances performance with minimal functional differences in behavior.

### Bundle Size Reduction

|        | v1.2.8    | v2.0.0   | Reduction |
| ------ | --------- | -------- | --------- |
| Raw    | 11.92 KiB | 8.92 KiB | **-25%**  |
| Gzip   | 4.78 KiB  | 3.74 KiB | **-22%**  |
| Brotli | 4.35 KiB  | 3.38 KiB | **-22%**  |

### Changed

- **Email validation simplified**: Now uses a practical regex instead of full RFC 5322 compliance. Quoted local parts like `"john doe"@example.com` are no longer accepted. All standard email formats continue to work.
- **Date parsing rewritten**: The `parseDate()` function now uses streamlined inline logic instead of the multi-pass `guessDateParts()` algorithm. Behavior is equivalent for all common date formats.
- **Date-time parsing expanded**: `parseDateTime()` now accepts ISO basic timestamps like `20210314T150926Z`, ISO basic with offsets like `20210314T1509+0200`, and dot-separated times like `2021-03-14 15.09`.

### Removed

- **`guessDateParts()`**: Removed complex date inference function. Use `parseDate()` directly instead.
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
