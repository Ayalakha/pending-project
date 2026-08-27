import { Newspaper } from 'lucide-react'
import { getBlogSourceName } from '../../utils/blogSource'

const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-blue-600',
]

// Deterministic so the same post always lands on the same gradient, mirroring
// CompanyLogo's seeded-color approach for logo-less companies.
const getGradientClass = (seed) => {
  const str = String(seed ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return GRADIENTS[hash % GRADIENTS.length]
}

/**
 * Fallback banner for blog posts without an image (most posts imported from
 * RSS feeds that don't embed a photo). Shows the source outlet so a text-only
 * post reads as an intentional editorial style, not a broken/missing image.
 */
const BlogImagePlaceholder = ({ blog, className = '' }) => {
  const sourceName = getBlogSourceName(blog?.external_source_url)

  return (
    <div
      className={`bg-gradient-to-br ${getGradientClass(blog?.id ?? blog?.title)} flex flex-col items-center justify-center gap-3 ${className}`}
      role="img"
      aria-label={blog?.title ? `${blog.title} (no image available)` : 'No image available'}
    >
      <Newspaper className="h-10 w-10 text-white/80" strokeWidth={1.5} />
      {sourceName && (
        <span className="text-white/90 text-xs font-semibold tracking-wide uppercase px-3 py-1 bg-black/15 rounded-full">
          {sourceName}
        </span>
      )}
    </div>
  )
}

export default BlogImagePlaceholder
