# # config/initializers/content_security_policy.rb
# Rails.application.config.content_security_policy do |policy|
#   policy.default_src :self, :https
#   policy.font_src :self, :https, :data
#   policy.img_src :self, :https, :data
#   policy.object_src :none
#   policy.script_src :self, :https
#   policy.style_src :self, :https, :unsafe_inline  # Necessário para Turbo
#   policy.connect_src :self, :https
#   policy.frame_src :self, :data  # Necessário para es-module-shims
#   policy.frame_ancestors :none
# end

# # Configuração de nonce para produção
# if Rails.env.production?
#   Rails.application.config.content_security_policy_nonce_generator = -> (request) { 
#     request.session[:nonce] ||= SecureRandom.base64(16)
#   }
#   Rails.application.config.content_security_policy_nonce_directives = %w(script-src)
# end