// app/javascript/controllers/alert_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    message: String, 
    type: String,
    duration: Number,
    position: String,
    showProgress: Boolean
  }

  connect() {
    // Define valores padrão
    this.position = this.positionValue || 'top-right'
    this.duration = this.durationValue || 4000
    this.showProgress = this.hasShowProgressValue ? this.showProgressValue : true
    
    this.show()
  }

  disconnect() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
    }
  }

  show() {
    // Cria o elemento do alerta
    const alert = this.createAlertElement()
    
    // Adiciona ao container ou cria um novo
    const container = this.getOrCreateContainer()
    container.appendChild(alert)
    
    // Armazena referência ao alerta
    this.alertElement = alert
    
    // Anima entrada
    requestAnimationFrame(() => {
      alert.classList.add('alert-show')
    })
    
    // Auto-remove após duração especificada
    if (this.duration > 0) {
      this.startAutoClose()
    }
    
    // Inicia animação da barra de progresso
    if (this.showProgress && this.duration > 0) {
      this.startProgressBar()
    }
  }

  close(event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    if (!this.alertElement) return
    
    // Para timers
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
    }
    
    // Anima saída
    this.alertElement.classList.remove('alert-show')
    this.alertElement.classList.add('alert-hide')
    
    // Remove do DOM após animação
    setTimeout(() => {
      if (this.alertElement && this.alertElement.parentElement) {
        this.alertElement.remove()
      }
      this.element.remove()
      
      // Remove container se vazio
      const container = document.querySelector('.alerts-container')
      if (container && container.children.length === 0) {
        container.remove()
      }
    }, 300)
  }

  createAlertElement() {
    const alert = document.createElement('div')
    alert.className = this.getAlertClasses()
    alert.innerHTML = this.getAlertContent()
    
    // Adiciona event listeners
    const closeButton = alert.querySelector('[data-alert-close]')
    if (closeButton) {
      closeButton.addEventListener('click', (e) => this.close(e))
    }
    
    // Pausa auto-close ao hover
    alert.addEventListener('mouseenter', () => this.pauseAutoClose())
    alert.addEventListener('mouseleave', () => this.resumeAutoClose())
    
    return alert
  }

  getOrCreateContainer() {
    let container = document.querySelector('.alerts-container')
    
    if (!container) {
      container = document.createElement('div')
      container.className = `alerts-container fixed z-50 ${this.getPositionClasses()}`
      document.body.appendChild(container)
    }
    
    return container
  }

  getPositionClasses() {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
    }
    
    return positions[this.position] || positions['top-right']
  }

  getAlertClasses() {
    const baseClasses = 'alert-box relative p-4 mb-3 rounded-lg shadow-lg transform transition-all duration-300 flex items-start space-x-3 max-w-sm'
    
    const typeClasses = {
      success: 'bg-green-100 text-green-800 border border-green-200',
      error: 'bg-red-100 text-red-800 border border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border border-blue-200'
    }
    
    return `${baseClasses} ${typeClasses[this.typeValue] || typeClasses.info}`
  }

  getAlertContent() {
    const icons = {
      success: `<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>`,
      error: `<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
      </svg>`,
      warning: `<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>`,
      info: `<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
      </svg>`
    }
    
    const progressBar = this.showProgress && this.duration > 0 ? `
      <div class="alert-progress absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b-lg overflow-hidden">
        <div class="alert-progress-bar h-full bg-current opacity-60 transition-all duration-100" style="width: 100%"></div>
      </div>
    ` : ''
    
    return `
      ${icons[this.typeValue] || icons.info}
      <span class="flex-1 text-sm">${this.escapeHtml(this.messageValue)}</span>
      <button data-alert-close class="flex-shrink-0 ml-2 hover:opacity-75 focus:outline-none focus:opacity-75">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
      ${progressBar}
    `
  }

  startAutoClose() {
    this.timeout = setTimeout(() => {
      this.close()
    }, this.duration)
    
    this.remainingTime = this.duration
  }

  pauseAutoClose() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (this.progressInterva;
