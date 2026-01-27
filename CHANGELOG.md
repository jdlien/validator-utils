# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - Unreleased

### Added

- Support for `"midnight"` and `"midday"` keywords in `parseTime()` and `parseDateTime()`.
- Support for `"yesterday"` keyword in `parseDate()` and `parseDateTime()`.
- **CJK date formats**: `parseDate()` and `parseDateTime()` now support Chinese (`2024年1月15日`), Japanese (same characters), and Korean (`2024년 1월 15일`) date formats.

## [2.1.0] - 2026-01-26

### Added

- **`parseBytes(value)`**: Parses human-readable byte sizes ("5MB", "1.5GiB", "500K") into bytes. Supports SI units (KB, MB, GB, TB) and binary units (KiB, MiB, GiB, TiB).
- **`formatBytes(bytes, decimal?)`**: Formats bytes as human-readable strings ("1.5 MB", "512 B"). Use `decimal=false` for binary (1024-based) formatting.
- **`parseRelativeDate(offset)`**: Parses relative date offsets like `-30d`, `+2w`, `-6m`, `+1y` into Date objects.
- **Enhanced `isDateInRange(date, range)`**: Now supports flexible date range syntax:
  - `today` keyword for today-only validation
  - Specific ranges: `2023-01-01:2023-12-31` (between two dates, inclusive)
  - Open-ended ranges: `:2025-12-31` (on or before), `2020-01-01:` (on or after)
  - Relative offsets: `-30d:+30d` (within 30 days), `-1y:` (from 1 year ago), `:+6m` (up to 6 months)
  - Single date: `2023-06-15` (exact date match)
  - Units: `d` (days), `w` (weeks), `m` (months), `y` (years)
  - Date-time bounds: `2024-01-01T12:00:2024-01-01T14:00`
- **ESM, CommonJS, and UMD builds**: Now ships three module formats for maximum compatibility
  - `validator-utils.mjs` (ESM) - for modern bundlers and `import` statements
  - `validator-utils.cjs` (CommonJS) - for `require()` in Node.js
  - `validator-utils.js` (UMD) - for `<script>` tags and CDNs (exposes `window.validatorUtils`)
- **Proper `exports` field**: Conditional exports for seamless ESM/CJS resolution
- **CDN support**: `unpkg` and `jsdelivr` fields for direct browser usage

### Changed

- **`parseBytes(value)`**: Now accepts naked decimals (e.g., `.5MB`) and trailing decimals (e.g., `1.`).
- **`parseRelativeDate(offset)`**: Now accepts offsets without a leading `+` sign (e.g., `30d`).

### Bundle Sizes

|        | ESM        | CJS       | UMD       |
| ------ | ---------- | --------- | --------- |
| Raw    | 14.89 KiB  | 11.70 KiB | 11.43 KiB |
| Gzip   | 5.06 KiB   | 4.65 KiB  | 4.64 KiB  |
| Brotli | —          | —         | 4.21 KiB  |

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
