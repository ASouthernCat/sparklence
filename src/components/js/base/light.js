import { AmbientLight, DirectionalLight, DirectionalLightHelper, CameraHelper, Scene, PointLight, PointLightHelper, Group, RectAreaLight } from 'three'
import { gui } from '../system/gui'
import Style from '../system/style'

/**
 * 添加光源，含环境光、平行光等
 * @param {Scene} scene 
 */
function createLight(scene) {
    // 环境光
    const ambientLight = new AmbientLight(0xffffff, 1)
    ambientLight.intensity = Style.default.ambientLightIntensity
    ambientLight.name = 'ambientLight'
    scene.add(ambientLight)
    // 平行光
    const directionalLight = new DirectionalLight(0xffffff, 4)
    directionalLight.intensity = Style.default.directionalLightIntensity
    directionalLight.name = 'directionalLight'
    directionalLight.castShadow = true
    directionalLight.shadow.normalBias = 0.02 //可消除锯齿阴影
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 20
    // directionalLight.shadow.camera.left = -20
    // directionalLight.shadow.camera.top = 20
    // directionalLight.shadow.camera.right = 20
    // directionalLight.shadow.camera.bottom = -20
    directionalLight.position.set(0.7, 10, 2.8)
    scene.add(directionalLight)
    const lightFolder = gui.addFolder('灯光设置')
    lightFolder.close()
    lightFolder.add(ambientLight, 'intensity').min(0).max(10).step(0.1).name('环境光强')
    lightFolder.add(directionalLight, 'intensity').min(0).max(50).step(0.01).name('平行光强')
    lightFolder.addColor(directionalLight, "color").name('平行光颜色')
    lightFolder.add(directionalLight.shadow, 'normalBias').min(-1).max(5).step(0.01)
    lightFolder.add(directionalLight.position, 'x').min(-100).max(200).step(0.1).name('平行光x')
    lightFolder.add(directionalLight.position, 'y').min(-100).max(200).step(0.1).name('平行光y')
    lightFolder.add(directionalLight.position, 'z').min(-100).max(200).step(0.1).name('平行光z')
    const directionalLightHelper = new DirectionalLightHelper(directionalLight)
    scene.add(directionalLightHelper)
    const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera)
    scene.add(directionalLightCameraHelper)
    directionalLightHelper.visible = false; directionalLightCameraHelper.visible = false
    lightFolder.add(directionalLightHelper, 'visible').name('平行光辅助器').onChange((e) =>
        directionalLightCameraHelper.visible = e
    )

}

export { createLight };