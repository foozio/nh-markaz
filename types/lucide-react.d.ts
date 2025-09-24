declare module 'lucide-react' {
  import * as React from 'react';

  type IconNode = ReadonlyArray<
    readonly [elementName: string, attrs: Record<string, string>]
  >;

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export function createLucideIcon(name: string, iconNode: IconNode): LucideIcon;

  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Bold: LucideIcon;
  export const Bookmark: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Circle: LucideIcon;
  export const FilePlus: LucideIcon;
  export const Heading1: LucideIcon;
  export const Heading2: LucideIcon;
  export const Heading3: LucideIcon;
  export const Italic: LucideIcon;
  export const List: LucideIcon;
  export const ListOrdered: LucideIcon;
  export const Loader2: LucideIcon;
  export const LogOut: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Pilcrow: LucideIcon;
  export const PlayCircle: LucideIcon;
  export const Quote: LucideIcon;
  export const Redo: LucideIcon;
  export const Save: LucideIcon;
  export const Share2: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Strikethrough: LucideIcon;
  export const Underline: LucideIcon;
  export const Undo: LucideIcon;
  export const User: LucideIcon;
  export const X: LucideIcon;
}
