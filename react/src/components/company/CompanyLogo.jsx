const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
]

// Generic/legal-form words are skipped so initials come from the distinctive
// part of the name (e.g. "Societe financiere suisse maghreb" -> "FS", not "SF").
const SKIP_WORDS = new Set([
  'de', 'du', 'des', 'la', 'le', 'les', 'et', 'l', 'd',
  'the', 'and', 'of', 'a', 'an', 'ste', 'societe', 'sa', 'sarl',
])

const getInitials = (name) => {
  if (!name) return '?'

  const words = name
    .replace(/\(.*?\)/g, ' ') // drop parenthetical abbreviations, e.g. "(AFMIN)"
    .split(/[\s'-]+/)
    .map((word) => word.replace(/[^\p{L}]/gu, ''))
    .filter((word) => word.length > 0 && !SKIP_WORDS.has(word.toLowerCase()))

  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// Simple deterministic string hash so the same company always lands on the
// same color, without needing to persist a color choice anywhere.
const getColorClass = (seed) => {
  const str = String(seed ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

/**
 * Renders a company's real logo when it has one, otherwise a deterministic
 * initials avatar (same company always gets the same letters and color).
 */
const CompanyLogo = ({
  company,
  sizeClassName = 'w-16 h-16',
  roundedClassName = 'rounded-lg',
  textClassName = 'text-lg',
  objectFitClassName = 'object-cover',
  extraClassName = '',
}) => {
  if (company?.logo) {
    return (
      <img
        src={company.logo}
        alt={`${company.name} logo`}
        className={`${sizeClassName} ${roundedClassName} ${objectFitClassName} ${extraClassName}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClassName} ${roundedClassName} ${extraClassName} ${getColorClass(company?.id ?? company?.name)} flex items-center justify-center flex-shrink-0`}
      role="img"
      aria-label={company?.name ? `${company.name} logo placeholder` : 'Company logo placeholder'}
    >
      <span className={`${textClassName} font-bold text-white select-none`}>
        {getInitials(company?.name)}
      </span>
    </div>
  )
}

export default CompanyLogo
