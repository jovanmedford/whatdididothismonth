import { render, screen } from "@testing-library/react";
import MonthPicker from "./month-picker";
import userEvent from "@testing-library/user-event";

describe("Month Picker", () => {
  it("active according to prop", async () => {
    let month = "5";
    render(<MonthPicker month={month} />);
    let activeMonths = (await screen.findAllByRole("radio", {
      checked: true,
    })) as HTMLInputElement[];

    expect(activeMonths.length).toEqual(1);
    expect(activeMonths[0].value).toEqual(month);
  });

  it("handles a month selection", async () => {
    const user = userEvent;
    const handleChange = jest.fn();
    let month = "1";
    let newMonthName = "APR";
    let newMonthValue = "3"
    render(<MonthPicker month={month} onChange={handleChange} />);
    let newMonth = screen.getByLabelText(newMonthName);
    await user.click(newMonth);
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0].target.value).toEqual(newMonthValue);
  });
});
