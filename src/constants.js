export function URIToExtension(uri) {
    if (uri.startsWith('data:image/png;') || uri.endsWith('.png')) {
        return 'png';
    } else if (uri.startsWith('data:image/jpg;') || uri.endsWith('.jpg')) {
        return 'jpg';
    } else {
        return uri.split('.').pop();
    }
}

// Enforces a display order on the images.
export const imageKeyOrder = ['at-rest', 'eyebrows-up', 'eyes-closed', 'nose-wrinkle', 'big-smile', 'lips-puckered', 'lower-teeth-bared'];
