import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Mesh,
} from "@babylonjs/core";
import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import SceneComponent from "./components/SceneComponent";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFyZWRlZnltZTMiLCJhIjoiY2xmZ2lxbzNrMXQ1cDNxbjF3djN3eTJkNyJ9.xEfvrZ5voQ2WKdAsGNDBvw";

function App() {
  const [img, setImg] = useState(null);
  let box;

  const onSceneReady = (scene) => {
    const mesh = new Mesh();
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    const myMaterial = new StandardMaterial("myMaterial", scene);

    myMaterial.diffuseTexture = new Texture(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom}/600x600?access_token=pk.eyJ1IjoiZGFyZWRlZnltZTMiLCJhIjoiY2xmZ2lxbzNrMXQ1cDNxbjF3djN3eTJkNyJ9.xEfvrZ5voQ2WKdAsGNDBvw`,
      scene
    );
    myMaterial.specularTexture = new Texture(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom}/600x600?access_token=pk.eyJ1IjoiZGFyZWRlZnltZTMiLCJhIjoiY2xmZ2lxbzNrMXQ1cDNxbjF3djN3eTJkNyJ9.xEfvrZ5voQ2WKdAsGNDBvw`,
      scene
    );
    myMaterial.emissiveTexture = new Texture(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom}/600x600?access_token=pk.eyJ1IjoiZGFyZWRlZnltZTMiLCJhIjoiY2xmZ2lxbzNrMXQ1cDNxbjF3djN3eTJkNyJ9.xEfvrZ5voQ2WKdAsGNDBvw`,
      scene
    );
    myMaterial.ambientTexture = new Texture(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom}/600x600?access_token=pk.eyJ1IjoiZGFyZWRlZnltZTMiLCJhIjoiY2xmZ2lxbzNrMXQ1cDNxbjF3djN3eTJkNyJ9.xEfvrZ5voQ2WKdAsGNDBvw`,
      scene
    );

    mesh.material = myMaterial;

    const canvas = scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

    // Move the box upward 1/2 its height
    box.position.y = 1;

    // Our built-in 'ground' shape.
    MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
  };

  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene) => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 10;
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
  };
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const getImage = () => {
    axios({
      method: "get",
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom}/600x600?access_token=pk.eyJ1IjoiZGFyZWRlZnltZTMiLCJhIjoiY2xmZ2lxbzNrMXQ1cDNxbjF3djN3eTJkNyJ9.xEfvrZ5voQ2WKdAsGNDBvw`,
    })
      .then((res) => {
        setImg(res.data);
      })
      .catch((err) => {
        console.log({ error: err });
      });
  };
  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <button onClick={() => getImage()}>3D Cuboid</button>
      {img && (
        <SceneComponent
          image={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom}/600x600?access_token=pk.eyJ1IjoiZGFyZWRlZnltZTMiLCJhIjoiY2xmZ2lxbzNrMXQ1cDNxbjF3djN3eTJkNyJ9.xEfvrZ5voQ2WKdAsGNDBvw`}
        />
      )}
    </div>
  );
}

export default App;
