export function upFirst(s: string = '') {
  return s.replace(/^[a-z]/, (g) => g.toUpperCase())
}

export function formatter(name = '') { 
  return name.replace(/-([a-zA-Z])/g, (g) => g[1].toUpperCase())
}
