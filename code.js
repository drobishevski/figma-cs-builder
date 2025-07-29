"use strict";
/// <reference types="@figma/plugin-typings" />
// ComponentSet Builder - Figma Plugin
// Automatically aligns ComponentSet variants into rows and columns, adds rulers, and applies consistent spacing and styling.
figma.on("run", () => {
    function groupByAxis(variants, axis = 'x', threshold = 20) {
        const groups = [];
        for (const variant of variants) {
            if (!('x' in variant) || !('y' in variant))
                continue;
            const key = axis === 'x' ? variant.y : variant.x;
            let group = groups.find(g => Math.abs(g.key - key) <= threshold);
            if (!group) {
                group = { key, variants: [] };
                groups.push(group);
            }
            group.variants.push(variant);
        }
        return groups;
    }
    function alignAndResize(componentSet) {
        const variants = componentSet.children.filter(n => 'x' in n && 'y' in n && 'width' in n && 'height' in n);
        const padding = 80;
        // Add padding from edges
        const dx = padding - Math.min(...variants.map(v => v.x));
        const dy = padding - Math.min(...variants.map(v => v.y));
        for (const v of variants) {
            v.x += dx;
            v.y += dy;
        }
        // Align rows
        const rows = groupByAxis(variants, 'x');
        for (const row of rows) {
            const refY = row.variants[0].y;
            for (const v of row.variants) {
                v.y = refY;
            }
        }
        // Align columns
        const cols = groupByAxis(variants, 'y');
        for (const col of cols) {
            const refX = col.variants[0].x;
            for (const v of col.variants) {
                v.x = refX;
            }
        }
        // Resize component set
        const contentRight = Math.max(...variants.map(v => v.x + v.width));
        const contentBottom = Math.max(...variants.map(v => v.y + v.height));
        const newWidth = contentRight + padding;
        const newHeight = contentBottom + padding;
        componentSet.resize(newWidth, newHeight);
        // Apply styling
        componentSet.cornerRadius = 32;
        componentSet.strokes = [];
        // Add guides - create new array and assign it
        const xGuides = new Set();
        const yGuides = new Set();
        for (const row of rows) {
            const top = Math.min(...row.variants.map(v => v.y));
            const bottom = Math.max(...row.variants.map(v => v.y + v.height));
            yGuides.add(top);
            yGuides.add(bottom);
        }
        for (const col of cols) {
            const left = Math.min(...col.variants.map(v => v.x));
            const right = Math.max(...col.variants.map(v => v.x + v.width));
            xGuides.add(left);
            xGuides.add(right);
        }
        // Create new guides array and assign it (as per Figma API documentation)
        const newGuides = [
            ...[...xGuides].sort((a, b) => a - b).map(x => ({ axis: 'X', offset: x })),
            ...[...yGuides].sort((a, b) => a - b).map(y => ({ axis: 'Y', offset: y }))
        ];
        componentSet.guides = newGuides;
    }
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        figma.notify("Please select a ComponentSet.");
        figma.closePlugin();
    }
    else {
        let _count = 0;
        for (const node of selection) {
            if (node.type === 'COMPONENT_SET') {
                alignAndResize(node);
                _count++;
            }
        }
        figma.notify("Done ✔️");
        figma.closePlugin();
    }
});
