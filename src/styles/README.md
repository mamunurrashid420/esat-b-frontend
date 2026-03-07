# Global Styles Documentation

This directory contains global styles extracted from the homepage design. The styles are organized using CSS custom properties (variables) for easy maintenance and theming.

## File Structure

- `globals.css` - Main global stylesheet with design tokens and utility classes

## Design Tokens

### Colors

#### Primary Colors (ESAT-B logo inspired)
- `--color-primary`: #1E5AA7 (Blue from logo)
- `--color-primary-dark`: #164A8A
- `--color-primary-darker`: #0D3A6E
- `--color-primary-darkest`: #0C2340
- `--color-primary-accent`: #2563EB
- `--color-primary-light`: #3B82F6
- `--color-primary-lighter`: #93C5FD
- `--color-gold` / `--color-gold-dark`: #D4A017 / #B8860B (Mustard from logo)

#### Secondary Colors
- `--color-secondary`: #1E5AA7
- `--color-secondary-light`: #3B82F6
- `--color-secondary-lighter`: #BFDBFE

#### Neutral Colors
- `--color-white`: #FFFFFF
- `--color-black`: #000000
- `--color-black-light`: #121212
- `--color-black-lighter`: #0A0A0A

#### Gray Scale
- `--color-gray-50` through `--color-gray-1600`: Various shades from light to dark

#### Dark Backgrounds
- `--color-dark`: #0C2340 (Navy)
- `--color-dark-light`: #0F172A
- `--color-dark-lighter`: #1E293B
- `--color-dark-lightest`: #334155

#### Accent Colors
- `--color-success`: #2ACA55 (Green)
- `--color-warning`: #F86F03 (Orange)
- Warning variants: light, lighter, dark, darker

### Typography

#### Font Families
- `--font-primary`: 'Roboto' (Main body font)
- `--font-secondary`: 'Nunito' (Navigation)
- `--font-tertiary`: 'Open Sans' (Content)
- `--font-heading`: 'Heebo' (Headings)
- `--font-accent`: 'Manrope' (Accent text)
- `--font-ui`: 'Urbanist' (UI elements)
- `--font-content`: 'Barlow' (Content blocks)
- `--font-display`: 'Inter' (Display text)

#### Font Sizes
- `--font-size-xs`: 12px
- `--font-size-sm`: 14px
- `--font-size-base`: 16px
- `--font-size-lg`: 18px
- `--font-size-xl`: 20px
- `--font-size-2xl`: 24px
- `--font-size-3xl`: 28px
- `--font-size-4xl`: 30px
- `--font-size-5xl`: 32px
- `--font-size-6xl`: 40px
- `--font-size-7xl`: 44px
- `--font-size-8xl`: 48px
- `--font-size-9xl`: 100px

#### Line Heights
- `--line-height-tight`: 16px
- `--line-height-normal`: 20px
- `--line-height-relaxed`: 24px
- `--line-height-loose`: 26px
- `--line-height-xl`: 28px
- `--line-height-2xl`: 30px
- `--line-height-3xl`: 32px
- `--line-height-4xl`: 36px
- `--line-height-5xl`: 40px
- `--line-height-6xl`: 52px
- `--line-height-7xl`: 56px
- `--line-height-8xl`: 72px
- `--line-height-9xl`: 120px

#### Font Weights
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700
- `--font-weight-extrabold`: 800

### Spacing

Spacing scale from `--spacing-xs` (4px) to `--spacing-12xl` (80px)

### Border Radius

- `--radius-xs`: 3px
- `--radius-sm`: 4px
- `--radius-md`: 5px
- `--radius-lg`: 6px
- `--radius-xl`: 10px
- `--radius-2xl`: 16px
- `--radius-3xl`: 20px
- `--radius-4xl`: 40px
- `--radius-full`: 200px

### Shadows

Multiple shadow variants from `--shadow-sm` to `--shadow-5xl` for different elevation levels.

## Utility Classes

### Buttons
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outline button style
- `.btn-success` - Success button style
- `.btn-disabled` - Disabled button style

### Typography
- `.heading-1` through `.heading-6` - Heading styles
- `.text-body` - Body text style
- `.text-body-large` - Large body text
- `.text-caption` - Caption text

### Layout
- `.container` - Main container with max-width and padding
- `.container-md` - Medium container
- `.section` - Section spacing
- `.section-sm` - Small section spacing

### Flexbox Utilities
- `.flex`, `.flex-row`, `.flex-col`
- `.items-center`, `.items-start`
- `.justify-between`, `.justify-center`
- `.gap-sm` through `.gap-3xl`

### Colors
- Background: `.bg-primary`, `.bg-secondary`, `.bg-dark`, `.bg-gray`, `.bg-white`
- Text: `.text-primary`, `.text-white`, `.text-black`, `.text-gray`

## Usage Examples

### Using CSS Variables

```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
}
```

### Using Utility Classes

```html
<div class="container">
  <h1 class="heading-1">Welcome</h1>
  <p class="text-body">Content here</p>
  <button class="btn-primary">Click Me</button>
</div>
```

### In React/TypeScript

```tsx
<div className="container">
  <h1 className="heading-1">Welcome</h1>
  <p className="text-body">Content here</p>
  <button className="btn-primary">Click Me</button>
</div>
```

## Responsive Design

The global styles include responsive breakpoints:
- Desktop: 1920px and above
- Tablet: 1280px and below
- Mobile: 768px and below

Container padding and font sizes adjust automatically at these breakpoints.

## Integration

The global styles are imported in `src/index.css` and will be available throughout the application. They work alongside Tailwind CSS, so you can use both utility classes and custom CSS variables.
