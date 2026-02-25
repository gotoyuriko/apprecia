/**
 * Date / timestamp utilities.
 *
 * AddArtwork.js and AddComment.js both previously contained identical
 * inline snippets to generate an ISO timestamp.  Centralising this here
 * ensures a single definition and makes it trivial to swap the format
 * if needed in the future.
 */

/**
 * Returns the current date/time as an ISO 8601 string.
 *
 * @returns e.g. "2024-03-15T12:34:56.789Z"
 */
export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}
