import { cn } from '@rememr/ui'
import type { ComponentPropsWithoutRef } from 'react'
import MarkdownComponent from 'react-markdown'

type MarkdownProps = ComponentPropsWithoutRef<typeof MarkdownComponent>

const components = {
  a: (
    props: React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >
  ) => (
    <a
      rel="noopener noreferrer"
      target="_blank"
      {...props}
      className={cn('underline', props.className)}
    />
  ),
}

export const Markdown = (props: MarkdownProps) => {
  return <MarkdownComponent {...props} components={components} />
}
