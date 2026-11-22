import { expect, test } from 'bun:test';

import {
  canShareAttachmentFiles,
  isIosOrAndroidPlatform,
  shareAttachmentFile,
  shouldShowAttachmentShare,
} from '../../web/src/ui/attachment-share.ts';

const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const IPADOS_DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function navigatorStub(overrides: Record<string, unknown> = {}) {
  return { userAgent: IPHONE_UA, maxTouchPoints: 5, ...overrides } as any;
}

test('attachment share platform detection covers iOS, iPadOS desktop UA and Android', () => {
  expect(isIosOrAndroidPlatform({ navigator: navigatorStub() })).toBe(true);
  expect(isIosOrAndroidPlatform({ navigator: navigatorStub({ userAgent: IPAD_UA }) })).toBe(true);
  expect(isIosOrAndroidPlatform({ navigator: navigatorStub({ userAgent: IPADOS_DESKTOP_UA, maxTouchPoints: 5 }) })).toBe(true);
  expect(isIosOrAndroidPlatform({ navigator: navigatorStub({ userAgent: ANDROID_UA, maxTouchPoints: 5 }) })).toBe(true);
});

test('attachment share platform detection excludes desktop browsers', () => {
  expect(isIosOrAndroidPlatform({ navigator: navigatorStub({ userAgent: DESKTOP_UA, maxTouchPoints: 0 }) })).toBe(false);
  expect(isIosOrAndroidPlatform({ navigator: navigatorStub({ userAgent: IPADOS_DESKTOP_UA, maxTouchPoints: 0 }) })).toBe(false);
  expect(isIosOrAndroidPlatform({ navigator: null })).toBe(false);
});

test('attachment share requires both platform and file-sharing capability', () => {
  const capable = navigatorStub({ share: async () => {}, canShare: () => true });
  const noCanShare = navigatorStub({ share: async () => {} });
  const noShare = navigatorStub({ canShare: () => true });

  expect(canShareAttachmentFiles({ navigator: capable })).toBe(true);
  expect(canShareAttachmentFiles({ navigator: noCanShare })).toBe(false);
  expect(canShareAttachmentFiles({ navigator: noShare })).toBe(false);

  expect(shouldShowAttachmentShare({ navigator: capable })).toBe(true);
  expect(shouldShowAttachmentShare({ navigator: navigatorStub({ ...capable, userAgent: DESKTOP_UA, maxTouchPoints: 0 }) })).toBe(false);
  expect(shouldShowAttachmentShare({ navigator: noCanShare })).toBe(false);
});

test('shareAttachmentFile reports unsupported when files cannot be shared', async () => {
  const file = { name: 'invoice.pdf' };

  expect(await shareAttachmentFile({ file, runtime: { navigator: navigatorStub() } })).toBe('unsupported');
  expect(await shareAttachmentFile({
    file,
    runtime: { navigator: navigatorStub({ share: async () => {}, canShare: () => false }) },
  })).toBe('unsupported');
  expect(await shareAttachmentFile({
    file,
    runtime: { navigator: navigatorStub({ share: async () => {}, canShare: () => { throw new Error('boom'); } }) },
  })).toBe('unsupported');
});

test('shareAttachmentFile passes the file to navigator.share', async () => {
  const file = { name: 'invoice.pdf', type: 'application/pdf' };
  let received: any = null;
  const nav = navigatorStub({
    canShare: (data: any) => Array.isArray(data?.files) && data.files.length === 1,
    share: async (data: any) => { received = data; },
  });

  expect(await shareAttachmentFile({ file, title: 'invoice.pdf', runtime: { navigator: nav } })).toBe('shared');
  expect(received.files).toEqual([file]);
  expect(received.title).toBe('invoice.pdf');
});

test('shareAttachmentFile distinguishes user cancellation from failure', async () => {
  const file = { name: 'invoice.pdf' };
  const aborting = navigatorStub({
    canShare: () => true,
    share: async () => { const error = new Error('cancelled'); error.name = 'AbortError'; throw error; },
  });
  const failing = navigatorStub({
    canShare: () => true,
    share: async () => { throw new Error('NotAllowedError'); },
  });

  expect(await shareAttachmentFile({ file, runtime: { navigator: aborting } })).toBe('cancelled');
  expect(await shareAttachmentFile({ file, runtime: { navigator: failing } })).toBe('failed');
});
