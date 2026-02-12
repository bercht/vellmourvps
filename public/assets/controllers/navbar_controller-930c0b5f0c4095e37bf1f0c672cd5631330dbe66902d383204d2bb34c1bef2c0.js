// app/javascript/controllers/navbar_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "hamburger", "closeIcon"]

  connect() {
    console.log("Navbar controller connected")
    // Garantir que o menu está fechado no início
    this.close()
  }

  toggle() {
    console.log("Toggle menu called")
    
    if (this.menuTarget.classList.contains("hidden")) {
      this.open()
    } else {
      this.close()
    }
  }

  open() {
    console.log("Opening menu")
    
    // Mostrar menu
    this.menuTarget.classList.remove("hidden")
    
    // Trocar ícones
    this.hamburgerTarget.classList.add("hidden")
    this.hamburgerTarget.classList.remove("block")
    
    this.closeIconTarget.classList.remove("hidden")
    this.closeIconTarget.classList.add("block")
  }

  close() {
    console.log("Closing menu")
    
    // Esconder menu
    this.menuTarget.classList.add("hidden")
    
    // Trocar ícones
    this.hamburgerTarget.classList.remove("hidden")
    this.hamburgerTarget.classList.add("block")
    
    this.closeIconTarget.classList.add("hidden")
    this.closeIconTarget.classList.remove("block")
  }

  // Fechar menu quando clicar fora (opcional)
  disconnect() {
    document.removeEventListener('click', this.handleClickOutside.bind(this))
  }

  // Método para fechar quando clicar fora
  handleClickOutside(event) {
    if (!this.element.contains(event.target) && !this.menuTarget.classList.contains("hidden")) {
      this.close()
    }
  }
};
