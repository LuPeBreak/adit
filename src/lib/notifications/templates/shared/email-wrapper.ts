import { EMAIL_HEADER, EMAIL_FOOTER, EMAIL_HTML_BASE } from './constants'

export interface EmailWrapperOptions {
  title: string
  content: string
}

export function createEmailWrapper({
  title,
  content,
}: EmailWrapperOptions): string {
  return EMAIL_HTML_BASE.replace('{{HEADER}}', EMAIL_HEADER)
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', content)
    .replace('{{FOOTER}}', EMAIL_FOOTER)
}
