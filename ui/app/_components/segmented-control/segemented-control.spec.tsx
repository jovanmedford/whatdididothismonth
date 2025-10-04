import { render, screen } from "@testing-library/react";
import SegmentedControl from "./segmented-control";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

describe("Segmented control", () => {
  it("renders, set to appropriate value", async () => {
    render(<TestComponent />);

    let radioBtns = (await screen.findAllByRole("radio", {
      checked: true,
    })) as HTMLInputElement[];
    expect(radioBtns.length).toEqual(1);
    expect(radioBtns[0].value).toBe("new");
  });

  it("changes correctly", async () => {
    const user = userEvent;
    render(<TestComponent />);
    await user.click(screen.getByLabelText("Existing"));
    let radioBtn = screen.getByRole("radio", {
      checked: true,
    }) as HTMLInputElement;
    expect(radioBtn.value).toBe("existing");
  });
});

function TestComponent() {
  const [value, setValue] = useState("new");
  return (
    <SegmentedControl
      controls={controls}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  );
}

const controls = [
  { label: "Existing", value: "existing" },
  { label: "Create new", value: "new" },
];
