export const TIMELINE_TOUCH_SCROLL_IDLE_EVENT = 'piclaw:timeline-touch-scroll-idle';

function currentNavigator(): any {
  return typeof navigator === 'undefined' ? null : navigator;
}

export function isAndroidTimelinePlatform(navigatorLike: any = currentNavigator()): boolean {
  const userAgentDataPlatform = String(navigatorLike?.userAgentData?.platform || '');
  const userAgent = String(navigatorLike?.userAgent || '');
  return /android/i.test(`${userAgentDataPlatform} ${userAgent}`);
}

export function isTimelineTouchScrolling(container: any): boolean {
  return container?.dataset?.timelineTouchScrolling === 'true';
}

export function shouldDeferAndroidTimelineCommit(
  container: any,
  navigatorLike: any = currentNavigator(),
): boolean {
  return isAndroidTimelinePlatform(navigatorLike) && isTimelineTouchScrolling(container);
}

/**
 * Wait until TimelineView reports a settled touch scroll before committing a
 * fetched Android history page. Returning false means no deferral was needed.
 */
export function waitForAndroidTimelineScrollIdle(
  container: any,
  navigatorLike: any = currentNavigator(),
): Promise<boolean> {
  if (!shouldDeferAndroidTimelineCommit(container, navigatorLike)
    || typeof container?.addEventListener !== 'function') {
    return Promise.resolve(false);
  }

  if (container.dataset) container.dataset.timelinePageCommitPending = 'true';
  return new Promise((resolve) => {
    container.addEventListener(
      TIMELINE_TOUCH_SCROLL_IDLE_EVENT,
      () => {
        if (container.dataset) delete container.dataset.timelinePageCommitPending;
        resolve(true);
      },
      { once: true },
    );
  });
}
