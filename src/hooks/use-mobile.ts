import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    const mql = window.matchMedia(query)

    const onChange = () => {
      setIsMobile(mql.matches || window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial evaluation
    onChange()

    // Add listeners with legacy fallback
    const hasAddEventListener = typeof mql.addEventListener === 'function'
    const hasAddListener = typeof mql.addListener === 'function'

    if (hasAddEventListener) {
      mql.addEventListener('change', onChange)
    } else if (hasAddListener) {
      mql.addListener(onChange)
    }

    // Also listen to window resize as a safety net for older browsers
    window.addEventListener('resize', onChange)

    return () => {
      if (hasAddEventListener) {
        mql.removeEventListener('change', onChange)
      } else if (hasAddListener) {
        mql.removeListener(onChange)
      }
      window.removeEventListener('resize', onChange)
    }
  }, [])

  return !!isMobile
}
