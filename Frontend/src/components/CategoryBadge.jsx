import { categoryBadgeClass } from '../constants/categories'

export default function CategoryBadge({ category, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryBadgeClass(category)} ${className}`}
    >
      {children ?? category}
    </span>
  )
}
