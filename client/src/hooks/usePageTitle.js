import { useEffect } from 'react'

// Sets the browser tab title, e.g. "Dashboard · CodeCollab"
function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · CodeCollab` : 'CodeCollab'
  }, [title])
}

export default usePageTitle