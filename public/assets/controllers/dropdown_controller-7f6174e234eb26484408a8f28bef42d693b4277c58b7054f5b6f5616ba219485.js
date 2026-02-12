// app/javascript/controllers/dropdown_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dropdownContent", "openButton", "closeButton"]
  static values = { open: Boolean }

  connect() {
    if (this.openValue) {
      this.openDropdown()
    } else {
      this.closeDropdown()
    }
  }

  toggleDropdown() {
    if (this.dropdownContentTarget.hidden == true) {
      this.openDropdown()
    } else {
      this.closeDropdown()
    }
  }

  openDropdown() {
    this.dropdownContentTarget.hidden = false
    this.openButtonTarget.hidden = true
    this.closeButtonTarget.hidden = false
  }

  closeDropdown() {
    this.dropdownContentTarget.hidden = true
    this.openButtonTarget.hidden = false
    this.closeButtonTarget.hidden = true
  }
};
