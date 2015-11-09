class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates_presence_of :username
  validates_uniqueness_of :username, :case_sensitive => false

  def win_perc
    if wins && losses
      if losses == 0
        0
      else
      (self.wins/self.losses)*100
      end
    end
  end
end
