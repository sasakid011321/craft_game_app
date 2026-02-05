module Api
  module V1
    class GameController < ApplicationController
      skip_before_action :verify_authenticity_token

      def load
        player = Player.find_or_create_by!(uuid: params[:uuid]) do |p|
          p.game_state = Player.default_game_state
        end
        render json: { game_state: player.game_state, last_saved_at: player.last_saved_at }
      end

      def save
        player = Player.find_or_create_by!(uuid: params[:uuid])
        game_state = params[:game_state].is_a?(ActionController::Parameters) ? params[:game_state].permit!.to_h : params[:game_state]
        player.update!(game_state: game_state, last_saved_at: Time.current)
        render json: { success: true, last_saved_at: player.last_saved_at }
      end

      def reset
        player = Player.find_by(uuid: params[:uuid])
        player&.update!(game_state: Player.default_game_state, last_saved_at: Time.current)
        render json: { success: true }
      end
    end
  end
end
