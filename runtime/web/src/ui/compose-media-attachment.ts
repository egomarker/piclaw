export const COMPOSE_MEDIA_ATTACH_EVENT = 'piclaw:compose-media-attach';

export interface ComposeMediaAttachRequest {
    mediaId: number;
    filename?: string;
    contentType?: string;
    result?: Promise<boolean>;
}

/** Queue a timeline attachment in the active composer; never submit the draft. */
export function requestComposeMediaAttachment(mediaId: number, filename: string, contentType?: string) {
    const detail: ComposeMediaAttachRequest = { mediaId, filename, contentType };
    window.dispatchEvent(new CustomEvent(COMPOSE_MEDIA_ATTACH_EVENT, { detail }));
    // The composer claims the request synchronously and resolves it after loading the file.
    return detail.result ?? Promise.resolve(false);
}
