// "Abdul Moiz" -> "AM". Labels like "+2" are shown as they are.
export const initials = (name) =>
  name.startsWith('+')
    ? name
    : name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()