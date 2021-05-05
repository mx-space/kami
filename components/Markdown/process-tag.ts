import { Accordion } from './helper'

export function processDetails($: HTMLElement) {
  const details = Array.from($.querySelectorAll('details'))

  for (const $details of details) {
    const firstEl = $details.children[0] as HTMLElement

    if (!firstEl || firstEl.nodeName != 'summary'.toUpperCase()) {
      continue
    }
    const parent = $details

    const $content = document.createElement('div')
    $content.setAttribute('class', 'content')

    for (let i = 1, cnt = $details.childElementCount; i < cnt; i++) {
      $content.appendChild($details.children[i].cloneNode(true))
    }

    const $newDetails = document.createElement('details')
    $newDetails.append(firstEl, $content)
    new Accordion($newDetails)
    parent.replaceWith($newDetails)
  }
}
