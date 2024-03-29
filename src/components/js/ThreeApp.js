import * as resize from "./system/resize"
import * as THREE from "three"
import Stats from "stats.js"
import { createCamera } from "./base/camera"
import { createScene } from "./base/scene"
import { createCube } from "./base/cube"
import { createRenderer } from "./base/renderer"
import { createControl } from "./base/control"
import { createLight } from "./base/light"
import { createModels } from "./main/model"


var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// stats.dom.style.top = "20%"
document.body.appendChild(stats.dom);
class ThreeApp {
    constructor(container) {
        // console.log(container)
        console.log("场景初始化")
        // 相机 camera
        this.camera = createCamera()
        this.listener = new THREE.AudioListener()
        this.camera.add( this.listener )
        // 控制器
        this.control = createControl(this.camera, container)
        // 场景 scene
        this.scene = createScene()
        this.scene.userData.listener = this.listener
        // 场景组成内容 object3D
        createModels(this.scene)
        createLight(this.scene)
        // 渲染器 renderer
        this.renderer = createRenderer(container)
        // resize
        resize.resizeEventListener(this.camera, this.renderer)
    }
    render() {
        // 渲染场景
        console.log("渲染场景...")
        const clock = new THREE.Clock()
        let previousTime = 0
        this.tick = () => {
            stats.update()
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime

            // // Update controls
            this.control.update()

            // Raycast
            // pickHelper.pick(pickPosition, currentScene.scene, camera)

            if(this.scene.getObjectByName('sparklence') && this.scene.getObjectByName('sparklence').userData.mixer)
            {
                this.scene.getObjectByName('sparklence').userData.mixer.update(deltaTime)
            }

            // // Render
            this.renderer.render(this.scene, this.camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(this.tick)
        }
        this.tick()
    }
    clear() {
        console.log("清理内存")
        location.reload()
        resize.clear()
        this.tick = null
        this.scene = null
        this.camera = null
        this.renderer.dispose()
        this.control.dispose()
    }
}

export { ThreeApp }