import { Color, Scene } from 'three';
import * as TEXTURE from '../texture/index.js'

function createScene() {
  const scene = new Scene();

  scene.background = new Color(0x000000);
  // scene.background = TEXTURE.skyTextureEquirec;
  // scene.backgroundIntensity = 0.1
  scene.environment = TEXTURE.envMap;

  return scene;
}

export { createScene };