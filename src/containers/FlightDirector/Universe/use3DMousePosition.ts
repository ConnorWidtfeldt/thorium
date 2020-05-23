import React from "react";
import * as THREE from "three";
import {useThree} from "react-three-fiber";
import useEventListener from "./useEventListener";
import {Camera, Vector3, Plane, Raycaster} from "three";
import {PositionTuple} from "./CanvasApp";

let pos = new Vector3();
const planeY = new Plane(new THREE.Vector3(0, 0, 1), 0);
const raycaster = new Raycaster();

export function get3DMousePosition(
  x: number,
  y: number,
  width: number,
  height: number,
  camera: Camera,
) {
  var mv = new THREE.Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);
  raycaster.setFromCamera(mv, camera);
  raycaster.ray.intersectPlane(planeY, pos);
  return pos;
}

export default function use3DMousePosition(initVal: PositionTuple = [0, 0, 0]) {
  // const [position, setPosition] = React.useState<PositionTuple>(initVal);
  const position = React.useRef<PositionTuple>(initVal);
  const {size, camera, viewport} = useThree();
  const {width, height} = viewport;
  const {left, top} = size;
  useEventListener("mousemove", (e: MouseEvent) => {
    const pos = get3DMousePosition(
      e.clientX - left,
      e.clientY - top,
      width,
      height,
      camera,
    );

    const {x, y, z} = pos;
    position.current = [Math.round(x), Math.round(y), Math.round(z)];
  });
  return position;
}
