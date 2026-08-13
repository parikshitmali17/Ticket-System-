import { useEffect, useRef, useState } from 'react'

/** Filter + sort dropdown open state with outside-click / Escape dismiss. */
export function useFilterSortMenus() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const filterRef = useRef(null)
  const sortRef = useRef(null)

  useEffect(() => {
    if (!filterOpen && !sortOpen) return undefined

    const onPointerDown = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setFilterOpen(false)
        setSortOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [filterOpen, sortOpen])

  return {
    filterOpen,
    setFilterOpen,
    sortOpen,
    setSortOpen,
    filterRef,
    sortRef,
  }
}
