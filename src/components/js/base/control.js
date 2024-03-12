import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
export function createControl(camera, canvas) {
    const control = new OrbitControls(camera, canvas)
    control.maxPolarAngle = Math.PI * 0.55
    // control.minPolarAngle = 0.1
    control.minDistance = 2
    // contol.screenSpacePanning = false
    control.target.set(0, 4, 0)
    control.enableDamping = true
    control.dampingFactor = 0.1
    control.enablePan = false
    return control
}