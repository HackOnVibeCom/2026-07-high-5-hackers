import { json, preflight } from "../_lib/http";
import { communities } from "../_lib/directory";

export const onRequestOptions = () => preflight();
export const onRequestGet = () => json(communities);
