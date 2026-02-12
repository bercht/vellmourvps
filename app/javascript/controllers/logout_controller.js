import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { url: String }

  confirm(event) {
    event.preventDefault()
    
    Swal.fire({
      title: 'Sair do sistema?',
      text: 'Tem certeza que deseja fazer logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.performLogout()
      }
    })
  }

  performLogout() {
    // Criar um form temporário para fazer a requisição DELETE
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = this.urlValue
    
    // Adicionar o method spoofing para DELETE
    const methodInput = document.createElement('input')
    methodInput.type = 'hidden'
    methodInput.name = '_method'
    methodInput.value = 'delete'
    form.appendChild(methodInput)
    
    // Adicionar o CSRF token
    const csrfInput = document.createElement('input')
    csrfInput.type = 'hidden'
    csrfInput.name = 'authenticity_token'
    csrfInput.value = document.querySelector('meta[name="csrf-token"]').content
    form.appendChild(csrfInput)
    
    // Adicionar ao DOM e submeter
    document.body.appendChild(form)
    form.submit()
  }
}