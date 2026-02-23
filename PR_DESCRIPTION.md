# Security: Upgrade Next.js and dev dependencies to fix critical vulnerabilities

## Summary

Comprehensive security upgrade addressing critical vulnerabilities in Next.js and development dependencies.

### Production Dependencies
- **Next.js**: 13.4.12 → 15.5.12
- **Firebase**: Updated transitive dependencies

### Dev Dependencies
- **Cypress**: 12.17.2 → 15.10.0
- **ESLint**: 8.45.0 → 9.39.3
- **eslint-config-next**: 13.4.12 → 15.5.12

## Vulnerabilities Fixed

### Critical (2 → 0) ✅
- **GHSA-fjxv-7rqg-78g4**: form-data unsafe random function
- **CVE-2025-66478**: React2Shell RCE (compliance)

### High Severity
- **GHSA-fr5h-rqp8-mj6g**: Next.js SSRF in Server Actions
- **GHSA-h25m-26qc-wcjf**: Next.js RSC HTTP deserialization DoS
- **GHSA-p8p7-x288-28g6**: Cypress SSRF

### Moderate Severity
- **GHSA-9g9p-9gw9-jx7f**: Next.js Image Optimizer DoS

## Security Impact

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Critical** | 2 | 0 | ✅ -2 |
| **High** | 17 | 14 | ✅ -3 |
| **Moderate** | 14 | 11 | ✅ -3 |
| **Total** | 66 | 25 | ✅ -41 |

## Testing

✅ Build verified: All 14 pages compile successfully
✅ Linting verified: ESLint passes with Next.js 15
✅ No breaking changes detected

## Remaining Vulnerabilities

All remaining issues are in transitive dependencies (Firebase SDK, Node.js):
- `glob`, `minimatch` in Firebase
- `undici` in Node.js/Firebase
- `ajv`, `js-yaml` in Firebase

These will resolve as upstream packages update.

## Commits

1. `f192e2f` - Upgrade Next.js 13.4.12 → 15.5.12 to fix security vulnerabilities
2. `9a8f4f7` - Upgrade dev dependencies to fix critical vulnerabilities

---

Branch: `claude/review-rsc-security-WFDnS`
Session: https://claude.ai/code/session_01TP5dLjwSo7phaw2vtZ2RrW
