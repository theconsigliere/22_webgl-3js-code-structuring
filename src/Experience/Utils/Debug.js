import GUI from "lil-gui"

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug"

    if (this.active) this.setupDebug()
  }

  setupDebug() {
    this.gui = new GUI()
  }
}
