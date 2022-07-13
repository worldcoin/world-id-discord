import cn from "classnames";
import { Link } from "components/common/Button";
import { memo } from "react";

export const NoCaptcha = memo(function NoCaptcha() {
  return (
    <div className="grid grid-cols-container px-8 mt-48">
      <div className="relative rounded-64 bg-gradient-81.5 from-4940e0 to-a39dff col-start-2 py-[105px] px-20">
        <div className="justify-items-start grid gap-y-12 max-w-[620px]">
          <div className="grid gap-y-4">
            <h2 className="font-semibold text-48">
              Say goodbye to CAPTCHA and bots
            </h2>

            <p className="text-ffffff/70 text-18">
              Secure your Discord with{" "}
              <span className="text-ffffff font-semibold">World ID Bot</span>
            </p>
          </div>

          {/* FIXME: add link */}
          <Link
            variant="flat"
            className="bg-ffffff"
            href="#!"
          >
            <span className="bg-gradient-81.5 from-4940e0 to-a39dff bg-clip-text text-transparent">
              Install now
            </span>
          </Link>
        </div>

        <div>
          <img
            className={cn(
              "absolute top-10 right-14 h-[calc(100%+40px)]",
              "[filter:drop-shadow(0px_4px_12px_rgba(0,0,0,.08))_drop-shadow(0px_8px_64px_rgba(0,0,0,0.16))]",
            )}
            src="/images/discord.png"
            alt="Discord"
          />
        </div>
      </div>
    </div>
  );
});
