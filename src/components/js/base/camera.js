import { PerspectiveCamera } from "three";
import { sizes } from "../system/sizes";
function createCamera(){
    const camera = new PerspectiveCamera(65, sizes.width / sizes.height, 1, 2000)
    camera.position.set(0, 4, 6.5)
    return camera
}
export {createCamera }