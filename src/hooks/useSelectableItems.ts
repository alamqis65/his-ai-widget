import { useState, useCallback, useMemo } from 'preact/hooks'

/**
 * useSelectableItems
 *
 * Generic checkbox-selection state for any list of items. Used by every
 * batch-savable SOAP panel (vital signs, ICD-10 diagnoses/procedures, and
 * any future field like prescriptions or doctor instructions).
 *
 * Usage in a new panel:
 *   const { isSelected, toggle, selectedItems, allSelected, selectAll, clearAll } =
 *     useSelectableItems(items, item => item.someUniqueId)
 *
 * Then report `selectedItems` up to the parent (e.g. via useEffect) so the
 * top-level "Simpan ke HIS" button can collect it into the combined payload.
 */
export function useSelectableItems<T>(items: T[], getId: (item: T) => string | number) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())

  const toggle = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const isSelected = useCallback((id: string | number) => selectedIds.has(id), [selectedIds])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(getId)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const clearAll = useCallback(() => setSelectedIds(new Set()), [])

  const allSelected = items.length > 0 && items.every(item => selectedIds.has(getId(item)))

  const selectedItems = useMemo(
    () => items.filter(item => selectedIds.has(getId(item))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, selectedIds],
  )

  return { selectedIds, toggle, isSelected, selectAll, clearAll, allSelected, selectedItems }
}
