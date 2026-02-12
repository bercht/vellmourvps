class Admin::BaseController < ApplicationController
  layout 'admin'
  before_action :authenticate_user!
  
  private
  
  def authenticate_user!
    unless user_signed_in?
      redirect_to new_user_session_path, alert: 'Você precisa estar logado para acessar esta área.'
    end
  end
end

