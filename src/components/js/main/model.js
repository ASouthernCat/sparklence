import { gui, debugObject } from '@/components/js/system/gui'
import * as TEXTURE from '@/components/js/texture/index.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { createLightning } from './lightningStrike'
import * as THREE from 'three'

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
    gltfLoader.load(import.meta.env.BASE_URL + 'models/sparklence.gltf',
        (gltf) => {
            const posGuiFolder = gui.addFolder('位置坐标')
            posGuiFolder.add(gltf.scene.position, 'x')
            posGuiFolder.add(gltf.scene.position, 'y')
            posGuiFolder.add(gltf.scene.position, 'z')
            gltf.scene.name = "sparklence"
            const sparklence = gltf.scene
            scene.add(sparklence)
            sparklence.add(positionalAudio)
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
                const onClip = THREE.AnimationUtils.subclip(animationClip, 'on', 3, 42)
                console.log(onClip)
                const onAnimationAction = mixer.clipAction(onClip)
                onAnimationAction.clampWhenFinished = true;
                onAnimationAction.loop = THREE.LoopOnce
                // off
                const offClip = THREE.AnimationUtils.subclip(animationClip, 'off', 42, 80)
                const offAnimationAction = mixer.clipAction(offClip)
                offAnimationAction.clampWhenFinished = true;
                offAnimationAction.loop = THREE.LoopOnce

                gui.add({
                    animation: () => {
                        mixer.stopAllAction()
                        animationAction.stop()
                        animationAction.play()
                        positionalAudio.play()
                        sparklence.userData.isOn = false;
                        scene.userData.lightningStrikeGroup.visible = true
                    }
                }, 'animation').name('complete')
                gui.add({
                    animation: () => {
                        if (sparklence.userData.isOn == true) return
                        mixer.stopAllAction()
                        onAnimationAction.stop();
                        onAnimationAction.play();
                        positionalAudio.play()
                        sparklence.userData.isOn = true;
                        scene.userData.lightningStrikeGroup.visible = true
                    }
                }, 'animation').name('on')
                gui.add({
                    animation: () => {
                        if (sparklence.userData.isOn == false) return
                        mixer.stopAllAction()
                        offAnimationAction.stop();
                        offAnimationAction.play();
                        positionalAudio.stop()
                        sparklence.userData.isOn = false;
                        scene.userData.lightningStrikeGroup.visible = false
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
    let f = gui.addFolder('地面')
    f.close()
    f.addColor(floor.material, 'color').name("floorColor")
    f.add(floor.material, 'envMapIntensity').name("Floor EnvMapIntensity")

    // 创建闪电
    const {group, lightningStrikesArray} = createLightning()
    scene.add(group)
    group.visible = false
    scene.userData.lightningStrikeGroup = group
    scene.userData.lightningStrikes = lightningStrikesArray
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
