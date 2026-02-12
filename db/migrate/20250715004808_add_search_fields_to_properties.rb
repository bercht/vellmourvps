class AddSearchFieldsToProperties < ActiveRecord::Migration[7.2]
  def change
    add_column :properties, :bedrooms, :integer
    add_column :properties, :bathrooms, :integer
    add_column :properties, :area_m2, :decimal
    add_column :properties, :garage_spaces, :integer
    add_column :properties, :property_type, :string
    add_column :properties, :furnished, :boolean
  end
end
