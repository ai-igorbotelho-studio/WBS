/** Waiheke Backyards Solutions components. Plain DOM factories, no framework. Load tokens.css and components/bundle.css first. */
export interface ButtonProps { label?: string; variant?: 'primary' | 'brand' | 'ghost'; href?: string; type?: 'button' | 'submit'; onClick?: (e: MouseEvent) => void }
export interface CardProps { eyebrow?: string; title?: string; body?: string; items?: string[]; raised?: boolean }
export interface FieldProps { id?: string; name?: string; label?: string; type?: string; placeholder?: string; value?: string; hint?: string; error?: string; required?: boolean; multiline?: boolean; rows?: number }
export interface EyebrowProps { text?: string; muted?: boolean }
export interface StatProps { value?: string; label?: string }
export declare const WBS: {
  Button(props?: ButtonProps): HTMLButtonElement | HTMLAnchorElement;
  Card(props?: CardProps): HTMLElement;
  Field(props?: FieldProps): HTMLDivElement;
  Eyebrow(props?: EyebrowProps): HTMLSpanElement;
  Stat(props?: StatProps): HTMLDivElement;
};
