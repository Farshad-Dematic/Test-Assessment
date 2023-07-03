/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('my-collapse')
export class MyCollapse extends LitElement {
  static override styles = css`
    :host {
      --collapse-content-padding: 20px 20px 17px 20px;
    }

    .animated {
      overflow: hidden;
      max-height: var(--collapse-content-height);
      will-change: max-height;
      transition: max-height 300ms ease-in-out;
    }

    slot::slotted(*) {
      padding: var(--collapse-content-padding);
    }
  `;

  @query('.container')
  protected _container?: HTMLDivElement;

  @query('slot')
  protected _slot?: HTMLSlotElement;

  /**
   * If true, the component is open.
   */
  protected _open = false;

  constructor() {
    super();
    this.style.setProperty('--collapse-content-height', `0px`);
  }

  override connectedCallback() {
    if (this._container) {
      this.init();
    }

    super.connectedCallback();
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    this.init();
    super.firstUpdated(_changedProperties);
  }

  protected init() {
    if (!this._open) {
      this.style.setProperty('--collapse-content-height', `0px`);
      this._container!.classList.add('animated');
    }
  }

  @property({ type: Boolean, reflect: true, attribute: true })
  get open(): boolean {
    return this._open;
  }

  set open(flag: boolean) {
    this._open = flag;

    if (this._container) {
      this.style.setProperty('--collapse-content-height', `${this.getSlotHeight(this._slot!)}px`);
      this._container.classList.add('animated');
      if (!this._open) {
        setTimeout(() => this.style.setProperty('--collapse-content-height', `0px`));
      }
    }
  }
  /**
   *
   * Displays the collapsible elements as a web component.
   */
  override render() {
    this.setAttribute('aria-expanded', `${this.open}`);

    return html`
      <div class="container" @transitionend=${() => this.transitionEnded()}>
        <slot></slot>
      </div>
    `;
  }

  private getSlotHeight(slot: HTMLSlotElement): number {
    let result = 0;

    slot.assignedElements().forEach((element) => {
      if (element instanceof HTMLSlotElement) {
        result += this.getSlotHeight(element);
      } else {
        result += element.getBoundingClientRect().height;
      }
    });

    return result;
  }

  private transitionEnded() {
    if (this.open) {
      this._container?.classList.remove('animated');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-collapse': MyCollapse;
  }
}