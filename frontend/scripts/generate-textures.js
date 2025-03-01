/**
 * Script to generate fallback Minecraft block textures
 * Run with: node generate-textures.js
 */
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create the textures directory if it doesn't exist
const textureDir = path.join(__dirname, '..', 'public', 'block-textures');
if (!fs.existsSync(textureDir)) {
  fs.mkdirSync(textureDir, { recursive: true });
}

// Block definitions with their approximate colors
const blocks = [
  { name: 'stone', color: [125, 125, 125] },
  { name: 'grass_block', color: [95, 159, 53] },
  { name: 'dirt', color: [134, 96, 67] },
  { name: 'cobblestone', color: [123, 123, 123] },
  { name: 'oak_planks', color: [162, 130, 78] },
  { name: 'spruce_planks', color: [104, 78, 47] },
  { name: 'birch_planks', color: [196, 179, 123] },
  { name: 'sand', color: [219, 209, 160] },
  { name: 'gravel', color: [127, 127, 127] },
  { name: 'gold_block', color: [249, 236, 79] },
  { name: 'iron_block', color: [220, 220, 220] },
  { name: 'coal_block', color: [19, 19, 19] },
  { name: 'oak_log', color: [107, 84, 51] },
  { name: 'oak_leaves', color: [60, 192, 41] },
  { name: 'sponge', color: [207, 203, 80] },
  { name: 'glass', color: [175, 213, 228] },
  { name: 'lapis_block', color: [39, 67, 138] },
  { name: 'sandstone', color: [217, 201, 157] },
  { name: 'white_wool', color: [233, 236, 236] },
  { name: 'orange_wool', color: [240, 118, 19] },
  { name: 'magenta_wool', color: [189, 68, 179] },
  { name: 'light_blue_wool', color: [58, 175, 217] },
  { name: 'yellow_wool', color: [248, 197, 39] },
  { name: 'lime_wool', color: [112, 185, 25] },
  { name: 'pink_wool', color: [237, 141, 172] },
  { name: 'gray_wool', color: [62, 68, 71] },
  { name: 'light_gray_wool', color: [142, 142, 134] },
  { name: 'cyan_wool', color: [21, 137, 145] },
  { name: 'purple_wool', color: [121, 42, 172] },
  { name: 'blue_wool', color: [53, 57, 157] },
  { name: 'brown_wool', color: [114, 71, 40] },
  { name: 'green_wool', color: [84, 109, 27] },
  { name: 'red_wool', color: [160, 39, 34] },
  { name: 'black_wool', color: [20, 21, 25] },
];

// Function to generate a simple texture for a block
function generateTexture(block) {
  // Create a 16x16 texture
  const size = 32;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill with the main color
  ctx.fillStyle = `rgb(${block.color[0]}, ${block.color[1]}, ${block.color[2]})`;
  ctx.fillRect(0, 0, size, size);
  
  // Add some noise/texture
  addTexture(ctx, size, block.color);
  
  // Add a slight border/shadow effect
  addBorder(ctx, size);
  
  // Save to file
  const filePath = path.join(textureDir, `${block.name}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${block.name}.png`);
}

// Add some texture/noise to make it look more like Minecraft
function addTexture(ctx, size, baseColor) {
  // Add some pixel noise
  for(let x = 0; x < size; x++) {
    for(let y = 0; y < size; y++) {
      // Random variation
      const variation = Math.floor(Math.random() * 20 - 10);
      
      // Only modify some pixels
      if(Math.random() > 0.7) {
        ctx.fillStyle = `rgb(
          ${clamp(baseColor[0] + variation, 0, 255)}, 
          ${clamp(baseColor[1] + variation, 0, 255)}, 
          ${clamp(baseColor[2] + variation, 0, 255)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

// Add border/shadow effect
function addBorder(ctx, size) {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, size, size);
  
  // Add some inner shading
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
}

// Helper function to clamp values
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Generate all textures
async function generateAllTextures() {
  console.log(`Generating ${blocks.length} textures in ${textureDir}...`);
  
  for (const block of blocks) {
    try {
      generateTexture(block);
    } catch (error) {
      console.error(`Error generating ${block.name}: ${error.message}`);
    }
  }
  
  console.log('Done!');
}

generateAllTextures();
