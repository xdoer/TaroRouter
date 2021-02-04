export const formatter = (name = '') => name.replace(/-([a-zA-Z])/g, (g) => g[1].toUpperCase())
