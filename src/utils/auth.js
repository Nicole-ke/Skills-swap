const STORAGE_KEY = "skillswap_current_user";

export function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
    }
export function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

}

export function logout () {
    localStorage.removeItem(STORAGE_KEY);
    
}