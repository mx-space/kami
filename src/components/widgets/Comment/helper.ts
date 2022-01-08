export function getCommentWrap<T extends { id: string }>(comment: T) {
  const $wrap = document.getElementById('comments-wrap')
  if (!$wrap) {
    return
  }
  const $parent = $wrap.querySelector<HTMLDivElement>(
    '[data-comment-id="'.concat(comment.id, '"] #write'),
  )
  return $parent
}
