import { redirect } from "@remix-run/server-runtime";

export const loader = async () => {
  return redirect("/posts/new");
};
