import EventEmitter from "./EventEmitter"

export default class Time extends EventEmitter {
  constructor() {
    super()

    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    // needs to be a number rather than 0, normally ends up being 16 when running at 60fps
    this.delta = 16

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.emit("tick")

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
