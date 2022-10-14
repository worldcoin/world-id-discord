import { Link } from "components/common/Button";
import { Icon } from "components/common/Icon";
import { Layout } from "components/common/Layout";
import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGuilds } from "utils";

export const Auth = memo(function Auth() {
  const [authorized, setAuthorized] = useState<boolean | null>(false);

  const navigate = useNavigate();

  const isParamsValid = (params: URLSearchParams) => {
    if (!params.get("token_type") || !params.get("access_token")) {
      return false;
    }

    return true;
  };

  const searchParams = useMemo(() => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.substring(1));

    if (!isParamsValid(hash)) {
      return null;
    }

    return hash;
  }, []);

  const discordUserToken = useMemo(() => {
    if (!searchParams) {
      return null;
    }

    return `${searchParams.get("token_type")} ${searchParams.get(
      "access_token",
    )}`;
  }, [searchParams]);

  useEffect(() => {
    if (!discordUserToken) {
      return setAuthorized(false);
    }

    setAuthorized(true);

    getGuilds(discordUserToken)
      .then((data) => {
        localStorage.setItem("discordToken", discordUserToken);

        navigate("/configuration", {
          replace: true,
          state: { administeredGuilds: data },
        });
      })
      .catch((error) => console.error(error));
  }, [discordUserToken, navigate]);

  return (
    <Layout>
      <div className="h-screen w-full flex justify-center items-center">
        {(authorized === null || authorized === true) && (
          <Icon
            className="w-32 h-32 animate animate-ping"
            name="logo"
          />
        )}

        {authorized === false && (
          <Link
            className="w-full disabled:opacity-20 max-w-xs"
            href={process.env.REACT_APP_ADD_BOT_URL}
          >
            {"Install bot"}
          </Link>
        )}
      </div>
    </Layout>
  );
});
