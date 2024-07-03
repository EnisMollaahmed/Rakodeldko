export function generateHexId() {
    const array = new Uint8Array(12);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}