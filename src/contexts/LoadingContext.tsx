import {
  createContext,
  ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";
import {
  isLoading,
  startLoading,
  stopLoading,
  subscribeToLoading,
} from "../services/loadingService";

interface LoadingContextValue {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined,
);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const loading = useSyncExternalStore(
    subscribeToLoading,
    isLoading,
    () => false,
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading: loading,
        showLoading: startLoading,
        hideLoading: stopLoading,
      }}
    >
      {children}
      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-overlay__card">
            <span className="loading-overlay__spinner" aria-hidden="true" />
            <span>Loading, please wait…</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoader must be used within a LoadingProvider");
  }

  return context;
}
