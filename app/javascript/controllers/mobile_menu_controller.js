import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mobileMenu", "openButton", "closeButton"]

  connect() {
    // Esconder menu mobile por padrão
    this.hideMobileMenu()
  }

  toggle() {
    if (this.mobileMenuTarget.classList.contains("hidden")) {
      this.showMobileMenu()
    } else {
      this.hideMobileMenu()
    }
  }

  showMobileMenu() {
    this.mobileMenuTarget.classList.remove("hidden")
    document.body.style.overflow = "hidden" // Prevenir scroll
  }

  hideMobileMenu() {
    this.mobileMenuTarget.classList.add("hidden")
    document.body.style.overflow = "auto" // Restaurar scroll
  }

  // Fechar menu ao clicar fora
  clickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.hideMobileMenu()
    }
  }
}