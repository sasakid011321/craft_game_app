class Player < ApplicationRecord
  validates :uuid, presence: true, uniqueness: true

  def self.default_game_state
    {
      gold: 0,
      herbs: { herb: 0.0 },
      water: 999999,
      seeds_owned: ["herb"],
      fields: [
        { slot: 1, seed_type: "herb", unlocked: true }
      ],
      potions: {},
      upgrades: {
        harvest_speed_level: 0,
        extra_field_level: 0,
        auto_craft_slot_level: 0
      },
      auto_craft_slots: [],
      unlocked_recipes: ["recovery_potion"],
      game_clear: false,
      last_tick_at: Time.current.to_i * 1000
    }
  end
end
