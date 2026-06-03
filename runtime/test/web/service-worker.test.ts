import { afterAll, beforeAll, expect, test } from 'bun:test';

type RegisteredHandler = (event: any) => void;

const handlers = new Map<string, RegisteredHandler>();

const workerSelf = {
  addEventListener(type: string, handler: RegisteredHandler) {
    handlers.set(type, handler);
  },
  skipWaiting: async () => {},
  clients: {
    matchAll: async () => [],
    openWindow: async (_url: string) => {},
    claim: async () => {},
  },
  registration: {
    showNotification: async () => {},
  },
  location: {
    origin: 'https://example.com',
  },
};

beforeAll(async () => {
  (globalThis as any).self = workerSelf;
  await import('../../web/static/sw.js');
});

afterAll(() => {
  delete (globalThis as any).self;
});

test('service worker handles same-origin GET fetches for Android PWA installability', async () => {
  const originalFetch = globalThis.fetch;
  let fetchedUrl = '';
  try {
    globalThis.fetch = async (input: RequestInfo | URL) => {
      fetchedUrl = input instanceof Request ? input.url : String(input);
      return new Response('ok');
    };

    let pending: Promise<Response> | null = null;
    handlers.get('fetch')?.({
      request: new Request('https://example.com/static/app.js', { method: 'GET' }),
      respondWith(promise: Promise<Response>) {
        pending = promise;
      },
    });

    const response = await pending;
    expect(await response?.text()).toBe('ok');
    expect(fetchedUrl).toBe('https://example.com/static/app.js');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('service worker ignores non-GET and cross-origin fetches', () => {
  let responded = false;

  handlers.get('fetch')?.({
    request: new Request('https://example.com/api/messages', { method: 'POST' }),
    respondWith() {
      responded = true;
    },
  });
  handlers.get('fetch')?.({
    request: new Request('https://cdn.example.net/static/app.js', { method: 'GET' }),
    respondWith() {
      responded = true;
    },
  });

  expect(responded).toBe(false);
});

test('service worker bypasses long-lived live and streaming requests', () => {
  let responded = false;
  const fetchHandler = handlers.get('fetch');
  const respondWith = () => {
    responded = true;
  };

  fetchHandler?.({
    request: new Request('https://example.com/sse/stream?chat_jid=web%3Adefault', { method: 'GET' }),
    respondWith,
  });
  fetchHandler?.({
    request: new Request('https://example.com/ws/terminal', { method: 'GET' }),
    respondWith,
  });
  fetchHandler?.({
    request: new Request('https://example.com/events', {
      method: 'GET',
      headers: { Accept: 'text/event-stream' },
    }),
    respondWith,
  });

  expect(responded).toBe(false);
});

test('service worker reuses an existing root app tab for relative notification targets', async () => {
  let focused = false;
  let navigatedTo = '';
  let openedTo = '';

  workerSelf.clients.matchAll = async () => [{
    url: 'https://example.com/',
    focus: async () => {
      focused = true;
    },
    navigate: async (url: string) => {
      navigatedTo = url;
    },
  }];
  workerSelf.clients.openWindow = async (url: string) => {
    openedTo = url;
  };

  let pending: Promise<unknown> | null = null;
  handlers.get('notificationclick')?.({
    notification: {
      close() {},
      data: { url: '/?chat_jid=web%3Adefault#msg-42' },
    },
    waitUntil(promise: Promise<unknown>) {
      pending = promise;
    },
  });

  await pending;

  expect(focused).toBe(true);
  expect(navigatedTo).toBe('https://example.com/?chat_jid=web%3Adefault#msg-42');
  expect(openedTo).toBe('');
});

test('service worker opens an absolute notification URL when no client matches', async () => {
  let openedTo = '';

  workerSelf.clients.matchAll = async () => [];
  workerSelf.clients.openWindow = async (url: string) => {
    openedTo = url;
  };

  let pending: Promise<unknown> | null = null;
  handlers.get('notificationclick')?.({
    notification: {
      close() {},
      data: { url: '/?chat_jid=web%3Aother' },
    },
    waitUntil(promise: Promise<unknown>) {
      pending = promise;
    },
  });

  await pending;

  expect(openedTo).toBe('https://example.com/?chat_jid=web%3Aother');
});

test('service worker hides notification source markers by default', async () => {
  let shownTitle = '';

  workerSelf.registration.showNotification = async (title: string) => {
    shownTitle = title;
  };

  let pending: Promise<unknown> | null = null;
  handlers.get('push')?.({
    data: {
      json() {
        return {
          title: 'PiClaw reply',
          body: 'Reply body',
          sourceLabel: 'Web Push',
        };
      },
    },
    waitUntil(promise: Promise<unknown>) {
      pending = promise;
    },
  });

  await pending;

  expect(shownTitle).toBe('PiClaw reply');
});
