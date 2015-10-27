class AddRecordsToUser < ActiveRecord::Migration
  def change
    add_column :users, :high_score, :integer
    add_column :users, :points, :integer
    add_column :users, :wins, :integer
    add_column :users, :losses, :integer
  end
end
