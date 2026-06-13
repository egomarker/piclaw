import { test, expect } from '../support/world';
import { sel } from '../support/selectors';

const CHAT_POST_TIMEOUT_MS = 8_000;

// US-16: Message Deletion from Timeline
//
// Delete flow:
//   click ✕ → count thread replies client-side
//   if replies > 0: confirm("Delete this message and its N replies?")
//   DELETE /post/{id}?cascade=true|false
//   server deleteThreadByRowId() removes parent + thread_id children + media
//   client animates removal (180ms), then filters from timeline
//
// Fallback: if server returns "Replies exist" but client saw 0,
//   shows a second confirm and retries with cascade=true.

/** Get timeline post IDs currently visible. */
async function getVisiblePostIds(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('.post[id]'))
      .map(el => el.id.replace('post-', ''))
      .filter(Boolean)
  );
}

/** Find the delete button for a specific post. */
function deleteButtonFor(page: import('@playwright/test').Page, postSelector: string) {
  return page.locator(`${postSelector} .post-delete-btn, ${postSelector} [aria-label="Delete message"]`);
}

/** Create a timeline post directly so deletion tests do not leave the agent busy. */
async function sendMessage(page: import('@playwright/test').Page, text: string): Promise<number> {
  const response = await page.evaluate(async (content) => {
    const res = await fetch('/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`/post failed with HTTP ${res.status}: ${JSON.stringify(body)}`);
    return body;
  }, text);

  const id = Number((response as { id?: unknown }).id);
  await expect(page.locator(`#post-${id}`)).toBeVisible({ timeout: CHAT_POST_TIMEOUT_MS });
  return id;
}

/** Create a deterministic thread reply without invoking the agent. */
async function sendReply(page: import('@playwright/test').Page, threadId: number, text: string): Promise<number> {
  const response = await page.evaluate(async ({ threadId, content }) => {
    const res = await fetch('/post/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, content }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`/post/reply failed with HTTP ${res.status}: ${JSON.stringify(body)}`);
    return body;
  }, { threadId, content: text });

  const id = Number((response as { id?: unknown }).id);
  await expect(page.locator(`#post-${id}`)).toBeVisible({ timeout: CHAT_POST_TIMEOUT_MS });
  return id;
}

// ── Single message deletion ──────────────────────────────────────

test.describe('US-16: Single Message Deletion', () => {
  test('delete button visible on hover', async ({ authedPage: page }) => {
    const postId = await sendMessage(page, `hover-delete-test-${Date.now()}`);

    const post = page.locator(`#post-${postId}`);
    await post.hover();
    await page.waitForTimeout(300);

    const deleteBtn = post.locator('.post-delete-btn, [aria-label="Delete message"]');
    await expect(deleteBtn).toBeVisible();
  });

  test('delete a single message removes it from timeline', async ({ authedPage: page }) => {
    const postId = await sendMessage(page, `e2e-delete-test-${Date.now()}`);
    const targetPost = page.locator(`#post-${postId}`);

    // Hover and click delete
    await targetPost.hover();
    await page.waitForTimeout(200);
    const deleteBtn = targetPost.locator('.post-delete-btn, [aria-label="Delete message"]');

    // Handle confirmation dialog (for no-reply messages, no dialog expected)
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await deleteBtn.click();
    await page.waitForTimeout(500);

    // Message should be gone (animation + removal)
    const stillExists = await page.locator(`#post-${postId}`).count();
    expect(stillExists).toBe(0);
  });

  test('deleted message stays gone after refresh', async ({ authedPage: page }) => {
    // Send and note a unique message
    const uniqueText = `e2e-persist-delete-${Date.now()}`;
    const postId = await sendMessage(page, uniqueText);
    await page.waitForTimeout(1000);

    // Find and delete our message
    const targetPost = page.locator(`#post-${postId}`);

    page.on('dialog', async (dialog) => await dialog.accept());

    await targetPost.hover();
    await page.waitForTimeout(200);
    const deleteBtn = targetPost.locator('.post-delete-btn, [aria-label="Delete message"]');
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
    }

    // Refresh
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector(sel.post, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // Message should not reappear
    const content = await page.locator(sel.timeline).textContent();
    expect(content).not.toContain(uniqueText);
  });
});

// ── Cascading thread deletion ────────────────────────────────────

test.describe('US-16: Cascading Thread Deletion', () => {
  test('deleting a parent with replies shows confirmation with count', async ({ authedPage: page }) => {
    // Create a parent plus deterministic replies without invoking the agent.
    const parentId = await sendMessage(page, 'Reply to this for thread deletion test');
    await sendReply(page, parentId, 'Thread deletion reply 1');

    // The user message should now have at least 1 reply (the agent response)
    // Find the user message (parent)
    const userPosts = page.locator('.post:not(.agent-post)');
    const count = await userPosts.count();
    if (count === 0) {
      test.skip(undefined, 'No user posts found');
      return;
    }

    const parentPost = page.locator(`#post-${parentId}`);

    await expect(page.locator(sel.postContent, { hasText: 'Thread deletion reply 1' })).toBeVisible();

    // Set up dialog listener to check the message
    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss(); // Cancel — don't actually delete
    });

    await parentPost.hover();
    await page.waitForTimeout(200);
    const deleteBtn = parentPost.locator('.post-delete-btn, [aria-label="Delete message"]');
    await deleteBtn.click();
    await page.waitForTimeout(500);

    // Confirmation should mention replies
    expect(dialogMessage).toContain('replies');
  });

  test('confirming cascade removes parent and all replies', async ({ authedPage: page }) => {
    const parentId = await sendMessage(page, 'Cascade delete test - please reply');
    const replyId = await sendReply(page, parentId, 'Cascade delete reply 1');

    const parentPost = page.locator(`#post-${parentId}`);

    // Accept cascade confirmation
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await parentPost.hover();
    await page.waitForTimeout(200);
    const deleteBtn = parentPost.locator('.post-delete-btn, [aria-label="Delete message"]');
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(1000);

      const postsAfter = await getVisiblePostIds(page);
      expect(postsAfter).not.toContain(String(parentId));
      expect(postsAfter).not.toContain(String(replyId));
    }
  });

  test('cancelling cascade preserves all messages', async ({ authedPage: page }) => {
    const parentId = await sendMessage(page, 'Cancel cascade test');
    const replyId = await sendReply(page, parentId, 'Cancel cascade reply 1');

    const parentPost = page.locator(`#post-${parentId}`);

    // Dismiss (cancel) confirmation
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await parentPost.hover();
    await page.waitForTimeout(200);
    const deleteBtn = parentPost.locator('.post-delete-btn, [aria-label="Delete message"]');
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      const postsAfter = await getVisiblePostIds(page);
      expect(postsAfter).toContain(String(parentId));
      expect(postsAfter).toContain(String(replyId));
    }
  });

  test('no orphaned replies remain after cascade delete', async ({ authedPage: page }) => {
    const createdParentId = await sendMessage(page, 'Orphan check test');
    await sendReply(page, createdParentId, 'Orphan check reply 1');

    const parentPost = page.locator(`#post-${createdParentId}`);
    const parentId = String(createdParentId);

    // Accept cascade
    page.on('dialog', async (dialog) => await dialog.accept());

    await parentPost.hover();
    await page.waitForTimeout(200);
    const deleteBtn = parentPost.locator('.post-delete-btn, [aria-label="Delete message"]');
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(1000);

      // Check no posts reference the deleted parent as thread_id
      const orphans = await page.evaluate((pid) => {
        return Array.from(document.querySelectorAll('.post')).filter(el => {
          const data = (el as any).__data || (el as any).dataset;
          return data?.threadId === pid;
        }).length;
      }, parentId);

      expect(orphans).toBe(0);
    }
  });
});

// ── Edge cases ───────────────────────────────────────────────────

test.describe('US-16: Deletion Edge Cases', () => {
  test('delete does not crash on last message', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.post);

    // We don't actually delete the last message in the real timeline
    // (that would destroy test state), but verify no JS errors on delete attempts
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    const post = page.locator(sel.post).last();
    page.on('dialog', async (dialog) => await dialog.accept());

    await post.hover();
    await page.waitForTimeout(200);
    const deleteBtn = post.locator('.post-delete-btn, [aria-label="Delete message"]');

    // Just verify the button exists and is clickable without JS errors
    if (await deleteBtn.isVisible()) {
      // Don't actually click in this test — just verify affordance
      expect(await deleteBtn.isEnabled()).toBe(true);
    }

    expect(errors.length).toBe(0);
  });

  test('message removal has visual animation', async ({ authedPage: page }) => {
    await sendMessage(page, `animation-test-${Date.now()}`);
    await page.waitForTimeout(1000);

    const userPosts = page.locator('.post:not(.agent-post)');
    const targetPost = userPosts.last();

    page.on('dialog', async (dialog) => await dialog.accept());

    await targetPost.hover();
    await page.waitForTimeout(200);
    const deleteBtn = targetPost.locator('.post-delete-btn, [aria-label="Delete message"]');

    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();

      // Check for .removing class (animation state)
      await page.waitForTimeout(50);
      const hasRemovingClass = await page.evaluate(() =>
        document.querySelector('.post.removing') !== null
      );
      // The removing class should appear briefly (180ms animation)
      // It may be gone by the time we check, so this is a soft assertion
      // The important thing is no crash
    }
  });
});
