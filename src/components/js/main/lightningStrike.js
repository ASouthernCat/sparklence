import * as THREE from 'three'
import { LightningStrike } from '@/lib/LightningStrike'
import { generateRandomVector3OnSphere } from '../utils/randomVector'

const rayParams1 = {
    // 源点偏移
    sourceOffset: new THREE.Vector3(0,4.7,0),
    // 目标点偏移
    destOffset: new THREE.Vector3(-10,10,0),
    // 半径0
    radius0: 0.05,
    // 半径1
    radius1: 0.05,
    // 最小半径
    minRadius: 2.5,
    // 最大迭代次数
    maxIterations: 7,
    // 是否永恒
    isEternal: true,

    // 时间缩放
    timeScale: 0.7,

    // 传播时间系数
    propagationTimeFactor: 0.05,
    // 消失时间系数
    vanishingTimeFactor: 0.95,
    // 子光束周期
    subrayPeriod: 2.5,
    // 子光束 duty 周期
    subrayDutyCycle: 0.3,
    // 最大子光束递归次数
    maxSubrayRecursion: 3,
    // 分支数
    ramification: 8,
    // 递归概率
    recursionProbability: 0.6,

    // 粗糙度
    roughness: 0.85,
    // 直线度
    straightness: 0.68
}

const rayParams2 = {
    sourceOffset: new THREE.Vector3(0,4.7,0),
    destOffset: new THREE.Vector3(-15,-4,0),
    radius0: 0.05,
    radius1: 0.05,
    minRadius: 2.5,
    maxIterations: 7,
    isEternal: true,

    timeScale: 0.7,

    propagationTimeFactor: 0.05,
    vanishingTimeFactor: 0.95,
    subrayPeriod: 2.5,
    subrayDutyCycle: 0.3,
    maxSubrayRecursion: 3,
    ramification: 10,
    recursionProbability: 0.6,

    roughness: 0.85,
    straightness: 0.5
}

const rayParams3 = {
    sourceOffset: new THREE.Vector3(0,4.7,0),
    destOffset: new THREE.Vector3(18,6,0),
    radius0: 0.05,
    radius1: 0.05,
    minRadius: 2.5,
    maxIterations: 7,
    isEternal: true,

    timeScale: 0.7,

    propagationTimeFactor: 0.05,
    vanishingTimeFactor: 0.95,
    subrayPeriod: 2.5,
    subrayDutyCycle: 0.3,
    maxSubrayRecursion: 3,
    ramification: 7,
    recursionProbability: 0.6,

    roughness: 0.85,
    straightness: 0.6
}

const rayParams4 = {
    sourceOffset: new THREE.Vector3(0,4.7,0),
    destOffset: new THREE.Vector3(12,-5,6),
    radius0: 0.05,
    radius1: 0.05,
    minRadius: 2.5,
    maxIterations: 7,
    isEternal: true,

    timeScale: 0.7,

    propagationTimeFactor: 0.05,
    vanishingTimeFactor: 0.95,
    subrayPeriod: 2.5,
    subrayDutyCycle: 0.3,
    maxSubrayRecursion: 3,
    ramification: 7,
    recursionProbability: 0.6,

    roughness: 0.85,
    straightness: 0.68
}

const rayParams5 = {
    sourceOffset: new THREE.Vector3(0,4.7,0),
    destOffset: new THREE.Vector3(2,10,-6),
    radius0: 0.05,
    radius1: 0.05,
    minRadius: 2.5,
    maxIterations: 7,
    isEternal: true,

    timeScale: 0.7,

    propagationTimeFactor: 0.05,
    vanishingTimeFactor: 0.95,
    subrayPeriod: 2.5,
    subrayDutyCycle: 0.3,
    maxSubrayRecursion: 3,
    ramification: 9,
    recursionProbability: 0.6,

    roughness: 0.85,
    straightness: 0.4
}

/**
 * 创建闪电mesh
 */
export function createLightning() {
    const lightningStrike = new LightningStrike(rayParams1)
    const lightningStrikeMesh = new THREE.Mesh(
        lightningStrike,
        new THREE.MeshBasicMaterial({
            color: "#ffffdd",
        })
    )

    const lightningStrike2 = new LightningStrike(rayParams2)
    const lightningStrikeMesh2 = new THREE.Mesh(
        lightningStrike2,
        new THREE.MeshBasicMaterial({
            color: "#ffffdd",
        })   
    )

    const lightningStrike3 = new LightningStrike(rayParams3)
    const lightningStrikeMesh3 = new THREE.Mesh(
        lightningStrike3,
        new THREE.MeshBasicMaterial({
            color: "#ffffdd",
        })
    )

    const lightningStrike4 = new LightningStrike(rayParams4)
    const lightningStrikeMesh4 = new THREE.Mesh(
        lightningStrike4,
        new THREE.MeshBasicMaterial({
            color: "#ffffdd",
        })
    )

    const lightningStrike5 = new LightningStrike(rayParams5)
    const lightningStrikeMesh5 = new THREE.Mesh(
        lightningStrike5,
        new THREE.MeshBasicMaterial({
            color: "#ffffdd",
        })
    )
    const group = new THREE.Group()
    group.add(
        lightningStrikeMesh,
        lightningStrikeMesh2,
        lightningStrikeMesh3,
        lightningStrikeMesh4,
        lightningStrikeMesh5
    )
    
    const lightningStrikesArray = [
        lightningStrike,
        lightningStrike2,
        lightningStrike3,
        lightningStrike4,
        lightningStrike5
    ]
    return { group, lightningStrikesArray}
}