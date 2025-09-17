import { ActivityLog } from "@/app/_types/types";
import { render, screen } from "@testing-library/react";
import ActivityForm from "./activity-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

describe("Happy paths", () => {
  it("shows assigned category if activity is existing", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    render(<ActivityForm />, { wrapper });

    const activityInput = screen.getByLabelText("activity");
    // Type into the input
    // Make Selection

    const categoryInput = screen.getByLabelText("category");
    // assert the input matches the output
  });
  it.todo("shows category field if activity is new");
  it.todo("shows color picker if  category is new");
  it.todo("sets target");
});