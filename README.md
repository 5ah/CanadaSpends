# Canada Spends helps Canadians understand how their government spends their money


## Ambition

Canada Spends aims to be the easiest way for Canadians to understand how their government spends their money.
A government cannot be held accountable if people don't understand what the government is doing. We aim to
bring transparency to every level of government in Canada: federal, provincial, municipal and school boards.

We bring this transparency in two ways:

1) We parse, aggregate and visualize audited financial statements that governments publish so that everyone can
   understand how their government spends their money and how it changes over time.
2) We aggregate and normalize government spending databases to make the data fast to search and accessible.

### Roadmap

By the end of 2025, we aim to have automated data ingestion pipelines for every province and territory and the largest 20 municipalities in Canada.

- [ ] Alberta
- [ ] British Columbia
- [ ] Ontario
- [ ] Quebec
- [ ] Saskatchewan
- [ ] Manitoba
- [ ] Nova Scotia
- [ ] New Brunswick
- [ ] Prince Edward Island
- [ ] Newfoundland and Labrador
- [ ] Yukon
- [ ] Northwest Territories
- [ ] Nunavut

- [ ] Toronto
- [ ] Ottawa
- [ ] Montreal
- [ ] Vancouver #79
- [ ] Calgary #81
- [ ] Edmonton #82
- [ ] Winnipeg #83
- [ ] Hamilton
- [ ] London
- [ ] Mississauga
- [ ] Brampton
- [ ] Markham
- [ ] Oakville
- [ ] Halifax
- [ ] Saint John
- [ ] St. John's
- [ ] Charlottetown
- [ ] Surrey
- [ ] Moncton
- [ ] Quebec City
- [ ] Victoria
- [ ] Vaughan
- [ ] Markham
- [ ] Gatineau


## Getting Started

Canada Spends is a NextJS app. To run it, run:

```
pnpm install
pnpm run dev
```

## Linting

This project uses ESLint with Next.js configuration. Run linting with:

```bash
pnpm lint          # Check for linting issues
pnpm lint:fix      # Auto-fix auto-fixable issues
```

The linting configuration enforces TypeScript best practices, React rules, and Next.js optimizations while keeping most issues as warnings (temporarily) to avoid blocking development.

## Git Hooks

This project automatically runs linting checks before each commit using `simple-git-hooks`. This is enabled automatically when you run `pnpm install`. If you need to enable it manually:

```bash
npx simple-git-hooks
```

If linting fails, the commit will be blocked until issues are resolved.
