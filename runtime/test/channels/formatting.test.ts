import { expect, test } from "bun:test";
import { buildChannelSystemPromptAppendix, getChannelFormattingInstructions } from "../../src/channels/formatting.js";

test("getChannelFormattingInstructions returns known channel hints", () => {
  expect(getChannelFormattingInstructions("web")).toContain("Use Markdown formatting");
  expect(getChannelFormattingInstructions("telegram")).toContain("attach_file");
  expect(getChannelFormattingInstructions("telegram")).toContain("raw Telegram Bot API calls via bash/curl");
  expect(getChannelFormattingInstructions("whatsapp")).toBeNull();
  expect(getChannelFormattingInstructions("unknown")).toBeNull();
});

test("buildChannelSystemPromptAppendix builds persistent session guidance", () => {
  const appendix = buildChannelSystemPromptAppendix("web", "web:default");
  expect(appendix).toContain("## Active delivery channel");
  expect(appendix).toContain("Current channel: web");
  expect(appendix).toContain("Current chat: web:default");
  expect(appendix).toContain("scope replies, tool calls, message lookups");
  expect(appendix).toContain("Use Markdown formatting");

  const telegramAppendix = buildChannelSystemPromptAppendix("telegram", "telegram:123");
  expect(telegramAppendix).toContain("Current channel: telegram");
  expect(telegramAppendix).toContain("Current chat: telegram:123");
  expect(telegramAppendix).toContain("attach_file");
  expect(buildChannelSystemPromptAppendix("unknown")).toBeNull();
});
