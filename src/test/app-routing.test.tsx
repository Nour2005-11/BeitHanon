import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches every public route instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    for (const location of ["/", "/archive", "/archive/1", "/about", "/suggest"]) {
      const matches = router.matchRoutes(location);
      expect(matches.at(-1)?.routeId, location).not.toBe(rootRouteId);
    }

    expect(router.matchRoutes("/archive/1").at(-1)?.routeId).toBe("/archive/$id");
  });
});
