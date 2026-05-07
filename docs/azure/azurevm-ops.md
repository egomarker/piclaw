# Azure VM Piclaw ops notes

## Access
- Host: `your-vm.example.com`
- Alternate IP: `203.0.113.10`
- SSH user: `agent`
- Key: `~/.ssh/azurevm_ed25519`

Example:
```
ssh -i ~/.ssh/azurevm_ed25519 agent@your-vm.example.com
```

### If SSH refuses connections
Common cause: ssh.socket only listening on IPv6 (`[::]:22`) while the host has no AAAA record.

Check:
```
dig +short AAAA your-vm.example.com
```

Fix listening on IPv4 + IPv6:
```
sudo tee /etc/systemd/system/ssh.socket.d/override.conf >/dev/null <<'EOF'
[Socket]
ListenStream=
ListenStream=0.0.0.0:22
ListenStream=[::]:22
BindIPv6Only=both
EOF
sudo systemctl daemon-reload
sudo systemctl restart ssh.socket ssh.service
sudo ss -lntp | grep 22
```

## Piclaw service
Systemd user unit:
- `~/.config/systemd/user/piclaw.service`

Expected ExecStart (adjust to your install path):
```
ExecStart=/usr/local/bin/piclaw --port 3000
```

Restart:
```
systemctl --user restart piclaw.service
systemctl --user status piclaw.service --no-pager -l | head -n 15
```

## Bun + global installs
- Bun should live at `/usr/local/bun/bin/bun`
- PATH should include `/usr/local/bun/bin` in `~/.bashrc` for interactive shells

Reinstall bun (if missing):
```
sudo BUN_INSTALL=/usr/local/bun bash -c "$(curl -fsSL https://bun.sh/install)"
```

Global installs:
```
# pi CLI
sudo /usr/local/bun/bin/bun add -g @earendil-works/pi-coding-agent

# piclaw from workspace repo root
sudo /usr/local/bun/bin/bun add -g --no-save file:/workspace/piclaw

# ensure wrapper is reachable
sudo ln -sf /usr/local/bun/bin/piclaw /usr/local/bin/piclaw
```

## Remote changes audit + import
Check commit history on VM:
```
git -C /workspace/piclaw log --oneline -n 10
```

If a new commit exists, pull a patch from the VM and apply locally:
```
# On local machine
ssh -i ~/.ssh/azurevm_ed25519 agent@your-vm.example.com \
  "git -C /workspace/piclaw format-patch -1 <commit> --stdout" \
  > /workspace/tmp/azurevm.patch

# Apply locally
cd /workspace/piclaw

git am /workspace/tmp/azurevm.patch
```

Only import code/UI changes.

Do not import:
- `piclaw/dist/`
- `runtime/skills/`
- `skel/.pi/skills/`
- `docs/`
