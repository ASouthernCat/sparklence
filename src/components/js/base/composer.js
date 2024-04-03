import {
    EffectComposer,
    EffectPass,
    RenderPass,
    NormalPass,
    DepthDownsamplingPass,
    SelectiveBloomEffect,
    BlendFunction,
    EdgeDetectionMode,
    SMAAEffect,
    SMAAPreset,
    KernelSize,
    OutlineEffect,
} from 'postprocessing'
import { Camera, HalfFloatType, Scene, WebGLRenderer } from 'three'
import { gui, debugObject } from '@/components/js/system/gui'

// 辉光
let bloomEffect
// 描边
let outlineEffect

/**
 * 创建后处理效果渲染器
 * @param {WebGLRenderer} renderer 
 * @param {Scene} scene 
 * @param {Camera} camera 
 * @returns 
 */
function createComposer(renderer, scene, camera) {
    // 后处理渲染器
    const effectComposer = new EffectComposer(renderer, {
        frameBufferType: HalfFloatType
    })
    const capabilities = renderer.capabilities
    // 渲染管线
    const renderPass = new RenderPass(scene, camera)
    // bloompass
    bloomEffect = new SelectiveBloomEffect(scene, camera, {
        blendFunction: BlendFunction.ADD,
        mipmapBlur: true,
        luminanceThreshold: 0,
        luminanceSmoothing: 0.1,
        intensity: 10,
    })
    bloomEffect.ignoreBackground = true
    bloomEffect.mipmapBlurPass.radius = 0.85
    const bloomPass = new EffectPass(camera, bloomEffect)
    bloomPass.name = 'bloomPass'
    // 描边
    outlineEffect = new OutlineEffect(scene, camera, {
        blendFunction: BlendFunction.SCREEN,
        multisampling: Math.min(4, renderer.capabilities.maxSamples),
        edgeStrength: 8,
        pulseSpeed: 0.0,
        visibleEdgeColor: 0xfff71a,
        hiddenEdgeColor: 0x000000,
        height: 480,
        blur: false,
        xRay: true
    });
    outlineEffect.blurPass.enabled = true
    outlineEffect.blurPass.blurMaterial.kernelSize = KernelSize.VERY_SMALL
    const outlinePass = new EffectPass(camera, outlineEffect);
    // smaapass
    const smaaEffect = new SMAAEffect({
        preset: SMAAPreset.HIGH,
        edgeDetectionMode: EdgeDetectionMode.COLOR,
    })
    const smaaPass = new EffectPass(camera, smaaEffect)
    // normalPass ...
    const normalPass = new NormalPass(scene, camera)
    const depthDownsamplingPass = new DepthDownsamplingPass({
        normalBuffer: normalPass.texture,
        resolutionScale: 0.5,
    })
    // 添加渲染通道
    effectComposer.addPass(renderPass)
    effectComposer.addPass(normalPass)
    if (capabilities.isWebGL2) {

        effectComposer.addPass(depthDownsamplingPass);

    } else {

        console.log("WebGL 2 not supported, falling back to naive depth downsampling");

    }
    effectComposer.addPass(outlinePass)
    effectComposer.addPass(smaaPass)
    effectComposer.addPass(bloomPass)

    // debug
    // const outlineFolder = gui.addFolder('描边-outline')
    // outlineFolder.add({ enabled: true }, 'enabled').onChange((v) => {
    //     if (v) effectComposer.addPass(outlinePass)
    //     else effectComposer.removePass(outlinePass)
    // })
    // outlineFolder.addColor(outlineEffect, "visibleEdgeColor")
    // // outlineFolder.addColor(outlineEffect, "hiddenEdgeColor")
    // outlineFolder.add(outlineEffect, "edgeStrength").min(0).max(20).step(0.1)
    // outlineFolder.add(outlineEffect, "pulseSpeed").min(0).max(5).step(0.1)
    // outlineFolder.add(outlineEffect.blurPass.blurMaterial, "kernelSize").name('blurriness').min(KernelSize.VERY_SMALL).max(KernelSize.VERY_LARGE + 1).step(1)

    // const bloomFolder = gui.addFolder('辉光-bloom')
    // bloomFolder.close()
    // bloomFolder.add({ enabled: true }, 'enabled').onChange((v) => {
    //     if (v) effectComposer.addPass(bloomPass)
    //     else effectComposer.removePass(bloomPass)
    // })
    // bloomFolder.add(bloomEffect, "intensity", 0.0, 10.0, 0.01)
    // bloomFolder.add(bloomEffect.mipmapBlurPass, "radius", 0.0, 1.0, 0.001)

    // console.log('eee',effectComposer.passes)
    return effectComposer
}

export { createComposer, bloomEffect, outlineEffect }