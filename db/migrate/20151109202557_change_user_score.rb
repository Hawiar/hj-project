class ChangeUserScore < ActiveRecord::Migration
  def change
    change_column :users, :points, :integer, :default => 0
    change_column :users, :high_score, :integer, :default => 0
    change_column :users, :wins, :integer, :default => 0
    change_column :users, :losses, :integer, :default => 0
  end
end
