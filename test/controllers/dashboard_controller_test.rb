require 'test_helper'

class DashboardControllerTest < ActionController::TestCase
  test "should get leaderboard" do
    get :leaderboard
    assert_response :success
  end

end
