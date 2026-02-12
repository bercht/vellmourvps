class AddSlugToProperties < ActiveRecord::Migration[7.2]
  def change
    add_column :properties, :slug, :string
    add_index :properties, :slug, unique: true
  end
end

# db/migrate/YYYYMMDDHHMMSS_add_slug_to_neighborhoods.rb
class AddSlugToNeighborhoods < ActiveRecord::Migration[7.2]
  def change
    add_column :neighborhoods, :slug, :string
    add_index :neighborhoods, :slug, unique: true
  end
end

# db/migrate/YYYYMMDDHHMMSS_create_friendly_id_slugs.rb
class CreateFriendlyIdSlugs < ActiveRecord::Migration[7.2]
  def change
    create_table :friendly_id_slugs do |t|
      t.string   :slug,           :null => false
      t.integer  :sluggable_id,   :null => false
      t.string   :sluggable_type, :limit => 50
      t.string   :scope
      t.datetime :created_at
    end
    add_index :friendly_id_slugs, [:sluggable_id, :sluggable_type]
    add_index :friendly_id_slugs, [:slug, :sluggable_type], :length => {:slug => 140, :sluggable_type => 50}
    add_index :friendly_id_slugs, [:slug, :sluggable_type, :scope], :length => {:slug => 70, :sluggable_type => 50, :scope => 70}, :unique => true
  end
end