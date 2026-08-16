// Canonical-host guard for nandor.ca (Cloudflare Pages Function).
//
//  - www.nandor.ca            -> 301 redirect to https://nandor.ca
//  - any other host           -> served normally but marked noindex
//    (*.pages.dev previews, raw deployment URLs, staging aliases)
//
// Only the apex nandor.ca is allowed into search indexes. app.nandor.ca is a
// separate Pages project and blocks itself via its own robots.txt + headers.

const CANONICAL = 'nandor.ca'

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const host = url.hostname.toLowerCase()

  if (host === 'www.' + CANONICAL) {
    url.hostname = CANONICAL
    url.protocol = 'https:'
    return Response.redirect(url.toString(), 301)
  }

  const response = await context.next()

  if (host !== CANONICAL) {
    const copy = new Response(response.body, response)
    copy.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return copy
  }

  return response
}
