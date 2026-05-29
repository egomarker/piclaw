const TELEGRAM_DIRECT_CHAT_ID_REGEX = /^\d+$/;

export function buildTelegramChatJid(chatId: string | number): string {
  const normalized = String(chatId || "").trim();
  return `telegram:${normalized}`;
}

export function parseTelegramChatJid(chatJid: string): { chatId: string } {
  const normalized = String(chatJid || "").trim().replace(/^(telegram|tg):/i, "");
  if (!normalized) {
    throw new Error(`Invalid Telegram chat JID: ${chatJid}`);
  }
  return { chatId: normalized };
}

export function isTelegramDirectChatId(chatId: string | number): boolean {
  return TELEGRAM_DIRECT_CHAT_ID_REGEX.test(String(chatId || "").trim());
}
