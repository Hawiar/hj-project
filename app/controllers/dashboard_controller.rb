class DashboardController < ApplicationController
  def leaderboard
  end

  def index
    @users = User.all
    .order("high_score desc")
    .first(10)
  end
end
