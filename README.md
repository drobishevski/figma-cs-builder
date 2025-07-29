# ComponentSet Builder — Figma Plugin

**Automatically aligns ComponentSet variants into rows and columns, adds rulers, and applies consistent spacing and styling.**

This plugin is designed to clean up and standardize layouts in Figma component sets. It analyzes the visual arrangement of variants, aligns them by rows and columns, and adds guides based on the outer bounds of each group.

## ✨ Features

- Aligns variants:
  - Rows: aligned to the top edge of the first item (if vertical offset is within 20px)
  - Columns: aligned to the left edge of the first item (if horizontal offset is within 20px)
- Adds horizontal and vertical rulers around variant groups
- Applies 80px padding between content and the ComponentSet frame
- Resizes the ComponentSet to fit the aligned content
- Sets `cornerRadius` to 32px
- Removes any stroke applied to the ComponentSet

## 🚀 How to Use

1. Select a `ComponentSet` in your Figma file
2. Run the plugin
3. The plugin will align and format the layout automatically

## 🔒 Requirements

- Works with Figma `ComponentSet` nodes only

## 🛠 Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Build Commands

- **Build once:**
  ```bash
  npm run build
  ```

- **Watch mode (for development):**
  ```bash
  npm run dev
  # or
  npm run watch
  ```

- **Lint code:**
  ```bash
  npm run lint
  npm run lint:fix
  ```

### Project Structure

```
figma-cs-builder/
├── manifest.json      # Plugin configuration
├── code.js           # Compiled JavaScript (generated)
├── code.ts           # TypeScript source code
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

### TypeScript Configuration

The project uses TypeScript with strict type checking and Figma plugin typings. The build process automatically compiles `code.ts` to `code.js` which is used by the Figma plugin.

## 🔍 API Compliance

This plugin has been verified against the official Figma Plugin API documentation:

- ✅ **ComponentSetNode API**: Uses correct properties and methods
- ✅ **Guides API**: Properly creates and assigns guides arrays
- ✅ **Resize API**: Uses `resize()` method correctly
- ✅ **Styling API**: Applies `cornerRadius` and `strokes` properties
- ✅ **Selection API**: Properly handles `figma.currentPage.selection`

### Key API Features Used:

- `ComponentSetNode.children` - Access to variant components
- `ComponentSetNode.resize()` - Resize the component set
- `ComponentSetNode.cornerRadius` - Apply corner radius
- `ComponentSetNode.strokes` - Remove stroke styling
- `ComponentSetNode.guides` - Add layout guides
- `figma.currentPage.selection` - Get selected nodes
- `figma.notify()` - Show user feedback
- `figma.closePlugin()` - Proper plugin termination

## 📝 License

See [LICENSE](LICENSE) file for details.

