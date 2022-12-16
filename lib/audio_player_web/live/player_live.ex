defmodule AudioPlayerWeb.PlayerLive do
  use AudioPlayerWeb, :live_view

  def mount(_params, _session, socket) do

    socket =
      socket
      |> assign(
        volume: 1.0,
        saved: 1.0,
        playing: false
      )

    {:ok, socket}
  end

  def handle_event("unmute", _, socket) do
    socket = assign(socket, volume: socket.assigns.saved)
    {:noreply, socket}
  end

  def handle_event("mute", _, socket) do
    saved = socket.assigns.volume
    socket = assign(socket, volume: 0.0, saved: saved)
    {:noreply, socket}
  end

  def handle_event("down", _, socket) do
    volume = Enum.max([socket.assigns.volume - 0.1, 0.0])
    socket = assign(socket, volume: volume, saved: volume)
    {:noreply, socket}
  end

  def handle_event("up", _, socket) do
    volume = Enum.min([socket.assigns.volume + 0.1, 1.0])
    js_adjust_volume(volume)
    socket = assign(socket, volume: volume, saved: volume)
    {:noreply, socket}
  end

  def handle_event("play_pause", _, socket) do
    %{playing: playing} = socket.assigns
    js_play_pause()

    cond do
      playing ->
        {:noreply, assign(socket, playing: false)}

      !playing ->
        {:noreply, assign(socket, playing: true)}

      true ->
        {:noreply, socket}
    end
  end

  defp js_play_pause() do
    JS.push("play_pause")
    |> JS.dispatch("js:play_pause", to: "#audio-player")
  end

  defp js_adjust_volume(volume) do

  end

  def render(assigns) do
    ~H"""
    <h1>Audio Player</h1>
    <div id="audio-player" phx-hook="AudioPlayer" class="w-full" role="region" aria-label="Player">
      <div id="audio-ignore" phx-update="ignore">
        <audio></audio>
      </div>
      <!-- play/pause -->
        <button
            type="button"
            class="mx-auto scale-75"
            phx-click={js_play_pause()}
            aria-label={
              if @playing do
                "Pause"
              else
                "Play"
              end
            }
          >
            <%= if @playing do %>
              <svg id="player-pause" width="50" height="50" fill="none">
                <circle
                  class="text-gray-300 dark:text-gray-500"
                  cx="25"
                  cy="25"
                  r="24"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path d="M18 16h4v18h-4V16zM28 16h4v18h-4z" fill="currentColor" />
              </svg>
            <% else %>
              <svg
                id="player-play"
                width="50"
                height="50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  id="svg_1"
                  stroke-width="0.8"
                  stroke="currentColor"
                  r="11.4"
                  cy="12"
                  cx="12"
                  class="text-gray-300 dark:text-gray-500"
                />
                <path
                  stroke="null"
                  fill="currentColor"
                  transform="rotate(90 12.8947 12.3097)"
                  id="svg_6"
                  d="m9.40275,15.10014l3.49194,-5.58088l3.49197,5.58088l-6.98391,0z"
                  stroke-width="1.5"
                  fill="none"
                />
              </svg>
            <% end %>
          </button>
          <!-- /play/pause -->
    </div>
    <div class="meter">
      <span style={"width: #{Float.round(@volume * 100, 1)}%"}>
        <%= round(@volume * 100) / 100 %>
      </span>
    </div>
    <button phx-click="mute">
      Mute
    </button>

    <button phx-click="unmute">
      Unmute
    </button>
    <button phx-click="down">
      Down
    </button>

    <button phx-click="up">
      Up
    </button>
    """
  end

end
