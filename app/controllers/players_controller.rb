class PlayersController < ApplicationController
  before_action :authenticate

  def show
  end

  def authenticate
    redirect_to unauth_path unless current_user
  end
end
