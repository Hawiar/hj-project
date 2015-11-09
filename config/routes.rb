Rails.application.routes.draw do


  devise_for :users, controllers: {registrations: "devise/registrations" }

  devise_scope :user do
    authenticated :user do
      root 'dashboard#index', as: :authenticated_root
    end

    unauthenticated do
      root 'welcome#index', as: :unauthenticated_root
    end
  end

  devise_for :admin_users, ActiveAdmin::Devise.config

  #resources :users

  ActiveAdmin.routes(self)


  post '/stats' => 'game#update_stats', as: "stats"
  get 'welcome/index' => 'welcome#index', as: "unauth"
  get 'dashboard/leaderboard'
  get 'game/index' => 'game#index', as: "game"
  get 'game/guest_game' => 'game#guest_game', as: "guest_game"
  get 'players/:id' => 'players#show', as: "player"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root
  root :to => 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
