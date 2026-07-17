# Copilot instructions

Template for repositories created in Pibox.

## Agent: Pi Coding Agent

This workspace uses [pi](https://github.com/badlogic/pi-mono) as its coding agent.

- Pi reads `AGENTS.md` files from the current directory and its parents for project context
- Global skills live in `~/.pi/agent/skills/` (schedule, send-message, and similar)
- Project skills live in `.pi/skills/` (setup, debug, and similar)
- Settings live in `.pi/settings.json` (project) and `~/.pi/agent/settings.json` (global)

## Mandatory: use the Makefile

Use `make` targets for build, lint, test, format, and dev flows whenever they exist.

## Environment

- `bun` and `brew` are available for installing tools
- Use `sudo apt` for system packages when needed
- Prefer Bun over npm or yarn for JS/TS package management
