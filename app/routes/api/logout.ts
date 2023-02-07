import { ActionArgs } from "@remix-run/server-runtime";
import { logout } from "~/session.server";

export function action({ request }: ActionArgs) {
  return logout(request);
}
