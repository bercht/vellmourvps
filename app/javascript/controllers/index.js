// app/javascript/controllers/index.js
import { application } from "./application"

// Registrar controllers manualmente (sem stimulus-loading)
import NavbarController from "./navbar_controller"
import DropdownController from "./dropdown_controller"
import ConfirmDeleteController from "./confirm_delete_controller"
import LogoutController from "./logout_controller"
import MobileMenuController from "./mobile_menu_controller"
import ImagePreviewController from "./image_preview_controller"
import FlashController from "./flash_controller"
import SweetalertController from "./sweetalert_controller"
import HelloController from "./hello_controller"
import SpotlightController from "./spotlight_controller"

application.register("navbar", NavbarController)
application.register("dropdown", DropdownController)
application.register("confirm-delete", ConfirmDeleteController)
application.register("logout", LogoutController)
application.register("mobile-menu", MobileMenuController)
application.register("image-preview", ImagePreviewController)
application.register("flash", FlashController)
application.register("sweetalert", SweetalertController)
application.register("hello", HelloController)
application.register("spotlight", SpotlightController)