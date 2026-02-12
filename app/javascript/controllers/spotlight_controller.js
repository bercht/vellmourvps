// app/javascript/controllers/spotlight_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mainImage", "mainImageLink", "thumb"]
  static values = { 
    group: String,
    title: String
  }

  connect() {
    console.log("🔍 Spotlight Controller conectado")
    
    // Aguarda um pouco para garantir que o Spotlight.js está carregado
    setTimeout(() => {
      this.initializeSpotlight()
    }, 100)
  }

  disconnect() {
    console.log("🔍 Spotlight Controller desconectado")
    
    // Limpa os event listeners do Spotlight
    if (typeof Spotlight !== 'undefined') {
      try {
        Spotlight.destroy()
      } catch (e) {
        console.log("Spotlight já foi destruído ou não existe")
      }
    }
  }

  initializeSpotlight() {
    if (typeof Spotlight === 'undefined') {
      console.warn("⚠️ Spotlight.js não está carregado ainda, tentando novamente...")
      setTimeout(() => this.initializeSpotlight(), 200)
      return
    }

    try {
      // Inicializa o Spotlight
      Spotlight.init({
        fit: 'contain',
        animation: 'slide',
        theme: 'dark',
        control: ['zoom', 'rotate', 'close'],
        keyboard: true,
        spinner: true,
        title: true,
        description: false,
        counter: true,
        progress: true,
        autohide: true,
        infinite: true
      })

      // Define primeira thumbnail como ativa
      this.setActiveThumb(0)
      
      console.log("✅ Spotlight inicializado com sucesso")
      
    } catch (error) {
      console.error("❌ Erro ao inicializar Spotlight:", error)
    }
  }

  // Método chamado quando uma thumbnail é clicada
  changeMainImage(event) {
    event.preventDefault()
    
    const clickedThumb = event.currentTarget
    const newImageUrl = clickedThumb.dataset.imageUrl
    const newTitle = clickedThumb.dataset.title
    
    // Atualiza a imagem principal
    if (this.hasMainImageTarget) {
      this.mainImageTarget.src = newImageUrl
    }
    
    // Atualiza o link da imagem principal para o spotlight
    if (this.hasMainImageLinkTarget) {
      this.mainImageLinkTarget.href = newImageUrl
      this.mainImageLinkTarget.dataset.title = newTitle
    }
    
    // Atualiza a thumbnail ativa
    const thumbIndex = Array.from(this.thumbTargets).indexOf(clickedThumb)
    this.setActiveThumb(thumbIndex)
  }

  // Define qual thumbnail está ativa
  setActiveThumb(activeIndex) {
    this.thumbTargets.forEach((thumb, index) => {
      const ring = thumb.querySelector('span:last-child')
      if (ring) {
        if (index === activeIndex) {
          ring.classList.add('ring-indigo-500')
        } else {
          ring.classList.remove('ring-indigo-500')
        }
      }
    })
  }
}