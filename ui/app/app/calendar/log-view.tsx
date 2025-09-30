import { ActivityLog } from "@/app/_types/types";
import ProgressGrid from "@/app/_components/progress-grid/progress-grid";
import { useFilterContext } from "./filter-context";
import { useTableStore } from "./use-table";
import useToggleMutation from "./use-toggle-mutation";
import { daysInMonth } from "@/app/utils";
import { ChangeEvent, FC, PropsWithChildren } from "react";

/**
 * Composes the container and list item for the log view
 */
export default function LogView({
  activityLogs,
  containerRenderer: Container,
  itemRenderer: Item,
}: LogViewProps) {
  if (activityLogs.length == 0) {
    return <p>Whoops! No tracking data this month</p>;
  }
  return (
    <Container>
      {activityLogs.map((log) => (
        <LogItem key={log.id} log={log} renderProp={Item} />
      ))}
    </Container>
  );
}

function LogItem({
  log,
  renderProp: Item,
}: {
  log: ActivityLog;
  renderProp: LogItemRenderer;
}) {
  const { filters } = useFilterContext();
  const selected = useTableStore((state) => state.selected);
  const updateSelected = useTableStore((state) => state.updateSelected);
  const toggleMutation = useToggleMutation();
  let numOfDays = daysInMonth(filters.month, filters.year);

  function handleToggleSuccess(
    e: ChangeEvent<HTMLInputElement>,
    successSet: Set<number>
  ) {
    const day = Number(e.target.value);
    const isSuccess = successSet.has(day);
    toggleMutation.mutate({ isSuccess, logId: log.id, day });
  }

  function handleLogSelected() {
    updateSelected(log.id);
  }

  const selectedSet = new Set(selected);
  const isSelected = selectedSet.has(log.id);

  return (
    <Item log={log} onSelected={handleLogSelected} isSelected={isSelected}>
      <ProgressGrid
        className="flex gap-2 flex-wrap"
        numOfDays={numOfDays}
        successes={log.successes}
        activity={{ id: log.activityId, label: log.activityName }}
        onToggleSuccess={handleToggleSuccess}
      />
    </Item>
  );
}

export interface LogViewProps {
  activityLogs: ActivityLog[];
  itemRenderer: LogItemRenderer;
  containerRenderer: LogContainerRenderer;
}

export interface LogItemRenderProps {
  isSelected: boolean;
  onSelected: () => void;
  log: ActivityLog;
}

export type LogItemRenderer = FC<PropsWithChildren<LogItemRenderProps>>;
export type LogContainerRenderer = FC<PropsWithChildren>;
