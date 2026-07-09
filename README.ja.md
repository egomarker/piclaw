# `piclaw` — セルフホスト型 AI ワークスペース

![PiClaw](docs/icon-256.png)

言語：[English](README.md) · [简体中文](README.zh-CN.md) · **日本語**

PiClaw は [Pi Coding Agent](https://github.com/badlogic/pi-mono) を、三言語対応のストリーミング Web UI、永続状態、複数プロバイダーの LLM 対応、そして[多数のアドオン](https://rcarmo.github.io/piclaw-addons/)を含む実用的な組み込みツールセット付きのセルフホスト型ワークスペースとしてまとめたものです。

対象は、ローカルまたはコンテナーで動かせる、状態を保持する agent ワークスペースが欲しい人です。半ダースの別サービスを無理やり縫い合わせる作業に人生を費やしたくない人向け、とも言えます。

## PiClaw を選ぶ理由

![デモアニメーション](docs/demo.gif)

- **1 つのワークスペース、1 つのアプリ** — チャット、エディター、ターミナル、ビューアー、ボード、アップロード、自動化を同じ Web UI に集約
- **永続状態** — SQLite ベースのメッセージ、メディア、タスク、トークン使用量、暗号化キー管理、セッション単位の SSH / Proxmox / Portainer プロファイル
- **実用的な組み込み機能** — コード編集、Office/PDF/CSV/画像/動画ビューアー、draw.io、VNC、ブラウザー自動化、画像処理、MCP、インフラ系ツール、ペアリングしたリモート peer 向けの任意のクロスインスタンス IPC
- **Agent ファーストのワークフロー** — steering、キュー付き follow-up、side prompt、自動調査ループ、スケジュールタスク、視覚的 artifact 生成
- **コンテキスト節約** — 常時有効な小さなツール基盤と、`list_tools` / `list_scripts` による段階的な発見
- **任意の認証/チャネル** — Web UI の passkey/TOTP、および任意の WhatsApp 連携

## クイックスタート

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

`http://localhost:8080` を開き、`/login` と入力して LLM プロバイダーを設定します。組み込みのホスト型プロバイダーを使わない場合は、OpenAI 互換のカスタムエンドポイントも設定できます。Web UI には現在、英語、簡体字中国語、日本語の文字列が同梱されています。今日は英語の丘で討ち死にしたくない、という場合は設定の言語スイッチャーを使ってください。

> [!TIP]
> `docker run` / `podman run` では `--init` を有効にしたままにしてください。ランタイムが小さな init プロセスを挿入し、シグナル転送とゾンビプロセスの回収を行います。同梱の `docker-compose.yml` も同等の `init: true` フラグを設定しています。

| マウント | コンテナーパス | 内容 |
|---|---|---|
| Home | `/config` | Agent home（`.pi/`、`.gitconfig`、`.bashrc`） |
| Workspace | `/workspace` | プロジェクト、ノート、piclaw 状態 |

> [!NOTE]
> コンテナーイメージでは、`/home/agent/.pi` は `/config/.pi` によって支えられています。上記の標準 `docker run` / `docker-compose.yml` 例を使う場合、Pi home の状態はホスト側の `./home/.pi/agent/` 以下に永続化されます。
>
> つまり、プロバイダーログイン状態やモデルメタデータを次のようなファイルに保存しておけば、再ビルドや再作成後も残るはずです。
>
> - `./home/.pi/agent/auth.json`
> - `./home/.pi/agent/models.json`
>
> `/home/agent` や `/home/agent/.pi/agent` へ直接マウントしても動作しますが、コンテナーイメージで文書化されている標準の永続化パスは `/config` です。

> [!WARNING]
> `/workspace/.piclaw/store/messages.db` は絶対に削除しないでください。チャット履歴、メディア、タスク状態が入っています。削除すると、未来の自分からかなり冷たい目で見られます。

> [!IMPORTANT]
> piclaw の環境変数に provider API key を設定する必要は**ありません**。PiClaw は Pi Agent 設定で構成された provider 認証情報を再利用します。

> [!NOTE]
> パワーユーザーは、ワークスペース単位の shell 環境上書きを `/workspace/.env.sh` に置けます。PiClaw は組み込みターミナルとランタイム起動時にこのファイルを source します。`PATH` 調整や、`GH_CONFIG_DIR=/workspace/.config/gh` による `gh auth login` の永続化などに便利です。この hook はユーザー管理です。内容が PiClaw の起動、shell 動作、ツール解決を壊した場合、それはユーザー自身の芸術作品です。

## Web UI 概要

PiClaw はシングルユーザー向けでモバイルフレンドリー、更新は SSE でストリーミングされます。

| 領域 | ハイライト |
|---|---|
| チャット | 思考/ドラフトパネル、steering、キュー付き follow-up、Adaptive Cards、`/btw`、リンクプレビュー、スレッド化された turn、復旧/タイムアウト chip |
| 言語 | 英語、簡体字中国語、日本語の UI 文字列と、設定内の言語スイッチャー |
| ステータス UX | 無音探測中もツール/意図ステータスを表示し続け、最近のアクティビティから有用な文脈を復元し、ツール行は meta 行にコンパクトな `x ago` ヒントを表示可能 |
| ワークスペース | サイドバーのブラウザー、ドラッグ＆ドロップアップロード、ファイル参照 pill、explorer 検索/再インデックス状態 |
| エディター | CodeMirror 6、検索/置換、dirty 状態追跡、シンタックスハイライト、遅延読み込みのローカル bundle |
| ターミナル | dock または tab として使える組み込み xterm.js Web ターミナル、切り離し可能なポップアウト、Ghostty は任意アドオンとして別途提供 |
| ビューアー | Draw.io、Office 文書、CSV/TSV、PDF、画像、動画、コードプレビュー、kanban ボード、VNC |
| 自動化 | `/image`、`/flux`、`image_process`、`cdp_browser`、`mcp`、実験的な `m365`、Windows 専用の `win_*` ツール |

完全な機能ツアーは [docs/web-ui.md](docs/web-ui.md) を参照してください。

> [!NOTE]
> デフォルトのターミナルレンダラーは、現在は組み込みの xterm.js 実装です。以前の Ghostty/WASM レンダラーは core から移動し、高性能ブラウザー向けの任意アドオン [`@rcarmo/piclaw-addon-ghostty-terminal`](https://rcarmo.github.io/piclaw-addons/addons/ghostty-terminal/) として提供されています。

## 設定

ほとんどのユーザーに必要な環境変数は少数です。

| 変数 | 既定値 | 目的 |
|---|---|---|
| `PICLAW_WEB_PORT` | `8080` | Web UI ポート |
| `PICLAW_WEB_TERMINAL_ENABLED` | Linux/macOS は `1`、Windows は `0` | 認証付き組み込み Web ターミナルの有効/無効 |
| `PICLAW_WEB_VNC_ALLOW_DIRECT` | Linux/macOS/Windows で `1` | 実行時に指定される直接 VNC ターゲットの許可/禁止 |
| `PICLAW_WEB_TOTP_SECRET` | _（空）_ | Base32 TOTP secret。ログインゲートを有効化（または `/totp` で初期化） |
| `PICLAW_WEB_PASSKEY_MODE` | `totp-fallback` | `totp-fallback`、`passkey-only`、`totp-only` |
| `PICLAW_ASSISTANT_NAME` | `PiClaw` | UI に表示される名前 |
| `PICLAW_ENABLE_M365_EXPERIMENTAL` | `0` | 実験的な Microsoft 365 拡張 bundle を有効化 |
| `PICLAW_KEYCHAIN_KEY` | _（空）_ | 暗号化 secret 保存用の master key |
| `PICLAW_TRUST_PROXY` | `0` | リバースプロキシまたはトンネルの背後にある場合に有効化 |

完全な一覧、認証設定（TOTP/passkey）、セッション単位の SSH-backed リモートツール、リバースプロキシ設定、SSHFS/FUSE 対応、ワークスペース環境 hook については [docs/configuration.md](docs/configuration.md) を参照してください。

## その他のインストール方法

### Docker なしでインストール

```bash
bun add -g github:rcarmo/piclaw
```

実験的です。Linux/macOS/Windows 対応。詳細は [docs/install-from-repo.md](docs/install-from-repo.md) を参照してください。

Windows では、PiClaw は引き続き二次的/非公式サポート対象です。shell 風の子プロセスは Windows では attached（`detached=false`）で実行されるため stdout/stderr を捕捉できます。Unix 系ホストでは、abort/shutdown 時にプロセスツリーをきれいに終了するため、引き続き分離プロセスグループを使います。

### 実験的なデスクトップシェル

PiClaw には、既存のローカル Web UI を包む任意の Electrobun デスクトップラッパーもあります。

```bash
bun run build:desktop
```

デスクトップシェルは `127.0.0.1` 上で Piclaw を起動し、`18080` から始まる空きポートを使ってネイティブウィンドウを開き、既定のワークスペースを各プラットフォームのアプリケーションデータディレクトリに保存します。すでに動作中の Piclaw Web サーバーを包みたい場合は、`PICLAW_DESKTOP_URL` を設定してください。

### ソースからビルド

[docs/development.md](docs/development.md) を参照してください。

## ドキュメント

| 領域 | ドキュメント |
|---|---|
| はじめに | [設定](docs/configuration.md)、[Web UI](docs/web-ui.md)、[リポジトリからインストール](docs/install-from-repo.md) |
| 運用 | [Azure VM デプロイ](docs/azure/README.md)、[リバースプロキシ](docs/reverse-proxy.md)、[リリース手順](docs/release.md) |
| ランタイム内部 | [アーキテクチャ](docs/architecture.md)、[ランタイムフロー](docs/runtime-flows.md)、[ランタイムストリームセッション](docs/runtime-stream-sessions.md)、[ストレージモデル](docs/storage.md)、[可観測性](docs/observability.md) |
| UI 拡張モデル | [Web pane extensions](docs/web-pane-extensions.md)、[Extension UI contract](docs/extension-ui-contract.md)、[Vendored widget libraries](docs/vendored-widget-libraries.md) |
| Agent 機能 | [ツールとスキル](docs/tools-and-skills.md)、[Visual artifact generator](docs/visual-artifact-generator.md)、[pi-mcp-adapter 経由の MCP](docs/mcp.md)、[キー管理](docs/keychain.md) |
| その他のリファレンス | [Dream memory system](docs/dream-memory.md)、[Web notification delivery policy](docs/web-notification-delivery-policy.md)、[iOS PWA reference](docs/PWA.md)、[WhatsApp](docs/whatsapp.md)、[Cross-instance interop](docs/cross-instance-ipc.md)、[Experimental M365 extension](docs/m365-experimental-extension.md)、[開発](docs/development.md) |
| プラットフォーム調査 | [Azure Functions feasibility study](docs/azure/azure-functions-feasibility-study-2026-04-17.md) |

## コントリビューション

作業項目とバグ報告は **[GitHub Issues](https://github.com/rcarmo/piclaw/issues)** で管理されています。

- [作業項目またはバグ報告を開く](https://github.com/rcarmo/piclaw/issues/new?template=workitem.md)
- [質問する](https://github.com/rcarmo/piclaw/issues/new?template=question.md)
- [プロジェクトボードを見る](https://github.com/users/rcarmo/projects/13)

ボードの lane 定義と triage taxonomy については、issue template と project board の label を基準にしてください。

## クレジット

- [pi.dev](http://pi.dev) — 非常に柔軟で拡張性の高い core の提供
- [rcarmo/agentbox](https://github.com/rcarmo/agentbox)
- [qwibitai/nanoclaw](https://github.com/qwibitai/nanoclaw)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [davebcn87/pi-autoresearch](https://github.com/davebcn87/pi-autoresearch) — Tobi Lutke と David Cortés による自律実験ループ（現在は `rcarmo/piclaw-addons` の autoresearch アドオンが担っています）
- [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) — Nico Bailon による視覚的 artifact 生成スキルの思想、prompt ワークフロー、テンプレートパターン（adapted、vendored ではありません）

> [!NOTE]
> piclaw は [pi.dev](https://pi.dev) と直接の提携関係には**ありません**。これは Pi の core 機能を活用し、その周囲に追加のランタイム、ツール、UI レイヤーを構築する派生作品です。

## ライセンス

MIT
