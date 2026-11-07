import { useEffect, useState } from 'react'

// Returns true while the CSS media query matches, e.g. useMediaQuery('(max-width: 767px)')
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange) // cleanup on unmount
  }, [query])

  return matches
}