import cn from "classnames";
import { Button } from "components/common/Button";
import { Captcha } from "components/common/Catpcha";
import { memo } from "react";

export const Intro = memo(function Intro() {
  return (
    <div
      className={cn(
        "relative -z-1 grid grid-cols-container px-8 overflow-x-clip",
        "before:absolute before:w-52 before:h-52 before:-bottom-24 before:-left-10 before:blur-[500px]",
        "before:bg-gradient-to-r before:from-4940e0 before:to-a39dff ",
      )}
    >
      <span
        className={cn(
          "absolute z-0 top-[-350px] right-0 w-[800px] h-[800px] bg-[url('/public/images/honeycombs.png')]",
          "bg-center bg-contain bg-no-repeat",
          "before:absolute before:z-[-1] before:inset-0 before:translate-x-[400px] before:bg-gradient-81.5",
          "before:from-4940e0 before:to-a39dff before:blur-[180px]",
        )}
      />
      <div className="grid items-center grid-cols-auto/fr gap-x-40 justify-between col-start-2 z-10">
        <div className="grid gap-y-6">
          <div className="text-48">
            <span className="bg-clip-text text-transparent bg-gradient-81.5 from-4940e0 to-a39dff inline-block">
              Improve your Discord&nbsp;
            </span>
            server by verifying unique people&nbsp;
            <span className="bg-clip-text text-transparent bg-gradient-81.5 from-4940e0 to-a39dff inline-block">
              with World ID
            </span>
          </div>

          <p className="font-rubik text-bcc5f9">
            The World ID Discord bot helps prevent spam and increase the quality
            of the community by verifying humans. Allow only humans to join,
            only humans to post or DM, or have humans-only channels.
          </p>

          <div className="mt-6">
            {/* FIXME: Redirect to bot installation page */}
            <Button>Install now</Button>

            <Button
              variant="flat"
              className="text-938cfa"
            >
              Learn more
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "justify-self-start relative p-6 z-0 rounded-32 w-min",
            "before:absolute before:-z-20 before:w-full before:h-full before:-left-1 before:-bottom-1",
            "before:bg-gradient-81.5 before:from-4940e0 before:to-a39dff before:rounded-32",
            "after:bg-ffffff after:-z-10 after:rounded-32 after:absolute after:inset-0",
          )}
        >
          <div className="grid gap-y-6">
            {/* FIXME: replace with real qr code */}
            <img
              className="w-[275px]"
              src="/images/qr.png"
              alt="Qr Code"
            />

            <span
              className={cn(
                "px-2 text-24 font-semibold bg-clip-text text-center text-transparent bg-gradient-81.5 from-4940e0 to-a39dff",
              )}
            >
              Prove your unique-humanness with WorldID.
            </span>

            <div className="px-2">
              <Captcha variant="flat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
