---
name: debug
description: Diagnose and fix issues with the Pibox container environment — tools, paths, mounts, pi configuration.
distribution: public
---

# Debug

Diagnose and fix issues with the Pibox container environment.

## Steps

1. Check system basics:
   ```bash
   uname -a && cat /etc/os-release | head -3
   whoami && id
   df -h / /workspace /home/agent 2>/dev/null
   free -h
   ```

2. Check tool availability:
   ```bash
   for cmd in bun brew git rg make pi vim tmux htop jq curl; do
     printf "%-8s " "$cmd"; which "$cmd" 2>/dev/null && "$cmd" --version 2>/dev/null | head -1 || echo "NOT FOUND"
   done
   ```

3. Check pi configuration:
   ```bash
   echo "=== Global skills ===" && ls ~/.pi/agent/skills/ 2>/dev/null || echo "none"
   echo "=== Global settings ===" && cat ~/.pi/agent/settings.json 2>/dev/null || echo "none"
   echo "=== Project AGENTS.md ===" && head -5 AGENTS.md 2>/dev/null || echo "none"
   echo "=== Project skills ===" && ls .pi/skills/ 2>/dev/null || echo "none"
   ```

4. Check piclaw (if running):
   ```bash
   echo "=== Piclaw ===" && pgrep -af "bun.*piclaw" || echo "not running"
   ls -la data/ipc/ 2>/dev/null || echo "no IPC directory"
   ```

5. Report findings and suggest fixes.

## Common Issues

- *bun not found:* `source ~/.bashrc` or check `~/.bun/bin` is in PATH
- *brew not found:* `eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"`
- *pi not found:* `bun add -g @earendil-works/pi-coding-agent`
- *Permission denied:* `sudo chown -R agent:agent /workspace`
- *Config not persisting:* Check `/config` volume is mounted and `~/.pi` is symlinked
