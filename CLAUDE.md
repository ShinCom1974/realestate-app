# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real estate application project (`realestate-app`). Update this section as the stack and architecture are established.

## Git Operation Rules

**Every code change must be committed and pushed to GitHub.**

Follow this workflow after any file modification:

```powershell
git add <changed-files>
git commit -m "<concise description of change>"
git push origin <current-branch>
```

- Always commit with a clear, descriptive message summarizing *why* the change was made.
- Never accumulate multiple unrelated changes in a single commit — commit each logical unit separately.
- Always push immediately after committing; do not leave commits only in the local repository.
- Before starting new work, run `git pull` to ensure the local branch is up to date.
- Use feature branches for new features (`feature/<name>`), bug fixes (`fix/<name>`), etc. Merge to `main` via pull request.
- Never force-push to `main` or shared branches.
