type EventListener<T> = (this: HTMLElement, event: T) => any;

export default EventListener;
