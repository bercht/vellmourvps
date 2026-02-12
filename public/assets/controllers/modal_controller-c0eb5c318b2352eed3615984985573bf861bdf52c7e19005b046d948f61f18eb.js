// app/javascript/controllers/modal_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "backdrop", "image", "caption", "counter", "prevButton", "nextButton", "loadingSpinner"]
  static values = { 
    currentIndex: Number,
    images: Array
  }

  connect() {
    this.currentIndexValue = 0
    this.preloadedImages = new Map()
    console.log("✅ Modal controller conectado")
  }

  disconnect() {
    // Limpa recursos ao desconectar
    this.preloadedImages.clear()
  }

  open(event) {
    event.preventDefault()
    
    // Coleta todas as imagens do grupo
    const group = event.currentTarget.dataset.modalGroup || 'default'
    const allImages = document.querySelectorAll(`[data-modal-group="${group}"]`)
    
    this.imagesValue = Array.from(allImages).map((img, index) => ({
      src: img.href || img.dataset.modalSrc || img.querySelector('img')?.src,
      caption: img.dataset.modalCaption || img.dataset.title || '',
      index: index
    }))
    
    // Encontra o índice da imagem clicada
    this.currentIndexValue = Array.from(allImages).indexOf(event.currentTarget)
    
    // Pré-carrega imagens adjacentes
    this.preloadAdjacentImages()
    
    this.showImage()
    this.modalTarget.classList.remove("hidden")
    this.modalTarget.classList.add("flex")
    document.body.style.overflow = 'hidden'
    
    // Adiciona classe para animação de entrada
    requestAnimationFrame(() => {
      this.modalTarget.classList.add("modal-open")
    })
  }

  close(event) {
    if (event) event.preventDefault()
    
    // Animação de saída
    this.modalTarget.classList.remove("modal-open")
    
    setTimeout(() => {
      this.modalTarget.classList.add("hidden")
      this.modalTarget.classList.remove("flex")
      document.body.style.overflow = ''
    }, 300)
  }

  next(event) {
    event.preventDefault()
    event.stopPropagation()
    this.currentIndexValue = (this.currentIndexValue + 1) % this.imagesValue.length
    this.showImage()
    this.preloadAdjacentImages()
  }

  previous(event) {
    event.preventDefault()
    event.stopPropagation()
    this.currentIndexValue = (this.currentIndexValue - 1 + this.imagesValue.length) % this.imagesValue.length
    this.showImage()
    this.preloadAdjacentImages()
  }

  showImage() {
    const image = this.imagesValue[this.currentIndexValue]
    
    // Mostra loading
    if (this.hasLoadingSpinnerTarget) {
      this.loadingSpinnerTarget.classList.remove("hidden")
    }
    
    // Se a imagem já foi pré-carregada, usa ela
    if (this.preloadedImages.has(image.src)) {
      this.displayImage(this.preloadedImages.get(image.src), image)
    } else {
      // Carrega a imagem
      const img = new Image()
      img.onload = () => {
        this.preloadedImages.set(image.src, img)
        this.displayImage(img, image)
      }
      img.onerror = () => {
        console.error("Erro ao carregar imagem:", image.src)
        if (this.hasLoadingSpinnerTarget) {
          this.loadingSpinnerTarget.classList.add("hidden")
        }
      }
      img.src = image.src
    }
    
    // Atualiza caption e contador
    if (this.hasCaptionTarget) {
      this.captionTarget.textContent = image.caption
    }
    
    if (this.hasCounterTarget) {
      this.counterTarget.textContent = `${this.currentIndexValue + 1} / ${this.imagesValue.length}`
    }
    
    // Gerencia visibilidade dos botões de navegação
    const hasMultipleImages = this.imagesValue.length > 1
    if (this.hasPrevButtonTarget) {
      this.prevButtonTarget.classList.toggle("invisible", !hasMultipleImages)
    }
    if (this.hasNextButtonTarget) {
      this.nextButtonTarget.classList.toggle("invisible", !hasMultipleImages)
    }
  }

  displayImage(img, imageData) {
    this.imageTarget.src = img.src
    this.imageTarget.alt = imageData.caption || ''
    
    // Esconde loading
    if (this.hasLoadingSpinnerTarget) {
      this.loadingSpinnerTarget.classList.add("hidden")
    }
  }

  preloadAdjacentImages() {
    // Pré-carrega a próxima e a anterior imagem
    const nextIndex = (this.currentIndexValue + 1) % this.imagesValue.length
    const prevIndex = (this.currentIndexValue - 1 + this.imagesValue.length) % this.imagesValue.length
    
    [nextIndex, prevIndex].forEach(index => {
      const image = this.imagesValue[index]
      if (image && !this.preloadedImages.has(image.src)) {
        const img = new Image()
        img.onload = () => {
          this.preloadedImages.set(image.src, img)
        }
        img.src = image.src
      }
    })
  }

  handleKeydown(event) {
    // Só responde se o modal estiver aberto
    if (this.modalTarget.classList.contains("hidden")) return
    
    switch(event.key) {
      case 'Escape':
        this.close()
        break
      case 'ArrowRight':
        if (this.imagesValue.length > 1) {
          this.next(event)
        }
        break
      case 'ArrowLeft':
        if (this.imagesValue.length > 1) {
          this.previous(event)
        }
        break
    }
  }

  backdropClick(event) {
    // Fecha apenas se clicar no backdrop, não nos elementos filhos
    if (event.target === this.backdropTarget || event.target === this.modalTarget) {
      this.close()
    }
  }

  // Touch support para mobile
  touchStart(event) {
    this.touchStartX = event.touches[0].clientX
    this.touchStartY = event.touches[0].clientY
  }

  touchEnd(event) {
    if (!this.touchStartX) return
    
    const touchEndX = event.changedTouches[0].clientX
    const touchEndY = event.changedTouches[0].clientY
    
    const diffX = this.touchStartX - touchEndX
    const diffY = this.touchStartY - touchEndY
    
    // Se o movimento horizontal for maior que o vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50 && this.imagesValue.length > 1) {
        // Swipe left - próxima imagem
        this.next(event)
      } else if (diffX < -50 && this.imagesValue.length > 1) {
        // Swipe right - imagem anterior
        this.previous(event)
      }
    }
    
    this.touchStartX = null
    this.touchStartY = null
  }
};
