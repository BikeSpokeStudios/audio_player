defmodule AudioPlayer.Repo do
  use Ecto.Repo,
    otp_app: :audio_player,
    adapter: Ecto.Adapters.Postgres
end
