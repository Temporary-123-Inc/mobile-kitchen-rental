import type { VercelRequest, VercelResponse } from "../server/types.js";
import { submitGlideContact } from "../server/glideContact.js";
import { body, headers, secure, fail } from "../server/http.js";

export const config = { maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  secure(res);
  try {
    const result = await submitGlideContact({
      method: req.method,
      headers: headers(req),
      body: await body(req),
    });
    return res.status(result.status).json(result.body);
  } catch (error) {
    return fail(res, error);
  }
}
