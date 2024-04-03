import { Vector3 } from "three";

export function generateRandomVector3OnSphere(center, radius) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new Vector3(center.x + x, center.y + y, center.z + z);
}