"use strict";
/// <reference types="@figma/plugin-typings" />
// ============================================================================
// CONSTANTS
// ============================================================================
const DEFAULT_CONFIG = {
    padding: 80,
    cornerRadius: 32,
    alignmentThreshold: 20,
};
const MESSAGES = {
    NO_SELECTION: "Please select a ComponentSet.",
    SUCCESS: "Done ✔️",
};
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Groups variants by their position along a specified axis
 */
function groupByAxis(variants, axis = 'x', threshold = DEFAULT_CONFIG.alignmentThreshold) {
    const groups = [];
    for (const variant of variants) {
        const key = axis === 'x' ? variant.y : variant.x;
        const existingGroup = groups.find(g => Math.abs(g.key - key) <= threshold);
        if (existingGroup) {
            existingGroup.variants.push(variant);
        }
        else {
            groups.push({ key, variants: [variant] });
        }
    }
    return groups;
}
/**
 * Filters and validates variant nodes from ComponentSet children
 */
function getValidVariants(componentSet) {
    return componentSet.children.filter((node) => 'x' in node &&
        'y' in node &&
        'width' in node &&
        'height' in node);
}
/**
 * Applies padding to move variants away from edges
 */
function applyPadding(variants, padding) {
    const minX = Math.min(...variants.map(v => v.x));
    const minY = Math.min(...variants.map(v => v.y));
    const deltaX = padding - minX;
    const deltaY = padding - minY;
    for (const variant of variants) {
        variant.x += deltaX;
        variant.y += deltaY;
    }
}
/**
 * Aligns variants in rows (same Y coordinate)
 */
function alignRows(variants) {
    const rows = groupByAxis(variants, 'x');
    for (const row of rows) {
        const referenceY = row.variants[0].y;
        for (const variant of row.variants) {
            variant.y = referenceY;
        }
    }
}
/**
 * Aligns variants in columns (same X coordinate)
 */
function alignColumns(variants) {
    const columns = groupByAxis(variants, 'y');
    for (const column of columns) {
        const referenceX = column.variants[0].x;
        for (const variant of column.variants) {
            variant.x = referenceX;
        }
    }
}
/**
 * Resizes ComponentSet to fit aligned content with padding
 */
function resizeComponentSet(componentSet, variants, padding) {
    const maxX = Math.max(...variants.map(v => v.x + v.width));
    const maxY = Math.max(...variants.map(v => v.y + v.height));
    const newWidth = maxX + padding;
    const newHeight = maxY + padding;
    componentSet.resize(newWidth, newHeight);
}
/**
 * Applies visual styling to ComponentSet
 */
function applyStyling(componentSet, config) {
    componentSet.cornerRadius = config.cornerRadius;
    componentSet.strokes = [];
}
/**
 * Creates guides based on variant group boundaries
 */
function createGuides(variants) {
    const rows = groupByAxis(variants, 'x');
    const columns = groupByAxis(variants, 'y');
    const xGuides = new Set();
    const yGuides = new Set();
    // Add vertical guides (X axis) from column boundaries
    for (const column of columns) {
        const left = Math.min(...column.variants.map(v => v.x));
        const right = Math.max(...column.variants.map(v => v.x + v.width));
        xGuides.add(left);
        xGuides.add(right);
    }
    // Add horizontal guides (Y axis) from row boundaries
    for (const row of rows) {
        const top = Math.min(...row.variants.map(v => v.y));
        const bottom = Math.max(...row.variants.map(v => v.y + v.height));
        yGuides.add(top);
        yGuides.add(bottom);
    }
    return [
        ...[...xGuides].sort((a, b) => a - b).map(offset => ({ axis: 'X', offset })),
        ...[...yGuides].sort((a, b) => a - b).map(offset => ({ axis: 'Y', offset }))
    ];
}
// ============================================================================
// MAIN FUNCTION
// ============================================================================
/**
 * Main function to align and format ComponentSet variants
 */
function alignAndResizeComponentSet(componentSet, config = DEFAULT_CONFIG) {
    const variants = getValidVariants(componentSet);
    if (variants.length === 0) {
        return;
    }
    // Apply padding to move variants away from edges
    applyPadding(variants, config.padding);
    // Align variants into rows and columns
    alignRows(variants);
    alignColumns(variants);
    // Resize ComponentSet to fit content
    resizeComponentSet(componentSet, variants, config.padding);
    // Apply visual styling
    applyStyling(componentSet, config);
    // Add layout guides
    const guides = createGuides(variants);
    componentSet.guides = guides;
}
// ============================================================================
// PLUGIN ENTRY POINT
// ============================================================================
figma.on("run", () => {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        figma.notify(MESSAGES.NO_SELECTION);
        figma.closePlugin();
        return;
    }
    let processedCount = 0;
    for (const node of selection) {
        if (node.type === 'COMPONENT_SET') {
            alignAndResizeComponentSet(node);
            processedCount++;
        }
    }
    if (processedCount > 0) {
        figma.notify(MESSAGES.SUCCESS);
    }
    figma.closePlugin();
});
