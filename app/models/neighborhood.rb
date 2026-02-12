class Neighborhood < ApplicationRecord
  extend FriendlyId
  has_many :properties, dependent: :destroy

  friendly_id :name, use: :slugged
  
  validates :name, presence: true, uniqueness: true

  scope :alphabetical, -> { order(:name) }
  scope :by_name, -> { order(:name) }
  
  # RANSACK - Atributos permitidos para busca
  def self.ransackable_attributes(auth_object = nil)
    ["id", "name", "created_at", "updated_at"]
  end
  
  # RANSACK - Associações permitidas para busca
  def self.ransackable_associations(auth_object = nil)
    ["properties"]
  end
end