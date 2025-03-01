/**
 * Script to download Minecraft block textures from Minecraft Wiki
 * Run with: node download-textures.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create the textures directory if it doesn't exist
const textureDir = path.join(__dirname, '..', 'public', 'block-textures');
if (!fs.existsSync(textureDir)) {
  fs.mkdirSync(textureDir, { recursive: true });
}

// List of blocks with their Wiki image URLs
const blocks = [
  { name: 'stone', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c1/Stone_JE3_BE2.png' },
  { name: 'grass_block', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/b0/Grass_Block_JE7_BE6.png' },
  { name: 'dirt', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Dirt.png' },
  { name: 'cobblestone', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d4/Cobblestone_JE3_BE2.png' },
  { name: 'oak_planks', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e9/Oak_Planks.png' },
  { name: 'spruce_planks', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/0c/Spruce_Planks_JE4_BE2.png' },
  { name: 'birch_planks', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/b3/Birch_Planks_JE4_BE2.png' },
  { name: 'sand', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/1e/Sand_JE4_BE3.png' },
  { name: 'gravel', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/cf/Gravel_JE3_BE2.png' },
  { name: 'gold_block', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/54/Block_of_Gold_JE6_BE3.png' },
  { name: 'iron_block', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/7e/Block_of_Iron_JE4_BE3.png' },
  { name: 'coal_block', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/12/Block_of_Coal_JE3_BE2.png' },
  { name: 'oak_log', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d2/Oak_Log_Axis_Y_JE6_BE2.png' },
  { name: 'oak_leaves', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6b/Oak_Leaves_JE9.png' },
  { name: 'sponge', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/68/Sponge_JE2_BE2.png' },
  { name: 'glass', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/bb/Glass_%28texture%29_JE2_BE2.png' },
  { name: 'lapis_block', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ad/Lapis_Lazuli_Block_JE3_BE3.png' },
  { name: 'sandstone', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/71/Sandstone_JE5_BE3.png' },
  { name: 'white_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2b/White_Wool_JE2_BE2.png' },
  { name: 'orange_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/03/Orange_Wool_JE2_BE2.png' },
  { name: 'magenta_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a2/Magenta_Wool_JE2_BE2.png' },
  { name: 'light_blue_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/38/Light_Blue_Wool_JE2_BE2.png' },
  { name: 'yellow_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/95/Yellow_Wool_JE2_BE2.png' },
  { name: 'lime_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5c/Lime_Wool_JE2_BE2.png' },
  { name: 'pink_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/08/Pink_Wool_JE2_BE2.png' },
  { name: 'gray_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/0c/Gray_Wool_JE2_BE2.png' },
  { name: 'light_gray_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/8c/Light_Gray_Wool_JE2_BE2.png' },
  { name: 'cyan_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/9e/Cyan_Wool_JE2_BE2.png' },
  { name: 'purple_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/41/Purple_Wool_JE2_BE2.png' },
  { name: 'blue_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/9f/Blue_Wool_JE2_BE2.png' },
  { name: 'brown_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/f7/Brown_Wool_JE2_BE2.png' },
  { name: 'green_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a5/Green_Wool_JE2_BE2.png' },
  { name: 'red_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c8/Red_Wool_JE2_BE2.png' },
  { name: 'black_wool', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/87/Black_Wool_JE2_BE2.png' }
];

// Download function
function downloadTexture(block) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(textureDir, `${block.name}.png`);
    const file = fs.createWriteStream(filePath);

    https.get(block.url, (response) => {
      if (response.statusCode !== 200) {
        reject(`Failed to download ${block.name}: ${response.statusCode}`);
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${block.name}.png`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file
      reject(`Error downloading ${block.name}: ${err.message}`);
    });
  });
}

// Download all textures
async function downloadAllTextures() {
  console.log(`Downloading ${blocks.length} textures to ${textureDir}...`);
  
  for (const block of blocks) {
    try {
      await downloadTexture(block);
    } catch (error) {
      console.error(error);
    }
  }
  
  console.log('Done!');
}

downloadAllTextures();
