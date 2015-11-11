class GameController < ApplicationController
  before_action :authenticate, only: [:index]

  def index
    @user = User.find(current_user.id)
  end

  def guest_game
  end

  def update_stats
    @user = User.find(current_user.id)
    @user.points = @user.points + params[:points].to_i
    if @user.high_score < params[:points].to_i
      @user.high_score = params[:points].to_i
    end
    if params[:wins].to_i == 1
      @user.wins = @user.wins + 1
    else
      @user.losses =  @user.losses + 1
    end
    @user.save
  end

  def authenticate
    redirect_to unauth_path unless current_user
  end
end
