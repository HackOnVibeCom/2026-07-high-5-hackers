import { json, preflight } from "../_lib/http";
import { influencers } from "../_lib/directory";

export const onRequestOptions = () => preflight();
export const onRequestGet = () => json(influencers);
