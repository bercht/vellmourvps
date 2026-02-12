class Admin::Properties::ImagesController < Admin::BaseController
  include ActionView::RecordIdentifier
  
  before_action :set_property
  before_action :set_image

  def destroy
    Rails.logger.debug "=== REMOVENDO IMAGEM ==="
    Rails.logger.debug "Property ID: #{@property.id}"
    Rails.logger.debug "Image ID: #{params[:id]}"
    Rails.logger.debug "Image exists: #{@image.present?}"
    
    @image.purge_later
    
    respond_to do |format|
      format.html { 
        redirect_to edit_admin_property_path(@property), 
        notice: 'Imagem removida com sucesso!' 
      }
      format.turbo_stream { 
        render turbo_stream: turbo_stream.remove(dom_id(@image, :container)) 
      }
    end
  end

  private

  def set_property
    @property = Property.friendly.find(params[:property_id])
  end

  def set_image
    @image = @property.images.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to edit_admin_property_path(@property), 
    alert: 'Imagem não encontrada.'
  end
end