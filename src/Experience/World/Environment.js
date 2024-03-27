import * as THREE from "three"

import Experience from ".."

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Setup
    this.setSunLight()
    this.setEnvironmentMap()

    //debug
    if (this.debug.active) this.environmentDebug()
  }

  environmentDebug() {
    this.debugFolder = this.debug.gui.addFolder("Environment")

    this.debugFolder
      .add(this.environmentMap, "intensity")
      .min(0)
      .max(1)
      .step(0.001)
      .name("Environment Map Intensity")
      .onChange(this.environmentMap.updateMaterials)

    this.debugFolder
      .add(this.sunLight, "intensity")
      .min(0)
      .max(10)
      .step(0.001)
      .name("Sun Light Intensity")

    this.debugFolder
      .add(this.sunLight.position, "x")
      .min(-10)
      .max(10)
      .step(0.001)
      .name("Sun Light X")

    this.debugFolder
      .add(this.sunLight.position, "y")
      .min(-10)
      .max(10)
      .step(0.001)
      .name("Sun Light Y")

    this.debugFolder
      .add(this.sunLight.position, "z")
      .min(-10)
      .max(10)
      .step(0.001)
      .name("Sun Light Z")
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunLight)
  }

  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.4
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.colorSpace = THREE.SRGBColorSpace

    this.scene.environment = this.environmentMap.texture

    // add a method to the envmap property to update all materials
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }
    this.environmentMap.updateMaterials()
  }
}
