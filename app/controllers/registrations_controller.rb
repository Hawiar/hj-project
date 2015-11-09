class RegistrationsController < Devise::RegistrationsController

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
