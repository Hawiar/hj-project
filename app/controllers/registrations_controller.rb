class RegistrationsController < Devise::RegistrationsController

  puts "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"
  puts "I MADE IT TO THE WRONG PLACE!"
  puts "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"
  private
  def sign_up_params
    params.require(:user).permit(:username, :email, :password)
  end

  def account_update_params
    params.require(:user).permit(:username, :email, :password)
  end

  protected

  def after_sign_up_path_for(resource)
    'dashboard/index'
  end
end
