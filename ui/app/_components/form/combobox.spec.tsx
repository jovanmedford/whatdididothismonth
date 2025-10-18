import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Combobox, Item } from "./combobox";
import { sampleActivities } from "@/app/_mocks/samples";
import { Activity } from "@/app/_types/types";

describe("combobox", () => {
  it("shows options when user clicks combobox", async () => {
    const user = userEvent;
    render(<Combobox {...comboBoxProps} />);
    await user.click(screen.getByRole("combobox" ));
    let options = screen.getAllByRole("option")
    expect(screen.getByRole("listbox")).toBeVisible()
    expect(options.length).toBeGreaterThan(1)
  });

  it("filters options on 'Morning'", async () => {
    const user = userEvent;
    render(<Combobox {...comboBoxProps} />);
    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "Morning");
    let items = screen.getAllByRole("option");
    expect(screen.getByRole("listbox")).toBeVisible()
    items.forEach(item => expect(item.textContent).toContain("Morning"))
  });

  it("allows a user to choose an option", async () => {
    render(<Combobox {...comboBoxProps}/>)
    let comboBox = screen.getByRole("combobox")
    await userEvent.click(comboBox)
    await userEvent.type(comboBox, "Read")
    let option = screen.getByRole("option", {name: /Read a Chapter/i})
    await userEvent.click(option)
    expect(comboBox).toHaveValue("Read a Chapter")
    expect(option).not.toBeVisible()
  })
});

const activityToItemList = (data: Activity[]): Item<Activity>[] => {
  return Array.isArray(data)
    ? data.map((activity) => ({
        key: activity.id,
        label: activity.label,
        value: activity.id,
        data: activity,
      }))
    : [];
};

describe("Activity Combobox", () => {
  it("filters activities", () => {
    render(<ActivityCombobox activities={sampleActivities} />)
  })
})

function getActivitiesFilter(inputValue: string) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function activitiesFilter(activity: Activity) {
    return (
      !inputValue || activity.label.toLowerCase().includes(lowerCasedInputValue)
    );
  };
}

let comboBoxProps = {
  name: "activity",
  label: "Activity",
  itemList: activityToItemList(sampleActivities),
  getItemFilter: getActivitiesFilter,
};
