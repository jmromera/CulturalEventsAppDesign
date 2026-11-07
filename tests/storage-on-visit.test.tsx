import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";

describe("a visit without interaction", () => {
  it("stores nothing in the browser", () => {
    render(<MemoryRouter initialEntries={["/"]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
    expect(Object.keys(window.localStorage)).toEqual([]);
    expect(document.cookie).toBe("");
  });
});
