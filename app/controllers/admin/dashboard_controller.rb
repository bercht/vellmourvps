class Admin::DashboardController < Admin::BaseController
  layout 'admin'
  def index
    # Estatísticas para o dashboard
    @total_properties = Property.count
    @featured_properties = Property.where(featured: true).count
    @total_neighborhoods = Neighborhood.count
    @total_users = User.count
    
    # Últimos 5 imóveis cadastrados
    @recent_properties = Property.includes(:neighborhood, images_attachments: :blob)
                                .order(created_at: :desc)
                                .limit(5)
  end
end
