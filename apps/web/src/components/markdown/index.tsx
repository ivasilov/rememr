import { cn } from '@rememr/ui'
import { ComponentPropsWithoutRef } from 'react'
import MarkdownComponent from 'react-markdown'

type MarkdownProps = ComponentPropsWithoutRef<typeof MarkdownComponent>

const components = {
  a: (props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
    <a target="_blank" rel="noopener noreferrer" {...props} className={cn('underline', props.className)} />
  ),
}

export const Markdown = (props: MarkdownProps) => {
  return <MarkdownComponent {...props} components={components} />
}
