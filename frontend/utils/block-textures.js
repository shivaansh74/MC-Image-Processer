/**
 * Base64 encoded Minecraft block textures
 */
export const blockTextures = {
  // Stone-type blocks
  stone: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA8UlEQVQ4T2NkwA7+MzAwMCLLM+KQx6piNGYDE4bBWA24GhvL8O/XLwa3y5cZEpKSGP79/cvAyMiIYhDDfwY0BYzo8mfXrWdYsmwZw5uHDxmSExMZFixezLBl40aG2oYGBkZGJoZFixYzMDEzMyCcCgZ/f38GU3YOhsT4eAYDI0OGndu3M3z++o3h////DMyMTAyLly1jYGRiRLUU5oJTJ04wTJs5g+H69esMnz99ZgAZzMjAyLBz1y4GdnZ2rC5gPHT4MENISAiDjo4Ow9ev3xgYGRkZ1q1by6CsrMwQGhrG8PbtW4bXr18zcHJyMvDx8WEGMgD7ulaRYqMZIwAAAABJRU5ErkJggg==',
  
  cobblestone: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAwElEQVQ4T2NkYGBgqKio+F9WVsbIwMDA8P//f4b///8zMDExMTAyMjIg06h8BgYGRpj8X1YGhjueaf/Zvt9hYGBkYnj98SPDvZs3GISEhcHqGBgYUQzAZcC/f/8YmJiYwHIOHDjA8O/vX7Dhn75+ZXj28CHD799/GJiYmRlYWFgYxMTEGPj4+MCGI/yAZMt/JycnsDyKC0gJSOLDgPg0xmI4qQbARgMjIyPD06dPGUxMTBi+fPnCwM7OziAhIcEQFhZGrAuIDjMAMYU3xXKtsP0AAAAASUVORK5CYII=',
  
  // Plant and wood blocks
  dirt: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0ElEQVQ4T2NkYGBg2Lpl8/9Xr14xSEpKMvz9+5fh79+/YA2MjIwMTExMDIxMTAzIammMS8DiLMYmDEysLAy/vv9g+PHjBwMPDw84nBAGoLnKwssLLH/tyBGGu0+eMGSXljJ8/viRYfvWrQwCAgIM//7/Y4A5A6GbgYHBYNIkBi4eHrih/Pz8DHw8vAxfvnxhePz4MYOOjg6DnJwcSg1BDYP/+AYQE4j4vPGfkAFYvUBsNsCcCnMqzOm4vAQtlcgLB4JJmZRiGrcL8BoPAMYXOsUQQ8nOAAAAAElFTkSuQmCC',
  
  grass_block: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDUlEQVQ4T2NkYGBgMDU1/c/JycnIwMDA8P//f4Z///4xMDMzMzAyMjIg06j8/wwMjDDpP7/+/b9+4enzD2/fMbCysTEwMjExvH3zhuH+vXsMYuLiDH///mNgZGRCMQCXAf/+/WNgYmICy12+coXh3bt3YLN+/vzJ8OrlS4aPHz6ADWNjY2MQERFh4OXlZeBgZwfbgXABki3/zczMwPIoLiAlIIkPA+LTGIvhJBsAczoTExPDo0ePGMzMzBi+fv3KwMXFxSArK8sQEhJCrAuIDwMmVlYGNjY2hpevXjH8/fuPgYeHG+zUL1++MLCzszEoKioy8PPzMbCyssDDACMa0bIRKs/IyMDw9+9fBhYWFpQwAADN12xhwKJgQAAAAABJRU5ErkJggg==',
  
  oak_planks: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAn0lEQVQ4T2NkYGBgSEtL+79t2zZGBgYGhv///zP8+/ePgZmZmYGJiYkBmUblMzAwMMLE/346+//vs8sMfz+9YODQsWdgERBn+PTsAcOLa2cZBCWkGf7/+8vAyMSEYgAuA/79+8fAxMQElvv+4SXDzy9fGJiYWRk+vXnO8Ob+LQZuHj6G379+MjCxsjCws7MzcHJygpVgdQEpdkNdCncBMakArxoAGWY5EfzR3ZkAAAAASUVORK5CYII=',
  
  spruce_planks: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAk0lEQVQ4T2NkYGBgSE9P/79161ZGBgYGhv///zP8+/ePgZmZmYGJiYkBmUblMzAwMMLE/n768P/vy5cM/z5/YeCQlWVg4eVl+PzwIcPzCxcYBPj5Gf7/+8fAyMSEYgAuA/79+8fAxMQElnvw9CnDl+/fGZiYmBg+vHvH8OTGDQYuNjaG379/MzCxsjCws7MzcHJygpVgdQEA/0g5EUWk3qcAAAAASUVORK5CYII=',
  
  // Wood colors
  oak_log: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAuklEQVQ4T2NkYGBgWPCq9L+SpAojAwMDw////xn+/fvHwMzMzMDExMSATKPyGRgYGGHy7z68/r/n0hWGl+/fMagryDPIiYgwvH73juHOkycMSjIyDP/+/WNgZGJCMQCXAf/+/WNgYmICy125eZPh48ePYLP+/v3L8OHDB4bXr18zsLKyMrCxsTFISEgw8PPzM3BwcIDtQLgAyZb/tra2YHkUF5ASkMSHAfFpjMVwkg2AORUWC7iSMTFBCAA6RykRLBjIGQAAAABJRU5ErkJggg==',
  
  birch_planks: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAs0lEQVQ4T2NkYGBgKMor/L9i1QpGBgYGhv///zP8+/ePgZmZmYGJiYkBmUblMzAwMMLE/n76+P/vq5cM/758ZeBQUGBg4edj+PTwEcOLi5cYBPj5GP7//cvAyMSEYgAuA/79+8fAxMQElnvw9CnDl+/fGRiZmBg+vHvH8OTGDQYuNjaG379/MzCxsjCws7MzcHJygpUgXIBuy39bW1uwPIoLSAlI4sOA+DTGYjjJBgAASkU5EVJgKFkAAAAASUVORK5CYII=',
    
  // Other blocks
  sand: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAp0lEQVQ4T2NkYGBgqKio+F9WVsbIwMDA8P//f4b///8zMDExMTAyMjIg06h8BgZGmDwj+7//LFwcDH/+/Gb4+fMng6CQEAMDAwPD58+fGT59+sQgKirKwMjIiGIALgP+/fvHwMTEBJZzcnJi+PnzJ9isnz9/Mnz48IHh3bt3DH/+/GFgY2NjkJaWZhAUFGTg4OAAq0e4AMmW/7a2tmB5FBeQEpDEhwEA4PdIEf8MFbcAAAAASUVORK5CYII=',
    
  gold_block: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtElEQVQ4T2NkYGBgaA5q/v8k+wkjAwMDw////xn+/fvHwMzMzMDExMSATKPyGRgYGGHy///////Tv/9P//9n+P//HwMjIxMDIyMjw////xm+fPnM8P//fwYWFhawekZGJhQDcBnw798/BiYmJrCcnp4ew+fPn8FmwQz+9OkTAycnJ4OIiAgDLy8vAxcXF1g5wgVItvw3NTUFW4DiAlICkvgwID6NsRhOsgGwkCQlGeNMBwDKwT8RVs9RFgAAAABJRU5ErkJggg==',
    
  iron_block: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAu0lEQVQ4T2NkYGBg2NTf/d/Ow5+RgYGB4f///wz//v1jYGZmZmBiYmJAplH5DAyMCPHf/xn+////nwEmzsjICBZHphlhYjB5XPL//v1j+PfvH9gMmDxMDGYAsiF////HUMCIyxZcBvz//5+BiYkJQ83169cZXrx4AXcZFxcXg4qKCoOsrCwDLy8vAycnJ1g/wgVItvw3NzcHy6O4gJSAJD4MiE9jLIaTbAAsJElJxjjTAQAt/0ARzyvYHQAAAABJRU5ErkJggg==',
    
  // Wool blocks - using plain colors with texture for simplicity
  white_wool: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAjElEQVQ4T2NkYGBgUFNT+3/mzBlGBgYGhv///zP8+/ePgZmZmYGJiYkBmUblMzAwMMLE/v///5+RkRGhmxEm+P//f7A4TAIm9u/fPwZGRkaEGkZGlECCG4CsGMUGXC4gJp2QnM5ITgWkGoDNMJI1YgsEoi3AFYhEGYDPZqINwOcFog3Al5nwFiQAcMosEUXNkcwAAAAASUVORK5CYII=',
    
  blue_wool: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAj0lEQVQ4T2NkYGBgcHBw+L9nzx5GBgYGhv///zP8+/ePgZmZmYGJiYkBmUblMzAwMMLE/v///5+RkRGhmxEm+P//f7A4TAIm9u/fPwZGRkaEGkZGlECCG4CsGMUGXC4gJp2QnM5ITgWkGoDNMJI1YgsEoi3AFYhEGYDPZqINwOcFog3Al5nwFiQAKKosET8J1DMAAAAASUVORK5CYII=',
    
  red_wool: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAjklEQVQ4T2NkYGBgMDY2/n/o0CFGBgYGhv///zP8+/ePgZmZmYGJiYkBmUblMzAwMMLE/v///5+RkRGhmxEm+P//f7A4TAIm9u/fPwZGRkaEGkZGlECCG4CsGMUGXC4gJp2QnM5ITgWkGoDNMJI1YgsEoi3AFYhEGYDPZqINwOcFog3Al5nwFiQAAu0sEaKMiMIAAAAASUVORK5CYII=',
    
  // Make more textures as needed...
};

/**
 * Convert a block name to a standardized format for texture lookup
 */
export function normalizeBlockName(blockName) {
  return blockName.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Check if a texture exists for the given block
 */
export function hasTexture(blockName) {
  const normalizedName = normalizeBlockName(blockName);
  return !!blockTextures[normalizedName];
}

/**
 * Get the fallback color for a block when texture isn't available
 */
export function getFallbackColor(blockName) {
  // Map of block types to fallback colors
  const fallbackColors = {
    stone: '#7a7a7a',
    dirt: '#866043',
    grass_block: '#5f9f35',
    oak_planks: '#a28250',
    // Add more as needed...
  };
  
  const normalizedName = normalizeBlockName(blockName);
  return fallbackColors[normalizedName] || '#7a7a7a';  // Default to stone color
}
