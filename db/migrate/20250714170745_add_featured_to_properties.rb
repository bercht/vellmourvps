class AddFeaturedToProperties < ActiveRecord::Migration[7.2]
  def change
    add_column :properties, :featured, :boolean, default: false, null: false
  end
end
