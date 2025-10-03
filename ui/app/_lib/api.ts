import { Activity, ActivityLog, Category } from "../_types/types";
import { Filters } from "../app/calendar/filter-context";

/**
 * Get user categories
 */
export const fetchCategories = async (
  idToken?: string
): Promise<Category[]> => {
  if (!idToken) {
    console.error("Not logged in.");
    return [];
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/category`,
    {
      mode: "cors",
      headers: {
        Authorization: idToken,
      },
    }
  );

  if (!response.ok) {
    throw Error("An error occured");
  }

  return response.json();
};

/**
 * Get user activities
 */
export const fetchActivities = async (
  idToken?: string,
  categoryId?: string
): Promise<Activity[]> => {
  if (!idToken) {
    console.error("Not logged in.");
    return [];
  }

  let endpoint = categoryId ? `?categoryId=${categoryId}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/activity` + endpoint,
    {
      mode: "cors",
      headers: {
        Authorization: idToken,
      },
    }
  );

  if (!response.ok) {
    throw Error("An error occured");
  }

  return response.json();
};

/**
 * Fetch activity logs
 * @param filters
 * @param token
 */
export const fetchLogs = async (
  filters: Filters,
  token?: string
): Promise<ActivityLog[]> => {
  if (!token) {
    console.log("Not signed in");
    return [];
  }

  let params = new URLSearchParams();
  params.set("year", String(filters.year));
  params.set("month", String(filters.month));

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_ENDPOINT
    }/activity-logs?${params.toString()}`,
    {
      mode: "cors",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.ok) {
    throw Error;
  }

  return response.json();
};

export const createActivityLog = async (
  activityLogInput: any,
  idToken?: string
) => {
  if (!idToken) {
    console.error("Not logged in.");
    return [];
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/activity-logs`,
    {
      mode: "cors",
      headers: {
        Authorization: idToken,
      },
      method: "POST",
      body: JSON.stringify(activityLogInput),
    }
  );

  if (!response.ok) {
    throw Error("An error occured");
  }

  return response.json();
};

/**
 * Adds or remove an item from the success log table 
 */
export const toggleSuccess = async (
  isSuccess: boolean,
  activityLogId: string,
  day: number,
  token?: string
) => {
  if (!token) {
    throw Error("Not logged in.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/success-logs`,
    {
      mode: "cors",
      method: isSuccess ? "DELETE" : "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({ activityLogId, day }),
    }
  );

  if (!response.ok) {
    throw Error;
  }
};

export const deleteLog = async (ids: string, token?: string) => {
  if (!token) {
    throw Error("Not logged in.");
  }

  if (!ids) {
    throw Error("No logs to delete");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/activity-logs?ids=${ids}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.ok) {
    throw Error;
  }

  return response.json();
};
