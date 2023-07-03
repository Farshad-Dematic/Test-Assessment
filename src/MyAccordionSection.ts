/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CustomElementEvent } from './CustomElementEvent';

export interface MyAccordionSectionToggleEventDetail {
  sectionId: string;
  opened: boolean;
}

export class MyAccordionSectionToggledEvent extends CustomElementEvent<MyAccordionSectionToggleEventDetail> {
  constructor(detail: MyAccordionSectionToggleEventDetail) {
    super('accordion-section-toggled-event', detail);
  }
}

@customElement('my-accordion-section')
export class MyAccordionSection extends LitElement {
  static override styles = css`
    :host {
      background-color: #f9f9f9;
      color: #202020;

      --theme-primary: #0157ae;
      --theme-primary-variant: #dbecfd;
      --theme-primary-variant-2: #0f4e8c;
      --theme-secondary: #fdbb30;
      --theme-secondary-variant: #fdbb30;
      --theme-background: #ffffff;
      --theme-background-variant: #fafafa;
      --theme-background-variant-2: #f4f4f4;
      --theme-surface: #f9f9f9;
      --theme-surface-variant: #f1f1f1;
      --theme-surface-variant-2: #dedede;
      --theme-error: #ac0101;
      --theme-error-variant: #740000;
      --theme-warning: #ff9d3e;
      --theme-success: #00d69d;
      --theme-on-primary: #ffffff;
      --theme-on-secondary: #000000;
      --theme-on-background: #202020;
      --theme-on-surface: #202020;
      --theme-on-error: #ffffff;
      --theme-on-warning: #000000;
      --theme-on-success: #000000;
      --theme-on-disabled: #b1b1b1;
      --theme-elevation-overlay: transparent;
      --accordion-header-padding: 14px 15px 14px 20px;
    }

    slot[name='header']::slotted(*) {
      padding: var(--accordion-header-padding);
    }

    #sectionHeader {
      padding: 1em;
    }

    .item-header {
      border-top: 2px solid var(--theme-surface-variant);

      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item-header .icon-container {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 24px;
      color: var(--theme-primary);
      padding: var(--accordion-header-padding);
      align-self: var(--accordion-icon-align);
    }

    .item-header .icon-container i {
      transition: transform 300ms linear;
      will-change: transform;
    }

    .item-header .icon-container i.section-open {
      transform: rotate(180deg);
    }

    .item-header .icon-container i.section-closed {
      transform: rotate(0deg);
    }

    .material-icons {
      font-family: "Material Icons";
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-feature-settings: "liga";
    }

    .item-header.disabled {
      cursor: default;
    }
    
    .item-header.disabled .icon-container {
      color: var(--theme-on-disabled);
      cursor: default;
    }
  `;

  /**
   * Determines whether this section of the accordion is open or collapsed
   */
  @state() open = false;
  /**
   * Determines whether this section of the accordion is disable or not
   */
  @property({ type: Boolean, attribute: true, reflect: true }) disabled = false;

  @property({ reflect: true, attribute: true }) override id!: string;

  /**
   * Sets header for Accordion Header
   */
  @property({ reflect: true, attribute: false }) headerTitle!: string;

  /**
   * Sets subheader for Accordion Header
   */
  @property({ reflect: true, attribute: false }) headerSubTitle!: string;

  private dispatchToggleSectionEvent(event: Event) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent<MyAccordionSectionToggleEventDetail>(
      'my-accordion-section-toggled', 
      {
        bubbles: true, 
        composed: true, 
        detail: {
          sectionId: this.id,
          opened: this.open,
        }
      }
    ));
  }

  /**
   * Keyup handler function, triggers method dispatchToggleSectionEvent when Space or Enter key is pressed
   * @param e KeyboardEvent
   */
  private _keyUpHandler(e: Event) {
    if ((e as KeyboardEvent).key === ' ' || (e as KeyboardEvent).key === 'Enter') this.dispatchToggleSectionEvent(e);
  }

  override render() {
    return html`
      <div
        class="item-header${this.disabled ? ' disabled' : ''}"
        @keyup=${this._keyUpHandler}
        @click=${this.dispatchToggleSectionEvent}
        aria-labelledby="sectionHeader"
        aria-disabled="${this.disabled}"
        tabindex="0"
      >
        <div id="sectionHeader">
          <h3 style="margin: 0">${this.headerTitle}</h3>
          <span>${this.headerSubTitle}</span>
        </div>
        <div class="icon-container">
          <i class="material-icons ${this.open ? 'section-open' : 'section-closed'}">expand_more</i>
        </div>
      </div>
      <my-collapse ?open=${this.open} aria-expanded="${this.open}">
        <slot name="content"></slot>
      </my-collapse>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-accordion-section': MyAccordionSection;
  }
}