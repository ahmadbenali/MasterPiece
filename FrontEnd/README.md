# northBank static frontend

Open `index.html` or serve this folder and visit `/html/home.html`. No build, backend, login, database, or storage is required.

The homepage keeps its Wise-inspired visual style with northBank branding. Prototype customer and admin journeys use the same local fonts, lime green, dark green, rounded cards, and pill buttons, with larger text for readability. Both workspaces have responsive top navigation; there are no sidebars.

## Files

- `html/`: one HTML file per screen.
- `css/home.css`: existing homepage styles.
- `css/account.css`: role-selection layout.
- `css/workspace.css`: shared prototype page styles and navbar.
- `css/bootstrap.min.css`: local Bootstrap.
- `js/home.js`, `js/appearance.js`: existing homepage interactions.
- `js/workspace.js`: mobile navigation, sample route changes, search, dialogs, and cosmetic card state.
- `assets/`: local artwork, fonts, flags, and marked sample downloads.
- `previews/`: screenshots.

## Navigation

Homepage Log in / Sign up → `login.html` → User or Admin, without credentials.

Customer sign-in preview: Welcome → Customer login → Verification → User overview.

Customer navbar: Overview, Accounts, Transfer, Cards, Activity. More includes Insights, Subscriptions, Security, Activity confirmation, ATM locator, Profile, sample sign-in, and session closure. Transfer routes through Review and Success screens.

Admin navbar: Overview, Live stream, Flagged, Cases, Reports. More includes Investigation, AI assessment, Decision desk, Credentials, sample staff sign-in, and station closure. Investigation routes through Assessment, Decision, and Case saved. The priority TX-2048 alert has a separate fixed sample flow.

All balances, credentials, recipients, risk outputs, map locations, and confirmations are illustrative. Forms navigate to fixed example pages. No authentication, transactions, API requests, or persistence occur. Reports download marked example XML/CSV files.

## Reference

Content and journeys follow the supplied NorthBank Figma prototype (`ipzudJJIUl49BYgllS42RA`), with its customer and staff flows. Styling follows the current Wise homepage as requested. Additional customer screens cover features named on the prototype homepage. Figma’s connector limit prevented full inspection of the final staff exit frame, which uses the shared session-closure pattern.
