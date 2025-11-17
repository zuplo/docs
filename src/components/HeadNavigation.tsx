import React from "react";
import { Button } from "zudoku/components";

export const HeadNavigation = () => {
  return (
    <div className="flex gap-2 mr-2">
      <Button variant="ghost" asChild>
        <a href="https://portal.zuplo.com/">Sign in</a>
      </Button>
      <Button asChild>
        <a href="https://portal.zuplo.com/signup">Start for Free</a>
      </Button>
    </div>
  );
};
