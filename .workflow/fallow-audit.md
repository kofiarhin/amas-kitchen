# Fallow Audit

## Command
`npx fallow audit --base HEAD --format json --quiet --explain 2>/dev/null || true`

## Verdict
PARTIAL

## Summary
kind=audit; verdict=fail; total_issues=0

## Notes
Fallow was run after tests/lint/build and review. The command used machine-readable JSON, `--quiet`, `--explain`, stderr redirection, and `|| true` as required.
