export default function cnx(...cls) {
    return cls.filter(Boolean).join(' ');
}
