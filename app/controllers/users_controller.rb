class UsersController < InheritedResources::Base

  def update_stats

  puts "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"
  puts "I MADE IT"
  puts "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"
    @user = current_user
    @user.points += params[:score]
    if @user.high_score < params[:score]
      @user.high_score = params[:score]
    end
    if params[:wins] == 1
      @user.wins += 1
    else
      @user.losses += 1
    end
  end


  private

    def user_params
      params.require(:user).permit(:email, :username, :password, :points, :high_score, :wins, :losses)
    end
end

