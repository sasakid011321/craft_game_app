class CreatePlayers < ActiveRecord::Migration[7.0]
  def change
    create_table :players do |t|
      t.string :uuid, null: false, index: { unique: true }
      t.string :name, default: "Player"
      t.jsonb :game_state, null: false, default: {}
      t.datetime :last_saved_at
      t.timestamps
    end
  end
end
