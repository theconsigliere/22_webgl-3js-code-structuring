import EventEmitter from "./EventEmitter"

export default class Sizes extends EventEmitter {
  constructor(parameters) {
    // constructor body
    super()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this.addEventListeners()
  }

  resize() {
    // resize body
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.emit("resize")
  }

  addEventListeners() {
    this.resizeEvent = this.resize.bind(this)
    // addEventListeners body
    window.addEventListener("resize", this.resizeEvent)
  }
  // methods
}
