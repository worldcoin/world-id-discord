import cn from "classnames";
import { Link } from "components/common/Button";
import { Icon } from "components/common/Icon";
import { memo } from "react";

const steps = [
  {
    title: "Download the Worldcoin app",
    content: (
      <span>
        The app can be downloaded for free on <br /> iOS and Android.
      </span>
    ),
  },
  {
    title: "Create your account",
    content: (
      <span>
        Users can sign up without providing <br /> any personal information.
      </span>
    ),
  },
  {
    title: "Visit an Orb Operator",
    content: (
      <span>
        Verify you are a human with an Orb Operator to activate <br /> your World
        ID. You’ll also get access to free airdrops!
      </span>
    ),
  },
];

export const Steps = memo(function Steps() {
  return (
    <div className="grid grid-cols-container px-8 mt-64">
      <div className="grid gap-y-24 col-start-2">
        <div className="relative z-0 grid grid-flow-col gap-x-8">
          {steps.map((step, index) => (
            <div
              className="relative grid grid-rows-auto/fr items-start justify-items-center text-center gap-y-12"
              key={index}
            >
              <span
                className={cn(
                  "relative grid items-center text-center w-[106px] h-[106px] rounded-full text-40 leading-[1.2]",
                  "before:absolute before:inset-0 before:border-gradient before:bg-gradient-81.5 before:from-4940e0",
                  "before:to-a39dff before:p-0.5 before:rounded-full",
                  "after:absolute after:z-[-1] after:-inset-8 after:bg-0d1020",
                  { "bg-gradient-81.5 from-4940e0 to-a39dff": index <= 0 },
                )}
              >
                {index + 1}
              </span>

              <div className="grid gap-y-4">
                <h3
                  className={cn(
                    "font-semibold text-20 text-transparent bg-clip-text bg-gradient-81.5 from-4940e0 to-a39dff",
                  )}
                >
                  {step.title}
                </h3>

                <p className="text-14 font-rubik text-96a0db">{step.content}</p>
              </div>

              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "absolute -z-10 w-full h-0.5 top-[53px] left-1/2 border border-dashed border-0d1020",
                    "[background:linear-gradient(#fff_0_0)_padding-box,_linear-gradient(90deg,_#4940e0,_#a39dff)_border-box]",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-flow-col auto-cols-min justify-self-center gap-x-6">
          <Link
            className="grid items-center bg-060816 border rounded-xl py-4"
            href="https://apps.apple.com/no/app/worldcoin-claim-send/id1560859847"
            target="_blank"
            variant="flat"
          >
            <Icon
              className="h-7 w-full"
              noMask
              name="app-store"
            />
          </Link>

          <Link
            className="grid items-center bg-060816 border rounded-xl py-4"
            href="https://play.google.com/store/apps/details?id=com.worldcoin"
            target="_blank"
            variant="flat"
          >
            <Icon
              className="h-7 w-full"
              noMask
              name="play-market"
            />
          </Link>
        </div>
      </div>
    </div>
  );
});
