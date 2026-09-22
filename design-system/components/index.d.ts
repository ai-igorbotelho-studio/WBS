/** Waiheke Backyards Solutions components. Plain DOM factories, no framework. Load tokens.css and components/bundle.css first. */
export interface ButtonProps { label?: string; variant?: 'primary' | 'brand' | 'ghost'; href?: string; type?: 'button' | 'submit'; onClick?: (e: MouseEvent) => void }
export interface CardProps { eyebrow?: string; title?: string; body?: string; items?: string[]; raised?: boolean }
export interface FieldProps { id?: string; name?: string; label?: string; type?: string; placeholder?: string; value?: string; hint?: string; error?: string; required?: boolean; multiline?: boolean; rows?: number }
export interface EyebrowProps { text?: string; muted?: boolean }
export interface StatProps { value?: string; label?: string }
export interface NavLink { label: string; href: string; current?: boolean }
export interface NavProps { links?: NavLink[]; cta?: { label?: string; href?: string }; whatsapp?: { label?: string; href?: string }; label?: string; background?: Element[] }
export interface NavHandle { trigger: HTMLButtonElement; drawer: HTMLDivElement; scrim: HTMLDivElement; setCurrent(href: string): void; open(): void; close(): void }
export interface ChipProps { label?: string; active?: boolean; onToggle?: (active: boolean) => void }
export interface RidgelineDividerProps { lit?: boolean[] }
export interface QuoteProps { text?: string; attribution?: string }
export declare const WBS: {
  Button(props?: ButtonProps): HTMLButtonElement | HTMLAnchorElement;
  Card(props?: CardProps): HTMLElement;
  Field(props?: FieldProps): HTMLDivElement;
  Eyebrow(props?: EyebrowProps): HTMLSpanElement;
  Stat(props?: StatProps): HTMLDivElement;
  Nav(props?: NavProps): NavHandle;
  Chip(props?: ChipProps): HTMLButtonElement;
  RidgelineDivider(props?: RidgelineDividerProps): HTMLDivElement;
  Quote(props?: QuoteProps): HTMLQuoteElement | null;
};
