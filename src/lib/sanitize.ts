import sanitize, { IOptions } from 'sanitize-html';

const options: IOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'span', 'code'],
  allowedAttributes: {
    span: ['class', 'lang', 'dir'],
    p: ['class', 'lang', 'dir'],
    blockquote: ['class'],
  },
  disallowedTagsMode: 'discard',
};

export function sanitizeHtml(input: string) {
  return sanitize(input, options);
}
