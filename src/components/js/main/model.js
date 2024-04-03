import { gui, debugObject } from '@/components/js/system/gui'
import * as TEXTURE from '@/components/js/texture/index.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { createLightning } from './lightningStrike'
import { LensFlareEffect } from '@/lib/LensFlare'
import { bloomEffect, outlineEffect } from '../base/composer'
import * as THREE from 'three'
import gsap from 'gsap'
import Style from '../system/style'

let scene = new THREE.Scene()
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        console.log('Loaded successfully!')
    },
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        let progressRatio = itemsLoaded / itemsTotal
        let p = (progressRatio * 100).toFixed(0)
        // console.log('progress:',p.value,'%')
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(import.meta.env.BASE_URL + 'draco/')
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * 
 * @param {THREE.Scene} scene 
 */
function createModels(_scene) {
    scene = _scene

    // 音效
    const positionalAudio = new THREE.PositionalAudio(scene.userData.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(import.meta.env.BASE_URL + 'audio/TigaSparklence.mp3', function (buffer) {
        positionalAudio.setBuffer(buffer);
        positionalAudio.setRefDistance(5);
        positionalAudio.offset = 0.5
    });

    // 加载器解析模型
    gltfLoader.load(import.meta.env.BASE_URL + 'models/eb.glb', // 能量球（法向修复）
        (glb) => {
            glb.scene.traverse((child) => {
                if(child instanceof THREE.Mesh){
                    child.material.emissive = new THREE.Color(0xffd270)
                    bloomEffect.selection.add(child)
                }
            })
            scene.add(glb.scene)
        }
    )
    gltfLoader.load(import.meta.env.BASE_URL + 'models/sparklence.gltf',
        (gltf) => {
            // const posGuiFolder = gui.addFolder('位置坐标')
            // posGuiFolder.add(gltf.scene.position, 'x')
            // posGuiFolder.add(gltf.scene.position, 'y')
            // posGuiFolder.add(gltf.scene.position, 'z')
            gltf.scene.name = "sparklence"
            const sparklence = gltf.scene
            scene.add(sparklence)
            sparklence.add(positionalAudio)
            sparklence.getObjectByName("Object_25").visible = false
            updateAllMaterials()
            console.log("", sparklence)

            // 模型动画
            console.log('动画', gltf.animations);
            const animations = gltf.animations;
            if (animations.length > 0) {
                const mixer = new THREE.AnimationMixer(sparklence);
                sparklence.userData.mixer = mixer
                const animationClip = animations[0]
                const animationAction = mixer.clipAction(animationClip);
                animationAction.name = "all"
                animationAction.loop = THREE.LoopOnce
                animationAction.play();
                sparklence.userData.isOn = false

                // 动画拆分
                // on
                const onClip = THREE.AnimationUtils.subclip(animationClip, 'on', 1, 42)
                console.log(onClip)
                const onAnimationAction = mixer.clipAction(onClip)
                onAnimationAction.clampWhenFinished = true;
                onAnimationAction.loop = THREE.LoopOnce
                // off
                const offClip = THREE.AnimationUtils.subclip(animationClip, 'off', 42, 80)
                const offAnimationAction = mixer.clipAction(offClip)
                offAnimationAction.clampWhenFinished = true;
                offAnimationAction.loop = THREE.LoopOnce

                // gui.add({
                //     animation: () => {
                //         mixer.stopAllAction()
                //         animationAction.stop()
                //         animationAction.play()
                //         positionalAudio.play()
                //         sparklence.userData.isOn = false;
                //     }
                // }, 'animation').name('complete')
                gui.add({
                    animation: () => {
                        if (sparklence.userData.isOn == true) return
                        mixer.stopAllAction()
                        onAnimationAction.stop();
                        onAnimationAction.play();
                        positionalAudio.play()
                        sparklence.userData.isOn = true;
                        scene.userData.lightningStrikeGroup.visible = true
                        lensTimeline.restart()
                    }
                }, 'animation').name('成为光！')
                gui.add({
                    animation: () => {
                        if (sparklence.userData.isOn == false) return
                        mixer.stopAllAction()
                        offAnimationAction.stop();
                        offAnimationAction.play();
                        positionalAudio.stop()
                        sparklence.userData.isOn = false;
                        scene.userData.lightningStrikeGroup.visible = false
                        lensTimeline.pause()
                        scene.userData.lensFlareEffect.visible = false
                        scene.getObjectByName("directionalLight").intensity = Style.default.directionalLightIntensity
                    }
                }, 'animation').name('off')
            }
        }
    )

    // floor
    const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.MeshStandardMaterial({
        // envMap: TEXTURE.envMap,
        color: "#545454",
        envMapIntensity: 0,
        side: THREE.DoubleSide,
        metalness: 0.8,
        roughness: 0.1,
    }))
    floor.receiveShadow = true
    floor.position.setY(0)
    floor.rotation.x = - Math.PI * 0.5
    floor.name = "ground"
    scene.add(floor)

    // 创建闪电
    const { group, lightningStrikesArray } = createLightning()
    scene.add(group)
    group.visible = false
    scene.userData.lightningStrikeGroup = group
    scene.userData.lightningStrikes = lightningStrikesArray
    group.traverse((child)=>{
        if(child instanceof THREE.Mesh){
            outlineEffect.selection.add(child)
        }
    })

    // 创建光晕
    const lensFlareEffect = LensFlareEffect(
        new THREE.Vector3(0, 4.7, 0),
        1
    )
    lensFlareEffect.material.uniforms.colorGain.value = new THREE.Color(77, 145, 255)
    lensFlareEffect.material.uniforms.starPoints.value = 12
    lensFlareEffect.material.uniforms.flareShape.value = 0.03
    lensFlareEffect.material.uniforms.flareSpeed.value = 0.6
    lensFlareEffect.material.uniforms.ghostScale.value = 0.16
    lensFlareEffect.visible = false
    scene.add(lensFlareEffect)
    scene.userData.lensFlareEffect = lensFlareEffect

    // 特效动画
    const lensTimeline = gsap.timeline()
    lensTimeline.pause()
    lensTimeline.to({},{
        duration: 2.4,
        onUpdate:()=>{
            scene.getObjectByName("directionalLight").intensity = Math.random()*20
        },
        onComplete:()=>{
            scene.getObjectByName("directionalLight").intensity = Style.default.directionalLightIntensity
        }
    })
    lensTimeline.fromTo(
        lensFlareEffect.material.uniforms.glareSize, {value: 0.65},{
            value: 0.0,
            duration: 0.05,
            yoyo: true,
            yoyoEase: "none",
            repeat: 8,
            onStart: ()=>{
                scene.userData.lensFlareEffect.visible = true
                scene.userData.lightningStrikeGroup.visible = false
            }
        },
        ">"
    )
    lensTimeline.fromTo(
        lensFlareEffect.material.uniforms.flareShape, {value: 0.03},{
            value: 0.0,
            duration: 0.5,
        },
        ">"
    )
    lensTimeline.fromTo(
        lensFlareEffect.material.uniforms.flareSize, { value: 0.0},{
            value: 0.25,
            duration: 2,
            ease: "power1.out",
            onStart: ()=>{
                lensFlareEffect.material.uniforms.flareSpeed.value = 0.05
            }
        },
        "<"
    )
    // Debug Lens Flare
    // gui.add(lensFlareEffect.material.uniforms.enabled, 'value').name('Enabled?')
    // gui.add(lensFlareEffect.material.uniforms.followMouse, 'value').name('Follow Mouse?')
    // gui.add(lensFlareEffect.material.uniforms.starPoints, 'value').name('starPoints').min(0).max(20).step(1)
    // gui.add(lensFlareEffect.material.uniforms.glareSize, 'value').name('glareSize').min(0).max(2)
    // gui.add(lensFlareEffect.material.uniforms.flareSize, 'value').name('flareSize').min(0).max(0.1).step(0.001)
    // gui.add(lensFlareEffect.material.uniforms.flareSpeed, 'value').name('flareSpeed').min(0).max(1).step(0.01)
    // gui.add(lensFlareEffect.material.uniforms.flareShape, 'value').name('flareShape').min(0).max(2).step(0.01)
    // gui.add(lensFlareEffect.material.uniforms.haloScale, 'value').name('haloScale').min(-0.5).max(1).step(0.01)
    // gui.add(LensFlareParams, 'opacity').name('opacity').min(0).max(1).step(0.01)
    // gui.add(lensFlareEffect.material.uniforms.ghostScale, 'value').name('ghostScale').min(0).max(2).step(0.01)
    // gui.add(lensFlareEffect.material.uniforms.animated, 'value').name('animated')
    // gui.add(lensFlareEffect.material.uniforms.anamorphic, 'value').name('anamorphic')
    // gui.add(lensFlareEffect.material.uniforms.secondaryGhosts, 'value').name('secondaryGhosts')
    // gui.add(lensFlareEffect.material.uniforms.starBurst, 'value').name('starBurst')
    // gui.add(lensFlareEffect.material.uniforms.aditionalStreaks, 'value').name('aditionalStreaks')
}

/**
 * 材质更新调整
 */
function updateAllMaterials() {

    scene.getObjectByName('sparklence').traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true

            child.material.envMap = TEXTURE.envMap;
            child.material.envMapIntensity = 1;
        }
    })
}

export { createModels, updateAllMaterials }
