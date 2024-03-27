import * as THREE from "three"

import EventEmitter from "./EventEmitter.js"
import { GLTFLoader } from "three/examples/jsm/Addons.js"

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    this.sources = sources.sources

    // once loaded add to this.items
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    }
  }

  startLoading() {
    this.sources.map((source) => {
      switch (source.type) {
        case "gltf":
          this.loaders.gltfLoader.load(source.path, (gltf) =>
            this.sourceLoaded(source, gltf)
          )
          break
        case "texture":
          this.loaders.textureLoader.load(source.path, (texture) =>
            this.sourceLoaded(source, texture)
          )
          break
        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(source.path, (texture) =>
            this.sourceLoaded(source, texture)
          )
          break
        default:
          console.warn("Unknown type")
      }
    })
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file

    this.loaded++

    if (this.loaded === this.toLoad) {
      this.emit("ready")
    }
  }
}
