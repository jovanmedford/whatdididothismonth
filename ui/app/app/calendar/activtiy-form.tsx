import { Activity, Category } from "@/app/_types/types";
import { sampleActivities, sampleCategories } from "@/app/mocks/samples";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";
import { useCombobox } from "downshift";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useFilterContext } from "./filter-context";
import { showNotification } from "@/app/_components/toast/toast";
import { Combobox, Item } from "@/app/_components/form/combobox";

export default function ActivityForm() {
  const [activityItems, setActivityItems] = useState(sampleActivities);
  let { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  // const createActivity = async (
  //   newData: Activity
  // ): Promise<Activity | null> => {
  //   // const { data, errors } = {data: null}

  //   // if (errors) {
  //   //   throw new Error(errors[0].message);
  //   // }

  //   return null;
  // };

  // let {
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  // } = useForm<ActivityFormData>();
  // const queryClient = useQueryClient();
  // let {
  //   filters: { year, month },
  // } = useFilterContext();

  // const mutation = useMutation({
  //   mutationFn: createActivity,
  //   onError: (e) => {
  //     showNotification({
  //       type: "error",
  //       title: "Could not add activity",
  //       description: e.message,
  //     });
  //   },
  //   onSuccess: (data) => {
  //     let newActivity = data;

  //     if (!newActivity) {
  //       return showNotification({
  //         type: "error",
  //         title: "Could not add activity",
  //         description: "Please try again.",
  //       });
  //     }

  //     showNotification({
  //       type: "success",
  //       title: "Activity Update",
  //       description: `Now tracking ${newActivity.activityName}`,
  //     });

  //     return queryClient.invalidateQueries({
  //       queryKey: ["activties", year, month],
  //     });
  //   },
  // });

  // const onSubmit: SubmitHandler<ActivityFormData> = (data) => {
  //   if (!user) {
  //     return;
  //   }

  //   let newData: Activity = {
  //     pk: user.userId,
  //     sk: `${year}#${month}#${data.activityName}`,
  //     successes: [],
  //     activityName: data.activityName,
  //     target: data.target,
  //   };
  //   mutation.mutate(newData);
  // };

  return (
    <form>
      <Combobox
        label="Activity"
        itemList={activityToItemList(sampleActivities)}
        getItemFilter={getItemFilter}
      />
      <Combobox
        label="Category"
        itemList={categoryToItemList(sampleCategories)}
        getItemFilter={getCategoryFilter}
      />
    </form>
  );
}

/**
 * 1. Get the combobox going
 * 2. Get the categeory to show for existing
 * 3. Get the form to log some output
 * 4. Get the categroy combobox going
 * 5. Get the color picker
 * 6. Get the icon picker
 */

type ActivityFormData = Omit<Activity, "sk" | "pk">;

const activityToItemList = (data: Activity[]): Item<Activity>[] => {
  return data.map((activity) => ({
    key: activity.sk,
    label: activity.activityName,
    value: activity.sk,
    data: activity,
  }));
};

const categoryToItemList = (data: Category[]): Item<Category>[] => {
  return data.map((categeory) => ({
    key: categeory.sk,
    label: categeory.name,
    value: categeory.sk,
    data: categeory,
  }));
};



const getItemFilter = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function activityFilter(activity: Item<Activity>) {
    return (
      !inputValue ||
      activity.data.activityName.toLowerCase().includes(lowerCasedInputValue)
    );
  };
};

const getCategoryFilter = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function categoryFilter(category: Item<Category>) {
    return (
      !inputValue ||
      category.label.toLowerCase().includes(lowerCasedInputValue)
    );
  };
};

{
  /* <form
onSubmit={handleSubmit(onSubmit)}
className="flex flex-col gap-4"
>
<Controller
  name="name"
  control={control}
  rules={{
    required: "This field is required",
  }}
  render={({ field }) => (
    <TextInput
      {...field}
      error={errors.name}
      className="mb-4 bg-white"
      label="Name"
      type="text"
    />
  )}
/>
<Controller
  name="target"
  control={control}
  rules={{
    required: "This field is required",
  }}
  render={({ field }) => (
    <TextInput
      {...field}
      error={errors.target}
      className="mb-4 bg-white"
      label="Target"
      type="number"
    />
  )}
/>
<div className="flex flex-col mt-8 gap-4">
  <Button variant="emphasized">Save</Button>
  <Button onClick={() => setShow(false)}>Cancel</Button>
</div>
</form> */
}
