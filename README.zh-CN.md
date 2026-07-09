# `piclaw` — 自托管 AI 工作区

![PiClaw](docs/icon-256.png)

语言：[English](README.md) · **简体中文** · [日本語](README.ja.md)

PiClaw 将 [Pi Coding Agent](https://github.com/badlogic/pi-mono) 打包成一个自托管工作区，带有三语流式 Web UI、持久状态、多提供商 LLM 支持，以及一套实用的内置工具，其中还包括[许多插件](https://rcarmo.github.io/piclaw-addons/)。

它面向那些想要一个有状态的 agent 工作区、可以本地运行或放进容器里运行、又不想把半打服务硬拼在一起的人。生活已经够复杂了，编排 AI 工具不必再添乱。

## 为什么选择 PiClaw

![演示动画](docs/demo.gif)

- **一个工作区，一个应用** — 聊天、编辑器、终端、查看器、看板、上传和自动化都在同一个 Web UI 里
- **持久状态** — 基于 SQLite 的消息、媒体、任务、token 使用量、加密钥匙串，以及会话级 SSH / Proxmox / Portainer 配置
- **实用内置功能** — 代码编辑、Office/PDF/CSV/图片/视频查看、draw.io、VNC、浏览器自动化、图像处理、MCP、基础设施工具，以及用于成对远端实例的可选跨实例 IPC
- **Agent 优先的工作流** — steer、排队 follow-up、side prompt、自动研究循环、计划任务和可视化 artifact 生成
- **节省上下文** — 默认只启用小型工具基线，通过 `list_tools` / `list_scripts` 分阶段发现更多工具
- **可选认证/通道** — Web UI 支持 passkey/TOTP，也可选接入 WhatsApp

## 快速开始

```bash
mkdir -p ./home ./workspace

docker run -d \
  --init \
  --name piclaw \
  --restart unless-stopped \
  -p 8080:8080 \
  -e PICLAW_WEB_PORT=8080 \
  -v "$(pwd)/home:/config" \
  -v "$(pwd)/workspace:/workspace" \
  ghcr.io/rcarmo/piclaw:latest
```

打开 `http://localhost:8080`，输入 `/login` 配置你的 LLM 提供商；如果不用内置托管提供商，也可以配置自定义 OpenAI 兼容端点。Web UI 目前内置英语、简体中文和日语文案；如果今天你不想和英语死磕，就去设置里的语言切换器改掉它。

> [!TIP]
> 对 `docker run` / `podman run` 保持启用 `--init`，这样运行时会插入一个很小的 init 进程，用于转发信号和回收僵尸进程。随附的 `docker-compose.yml` 现在也设置了等效的 `init: true` 标志。

| 挂载 | 容器路径 | 内容 |
|---|---|---|
| Home | `/config` | Agent home（`.pi/`、`.gitconfig`、`.bashrc`） |
| Workspace | `/workspace` | 项目、笔记和 piclaw 状态 |

> [!NOTE]
> 在容器镜像中，`/home/agent/.pi` 由 `/config/.pi` 支撑。使用上面的标准 `docker run` / `docker-compose.yml` 示例时，Pi home 状态会持久保存在主机的 `./home/.pi/agent/` 下。
>
> 这意味着 provider 登录状态和模型元数据如果存放在以下文件中，重建/重建容器后应该仍然存在：
>
> - `./home/.pi/agent/auth.json`
> - `./home/.pi/agent/models.json`
>
> 直接挂载到 `/home/agent` 或 `/home/agent/.pi/agent` 也可以工作，但 `/config` 是容器镜像的规范文档化持久化路径。

> [!WARNING]
> 绝不要删除 `/workspace/.piclaw/store/messages.db`。它包含聊天历史、媒体和任务状态。删它就是给自己寄一封来自过去的投诉信。

> [!IMPORTANT]
> 你**不需要**在 piclaw 环境变量里设置 provider API key。PiClaw 会复用 Pi Agent 设置中配置的 provider 凭据。

> [!NOTE]
> 高级用户可以把工作区级 shell 环境覆盖写入 `/workspace/.env.sh`。PiClaw 会为内置终端和运行时启动过程 source 该文件，适合用于 `PATH` 调整，或通过 `GH_CONFIG_DIR=/workspace/.config/gh` 持久化 `gh auth login`。这个 hook 由用户控制：如果其内容破坏了 PiClaw 启动、shell 行为或工具解析，那就是用户自己的杰作。

## Web UI 概览

PiClaw 是单用户、移动端友好的，并通过 SSE 流式推送更新。

| 区域 | 亮点 |
|---|---|
| 聊天 | 思考/草稿面板、steering、排队 follow-up、Adaptive Cards、`/btw`、链接预览、线程化轮次、恢复/超时 chip |
| 语言 | 英语、简体中文和日语 UI 文案，并带有设置内语言切换器 |
| 状态 UX | 静默探测期间工具/意图状态保持可见，最近活动会恢复有用上下文，工具行可在 meta 行显示紧凑的 `x ago` 提示 |
| 工作区 | 侧边栏浏览器、拖放上传、文件引用 pill、explorer 搜索/重建索引状态 |
| 编辑器 | CodeMirror 6、搜索/替换、dirty 状态跟踪、语法高亮、延迟加载的本地 bundle |
| 终端 | 内置 xterm.js Web 终端，可作为 dock 或 tab；支持可分离弹窗；Ghostty 作为可选插件单独提供 |
| 查看器 | Draw.io、Office 文档、CSV/TSV、PDF、图片、视频、代码预览、看板、VNC |
| 自动化 | `/image`、`/flux`、`image_process`、`cdp_browser`、`mcp`、实验性 `m365`、仅 Windows 的 `win_*` 工具 |

完整功能导览见 [docs/web-ui.md](docs/web-ui.md)。

> [!NOTE]
> 默认终端渲染器现在是内置 xterm.js 实现。之前的 Ghostty/WASM 渲染器已经从核心中移出，并作为可选 [`@rcarmo/piclaw-addon-ghostty-terminal`](https://rcarmo.github.io/piclaw-addons/addons/ghostty-terminal/) 插件提供给高端浏览器使用。

## 配置

多数用户只需要少量环境变量：

| 变量 | 默认值 | 用途 |
|---|---|---|
| `PICLAW_WEB_PORT` | `8080` | Web UI 端口 |
| `PICLAW_WEB_TERMINAL_ENABLED` | Linux/macOS 为 `1`，Windows 为 `0` | 启用或禁用经过认证的内置 Web 终端 |
| `PICLAW_WEB_VNC_ALLOW_DIRECT` | Linux/macOS/Windows 为 `1` | 允许或禁用运行时提供的直接 VNC 目标 |
| `PICLAW_WEB_TOTP_SECRET` | _（空）_ | Base32 TOTP secret；启用登录门禁（也可用 `/totp` 初始化） |
| `PICLAW_WEB_PASSKEY_MODE` | `totp-fallback` | `totp-fallback`、`passkey-only` 或 `totp-only` |
| `PICLAW_ASSISTANT_NAME` | `PiClaw` | UI 中显示的名称 |
| `PICLAW_ENABLE_M365_EXPERIMENTAL` | `0` | 启用实验性 Microsoft 365 扩展 bundle |
| `PICLAW_KEYCHAIN_KEY` | _（空）_ | 加密 secret 存储的主密钥 |
| `PICLAW_TRUST_PROXY` | `0` | 位于反向代理或隧道后方时启用 |

完整列表、认证设置（TOTP/passkey）、会话级 SSH-backed 远程工具、反向代理配置、SSHFS/FUSE 支持以及工作区环境 hook，见 [docs/configuration.md](docs/configuration.md)。

## 其他安装方式

### 不使用 Docker 安装

```bash
bun add -g github:rcarmo/piclaw
```

实验性。支持 Linux/macOS/Windows。见 [docs/install-from-repo.md](docs/install-from-repo.md)。

在 Windows 上，PiClaw 仍然是次要/非官方支持目标。类 shell 子进程现在在那里以附加模式运行（`detached=false`），因此 stdout/stderr 仍可捕获；类 Unix 主机仍使用分离进程组，以便在 abort/shutdown 时更干净地终止进程树。

### 实验性桌面壳

PiClaw 还有一个可选的 Electrobun 桌面包装器，包裹现有本地 Web UI：

```bash
bun run build:desktop
```

桌面壳会在 `127.0.0.1` 上启动 Piclaw，使用从 `18080` 起的可用端口，打开原生窗口，并把默认工作区存储在平台应用数据目录下。设置 `PICLAW_DESKTOP_URL` 可包装一个已经运行的 Piclaw Web 服务器，而不是再启动一个。

### 从源码构建

见 [docs/development.md](docs/development.md)。

## 文档

| 区域 | 文档 |
|---|---|
| 入门 | [配置](docs/configuration.md)、[Web UI](docs/web-ui.md)、[从仓库安装](docs/install-from-repo.md) |
| 运维 | [Azure VM 部署](docs/azure/README.md)、[反向代理](docs/reverse-proxy.md)、[发布流程](docs/release.md) |
| 运行时内部 | [架构](docs/architecture.md)、[运行时流程](docs/runtime-flows.md)、[运行时流式会话](docs/runtime-stream-sessions.md)、[存储模型](docs/storage.md)、[可观测性](docs/observability.md) |
| UI 扩展模型 | [Web pane 扩展](docs/web-pane-extensions.md)、[扩展 UI 契约](docs/extension-ui-contract.md)、[Vendored widget 库](docs/vendored-widget-libraries.md) |
| Agent 能力 | [工具和技能](docs/tools-and-skills.md)、[可视化 artifact 生成器](docs/visual-artifact-generator.md)、[通过 pi-mcp-adapter 使用 MCP](docs/mcp.md)、[钥匙串](docs/keychain.md) |
| 其他参考 | [Dream 记忆系统](docs/dream-memory.md)、[Web 通知交付策略](docs/web-notification-delivery-policy.md)、[iOS PWA 参考](docs/PWA.md)、[WhatsApp](docs/whatsapp.md)、[跨实例互操作](docs/cross-instance-ipc.md)、[实验性 M365 扩展](docs/m365-experimental-extension.md)、[开发](docs/development.md) |
| 平台研究 | [Azure Functions 可行性研究](docs/azure/azure-functions-feasibility-study-2026-04-17.md) |

## 贡献

工作项和 bug 报告在 **[GitHub Issues](https://github.com/rcarmo/piclaw/issues)** 中跟踪。

- [提交工作项或 bug 报告](https://github.com/rcarmo/piclaw/issues/new?template=workitem.md)
- [提问](https://github.com/rcarmo/piclaw/issues/new?template=question.md)
- [查看项目看板](https://github.com/users/rcarmo/projects/13)

看板泳道定义和分诊分类请以 issue 模板和项目看板标签为准。

## 鸣谢

- [pi.dev](http://pi.dev)，提供了极其灵活且可扩展的核心
- [rcarmo/agentbox](https://github.com/rcarmo/agentbox)
- [qwibitai/nanoclaw](https://github.com/qwibitai/nanoclaw)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [davebcn87/pi-autoresearch](https://github.com/davebcn87/pi-autoresearch) — Tobi Lutke 和 David Cortés 的自主实验循环（现在由 `rcarmo/piclaw-addons` 中的 autoresearch 插件承载）
- [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) — Nico Bailon 的可视化 artifact 生成技能理念、prompt 工作流和模板模式（已改编，非 vendored）

> [!NOTE]
> piclaw 与 [pi.dev](https://pi.dev) **没有**直接关联。它是一个衍生作品，利用其核心 Pi 功能，并在其周围构建额外的运行时、工具和 UI 层。

## 许可证

MIT
