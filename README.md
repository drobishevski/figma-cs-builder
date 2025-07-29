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

