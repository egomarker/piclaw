/** Prompt text posted by the turn-outcome strip's Continue buttons. */
export const CONTINUE_PROMPT = 'please continue';

/**
 * Build the user prompt for the outcome strip.
 *
 * Plain Continue sends "please continue"; Continue with note appends the note
 * after a period, exactly as if the user had typed it into the compose box.
 */
export function buildContinuePrompt(note?: unknown): string {
    const trimmed = typeof note === 'string' ? note.trim() : '';
    return trimmed ? `${CONTINUE_PROMPT}. ${trimmed}` : CONTINUE_PROMPT;
}
