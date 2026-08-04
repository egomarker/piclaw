const NOTIFICATION_SOURCE_LABELS_ENABLED = "__PICLAW_NOTIFICATION_SOURCE_LABELS_FLAG__" === "1";

function formatNotificationTitle(title, sourceLabel) {
  const normalizedTitle = String(title || '').trim() || 'PiClaw';
  const normalizedSource = NOTIFICATION_SOURCE_LABELS_ENABLED ? String(sourceLabel || '').trim() : '';
  return normalizedSource ? `${normalizedTitle} [${normalizedSource}]` : normalizedTitle;
}

function resolveAbsoluteNotificationUrl(value) {
  try {
    return new URL(String(value || '/'), self.location.origin);
  } catch {
    return new URL('/', self.location.origin);
  }
}

function shouldReuseClientForNotification(clientUrl, targetUrl) {
  const client = resolveAbsoluteNotificationUrl(clientUrl);
  const target = resolveAbsoluteNotificationUrl(targetUrl);
  if (client.origin !== target.origin) {
    return false;
  }
  if (client.href === target.href) {
    return true;
  }
  return client.pathname === target.pathname;
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function shouldBypassServiceWorkerFetch(request, url) {
  if (url.pathname.startsWith('/sse/') || url.pathname.startsWith('/ws/')) {
    return true;
  }
  return String(request.headers.get('accept') || '').toLowerCase().includes('text/event-stream');
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!request || request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (shouldBypassServiceWorkerFetch(request, url)) return;

  event.respondWith((async () => {
    // Navigations may hit a restarting backend; retry briefly before giving up.
    const isNavigation = request.mode === 'navigate';
    const attempts = isNavigation ? 3 : 1;
    for (let attempt = 1; ; attempt++) {
      try {
        return await fetch(request);
      } catch (err) {
        if (attempt >= attempts) {
          if (isNavigation) {
            return new Response(
              '<!doctype html><html><head><meta charset="utf-8"><title>PiClaw</title>' +
              '<meta name="viewport" content="width=device-width,initial-scale=1">' +
              '<style>body{font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;' +
              'display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}' +
              'h1{font-size:1.4rem}p{color:#94a3b8}</style></head><body>' +
              '<div><h1>PiClaw is unreachable</h1>' +
              '<p>The server did not answer (it may be restarting).<br>Please try reloading in a moment.</p></div>' +
              '</body></html>',
              { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          }
          return new Response('Network error', { status: 504 });
        }
        await new Promise((resolve) => setTimeout(resolve, 750));
      }
    }
  })());
});

self.addEventListener('push', (event) => {
  const defaultNotification = {
    title: 'PiClaw',
    body: 'You have a new update.',
    tag: 'piclaw',
    url: '/',
    sourceLabel: '',
  };

  let payload = defaultNotification;
  try {
    const next = event.data?.json?.();
    if (next && typeof next === 'object') {
      payload = {
        ...defaultNotification,
        ...next,
      };
    }
  } catch {
    const text = event.data?.text?.();
    if (text) {
      payload = {
        ...defaultNotification,
        body: text,
      };
    }
  }

  event.waitUntil(self.registration.showNotification(formatNotificationTitle(payload.title, payload.sourceLabel), {
    body: payload.body,
    tag: payload.tag,
    data: {
      url: payload.url || '/',
    },
    icon: '/static/icon-192.png',
    badge: '/static/icon-192.png',
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = resolveAbsoluteNotificationUrl(event.notification?.data?.url || '/').href;

  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      const clientUrl = client.url || '';
      if (shouldReuseClientForNotification(clientUrl, targetUrl)) {
        if ('focus' in client) {
          await client.focus();
        }
        if ('navigate' in client && targetUrl && clientUrl !== targetUrl) {
          await client.navigate(targetUrl).catch(() => {});
        }
        return;
      }
    }

    if (self.clients.openWindow) {
      await self.clients.openWindow(targetUrl);
    }
  })());
});
