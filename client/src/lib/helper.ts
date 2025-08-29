// src/utils/helpers.ts

export function generateSparkline(data: number[], color: string): string {
    const width = 120;
    const height = 50;
    const padding = 5;

    // Handle empty or single-point data
    if (!data || data.length < 2) {
        return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="w-full h-16 mt-auto"></svg>`;
    }

    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal; // Prevent division by zero

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((d - minVal) / range) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');

    return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="w-full h-16 mt-auto"><polyline fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${points}" /></svg>`;
}

export function cleanIndexNameForFilename(indexName: string): string {
    return indexName.replace(/ /g, '_').toLowerCase();
}