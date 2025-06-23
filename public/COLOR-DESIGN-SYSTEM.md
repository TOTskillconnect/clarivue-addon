# Clarivue Color Design System

## Overview
The Clarivue design system uses a carefully crafted color palette designed for accessibility, consistency, and visual hierarchy. The color system is built on Chakra UI's theming architecture and provides semantic color tokens for different use cases.

## Color Palette

### Primary Colors
**Blue Spectrum (#1076D1 base)**
```
primary.50:  #DFF6FF  // Lightest blue, backgrounds
primary.100: #C1EFFF  // Light blue, subtle accents
primary.200: #94E2FF  // Soft blue, hover states
primary.300: #67D4FF  // Medium light blue
primary.400: #39C7FF  // Medium blue
primary.500: #1076D1  // Main brand blue (Primary)
primary.600: #0C5DA6  // Darker blue, active states
primary.700: #08447A  // Dark blue, text on light
primary.800: #042B4F  // Very dark blue
primary.900: #001223  // Darkest blue, high contrast
```

### Secondary Colors
**Purple-Blue Spectrum (#5F9DF7 base)**
```
secondary.50:  #F5F8FF  // Lightest purple-blue
secondary.100: #EBF1FF  // Light purple-blue
secondary.200: #D6E4FF  // Soft purple-blue
secondary.300: #B3CCFF  // Medium light purple-blue
secondary.400: #80A9FF  // Medium purple-blue
secondary.500: #5F9DF7  // Main secondary color
secondary.600: #3264CC  // Darker purple-blue
secondary.700: #1E2A78  // Dark purple-blue
secondary.800: #101D66  // Very dark purple-blue
secondary.900: #050B33  // Darkest purple-blue
```

### Neutral Colors
**Gray Spectrum**
```
gray.50:  #F7FAFC  // Lightest gray, backgrounds
gray.100: #EDF2F7  // Light gray, borders
gray.200: #E2E8F0  // Soft gray, dividers
gray.300: #CBD5E0  // Medium light gray
gray.400: #A0AEC0  // Medium gray, placeholders
gray.500: #718096  // Main gray, secondary text
gray.600: #4A5568  // Dark gray, body text
gray.700: #2D3748  // Darker gray, headings
gray.800: #1A202C  // Very dark gray, main text
gray.900: #171923  // Darkest gray, high contrast
```

## Color Usage Guidelines

### Semantic Usage
Always use semantic color tokens rather than direct hex values:

✅ **Good Examples:**
```jsx
<Button variant="primary">Primary Action</Button>
<Text color="gray.600">Body text content</Text>
<Box bg="primary.50">Light background</Box>
<Heading color="primary.500">Section heading</Heading>
```

❌ **Avoid:**
```jsx
<Button bg="#1076D1">Button</Button>
<Text color="#4A5568">Text</Text>
```

### Color Hierarchy

#### Text Colors
- **Primary Text**: `gray.800` - Main content, headings
- **Secondary Text**: `gray.600` - Supporting text, descriptions  
- **Tertiary Text**: `gray.500` - Captions, metadata
- **Brand Text**: `primary.500` - Links, branded elements
- **White Text**: `white` - Text on dark/colored backgrounds

#### Background Colors
- **Primary Background**: `white` - Main page background
- **Secondary Background**: `gray.50` - Section backgrounds
- **Card Background**: `white` - Card/panel backgrounds
- **Accent Background**: `primary.50` - Highlighted sections

#### Interactive Elements
- **Primary Actions**: `primary.500` background, `white` text
- **Secondary Actions**: `transparent` background, `primary.500` border/text
- **Hover States**: Darker shade of base color
- **Active States**: Even darker shade
- **Disabled States**: `gray.300` background, `gray.500` text

## Gradients

### Predefined Gradients
```scss
// Main brand gradient (180° vertical)
gradientBg: linear(180deg, #1E2A78 0%, #5F9DF7 65%, #C1EFFF 100%)

// Hero gradient (135° diagonal)
heroGradient: linear(135deg, brand.primary 0%, brand.secondary 100%)

// CTA gradient (135° diagonal)
ctaGradient: linear(135deg, #10B981 0%, #3B82F6 100%)
```

### Usage
```jsx
<Box layerStyle="gradientBg">Background with main gradient</Box>
<Box layerStyle="heroGradient">Hero section background</Box>
<Box layerStyle="ctaGradient">Call-to-action background</Box>
```

## Button Variants

### Available Variants
1. **Primary**: `primary.500` background, white text
2. **Secondary**: Transparent background, `primary.500` border/text
3. **Gradient**: Green-to-blue gradient background
4. **Outline**: Border-only style with `primary.500`
5. **Ghost**: Text-only style with hover background
6. **Link**: Text-only with underline on hover

### Button Usage
```jsx
<Button variant="primary" size="lg">Primary Action</Button>
<Button variant="secondary" size="md">Secondary Action</Button>
<Button variant="gradient" size="lg">Special CTA</Button>
<Button variant="outline" size="sm">Outline Button</Button>
```

## Accessibility

### Contrast Ratios
All color combinations meet WCAG 2.1 AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio

### Color Blindness Considerations
- Primary and secondary colors are distinguishable for common color vision deficiencies
- Never rely on color alone to convey information
- Use additional visual cues (icons, text, patterns) alongside color

## Component-Specific Guidelines

### Cards
```jsx
<Box layerStyle="card">
  {/* Card content */}
</Box>
```
- Uses `white` background
- `16px` border radius
- Large shadow for elevation

### Typography
- **H1**: White text (for dark backgrounds), 48-72px
- **H2**: `primary.500` text, 40-48px, weight 700
- **Body**: `gray.600` text, 18-20px, standard weight

## Design Tokens Structure

### File Organization
```
src/theme/
├── index.ts              # Main theme configuration
├── foundations/
│   ├── colors.ts         # Color palette definitions
│   └── typography.ts     # Typography tokens
├── components/
│   └── button.ts         # Component-specific styles
└── tokens.ts             # Usage examples
```

### Extending Colors
To add new colors, extend the color object in `foundations/colors.ts`:

```typescript
export const colors = {
  // ... existing colors
  brand: {
    primary: '#1076D1',
    secondary: '#5F9DF7',
    light: '#C1EFFF',
    dark: '#08447A',
  }
} as const;
```

## Implementation Notes

### Current Issues to Address
1. **Brand Color References**: Button components reference `brand.primary` but this token isn't defined
2. **Gradient Inconsistency**: Some gradients use undefined brand tokens
3. **Missing Semantic Tokens**: Could benefit from semantic color names (e.g., `text.primary`, `surface.elevated`)

### Recommended Improvements
1. Add brand color tokens to match button component expectations
2. Create semantic color aliases for better developer experience
3. Add status colors (success, warning, error, info)
4. Implement dark mode color variants

## Best Practices

1. **Always use design tokens** instead of hardcoded hex values
2. **Test color combinations** for accessibility compliance
3. **Use semantic naming** when adding new colors
4. **Document new additions** to maintain consistency
5. **Consider responsive design** when applying colors across breakpoints

---

*Last updated: [Current Date]*
*Version: 1.0.0* 