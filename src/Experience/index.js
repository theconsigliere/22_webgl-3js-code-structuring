import * as THREE from "three"

import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Debug from "./Utils/Debug"

import Camera from "./Core/Camera"
import Renderer from "./Core/Renderer"

import World from "./World"
import Resources from "./Utils/Resources"
import sources from "./sources"

// convert experience into singleton
let instance = null

export default class Experience {
  constructor(canvas) {
    if (instance) return instance

    instance = this
    window.experience = this
    this.canvas = canvas
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.setup()
  }

  setup() {
    this.resizeEvent = this.resize.bind(this)
    this.tickEvent = this.update.bind(this)

    // emits form Sizes
    this.sizes.on("resize", this.resizeEvent)
    // emits from Time
    this.time.on("tick", this.tickEvent)
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.off("resize", this.resizeEvent)
    this.time.off("tick", this.tickEvent)

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child.isMesh) {
        child.geometry.dispose()

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key]

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if (this.debug.active) this.debug.ui.destroy()
  }
}
