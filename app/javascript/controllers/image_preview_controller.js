// app/javascript/controllers/image_preview_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "preview"]

  connect() {
    console.log("Image preview controller connected")
  }

  preview() {
    const files = this.inputTarget.files
    this.previewTarget.innerHTML = ""

    if (files.length === 0) {
      return
    }

    // Criar header com informações
    const header = document.createElement("div")
    header.className = "flex items-center justify-between mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    header.innerHTML = `
      <div>
        <h3 class="text-sm font-semibold text-blue-900 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Imagens Selecionadas
        </h3>
        <p class="text-sm text-blue-700">
          ${files.length} arquivo${files.length > 1 ? 's' : ''} selecionado${files.length > 1 ? 's' : ''}
          • <span class="font-medium">Clique no ✕ vermelho para remover</span>
        </p>
      </div>
      <button type="button" 
              class="px-3 py-1 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md font-medium transition-colors"
              data-action="click->image-preview#clearPreviews">
        🗑️ Limpar Todas
      </button>
    `
    this.previewTarget.appendChild(header)

    // Criar container para as miniaturas
    const container = document.createElement("div")
    container.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          const imageContainer = this.createImagePreview(e.target.result, file.name, index, file.size)
          container.appendChild(imageContainer)
        }
        
        reader.readAsDataURL(file)
      }
    })

    this.previewTarget.appendChild(container)
  }

  createImagePreview(src, fileName, index, fileSize) {
    const container = document.createElement("div")
    container.className = "relative group"
    container.dataset.index = index

    const fileSizeKB = (fileSize / 1024).toFixed(1)
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2)
    const displaySize = fileSize > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`

    container.innerHTML = `
      <!-- Miniatura da imagem -->
      <div class="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200 shadow-md border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200">
        <img src="${src}" alt="${fileName}" class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200">
        
        <!-- Overlay escuro no hover -->
        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
      </div>

      <!-- Botão de Remoção - MAIS DESTACADO -->
      <button type="button" 
              class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-200 z-20 flex items-center justify-center group/btn"
              data-action="click->image-preview#removeImage"
              data-index="${index}"
              title="Remover esta imagem">
        <svg class="h-4 w-4 group-hover/btn:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Badge de índice -->
      <div class="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md z-10">
        ${index + 1}
      </div>

      <!-- Informações do arquivo -->
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-3 rounded-b-lg">
        <div class="text-xs font-medium truncate mb-1">${fileName}</div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-gray-300">${displaySize}</span>
          <span class="px-2 py-0.5 bg-green-600 rounded-full text-xs font-medium">
            ✓ OK
          </span>
        </div>
      </div>

      <!-- Tooltip no hover -->
      <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
        Clique no ✕ para remover
      </div>
    `

    return container
  }

  removeImage(event) {
    event.preventDefault()
    event.stopPropagation()
    
    const index = parseInt(event.currentTarget.dataset.index)
    const input = this.inputTarget
    const files = Array.from(input.files)
    
    // Animação de saída (opcional)
    const container = event.currentTarget.closest('[data-index]')
    container.style.transform = 'scale(0.8)'
    container.style.opacity = '0.5'
    
    setTimeout(() => {
      // Remover arquivo do array
      files.splice(index, 1)
      
      // Criar novo FileList
      const dataTransfer = new DataTransfer()
      files.forEach(file => dataTransfer.items.add(file))
      input.files = dataTransfer.files
      
      // Atualizar preview
      this.preview()
    }, 200)
  }

  clearPreviews() {
    // Animação de saída para todas as imagens
    const previews = this.previewTarget.querySelectorAll('[data-index]')
    previews.forEach((preview, index) => {
      setTimeout(() => {
        preview.style.transform = 'scale(0.8)'
        preview.style.opacity = '0'
      }, index * 50)
    })
    
    setTimeout(() => {
      this.previewTarget.innerHTML = ""
      this.inputTarget.value = ""
    }, previews.length * 50 + 200)
  }
}