puts "🌱 Iniciando seeds..."

# Admin opcional via ENV (seguro para produção)
admin_email = ENV["ADMIN_EMAIL"]
admin_password = ENV["ADMIN_PASSWORD"]
if admin_email && admin_password
  puts "👤 Criando usuário administrador..."
  admin = User.find_or_create_by!(email: admin_email) do |user|
    user.password = admin_password
    user.password_confirmation = admin_password
  end
  puts "✅ Usuário criado: #{admin.email}"
end

# Evita seed de dados de exemplo em produção, a menos que explicitamente habilitado
if Rails.env.production? && ENV["SEED_SAMPLE_DATA"] != "1"
  puts "ℹ️  Seeds de exemplo desativados em produção (SEED_SAMPLE_DATA=1 para habilitar)"
  exit 0
end

# Criar bairros base (se não existirem)
puts "🏘️ Criando bairros..."
neighborhood_names = [
  "Centro",
  "Copacabana",
  "Ipanema",
  "Leblon",
  "Botafogo",
  "Flamengo",
  "Tijuca",
  "Barra da Tijuca"
]

neighborhood_names.each do |name|
  Neighborhood.find_or_create_by!(name: name)
end

puts "✅ #{Neighborhood.count} bairros criados"

# Criar propriedades de exemplo
puts "🏠 Criando propriedades de exemplo..."

descriptions = [
  'Imóvel com excelente localização, próximo ao comércio e transporte público. Acabamento de primeira qualidade.',
  'Propriedade ampla e bem iluminada, com vista panorâmica. Ideal para famílias.',
  'Imóvel moderno com design contemporâneo. Pronto para morar.',
  'Excelente oportunidade de investimento. Região em valorização.',
  'Propriedade única com características especiais. Não perca esta chance!'
]

neighborhoods = Neighborhood.all
if neighborhoods.empty?
  puts "⚠️ Nenhum bairro encontrado. Pulando criação de propriedades."
  exit 0
end

20.times do |i|
  neighborhood = neighborhoods.sample
  
  property = Property.create!(
    title: "#{"Casa em"} #{i + 1} - #{neighborhood.name}",
    price: rand(300_000..2_000_000),
    description: descriptions.sample,
    neighborhood: neighborhood,
    featured: 0,
    bedrooms: rand(1..5),
    bathrooms: rand(1..4),
    area_m2: rand(50..300),
    garage_spaces: rand(0..3),
    property_type: "casa",
    furnished: [true, false].sample,
    created_at: rand(30.days.ago..Time.current)
  )
  
  puts "✅ Propriedade criada: #{property.title}"
end

puts "🎉 Seeds executados com sucesso!"
puts "📊 Estatísticas:"
puts "   - Usuários: #{User.count}"
puts "   - Bairros: #{Neighborhood.count}"
puts "   - Imóveis: #{Property.count}"
puts "   - Imóveis em destaque: #{Property.where(featured: true).count}"





