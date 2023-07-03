/**
 * Base class for custom element events based on {@link CustomEvent}
 */
export abstract class CustomElementEvent<D> extends CustomEvent<D> {
  static EVENT_NAME = '';

  /**
   *
   * @param {string} eventName - Set by {@link DguElementEventDecorator} naming notation.
   * @param {D} detail - Corresponding detail. Null if not given.
   * @param {EventInit} options - @see {@link EventInit}
   * @protected
   */
  protected constructor(eventName: string, detail?: D, options?: EventInit) {
    super(eventName, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...options,
    } as CustomEventInit);
  }
}
