import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { HomePageData } from "../../types";
import HomePresenter from "./HomePresenter";
import { getHomePageData } from "../../services/homeService";

function HomeContainer() {
  const [homeData, setHomeData] = useState<HomePageData>({
    topCategories: [],
    bestDeals: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadHomePage() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getHomePageData(controller.signal);
        setHomeData(response);
      } catch (requestError: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        const apiMessage = isAxiosError<{
          detail?: string;
          message?: string;
        }>(requestError)
          ? (requestError.response?.data?.detail ??
            requestError.response?.data?.message)
          : undefined;

        setError(
          typeof apiMessage === "string"
            ? apiMessage
            : "Unable to load the home page. Please try again later.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadHomePage();

    return () => controller.abort();
  }, []);

  return (
    <HomePresenter
      categories={homeData.topCategories}
      bestDeals={homeData.bestDeals}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default HomeContainer;
