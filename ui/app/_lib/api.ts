import { json } from "stream/consumers";
import { Activity, Category } from "../_types/types";

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

export const createActivityLog = async (
  idToken?: string,
  activityLogInput: any
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
      body: JSON.stringify(activityLogInput)
    }
  );

  if (!response.ok) {
    throw Error("An error occured");
  }

  return response.json();
};
