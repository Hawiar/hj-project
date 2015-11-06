class GameController < ApplicationController
  before_action :authenticate, only: [:index]

  def index
  end

  def guest_game
  end

  def authenticate
    redirect_to unauth_path unless current_user
  end
end
