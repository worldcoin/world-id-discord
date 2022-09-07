import cn from "classnames";
import { Link } from "components/common/Button";
import { Icon } from "components/common/Icon";
import { memo } from "react";

export const Join = memo(function Join() {
  return (
    <div
      className={cn(
        "relative grid grid-cols-container-wide px-4 md:px-8 mt-32 md:mt-64 overflow-x-clip",
        "before:absolute before:-inset-y-24 before:-inset-x-24 before:rounded-[100%] before:blur-[360px]",
        "before:bg-gradient-81.5 before:from-4940e0 before:to-a39dff",
      )}
    >
      <div className="relative col-start-2 text-center grid gap-y-6 justify-items-center">
        <h3 className="font-medium text-32 md:text-48">
          Ready to join our community?
        </h3>
        <Link
          href={process.env?.REACT_APP_DISCORD_LOGIN_AUTH_URL || "#"}
          className="max-w-sm"
        >
          <span className="grid grid-flow-col justify-center auto-cols-max gap-x-4">
            <Icon
              className="h-full w-4"
              name="discord"
            />
            Add to Discord
          </span>
        </Link>
      </div>
    </div>
  );
});
