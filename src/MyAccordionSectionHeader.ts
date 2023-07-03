/* eslint max-classes-per-file: ["error", 2] */
import { html } from 'lit';
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-accordion-section-header')
export class MyAccordionSectionHeader extends LitElement {
  /**
   * Sets header for Accordion Header
   */
  @property({ reflect: true, attribute: true }) headerTitle!: string;

  /**
   * Sets subheader for Accordion Header
   */
  @property({ reflect: true, attribute: true }) headerSubTitle!: string;

  override render() {
    console.log("section-header", this.headerSubTitle, this.headerTitle);
    return html`
      <h3 style="margin: 0">${this.headerTitle}</h3>
      <span>${this.headerSubTitle}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-accordion-section-header': MyAccordionSectionHeader;
  }
}