# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OTM Detector is a lightweight Node.js ES module that detects one-time/disposable email services by analyzing DNS MX records and IP addresses. Instead of maintaining a domain blocklist, it checks MX infrastructure — most temporary email services reuse the same mail servers across many domains.

## Commands

- **Build:** `npm run build` — Uses Rollup to compile `index.js` (ESM) into `index.cjs` (CommonJS) with inlined blocklist
- **Test:** `npm test` — Runs tests via Node.js built-in `node:test` runner (no external test framework)
- **Run single test:** `node --test --test-name-pattern="<pattern>" index.test.js`

There is no linter configured.

## Architecture

The module exports a single async function `getOneTimeMailInfo(domain, options?)` that returns `{ otmAllowed: boolean, abuseEmail: string | null }`.

**Detection flow:**
1. Resolve MX records for the domain via `node:dns/promises`
2. Check MX hostnames against `OTM_HOSTS` set in `blocklist.js` → `{ otmAllowed: true, abuseEmail: null }`
3. If no match, resolve IPv4 addresses of the first MX host
4. Check IPs against `OTM_IPS` set in `blocklist.js` → `{ otmAllowed: true, abuseEmail: null }`
5. If still no match, check MX host against `abuseContacts` map → `{ otmAllowed: false, abuseEmail: '...' }` if found
6. Otherwise → `{ otmAllowed: false, abuseEmail: null }`
7. Domains that fail DNS resolution (`ENOTFOUND`) return `{ otmAllowed: false, abuseEmail: null }`

**Key files:**
- `index.js` — Main ESM entry point with the detection logic
- `blocklist.js` — Contains `OTM_HOSTS` (MX hostnames) and `OTM_IPS` (IP addresses) as Sets, and `abuseContacts` Map (MX host → abuse email)
- `index.cjs` — Auto-generated CommonJS build output (do not edit directly)
- `index.d.ts` — TypeScript type declarations
- `index.test.js` — Tests using `node:test` with a mocked DNS module

**Dual package support:** The `exports` field in `package.json` maps `import` to `index.js` and `require` to `index.cjs`.

## Working with the Blocklist

Most maintenance involves adding entries to `blocklist.js`. MX hostnames go in `OTM_HOSTS`, IP addresses go in `OTM_IPS`. Providers that shouldn't be blocked but should surface an abuse contact go in `abuseContacts` (keyed by exact MX hostname, value is the abuse email). After modifying the blocklist, run `npm run build` to regenerate `index.cjs`.

## Testing

Tests mock the DNS module by passing a custom `dns` option to `getOneTimeMailInfo()`, avoiding real DNS queries. When adding tests, follow this pattern from `index.test.js`.
