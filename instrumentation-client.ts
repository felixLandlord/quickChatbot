import { initBotId } from "botid/client/core";

if (
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL === "1"
) {
  initBotId({
    protect: [
      {
        path: "/api/chat",
        method: "POST",
      },
    ],
  });
}
