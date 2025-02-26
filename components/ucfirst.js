export default function ucfirst(str) {
    if (!str) return str; // If the string is empty or undefined, return it as is
    return str.charAt(0).toUpperCase() + str.slice(1);
}
