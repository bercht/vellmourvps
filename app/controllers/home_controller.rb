class HomeController < ApplicationController
  def index
    @featured_properties = Property.featured
                                  .includes(:neighborhood)
                                  .order(created_at: :desc)
    
    # Se não tiver 3 imóveis em destaque, completar com os mais recentes
    if @featured_properties.count < 4
      recent_properties = Property.includes(:neighborhood)
                                 .where.not(id: @featured_properties.pluck(:id))
                                 .order(created_at: :desc)
                                 .limit(4 - @featured_properties.count)
      @featured_properties = (@featured_properties + recent_properties).first(4)
    end
    
    @neighborhoods = Neighborhood.all
  end
end