# CLAUDE.md

## Project
**[App Name]** - hackathon demo (30 min build). A text analyzer app that:
1. **Scam Detection** - flags suspicious texts and gives a risk level (Safe / Suspicious / Likely Scam) with a short reason.
2. **AI Opportunity Finder** - finds repeated tasks in texts (scheduling, same replies, reminders, group planning) and suggests how AI could help.

**Goal: a working demo, not a finished product.**

## Team
| Name | Owns |
|------|------|
| [Name] | Lead + merges to `main` |
| [Name] | Frontend / UI |
| [Name] | Scam Detection |
| [Name] | AI Opportunity Finder |
| [Name] | Demo data + pitch |

## Folder Structure
```
/src
  /screens     # app screens
  /components  # UI pieces
  /scam        # scam detection
  /ai-finder   # AI Opportunity Finder
/demo-data     # fake sample texts for the demo
```

## Repo Rules
- Branches are named `yourname/task` (e.g., `seb/scam-checker`). Never work on `main`.
- Push to your own branch often.
- Only the Lead merges into `main`. Tell the group chat when you're ready.
- Stay in your own folder to avoid conflicts. If a conflict happens, ask the other person before deleting their code.

## Rules for Claude
- Speed over polish. Simple and working beats perfect.
- Mock data and hardcoded examples are fine.
- Use only fake texts from `/demo-data`. No real messages, no API keys in the repo.
- Stay in the user's own folder unless asked.
- Prioritize whatever shows up in the demo.
