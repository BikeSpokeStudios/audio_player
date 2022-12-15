defmodule AudioPlayerWeb.ErrorJSONTest do
  use AudioPlayerWeb.ConnCase, async: true

  test "renders 404" do
    assert AudioPlayerWeb.ErrorJSON.render("404.json", %{}) == %{errors: %{detail: "Not Found"}}
  end

  test "renders 500" do
    assert AudioPlayerWeb.ErrorJSON.render("500.json", %{}) ==
             %{errors: %{detail: "Internal Server Error"}}
  end
end
