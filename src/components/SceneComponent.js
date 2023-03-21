import React, { useEffect, useRef } from "react";
import { Engine, Scene, useBeforeRender } from "react-babylonjs";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

const SceneComponent = ({ image }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      const { scene } = boxRef.current;

      // Create the texture object using the image URL
      const texture = new Texture(image, scene, true, false);

      // Create the material for the box
      const material = new StandardMaterial("box-material", scene);
      material.diffuseTexture = texture;

      // Create the box mesh
      const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
      box.material = material;
      box.position = new Vector3(0, 1, 0);
    }
  }, [image]);

  useBeforeRender((scene) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Engine antialias adaptToDeviceRatio>
      <Scene>
        <arcRotateCamera
          name="camera"
          alpha={Math.PI / 2}
          beta={Math.PI / 4}
          radius={5}
          target={Vector3.Zero()}
        />
        <hemisphericLight
          name="light"
          intensity={0.7}
          direction={Vector3.Up()}
        />
        <box ref={boxRef} />
      </Scene>
    </Engine>
  );
};

export default SceneComponent;
