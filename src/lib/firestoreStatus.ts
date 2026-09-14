type Listener = (message: string | null) => void;

let current: string | null = null;
let listeners: Listener[] = [];

export function setFirestoreError(message: string | null) {
  current = message;
  listeners.forEach((l) => l(message));
}

export function getFirestoreError() {
  return current;
}

export function subscribeFirestoreError(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
