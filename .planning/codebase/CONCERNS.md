# Codebase Concerns

**Analysis Date:** 2026-02-14

## Security Issues

**Exposed Credentials in Version Control:**
- Issue: The `.env` file containing database credentials, API keys, and email service tokens is committed to the repository despite being listed in `.gitignore`
- Files: `/src` (root directory contains `.env`)
- Impact: Database passwords, Resend API keys, and email configuration are exposed. Any person with access to the repository or its history can retrieve active credentials and compromise the production database and email infrastructure
- Current mitigation: The credentials appear to be tied to a Railway deployment, which may be monitored for unauthorized access
- Recommendations:
  - Immediately rotate all exposed credentials (database password, PAYLOAD_SECRET, RESEND_API_KEY)
  - Remove `.env` from git history using `git filter-branch` or similar
  - Enable repository secret scanning if using GitHub
  - Consider using environment variable management tools like Doppler, HashiCorp Vault, or AWS Secrets Manager
  - Set up pre-commit hooks to prevent `.env` files from being committed

**Email Configuration Exposed:**
- Risk: RESEND_FROM_EMAIL and RESEND_FROM_NAME are used in both `.env` and hardcoded in `payload.config.ts` fallbacks
- Files: `/src/payload.config.ts` (lines 40-41, 45)
- Problem: Fallback values in code reveal domain structure (`noreply@yourdomain.com` pattern shows intended namespace)
- Recommendations: Move all email configuration to environment variables with no code defaults

## Test Coverage Gaps

**No Automated Tests:**
- What's not tested: All business logic, collection hooks, validation logic, API endpoints, and data transformations
- Files: `src/collections/`, `src/app/`, `src/payload.config.ts`
- Risk: Regressions can be introduced without detection; roster validation logic (duplicate jersey numbers, duplicate players) has no test coverage; email sending failures are untested
- Priority: High - The duplicate validation logic in `Rosters.ts` (lines 125-157) is critical but has no test coverage

**Missing Validation Tests:**
- Specific concerns:
  - Slug generation from names (Players, Tournaments, Posts) uses regex replacements with no coverage
  - Roster hooks that fetch player and tournament data and construct display labels (Rosters.ts lines 60-80) have no error scenario coverage
  - Email sending error handling (payload.config.ts lines 53-56) has no test coverage for failure cases
- Priority: High

## Error Handling Issues

**Inconsistent Error Handling:**
- Problem: Some areas use structured logging, others use `console.error()`, and error recovery varies
- Files:
  - `src/payload.config.ts`: Uses `payload.logger.error()` (line 54) with structured logging
  - `src/collections/Rosters.ts`: Uses `console.error()` (line 72) - inconsistent with framework patterns
  - `src/collections/Rosters.ts`: Silent failure in catch block (line 102) - error is caught but not logged
- Pattern: When errors occur in beforeChange hooks, they gracefully degrade to defaults rather than surfacing issues to users
- Recommendations: Standardize on Payload's logging system throughout; surface error details to admin UI when critical operations fail

**Silent Error Degradation:**
- Problem: Multiple hooks fail silently with fallback values instead of preventing invalid state
- Files: `src/collections/Rosters.ts` (lines 64-74, 96-104)
- Symptom: If player lookup fails, roster displays "#[jersey] Player" instead of failing validation
- Risk: Database can contain display labels without corresponding player data, creating orphaned records
- Recommendation: Implement explicit error responses in hooks rather than fallbacks; consider throwing errors for missing required relationships

## Fragile Areas

**Hook-Based Business Logic is Tightly Coupled:**
- Files: `src/collections/Rosters.ts`, `src/collections/Players.ts`, `src/collections/Posts.ts`, `src/collections/Tournaments.ts`
- Why fragile: Multiple complex beforeChange and beforeValidate hooks that fetch external data and transform state
- Risk areas:
  - Roster displayLabel hook (lines 60-80) makes synchronous API call to fetch player data - if player is deleted, hook silently fails
  - Players slug generation (lines 58-67) regex logic lacks normalization standards
  - Posts publishedAt auto-set (lines 130-137) relies on data.status which isn't defined as a field
  - Tournaments slug generation (lines 29-44) uses different regex pattern than Players slug
- Safe modification: Centralize slug generation logic; extract player/tournament lookup into dedicated service functions with proper error handling; add explicit error surfacing
- Test coverage: All hooks lack unit test coverage

**Relationship Validation Gaps:**
- Problem: No validation that related records still exist before displaying them
- Files: `src/collections/Rosters.ts` (relationship fields on lines 14-22, 30-35), `src/collections/Posts.ts` (lines 106-122)
- Specific concern: If a tournament is deleted, rosters still reference it via relationTo field with no cascade behavior defined
- Recommendation: Define cascade delete policies explicitly in Payload config; add afterDelete hooks to clean up orphaned records

**Email Sending Error Recovery:**
- Problem: If Resend API fails, Payload logs error and throws, but no retry mechanism or fallback
- Files: `src/payload.config.ts` (lines 39-58)
- Risk: User-triggering actions (like admin panel operations) may fail entirely if email service is temporarily down
- Recommendation: Implement retry logic with exponential backoff; queue failed emails for later retry; log to external service for monitoring

## Performance Concerns

**N+1 Query Problem in Hooks:**
- Problem: Rosters collection performs database lookups in beforeChange hook for every array item
- Files: `src/collections/Rosters.ts` (lines 61-74)
- Issue: For each player in roster array, a separate `findByID` call is made to fetch player details
- Impact: Large rosters with 20+ players trigger 20+ database queries on each save
- Scaling limit: Roster performance degrades linearly with player count
- Improvement path: Batch fetch all players at once; cache player data during hook execution; consider moving display label to frontend rendering

**Collection Size Concerns:**
- Problem: No defined data retention policy or archival strategy
- Files: All collections lack timestamp-based cleanup
- Risk areas:
  - Contacts collection could accumulate years of inactive records
  - Posts versioning is set to 10 maxPerDoc (line 143) but no cleanup policy for old versions
  - Games collection stores all historical matches indefinitely
- Recommendation: Define retention periods; implement cleanup jobs; consider archiving old tournaments/years to separate storage

## Code Quality Concerns

**Unused TypeScript Imports:**
- Problem: `CollectionConfig` type imported from both `payload` and `payload/types` in different files
- Files:
  - `src/collections/Rosters.ts` (line 1): imports from `payload/types`
  - `src/collections/Tournaments.ts` (line 1): imports from `payload/types`
  - `src/collections/Players.ts`: no explicit import line shown
  - `src/collections/Posts.ts` (line 3): redundant import - imports on lines 1 and 3
- Impact: Inconsistent import patterns; bundle size slightly increased; confusing for maintainers
- Recommendation: Standardize on `import type { CollectionConfig } from 'payload'`; run linter with unused-imports rule enabled

**Duplicate Type Import:**
- Problem: Posts.ts imports CollectionConfig twice (lines 1 and 3)
- Files: `src/collections/Posts.ts`
- Impact: Minor - bundler will deduplicate, but indicates lack of code review

**Console Logging in Production Code:**
- Problem: Rosters.ts uses console.log in afterChange hook
- Files: `src/collections/Rosters.ts` (lines 160-161)
- Issue: These logs will appear in production and may expose sensitive data; should use structured logging framework
- Recommendation: Replace with `payload.logger.info()`; remove noisy logging

**Linter Configuration Too Permissive:**
- Problem: ESLint config set to 'warn' for many important issues
- Files: `eslint.config.mjs`
- Issues flagged as warnings instead of errors (lines 16-30):
  - `@typescript-eslint/ban-ts-comment` - allows unsafe @ts-ignore without investigation
  - `@typescript-eslint/no-explicit-any` - allows unchecked 'any' types
  - `@typescript-eslint/no-unused-vars` - allows dead code to accumulate
- Recommendation: Change critical rules to 'error'; enforce pre-commit linting; fail CI on warnings

## Missing Critical Features

**No User Roles/Permissions Beyond Basic:**
- Problem: Users.ts defines roles but doesn't use them in access control
- Files: `src/collections/Users/Users.ts` (lines 16-21)
- Impact: All authenticated users have equal access; cannot restrict Contacts or internal data by role
- Blocking: Cannot implement multi-level admin access control
- Recommendation: Implement role-based access control in collections using access.read/create/update/delete predicates

**No Audit Logging:**
- Problem: No tracking of who changed what, when
- Impact: Cannot investigate data corruption; cannot track unauthorized changes
- Files: All collections
- Blocking: Cannot meet compliance requirements (GDPR, sports federation auditing)
- Recommendation: Enable Payload's built-in audit logging plugin or implement custom before/after hooks to log changes

**No Data Validation Rules Engine:**
- Problem: Collection hooks contain business logic but no centralized validation
- Impact: Rules like "roster must have at least 13 players" exist only in admin descriptions, not as enforced constraints
- Files: All collections
- Recommendation: Implement validation schema layer using Zod or similar; enforce business rules at database level

## Dependencies at Risk

**Next.js Version Mismatch Risk:**
- Risk: package.json specifies Next 15.3.0 but TypeScript files may not be fully compatible
- Files: `package.json` (line 25)
- Current: Using latest Next.js but project is relatively new (created June 2025)
- Recommendation: Monitor Next.js changelog; test before upgrading to 16.x when released

**Payload 3.40.0 Support Timeline:**
- Risk: Payload CMS 3.x may reach end-of-life; database and plugins are tightly coupled to version
- Files: All dependencies from `@payloadcms` scope (lines 18-22)
- Recommendation: Monitor Payload CMS release schedule; plan for eventual migration path to newer major versions

**Database URI Hardcoded Pattern Risk:**
- Risk: If DATABASE_URI environment variable is missing, defaults to empty string (payload.config.ts line 79)
- Impact: Startup will fail obscurely instead of clear error message
- Recommendation: Add validation in config that requires DATABASE_URI; throw clear error on startup if missing

## Known Bugs

**Slug Generation Inconsistency:**
- Symptoms: Different collections generate slugs using different regex patterns
- Files:
  - Players (line 62): `/[^a-z0-9-]/g`
  - Tournaments (line 36): `/[^a-z0-9\s-]/g` (includes space character)
  - Posts (line 54): `/[^\w-]+/g` (includes underscores and Unicode)
- Result: Same input creates different slugs in different collections; breaks consistency
- Trigger: Creating player "José Luis" vs tournament "José Luis" produces different slugs
- Workaround: Manually edit slugs after creation to maintain consistency
- Fix: Create centralized slug utility function used by all collections

**Posts Missing Status Field:**
- Symptoms: Posts.ts hook checks `data.status === 'published'` but no status field is defined
- Files: `src/collections/Posts.ts` (lines 133-134)
- Result: Code will never execute; published date never auto-sets
- Fix: Add status select field to Posts collection with 'draft' and 'published' options

**Rosters Broken Display Label on Deletion:**
- Symptoms: If a player is deleted after being added to a roster, roster displays "#[number] Player"
- Files: `src/collections/Rosters.ts` (line 72-73)
- Cause: Try/catch silently fails on player lookup; catch block returns fallback string
- Result: Orphaned roster entries with invalid player references
- Fix: Prevent deletion of players that are assigned to active rosters; or update rosters on player deletion

## Validation Gaps

**Email Validation Missing:**
- Problem: Contacts collection requires unique email but doesn't validate format
- Files: `src/collections/Contacts.ts` (lines 29-34)
- Risk: Invalid emails (e.g., "not-an-email") are accepted if not duplicates
- Recommendation: Use Payload's built-in email field type validation; add regex constraint

**Jersey Number Conflict Between Tournaments:**
- Problem: Players can have same jersey number in different tournaments (correct) but logic doesn't prevent same number on same roster (correct, but validation is complex)
- Files: `src/collections/Rosters.ts` (lines 127-144)
- Review: Validation logic appears correct, but test coverage is zero
- Concern: Edge case - what happens if roster is created with one player, then another admin adds same player again before you save? Race condition possible
- Recommendation: Add unique constraint at database level; test concurrent roster editing

**Missing Required Field Validation:**
- Problem: Some critical fields lack explicit required validation
- Files: `src/collections/Media.ts` (no metadata required), `src/collections/Years.ts` (not examined)
- Impact: Can create media records without meaningful data; can create orphaned media
- Recommendation: Define what constitutes a "complete" record for each collection; enforce via required fields and hooks

## Missing Documentation

**No Deployment Guide:**
- Problem: No documentation for:
  - Setting up production database
  - Configuring email service credentials
  - Deploying to production (beyond Railway.json which exists)
  - Backup and recovery procedures
  - Environment variable setup
- Impact: Deployment knowledge is tribal; new team members can't deploy independently
- Files: No deploy documentation in `src` or root

**No API Documentation:**
- Problem: Custom routes exist but are not documented
- Files: `src/app/my-route/route.ts` - example route with no purpose doc
- Impact: Frontend developers don't know what APIs are available

---

*Concerns audit: 2026-02-14*
