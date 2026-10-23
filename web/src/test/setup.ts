import "@testing-library/jest-dom/jest-globals";

// jsdom has no IntersectionObserver; motion's whileInView needs one to mount.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver ??= IntersectionObserverStub as unknown as typeof IntersectionObserver;
