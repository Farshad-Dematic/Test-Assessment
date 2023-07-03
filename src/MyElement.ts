import { LitElement, html } from 'lit';
import { customElement} from 'lit/decorators.js';
import './MyAccordion';
import './MyAccordionSection';
import './MyAccordionSectionHeader';
import './MyCollapse';

@customElement('my-element')
export class MyElement extends LitElement {
  override render() {
    return html`
      <my-accordion .multiple=${true} @my-accordion-section-open=${(e) => console.log(e.detail)}>
        <my-accordion-section .headerTitle=${"Section 1 Title"} .headerSubTitle=${"Subtitle 1"}  id="1" ?disabled=${false}>
          <div slot="content">
            This is the content of an accordion 1!
          </div>
        </my-accordion-section>
        <my-accordion-section .headerTitle=${"Section 2 Title"} .headerSubTitle=${"Subtitle 2"} id="2" ?disabled=${false}>
          <div slot="content">
            This is the content of an accordion 2!
          </div>
        </my-accordion-section>
      </my-accordion>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}