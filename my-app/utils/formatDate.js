export function formatDate(date, options = {}) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", ...options }).format(new Date(date)); }
