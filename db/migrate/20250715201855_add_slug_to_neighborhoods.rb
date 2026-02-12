class AddSlugToNeighborhoods < ActiveRecord::Migration[7.2]
  def change
    add_column :neighborhoods, :slug, :string
    add_index :neighborhoods, :slug
  end
end
