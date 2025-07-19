import { http, HttpResponse } from "msw";
import { sampleActivities } from "./samples";

http.get("/activities", () => {
  return HttpResponse.json(sampleActivities);
});
