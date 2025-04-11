# Inline SVG Web Component

A lightweight, customizable web component for dynamically inlining SVG files into your web applications. This component allows you to embed SVGs with customizable attributes and replaceable patterns, making it perfect for dynamic icons and illustrations.

## Features

- 🎨 Dynamically load SVG files
- ✨ Customize SVG attributes (fill, width, height, etc.)
- 🔄 Pattern replacement support
- 🎯 Shadow DOM encapsulation
- 📦 No dependencies
- 🚀 TypeScript support

## Installation

```bash
npm install inline-svg
```

## Usage

### Basic Usage

```html
<inline-svg 
  src="/path/to/your.svg"
  width="200"
  height="150"
  fill="#f44336"
></inline-svg>
```

### Pattern Replacement

You can replace specific patterns in your SVG with custom values:

```html
<inline-svg src="/path/to/your.svg">
  <inline-svg-replace pattern="COLOR_PLACEHOLDER" value="blue"></inline-svg-replace>
</inline-svg>
```

## API

### Attributes

- `src` (required): Path to the SVG file
- Any standard SVG attribute (optional): Will be transferred to the loaded SVG
  - `width`
  - `height`
  - `fill`
  - `stroke`
  - etc.

### Child Elements

#### `<inline-svg-replace>`

Use this element to define pattern replacements within the SVG:

- `pattern`: The pattern to search for in the SVG
- `value`: The value to replace the pattern with

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Building

```bash
npm run build
```

The built files will be available in the `dist` directory.

## License

Apache-2.0 - see [LICENSE](LICENSE) for details.

## Author

Guy Walker