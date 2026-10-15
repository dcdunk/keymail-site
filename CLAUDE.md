# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

This is the marketing/download website for **Keymail**, a native macOS mail client, served at keymailapp.com (domain on Cloudflare) via Cloudflare Pages. Repo: https://github.com/dcdunk/keymail-site.

## Stack and commands

Plain static HTML/CSS, no build step. Everything lives in `public/`: `index.html` (home), `releases/index.html` (/releases), `privacy/index.html` (/privacy), shared `style.css`, plus `icon.png` and `favicon.png` resized from the app repo's `icon/AppIcon.png`. Nav and footer markup is repeated in each page, so edit every page when you change them.

`/releases` uses the only JavaScript on the site. It fetches `api.github.com/repos/dcdunk/keymail-app/releases` in the browser and renders GitHub's sanitized `body_html`. Release notes are written in the GitHub release (`release.sh` uses `--generate-notes`; edit them on GitHub), not in this repo.

- Local preview: `python3 -m http.server 8788 -d public` (also defined in `.claude/launch.json` as `site`)
- Deploy: `npx wrangler pages deploy --branch main` (reads `wrangler.toml`, which points Pages at `public/`). It's a classic Pages project named `keymail-site`, created with `--force` because newer Wrangler versions route Pages commands to Workers. Don't pass `--force` again. Deploys are manual: pushing to GitHub does not deploy.
- Email: Cloudflare Email Routing forwards hello@keymailapp.com to the owner's Gmail (receive only). It's the contact address on /privacy. Other addresses on the domain bounce.
- Hosting: https://keymail-site.pages.dev, with custom domains keymailapp.com and www.keymailapp.com (proxied CNAMEs to `keymail-site.pages.dev` in the Cloudflare zone).
- Check after edits: no horizontal scroll at 375px width, and every shortcut shown on the page exists in the app.

Design: dark, Linear/attnos-inspired. Colors are CSS variables on `:root`, taken from the app icon (navy `#252b63`, periwinkle `#6677e0`, keycap lavender `#b8c0e0`). Keycaps are `<kbd>` elements. Inter + JetBrains Mono from Google Fonts.

Only show keyboard shortcuts that exist in `Store+Keyboard.swift` (e.g. j/k move, Tab/Shift+Tab splits, Enter/o open, Esc, e done, h remind me, l label, r/a/f, c, s star, # delete, Shift+U unsubscribe, /, Cmd+K). Reach other actions through "Cmd+K + command name" instead of making up keys.

## The product (source: https://github.com/dcdunk/keymail-app, `SPEC.md`)

Use these facts for site copy. SPEC.md is an old planning note and has been wrong (it listed h/l for splits). The app's Swift source is the source of truth: check `Sources/Email/Store+Keyboard.swift` for shortcuts and `Store+Palette.swift` for command names.

- Native SwiftUI app, macOS 14+. Keyboard-first, Superhuman-style. Gmail (REST API), iCloud Mail (IMAP/SMTP to imap/smtp.mail.me.com) and Outlook in preview (Microsoft Graph; `MicrosoftAuth.swift`, `MicrosoftMail.swift`). Label Outlook "Preview" on the site until the owner says it's GA. Its logo is `public/outlook.svg`, the 2025 Outlook icon from Wikimedia Commons (public domain).
- Gmail sign-in is Google OAuth in the browser (PKCE); multiple accounts. iCloud uses an app-specific password (never the Apple Account password) and supports sending from aliases. Outlook signs in with Microsoft OAuth in the browser (PKCE, `common` authority: personal and work/school accounts). All credentials live in the macOS Keychain.
- v1 features: Cmd+K command palette, j/k/Enter/Esc navigation, Split Inbox (rule-based tabs), Mark Done (archive), Snooze, Send Later, follow-up reminders, snippets, one-key unsubscribe, search.
- Local cache (encrypted JSON files in `~/Library/Application Support/Email`, key in the Keychain; `Sources/Email/Storage.swift`); every keypress hits local data first, sync runs in the background. Speed is the core pitch.
- AI (advertised in the #ai section): summarize thread (i) and instant reply (Shift+R, pick 1-3), run through the user's own signed-in CLI: Claude Code, OpenAI Codex or Gemini CLI (`Sources/Email/AIProviders.swift`), read-only, no API key. Logos are Simple Icons paths (simple-icons@13.21.0, CC0) inlined as SVG.
- Deliberately skipped: read receipts / tracking pixels, team features.
- Honest caveats: Send Later and Snooze fire only while the Mac is awake and the app is running. Personal-use Google OAuth in Testing mode forces re-sign-in every 7 days (Workspace "Internal" apps avoid this).

## Privacy policy (/privacy)

Every claim on it was checked against the app source. When app behavior changes, re-check it, especially: network connections (Google, Apple, GitHub for Sparkle, remote images on by default, unsubscribe links, AI CLIs), Google scopes in `GoogleAuth.swift` (`gmail.modify`, `gmail.settings.basic`, `calendar.events`), Microsoft scopes in `MicrosoftAuth.swift`, Send to Claude Code (`ClaudeCodeLink.swift`: opens Claude Desktop with the email as prompt, writes `.claude/settings.local.json`), what `removeAccount` in `Store+Accounts.swift` deletes, and that there's still no analytics or crash reporting. Bump the "Last updated" date when the text changes. Keep the Google API Services User Data Policy / Limited Use sentence; Google's OAuth review requires it.

## Downloads and versions

The app ships from GitHub Releases on `dcdunk/keymail-app` (`release.sh`), notarized, with Sparkle auto-updates. Link downloads to the latest release rather than hardcoding a version:

- Latest release page: `https://github.com/dcdunk/keymail-app/releases/latest`
- Zip asset is named `Keymail-<VERSION>.zip`; the current version is in the app repo's `VERSION` file.
- Installed apps poll `releases/latest/download/appcast.xml`. The site must not host or rewrite the appcast.

App icon source files: `icon/` in the app repo (`AppIcon.png`, `AppIcon.icns`).
