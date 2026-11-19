//This is for saved lists athat are kept per user so two accounts on the same browser dont overlap

function storageKey(userId) {
    return `skillswap_saved_${userId}`;

}

export function getSavedIds(userId) {
try {
    return JSON.parse(localStorage.getItem(storageKey(useId)) || "[]" );
} catch {
    return [];
}
}

export function storeSavedIds(userId, ids) {
    localStorage.setItem(storageKey(userId), JSON.stringify(ids));
}