/**
 * Shared search and filter utilities for artworks.
 *
 * Both SearchBar.js (component) and ArtworkContext.js (context) previously
 * contained duplicate implementations of these algorithms. Centralising them
 * here ensures consistent behaviour and a single place to maintain the logic.
 */

/**
 * Filters artworks by a free-text keyword across multiple fields:
 *   - Any artwork field value (stringified)
 *   - Creator name (via user lookup)
 *   - Skill labels/values
 *   - Tag labels/values
 *
 * @param {Array}  artworksData - Full list of artwork objects
 * @param {Array}  usersData    - Full list of user objects
 * @param {string} keyword      - Raw search string from the user
 * @returns {Array} Filtered artwork list
 */
export function filterArtworksByKeyword(artworksData, usersData, keyword) {
    if (!keyword || keyword.trim() === "") {
        return artworksData;
    }

    const keywords = keyword.toString().toLowerCase();

    // Find creator emails whose display name matches the keyword
    const matchingCreatorEmails = usersData
        .filter((user) => user.user_name?.toLowerCase().includes(keywords))
        .map((user) => user.user_email);

    return artworksData.filter((artwork) => {
        return (
            // Match any top-level artwork field
            Object.values(artwork).some(
                (value) =>
                    value !== undefined &&
                    value !== null &&
                    value.toString().toLowerCase().includes(keywords)
            ) ||
            // Match creator by name
            matchingCreatorEmails.includes(artwork.project_creator) ||
            // Match skill values
            artwork.project_skills
                ?.map((skill) => skill.value.toLowerCase())
                ?.some((skill) => skill.includes(keywords)) ||
            // Match tag values
            artwork.project_tags
                ?.map((tag) => tag.value.toLowerCase())
                ?.some((tag) => tag.includes(keywords))
        );
    });
}

/**
 * Filters artworks by a category/skill/tag value.
 *
 * @param {Array}  artworksData - Full list of artwork objects
 * @param {string} category     - Category value to filter by, or "all" / falsy to reset
 * @returns {Array} Filtered artwork list
 */
export function filterArtworksByCategory(artworksData, category) {
    if (!category || category === "all") {
        return artworksData;
    }

    return artworksData.filter(
        (artwork) =>
            artwork.project_category === category ||
            artwork.project_skills?.some((skill) => skill.value === category) ||
            artwork.project_tags?.some((tag) => tag.value === category)
    );
}

/**
 * Filters artworks to only those created by a specific creator email.
 *
 * @param {Array}  artworksData  - Full list of artwork objects
 * @param {string} creatorEmail  - Creator email to filter by, or falsy to reset
 * @returns {Array} Filtered artwork list
 */
export function filterArtworksByCreator(artworksData, creatorEmail) {
    if (!creatorEmail) {
        return artworksData;
    }

    return artworksData.filter(
        (artwork) => artwork.project_creator === creatorEmail
    );
}
