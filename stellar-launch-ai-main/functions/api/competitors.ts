import { json, preflight } from "../_lib/http";
import { competitors } from "../_lib/directory";

export const onRequestOptions = () => preflight();
export const onRequestGet = () => json(competitors);
