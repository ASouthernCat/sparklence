import * as resize from "./system/resize"
import * as THREE from "three"
import Stats from "stats.js"
import { createCamera } from "./base/camera"
import { createScene } from "./base/scene"
import { createCube } from "./base/cube"
import { createRenderer } from "./base/renderer"
import { createComposer } from "./base/composer"
import { createControl } from "./base/control"
import { createLight } from "./base/light"
import { createModels } from "./main/model"
import { generateRandomVector3OnSphere } from "./utils/randomVector"

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.className = "stats"
// stats.dom.style.top = "20%"
document.body.appendChild(stats.dom);
class ThreeApp {
    constructor(container) {
        // console.log(container)
        console.log("场景初始化")
        // 相机 camera
        this.camera = createCamera()
        this.listener = new THREE.AudioListener()
        this.camera.add(this.listener)
        // 控制器
        this.control = createControl(this.camera, container)
        // 场景 scene
        this.scene = createScene()
        this.scene.userData.listener = this.listener
        // 渲染器 renderer
        this.renderer = createRenderer(container)
        // 后处理渲染器 composer
        this.composer = createComposer(this.renderer, this.scene, this.camera)
        // 场景组成内容 object3D
        createModels(this.scene)
        createLight(this.scene)
        // resize
        resize.resizeEventListener(this.camera, this.renderer, this.composer)
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

            if (this.scene.getObjectByName('sparklence') && this.scene.getObjectByName('sparklence').userData.mixer) {
                this.scene.getObjectByName('sparklence').userData.mixer.update(deltaTime)
            }

            if (this.scene.userData.lightningStrikes) {
                this.scene.userData.lightningStrikes.forEach(lightningStrike => {
                    lightningStrike.rayParameters.destOffset.addScalar(Math.sin(elapsedTime) * 0.05)
                    lightningStrike.update(elapsedTime)
                });
            }

            // Render
            // this.renderer.render(this.scene, this.camera)
            this.composer.render()

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