/**
 * attachment-share.ts – Web Share integration for chat attachments.
 *
 * Mobile browsers expose `navigator.share({ files })`, which opens the native
 * share sheet. That sheet is the only path from the web UI to the device file
 * system (for example "Save to Files" on iOS), because downloads triggered by
 * `Content-Disposition: attachment` are unreliable in mobile browsers and
 * standalone PWAs.
 *
 * Desktop browsers and older mobile browsers do not support sharing files, so
 * the attachment card gates the action on both platform and capability.
 */

/** Runtime overrides so the helpers stay testable without a DOM. */
export interface AttachmentShareRuntime {
  navigator?: {
    userAgent?: string;
    maxTouchPoints?: number;
    share?: (data: { files?: unknown[]; title?: string }) => Promise<void>;
    canShare?: (data?: { files?: unknown[] }) => boolean;
  } | null;
}

function resolveNavigator(runtime: AttachmentShareRuntime = {}) {
  return runtime.navigator ?? (typeof navigator !== 'undefined' ? navigator : null);
}

/**
 * Whether the runtime is an iOS or Android device.
 *
 * iPadOS 13+ reports a desktop "Macintosh" user agent, so touch support is the
 * discriminator there.
 */
export function isIosOrAndroidPlatform(runtime: AttachmentShareRuntime = {}): boolean {
  const nav = resolveNavigator(runtime);
  const userAgent = String(nav?.userAgent || '');
  if (/Android/i.test(userAgent)) return true;
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true;
  const maxTouchPoints = Number(nav?.maxTouchPoints || 0);
  return /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

/** Whether the navigator exposes the file-sharing half of the Web Share API. */
export function canShareAttachmentFiles(runtime: AttachmentShareRuntime = {}): boolean {
  const nav = resolveNavigator(runtime);
  return Boolean(nav && typeof nav.share === 'function' && typeof nav.canShare === 'function');
}

/** Whether the attachment card should offer the share action at all. */
export function shouldShowAttachmentShare(runtime: AttachmentShareRuntime = {}): boolean {
  return isIosOrAndroidPlatform(runtime) && canShareAttachmentFiles(runtime);
}

export type AttachmentShareOutcome = 'shared' | 'cancelled' | 'unsupported' | 'failed';

/**
 * Hand a file to the native share sheet.
 *
 * `unsupported` means the browser cannot share files, `cancelled` means the
 * user dismissed the sheet, `failed` covers every other rejection.
 */
export async function shareAttachmentFile(options: {
  file: unknown;
  title?: string;
  runtime?: AttachmentShareRuntime;
}): Promise<AttachmentShareOutcome> {
  const nav = resolveNavigator(options.runtime ?? {});
  if (!canShareAttachmentFiles({ navigator: nav })) return 'unsupported';

  const files = [options.file];
  try {
    if (!nav!.canShare!({ files })) return 'unsupported';
  } catch {
    return 'unsupported';
  }

  try {
    await nav!.share!({ files, ...(options.title ? { title: options.title } : {}) });
    return 'shared';
  } catch (error) {
    const name = (error as { name?: string } | null)?.name;
    return name === 'AbortError' ? 'cancelled' : 'failed';
  }
}
