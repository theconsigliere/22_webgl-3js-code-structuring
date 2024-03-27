import * as THREE from "three"
import Experience from ".."

export default class Fox {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug

    // setup
    this.resource = this.resources.items.foxModel

    this.setModel()
    this.setAnimation()

    if (this.debug.active) this.foxDebug()
  }

  foxDebug() {
    this.debugFolder = this.debug.gui.addFolder("Fox")

    this.debugObject = {
      playIdle: () => {
        this.animation.play("idle")
      },
      playWalk: () => {
        this.animation.play("walk")
      },
      playRun: () => {
        this.animation.play("run")
      },
    }

    this.debugFolder.add(this.debugObject, "playIdle")
    this.debugFolder.add(this.debugObject, "playWalk")
    this.debugFolder.add(this.debugObject, "playRun")
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.025, 0.025, 0.025)
    this.model.position.set(0, -0.5, 0)
    this.scene.add(this.model)

    // add shadow
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }

  setAnimation() {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.model)

    this.animation.actions = {}

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    )

    this.animation.actions.walk = this.animation.mixer.clipAction(
      this.resource.animations[1]
    )

    this.animation.actions.run = this.animation.mixer.clipAction(
      this.resource.animations[2]
    )

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)
      this.animation.actions.current = newAction
    }
  }

  update() {
    // delta in millseconds but animation needs seconds
    if (this.animation.mixer)
      this.animation.mixer.update(this.time.delta * 0.001)
  }
}
