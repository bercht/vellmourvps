import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    message: String, 
    type: String,
    timer: Number 
  }

  connect() {
    // Aguarda um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      this.show()
    }, 100)
  }

  show() {
    // Verifica se Swal está disponível
    if (typeof Swal === 'undefined') {
      console.error('SweetAlert2 não está carregado')
      return
    }

    const config = {
      text: this.messageValue,
      icon: this.typeValue || 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: this.timerValue || 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    }

    Swal.fire(config)
  }
}