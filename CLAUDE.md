# Validator Utils

These are a set of simple, compact utilities that are broadly useful on web pages, and are also the sole dependenc for @jdlien/validator.

This project has the following goals:

1. Compactness and efficiency above all else.
2. 100% test coverage of all functionality, with a broad corpus of tests to evaluate behavior of a wide range of acceptable inputs, especially for dates.
3. Focus on high-value functionality, carefully consider whether adding new functionality is highly impactful and reusable in many projects.

When completing edits or new features:

1. Ensure that all tests run with 100% coverage: `pnpm coverage`
2. Compare the original size with the new size. Have we been able to keep the wire size as small or better than before? If the size has increased meaningfully, notify the user: `pnpm size:wire`

## Release Checklist

1. Ensure 100% test coverage: `pnpm coverage`
2. Check bundle size hasn't grown unexpectedly: `pnpm size:wire`
3. Update version in `package.json` with correct semantic versioning
4. Update `CHANGELOG.md` with details of all changes
5. Update `README.md` to ensure documentation is current
6. Verify new functions are exported from `index.ts`
7. Run `pnpm build` and ensure it completes with no errors
8. Commit and push all changes to git
9. Tag the release to match `package.json` version: `git tag v2.x.x && git push --tags`
10. Publish to npm: `pnpm publish` (may require `npm login` first)
11. (Optional, more important for Validator proper) Update live demo at https://jdlien.com/validator/: pull, `pnpm update`, `pnpm build` on server
