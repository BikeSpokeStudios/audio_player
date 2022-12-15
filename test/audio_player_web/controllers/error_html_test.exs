defmodule AudioPlayerWeb.ErrorHTMLTest do
  use AudioPlayerWeb.ConnCase, async: true

  # Bring render_to_string/3 for testing custom views
  import Phoenix.Template

  test "renders 404.html" do
    assert render_to_string(AudioPlayerWeb.ErrorHTML, "404", "html", []) == "Not Found"
  end

  test "renders 500.html" do
    assert render_to_string(AudioPlayerWeb.ErrorHTML, "500", "html", []) == "Internal Server Error"
  end
end
