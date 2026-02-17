// Shared CMS types

// Lexical editor state structure
export type LexicalEditorState = {
  root?: {
    children?: unknown[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

// Year/Season type
export type Year = {
  id: number;
  year: string;
};
