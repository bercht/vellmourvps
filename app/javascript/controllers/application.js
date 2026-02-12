// app/javascript/controllers/application.js
import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Apenas para debug em desenvolvimento
application.debug = false
window.Stimulus = application

export { application }