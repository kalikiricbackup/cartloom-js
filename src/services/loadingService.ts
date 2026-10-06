type LoadingListener = () => void;

let activeLoadingCount = 0;
const listeners = new Set<LoadingListener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function startLoading() {
  activeLoadingCount += 1;
  notifyListeners();
}

export function stopLoading() {
  if (activeLoadingCount === 0) {
    return;
  }

  activeLoadingCount -= 1;
  notifyListeners();
}

export function subscribeToLoading(listener: LoadingListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isLoading() {
  return activeLoadingCount > 0;
}
