class CreateProperties < ActiveRecord::Migration[7.2]
  def change
    create_table :properties do |t|
      t.string :title
      t.decimal :price
      t.text :description
      t.references :neighborhood, null: false, foreign_key: true

      t.timestamps
    end
  end
end
