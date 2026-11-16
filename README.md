# West Coast KBP public site

Deploys: every push to main goes live on westcoastkbp.com through Vercel Git integration;
pull requests get a preview link. Merge to main only with Tony's yes.

This directory preserves the seven files of the live static Vercel deployment
`dpl_8QBfmYbKyJwecXqB48emHvDuP8FL` and adds the requested English privacy policy.
The existing deployment points to an archived repository; this copy keeps its
public assets and routing together in the maintained Engineering repository.

The requested change is limited to `privacy.html` and the `/privacy` route in
`vercel.json`. The homepage and other source files are preserved byte for byte.
The homepage snapshot is the response from https://www.westcoastkbp.com/.

Publish only the eight HTML/assets/config files in this directory (exclude this
README) to the existing `west-coast-kbp-platform-preview` Vercel project,
`prj_4InNL4BjzDO2aYzCBVKx1NBxpRFL`, team `team_fVhl4AkoYcDpTtUfbjyapWz8`.
Keep framework null, empty build/install commands, and output directory `.`.
Do not publish the repository root or replace the homepage from the Next.js app.

Acceptance: unauthenticated HTTPS GET `/privacy` returns 200 and the English
policy, the deletion contact is `hello@westcoastkbp.com`, and the homepage
SHA-256 matches the pre-publication response. Verify `/privacy/`, the SVG,
robots, sitemap, existing `/about` rewrite, and retired route status too.

Rollback: promote the previous deployment above to restore all original files.
