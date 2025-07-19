import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DateSquare } from "./activity-table";

describe("Data Square", () => {
  it("shows success", () => {
    render(
      <DateSquare
        assignedKey="2025#03#tennis"
        day={1}
        isChecked={true}
        name="test"
      />
    );
    screen.getByRole("checkbox");
  });
  it.todo("shows no success");
  it.todo("shows day");
});

describe("Month Selector", () => {
  it.todo("shows the correct month");
  it.todo("performs correct query on month change");
});

describe("Year Selector", () => {
  it.todo("shows the correct Year");
  it.todo("performs correct query on year change");
});

describe("Table Display", () => {
  it.todo("Handles empty");
  it.todo("One row");
  it.todo("Many rows");
});
