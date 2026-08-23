export type SearchHighlight = {
  keywords: string[]
  snippet: string | null
}

export type SearchResultItem =
  | {
      type: 'post'
      title: string
      id: string
      slug: string
      category?: {
        name: string
        slug: string
      } | null
      highlight?: SearchHighlight
      isFallback?: boolean
    }
  | {
      type: 'note'
      title: string
      id: string
      nid: number
      highlight?: SearchHighlight
      isFallback?: boolean
    }
  | {
      type: 'page'
      title: string
      id: string
      slug: string
      highlight?: SearchHighlight
      isFallback?: boolean
    }

export type SearchResultResponse = {
  data: SearchResultItem[]
}

export type SearchListItem = {
  title: string
  subtitle?: string
  url: string
  id: string
  highlight?: SearchHighlight
  isFallback: boolean
}

export type SearchResultLabels = {
  note: string
  page: string
}

export function toSearchListItems(
  items: readonly SearchResultItem[] | undefined,
  labels: SearchResultLabels,
): SearchListItem[] {
  if (!items) {
    return []
  }

  return items.reduce<SearchListItem[]>((list, item) => {
    switch (item.type) {
      case 'post': {
        if (!item.category) {
          return list
        }

        list.push({
          title: item.title,
          subtitle: item.category.name,
          id: item.id,
          url: `/posts/${item.category.slug}/${item.slug}`,
          highlight: item.highlight,
          isFallback: item.isFallback === true,
        })
        return list
      }
      case 'note': {
        list.push({
          title: item.title,
          subtitle: labels.note,
          id: item.id,
          url: `/notes/${item.nid}`,
          highlight: item.highlight,
          isFallback: item.isFallback === true,
        })
        return list
      }
      case 'page': {
        list.push({
          title: item.title,
          subtitle: labels.page,
          id: item.id,
          url: `/${item.slug}`,
          highlight: item.highlight,
          isFallback: item.isFallback === true,
        })
        return list
      }
    }
  }, [])
}

export type HighlightSegment = {
  highlighted: boolean
  key: string
  text: string
}

export function getHighlightSegments(
  text: string,
  keywords?: readonly string[],
): HighlightSegment[] {
  const normalizedKeywords = [
    ...new Set(
      keywords
        ?.map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0) ?? [],
    ),
  ]
    .sort((a, b) => b.length - a.length)
    .slice(0, 8)

  if (!text || normalizedKeywords.length === 0) {
    return [{ key: 'plain-0', text, highlighted: false }]
  }

  const pattern = new RegExp(
    normalizedKeywords.map(escapeRegExp).join('|'),
    'gi',
  )
  const segments: HighlightSegment[] = []
  let cursor = 0

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    const matchedText = match[0]

    if (index > cursor) {
      segments.push({
        key: `plain-${cursor}`,
        text: text.slice(cursor, index),
        highlighted: false,
      })
    }

    segments.push({
      key: `highlight-${index}`,
      text: matchedText,
      highlighted: true,
    })
    cursor = index + matchedText.length
  }

  if (cursor < text.length) {
    segments.push({
      key: `plain-${cursor}`,
      text: text.slice(cursor),
      highlighted: false,
    })
  }

  return segments.length > 0
    ? segments
    : [{ key: 'plain-0', text, highlighted: false }]
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
