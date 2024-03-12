import { PerspectiveCamera } from "three";
import { sizes } from "../system/sizes";
function createCamera(){
    const camera = new PerspectiveCamera(65, sizes.width / sizes.height, 1, 2000)
    camera.position.set(0, 7, 6)
    return camera
}
export {createCamera }