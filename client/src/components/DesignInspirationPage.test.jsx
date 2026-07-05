import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import DesignInspirationPage from "./DesignInspirationPage";

describe("DesignInspirationPage", () => {
  test("renders the checked Ama's Kitchen design inspiration shortlist", () => {
    render(<DesignInspirationPage />);

    expect(screen.getByRole("heading", { name: /focused visual direction/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /six ideas to guide the next design pass/i })).toBeVisible();
    expect(screen.getByText("Warm Accra-home palette")).toBeVisible();
    expect(screen.getByText("Delivery-first ordering")).toBeVisible();
    expect(screen.getByText(/checked against current homepage/i)).toBeVisible();
  });
});
