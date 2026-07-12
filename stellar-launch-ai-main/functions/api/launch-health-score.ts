import { json, preflight, readJSON, type AppContext } from "../_lib/http";
import { computeHealthScore } from "../_lib/engine";

export const onRequestOptions = () => preflight();

export const onRequestPost = async ({ request }: { request: Request }) => {
  const ctx = await readJSON<AppContext>(request);
  return json(computeHealthScore(ctx));
};
