'use client'; // Important: This must be a Client Component

import { RichText } from '@payloadcms/richtext-lexical/react';
import type { LexicalEditorState } from '@/types/cms';

type Props = {
  content: LexicalEditorState | null | undefined;
  className?: string;
};

export default function RichTextComponent({ content, className }: Props) {
  if (!content?.root?.children?.length) {
    return null;
  }

  return (
    <div className={`prose max-w-none ${className || ''}`}>
      <RichText data={content} />
    </div>
  );
}