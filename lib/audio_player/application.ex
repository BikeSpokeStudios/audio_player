defmodule AudioPlayer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      AudioPlayerWeb.Telemetry,
      # Start the Ecto repository
      AudioPlayer.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: AudioPlayer.PubSub},
      # Start Finch
      {Finch, name: AudioPlayer.Finch},
      # Start the Endpoint (http/https)
      AudioPlayerWeb.Endpoint
      # Start a worker by calling: AudioPlayer.Worker.start_link(arg)
      # {AudioPlayer.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: AudioPlayer.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    AudioPlayerWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
