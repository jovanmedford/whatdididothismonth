import Button from "@/app/_components/button/button";
import ActivityCombobox from "@/app/_components/form/activity-combobox";
import Input from "@/app/_components/form/input";
import { useAuthSession } from "@/app/_hooks/use-auth-session";
import { fetchActivities } from "@/app/_lib/api";
import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useFilterContext } from "./filter-context";
import { daysInMonth } from "@/app/utils";
import useCreateActivityLogMutation from "./use-create-log-mutation";
import { useState } from "react";

export default function ActivityLogPopover() {
  const { register, handleSubmit } = useForm<ActivityForm>();
  const [open, setOpen] = useState(false);
  const { filters } = useFilterContext();
  const { token } = useAuthSession();
  const mutation = useCreateActivityLogMutation();
  const max = daysInMonth(filters.month, filters.year);
  const { status, data: activities } = useQuery({
    queryKey: ["form-activities"],
    queryFn: () => fetchActivities(token),
    enabled: !!token,
  });

  const handleFormSubmit: SubmitHandler<ActivityForm> = (data) => {
    if (!Array.isArray(activities)) {
      return;
    }

    const { activityLabel, targetValue } = data;

    mutation.mutate({
      target: targetValue,
      label: activityLabel,
    });
    // setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Popover.Trigger asChild>
        <Button variant="emphasized">Track an activity</Button>
      </Popover.Trigger>
      <Popover.Portal>
        {status === "success" && (
          <Popover.Content className="bg-white px-8 py-4 shadow-xl border-1 border-gray-200 min-w-40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Start a new log</h2>
              <Popover.Close asChild={true}>
                <Button icon={X} size="medium" />
              </Popover.Close>
            </div>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="min-w-sm"
            >
              <ActivityCombobox
                {...register("activityLabel")}
                required
                className="mb-2 w-full"
                activities={activities}
              />
              <Input
                {...register("targetValue")}
                required
                min={0}
                max={max}
                className="w-full"
                label="Target"
                type="number"
              />
              <div className="mt-8">
                <Button className="w-full" variant="emphasized">
                  Save
                </Button>
              </div>
            </form>

            <Popover.Arrow />
          </Popover.Content>
        )}
      </Popover.Portal>
    </Popover.Root>
  );
}

interface ActivityForm {
  activityLabel: string;
  targetValue: number;
}
