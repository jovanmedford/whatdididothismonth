import { render, screen } from "@testing-library/react";
import ProgressGrid from "./progress-grid";
import { Activity } from "@/app/_types/types";
import userEvent from "@testing-library/user-event";

describe("Progress grid", () => {
  it("renders a grid with 7 squares", () => {
    render(<ProgressGrid activity={activity} numOfDays={7}></ProgressGrid>);
    let checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.length === 7).toBe(true);
    expect(checkboxes.every((box) => !box.checked)).toBe(true);
  });

  it("can preset two squares active", () => {
    render(
      <ProgressGrid
        activity={activity}
        numOfDays={7}
        successes={[1, 2]}
      ></ProgressGrid>
    );
    let checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.filter((box) => box.checked).length).toEqual(2);
  });

  it("fires toggle on active square", async () => {
    const user = userEvent
    const handleToggle = jest.fn()
    render(
      <ProgressGrid
        activity={activity}
        numOfDays={7}
        successes={[1, 2]}
        onToggleSuccess={handleToggle}
      ></ProgressGrid>
    );

    let checkbox = screen.getAllByRole("checkbox", {checked: true})[1]
    await user.click(checkbox)
    expect(handleToggle).toHaveBeenCalled()
    expect(handleToggle.mock.calls[0][0].target.checked).toBe(true)
    expect(handleToggle.mock.calls[0][0].target.value).toBe("2")
  });
});

const activity: Activity = {
  id: "test",
  label: "Walk 10,000 steps",
};
