namespace :friendly_id do
  desc "Generate slugs for existing records"
  task generate_slugs: :environment do
    puts "Generating slugs for existing records..."
    
    # Gerar slugs para neighborhoods
    puts "Processing neighborhoods..."
    Neighborhood.find_each do |neighborhood|
      if neighborhood.slug.blank?
        neighborhood.slug = nil
        neighborhood.save!
        puts "Generated slug for neighborhood: #{neighborhood.name} -> #{neighborhood.slug}"
      end
    end
    
    # Gerar slugs para properties
    puts "Processing properties..."
    Property.find_each do |property|
      if property.slug.blank?
        property.slug = nil
        property.save!
        puts "Generated slug for property: #{property.title} -> #{property.slug}"
      end
    end
    
    puts "Slug generation completed!"
  end
  
  desc "Regenerate all slugs"
  task regenerate_slugs: :environment do
    puts "Regenerating all slugs..."
    
    # Regenerar slugs para neighborhoods
    puts "Regenerating neighborhoods..."
    Neighborhood.find_each do |neighborhood|
      neighborhood.slug = nil
      neighborhood.save!
      puts "Regenerated slug for neighborhood: #{neighborhood.name} -> #{neighborhood.slug}"
    end
    
    # Regenerar slugs para properties
    puts "Regenerating properties..."
    Property.find_each do |property|
      property.slug = nil
      property.save!
      puts "Regenerated slug for property: #{property.title} -> #{property.slug}"
    end
    
    puts "Slug regeneration completed!"
  end
end