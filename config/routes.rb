Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get  "game/load",  to: "game#load"
      post "game/save",  to: "game#save"
      delete "game/reset", to: "game#reset"
    end
  end

  root "pages#index"
  get "*path", to: "pages#index", constraints: ->(req) { !req.path.start_with?("/api") }
end
