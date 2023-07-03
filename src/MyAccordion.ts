/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { MyAccordionSection, MyAccordionSectionToggledEvent } from './MyAccordionSection';
import { MyAccordionSectionHeader } from './MyAccordionSectionHeader';

type AnyConstructor<A = unknown> = new (...input: any[]) => A;
const ALLOWED_TAGS = [MyAccordionSection, MyAccordionSectionHeader];

interface MyAccordionSectionOpenEventDetail {
  open: string[];
};

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-accordion')
export class MyAccordion extends LitElement {
  static override styles = css`
    .container {
      border: 2px solid #f1f1f1;
      border-top: 0;
    }
  `;

  /**
   * Object containing all sections in the slot
   * Initialised within handleSlotChange function
   */
  @property({ attribute: false })
  accordionSections!: MyAccordionSection[];

  /**
   * Whether the accordion should be able to have open several sections at a time
   */
  @property({ type: Boolean, attribute: true, reflect: true })
  multiple = false;

  override render() {
    return html`
      <div class="container" @my-accordion-section-toggled=${(e) => this.handleToggle(e)}>
        <slot @slotchange=${(e: Event) => this.handleSlotChange(e)}></slot>
      </div>
    `;
  }

  /**
   * Prevents event propagating & sets section to open or closed depending on current state
   * @param e
   * @returns
   */
  private handleToggle(e: MyAccordionSectionToggledEvent) {
    e.stopPropagation();
    const id = e.detail.sectionId;
    const toggledSection = this.accordionSections.filter((section) => section.id === id)[0] as MyAccordionSection;

    if (!this.multiple && !toggledSection.open) {
      const openSections = this.accordionSections.filter((section) => section.open); // find section already open
      const numberOfOpenSections = openSections.length;
      if (numberOfOpenSections > 0) {
        openSections[0].open = !openSections[0].open; // close open section
      }
    }
    toggledSection.open = !toggledSection.open; // open clicked section
    this.dispatchNewAccordionStateEvent();
  }

  /**
   * Dispatches a AccordionSectionOpenEvent
   * event.detail contains an object. The object contains an array of open sections.
   */
  private dispatchNewAccordionStateEvent() {
    const openSections = this.accordionSections.filter((section) => section.open);
    const openSectionIds = openSections.map((section) => section.id);
    const eventDetail = {
      open: openSectionIds,
    };
    this.dispatchEvent(
      new CustomEvent<MyAccordionSectionOpenEventDetail>(
      'my-accordion-section-open', 
      {
        bubbles: true, 
        composed: true, 
        detail: eventDetail
      }
    ));
  }

  /**
   * Restricts elements within slot to AccordionSection
   * Initializes accordionSections object
   * @param e
   */
  private handleSlotChange(e: Event) {
    MyAccordion.restrictElementsInSlot(ALLOWED_TAGS, e);
    const slot = e.target as HTMLSlotElement;
    this.accordionSections = slot.assignedElements() as MyAccordionSection[];
  }

  /**
   * Remove assigned elements that aren't allowed in this slot
   * @param allowedTags [string[] || string] of allowed tag names
   * @param slotchangeEvent The slotchange event
   */
  protected static restrictElementsInSlot(allowedElements: AnyConstructor<HTMLElement>[], slotchangeEvent: Event): Element[] {
    const slot = slotchangeEvent.target as HTMLSlotElement;
    const elements: Element[] = slot.assignedElements();
    const remainingElements: Element[] = [];

    const shouldExcludeElement = (node) => !allowedElements.find((constructor) => node instanceof constructor);

    for (const node of elements) {
      if (shouldExcludeElement(node)) {
        node.remove();
      } else {
        remainingElements.push(node);
      }
    }

    return remainingElements;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-accordion': MyAccordion;
  }
}
