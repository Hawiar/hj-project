class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates_presence_of :username
  validates_uniqueness_of :username, :case_sensitive => false

  def win_perc
    if wins == 0 && losses == 0
      0
    elsif losses == 0
      100
    else
      (wins.to_f/(losses.to_f + wins.to_f))*100
    end
  end
end
