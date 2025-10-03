import { useTableStore } from "./use-table";
import Button from "@/app/_components/button/button";
import { Trash } from "lucide-react";
import useDeleteMutation from "./use-delete-mutation";

export default function MultiselectToolbar() {
  const selected = useTableStore((state) => state.selected);
  const resetSelected = useTableStore((state) => state.resetSelected);
  const deleteMutation = useDeleteMutation();

  if (selected.length < 1) return <div className="h-9 w-4"></div>;

  function handleDelete() {
    deleteMutation.mutate(selected.join(","));
    resetSelected();
  }

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 flex mb-1 px-4 py-5 justify-center
        md:static md:ml-4 md:rounded-xl md:px-3 md:py-1 bg-gray-200  items-center`}
    >
      <span className="mr-2">{selected.length} selected</span>
      <Button
        onClick={handleDelete}
        icon={Trash}
        size="small"
        className="rounded-4xl"
      ></Button>
    </div>
  );
}
