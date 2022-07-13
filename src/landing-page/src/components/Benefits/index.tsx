import cn from "classnames";
import { memo } from "react";

const items = [
  {
    title: "Only humans",
    content: "Protect certain actions so only humans can perform them.",
  },
  {
    title: "Complete flexibility",
    content:
      "The Discord bot will assign a role(s) to verified humans. You can choose what users can do with that role.",
  },
  {
    title: "Anonymous and private",
    content: "No personal information needed or shared. Just verify humans.",
  },
  {
    title: "Better community controls",
    content: "Now when you ban a user you can be sure they won’t return with another account. Prevent spam.",
  },
];

export const Benefits = memo(function Benefits() {
  return (
    <div className="grid grid-cols-container mt-36">
      <div className="grid gap-y-28 col-start-2">
        <div className="text-center w-min justify-self-center">
          <span className="font-bold uppercase text-14 text-96a0db">
            WORLD ID BENEFITS
          </span>

          <h2
            className={cn(
              "text-transparent bg-clip-text bg-gradient-81.5 from-4940e0 to-a39dff text-64 font-semibold mt-4",
              "whitespace-nowrap",
            )}
          >
            Why choose World ID Bot?
          </h2>

          <p className="mt-8 px-16 text-18 text-bcc5f9">
            The World ID bot removes bot spam and protects against sybil attacks
            on your Discord server. Additionally, it’s trustless and completely
            privacy-preserving.
          </p>
        </div>
        <div className="grid grid-flow-col gap-x-4">
          {items.map((item, index) => (
            <div
              className={cn(
                "grid place-items-start place-content-start border-2 border-f9f9f9/20 bg-0f1328 p-8 rounded-lg",
              )}
              key={index}
            >
              <span
                className={cn(
                  "text-transparent bg-clip-text bg-gradient-81.5 from-4940e0 to-a39dff font-medium text-72",
                )}
              >
                {(index + 1).toString().padStart(2, "0")}
              </span>

              <h3
                className={cn(
                  "text-transparent bg-clip-text bg-gradient-81.5 from-4940e0 to-a39dff text-24 font-semibold mt-8",
                )}
              >
                {item.title}
              </h3>

              <p className="font-rubik text-96a0db mt-4">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
