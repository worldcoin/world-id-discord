import { Icon } from "../index";

import { render } from "@testing-library/react";

describe("Extensible icon component", () => {
  it("renders properly", async () => {
    expect(render(<Icon name="logo" />)).toBeTruthy();
  });
});
