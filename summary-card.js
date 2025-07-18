import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

const editorDomains = [
  'light', 'switch', 'binary_sensor', 'climate', 'cover',
  'media_player', 'person', 'alarm_control_panel', 'lock', 'vacuum'
];

// Yeni koşullar eklendi
const editorConditions = ['any_active', 'all_inactive', 'any_unavailable', 'any_inactive', 'all_active'];

// Yeni koşullar için etiketler eklendi
const conditionLabels = {
  'any_active': 'If Any Active',
  'all_inactive': 'If All Inactive',
  'any_unavailable': 'If Any Unavailable',
  'any_inactive': 'If Any Inactive',
  'all_active': 'If All Active'
};

class SummaryCardEditor extends LitElement {
  _didInitialFilter = false;

  static get properties() {
    return {
      hass: {},
      _config: { state: true },
      _cardEditorStates: { state: true }
    };
  }

  setConfig(config) {
    this._config = config;
    if (!this._cardEditorStates || this._cardEditorStates.length !== (config.cards?.length || 0)) {
        this._cardEditorStates = (config.cards || []).map(() => false);
    }
  }

  willUpdate(changedProperties) {
    // hass ve config nesneleri mevcut olduğunda ve filtreleme işlemi bu oturumda henüz yapılmadıysa çalışır.
    if (this.hass && this._config && !this._didInitialFilter) {
      const defaultConfig = SummaryCard.getStubConfig();
      
      // Mevcut yapılandırmanın, varsayılan yapılandırma olup olmadığını kontrol et.
      // Bu, kullanıcının henüz bir değişiklik yapmadığı ilk kurulum anını tespit eder.
      const isDefaultConfig = JSON.stringify(this._config) === JSON.stringify(defaultConfig);

      if (isDefaultConfig) {
        // Bu ilk yapılandırma ise, mevcut domain'lere göre filtrele.
        const allEntities = Object.values(this.hass.states);
        const presentDomains = new Set(allEntities.map(e => e.entity_id.split('.')[0]));

        const filteredCards = defaultConfig.cards.filter(card => presentDomains.has(card.domain));

        const newConfig = {
            ...this._config,
            cards: filteredCards,
        };

        // UI'daki YAML'ı güncellemek için olayı gönder.
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: newConfig },
            bubbles: true,
            composed: true,
        }));

        // Editör arayüzünün anında güncellenmesi için bileşenin kendi durumunu da güncelle.
        this.setConfig(newConfig);
      }
      
      // Bu editör örneği için kontrolün yapıldığını ve tekrar çalışmayacağını işaretle.
      this._didInitialFilter = true;
    }
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;

    const target = ev.target;
    const path = target.configValue.split('.');
    let value = ev.detail.value !== undefined ? ev.detail.value : target.value;

    if (target.type === 'checkbox') {
        value = target.checked;
    } else if (target.type !== 'text' && target.value.trim() !== '' && !isNaN(target.value)) {
        value = Number(value);
    }
    
    const newConfig = JSON.parse(JSON.stringify(this._config));
    let current = newConfig;

    for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined) {
             current[path[i]] = {};
        }
        current = current[path[i]];
    }

    const lastKey = path[path.length - 1];

    if (lastKey === 'include' || lastKey === 'exclude') {
      const entities = value.split(',').map(e => e.trim()).filter(e => e);
      if (entities.length > 0) {
        current[lastKey] = entities;
      } else {
        delete current[lastKey];
      }
    } else {
      if (value === "" || value === null || value === undefined) {
        delete current[lastKey];
      } else {
        current[lastKey] = value;
      }
    }
    
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
  }
  
  _toggleCardEditor(ev) {
    const index = ev.currentTarget.cardIndex;
    this._cardEditorStates[index] = !this._cardEditorStates[index];
    this.requestUpdate('_cardEditorStates');
  }
  
  _addOrDelete(action, path) {
    const newConfig = JSON.parse(JSON.stringify(this._config));
    let current = newConfig;
    
    for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
    }
    
    const lastKey = path[path.length - 1];
    
    if (action === 'add') {
        if (!current[lastKey]) current[lastKey] = [];
        let newItem;
        if (lastKey === 'cards') {
            newItem = { domain: 'light', name: 'New Card', styles: [{condition: 'all_inactive', text: 'All Off', icon: 'mdi:power-off', color: 'grey'}] };
            this._cardEditorStates.push(true);
        } else { // styles
            newItem = { condition: 'any_active', text: 'Active' };
        }
        current[lastKey].push(newItem);
    } else { // delete
        const indexToDelete = parseInt(lastKey, 10);
        current.splice(indexToDelete, 1);

        const parentKey = path[path.length - 2];
        if (parentKey === 'cards') {
            this._cardEditorStates.splice(indexToDelete, 1);
        }
    }
    
    this.requestUpdate('_cardEditorStates');
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.hass || !this._config) return html``;

    return html`
      <div class="card-config">
        <h3>General Settings</h3>
        <ha-textfield
          label="Card per Row"
          .value="${this._config.columns || ''}"
          .configValue=${"columns"}
          @input="${this._valueChanged}"
          type="text" 
          placeholder="Default: 3"
        ></ha-textfield>
        <ha-textfield
          label="Card Height (e.g. 85px)"
          .value="${this._config.row_height || ''}"
          .configValue=${"row_height"}
          @input="${this._valueChanged}"
          placeholder="Default: 85px"
        ></ha-textfield>

        <div class="cards-container">
          <h3>Cards</h3>
          ${(this._config.cards || []).map((card, cardIndex) => this._renderCard(card, cardIndex))}
          <mwc-button @click="${() => this._addOrDelete('add', ['cards'])}" outlined>
            <ha-icon icon="mdi:plus"></ha-icon> Add Domain
          </mwc-button>
        </div>
      </div>
    `;
  }

  _renderCard(card, cardIndex) {
    const isOpen = this._cardEditorStates[cardIndex];
    return html`
      <div class="card-editor">
        <div class="toolbar" @click="${this._toggleCardEditor}" .cardIndex="${cardIndex}">
          <h4 class="card-title">Card ${cardIndex + 1}: ${card.name || 'New Card'}</h4>
          <div class="actions">
            <ha-icon class="toggle-icon" icon="${isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}"></ha-icon>
            <ha-icon 
              class="delete-btn" 
              icon="mdi:close" 
              @click="${(e) => { e.stopPropagation(); this._addOrDelete('delete', ['cards', cardIndex]); }}"
            ></ha-icon>
          </div>
        </div>
        ${isOpen ? html`
          <div class="card-content">
            <ha-textfield
              label="Name"
              .value="${card.name || ''}"
              .configValue="cards.${cardIndex}.name"
              @input="${this._valueChanged}"
            ></ha-textfield>
            <ha-select
              label="Domain"
              .value="${card.domain || 'light'}"
              .configValue="cards.${cardIndex}.domain"
              @selected="${this._valueChanged}"
              @closed="${(e) => e.stopPropagation()}"
            >
              ${editorDomains.map(d => html`<mwc-list-item .value="${d}">${d}</mwc-list-item>`)}
            </ha-select>
            <ha-textfield
              label="Included Entities (comma-separated)"
              .value="${(card.include || []).join(', ')}"
              .configValue="cards.${cardIndex}.include"
              @input="${this._valueChanged}"
              placeholder="light.living_room, light.kitchen"
            ></ha-textfield>
            <ha-textfield
              label="Excluded Entities (comma-separated)"
              .value="${(card.exclude || []).join(', ')}"
              .configValue="cards.${cardIndex}.exclude"
              @input="${this._valueChanged}"
              placeholder="light.decorative, switch.unused"
            ></ha-textfield>
            <div class="styles-container">
              <h5>Conditions</h5>
              ${(card.styles || []).map((style, styleIndex) => this._renderStyle(style, cardIndex, styleIndex))}
              <mwc-button @click="${() => this._addOrDelete('add', ['cards', cardIndex, 'styles'])}" outlined>
                <ha-icon icon="mdi:plus"></ha-icon> Add Condition
              </mwc-button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderStyle(style, cardIndex, styleIndex) {
    return html`
      <div class="style-editor">
        <div class="toolbar">
          <h6>Condition ${styleIndex + 1}</h6>
          <ha-icon 
            class="delete-btn" 
            icon="mdi:close"
            @click="${() => this._addOrDelete('delete', ['cards', cardIndex, 'styles', styleIndex])}"
          ></ha-icon>
        </div>
        <ha-select 
            label="Condition" 
            .value="${style.condition}" 
            .configValue="cards.${cardIndex}.styles.${styleIndex}.condition" 
            @selected="${this._valueChanged}"
            @closed="${(e) => e.stopPropagation()}"
            >
          ${editorConditions.map(c => html`<mwc-list-item .value="${c}">${conditionLabels[c] || c}</mwc-list-item>`)}
        </ha-select>
        <ha-textfield label="Text" .value="${style.text || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.text" @input="${this._valueChanged}"></ha-textfield>
        <!-- YENİ: Secondary Text alanı eklendi -->
        <ha-textfield label="Secondary Text" .value="${style.secondary_text || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.secondary_text" @input="${this._valueChanged}"></ha-textfield>
        <ha-icon-picker label="Icon" .value="${style.icon || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.icon" @value-changed="${this._valueChanged}"></ha-icon-picker>
        <ha-textfield label="Color" .value="${style.color || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.color" @input="${this._valueChanged}"></ha-textfield>
      </div>
    `;
  }

  static get styles() {
    return css`
      h3 { margin-bottom: 8px; font-weight: 500; }
      .card-editor, .style-editor { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; margin-top: 12px; }
      .toolbar { display: flex; justify-content: space-between; align-items: center; }
      .card-editor > .toolbar { cursor: pointer; }
      .card-content { padding-top: 12px; }
      .card-title { flex-grow: 1; }
      .actions { display: flex; align-items: center; color: var(--secondary-text-color); }
      h4, h5, h6 { margin: 0; font-weight: 500; }
      .delete-btn { cursor: pointer; margin-left: 8px; }
      .delete-btn:hover { color: var(--primary-text-color); }
      ha-textfield, ha-select, ha-icon-picker { display: block; margin-bottom: 8px; }
      mwc-button { margin-top: 8px; }
    `;
  }
}

customElements.define("summary-card-editor", SummaryCardEditor);


const DOMAIN_STATE_MAP = {
  light: { active: ['on'] },
  switch: { active: ['on'] },
  binary_sensor: { active: ['on'] },
  climate: { active: ['heat', 'cool', 'heat_cool', 'auto', 'dry', 'fan_only'] },
  cover: { active: ['open', 'opening', 'closing'] },
  media_player: { active: ['playing', 'buffering', 'on'] },
  person: { active: ['home'] },
  alarm_control_panel: { active: ['armed_home', 'armed_away', 'armed_night', 'pending', 'triggered'] },
  lock: { active: ['unlocked'] },
  vacuum: { active: ['cleaning', 'paused', 'returning', 'error'] },
};

class SummaryCard extends LitElement {

  static async getConfigElement() {
    return document.createElement('summary-card-editor');
  }

  static getStubConfig() {
    return {
      columns: 3,
      row_height: '85px',
      cards: [
        {
          domain: 'light',
          name: 'Lights',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:lightbulb-off', color: 'grey' },
            { condition: 'any_active', text: '{active_count} on', icon: 'mdi:lightbulb-on', color: 'orange' },
            { condition: 'all_inactive', text: 'All Off', icon: 'mdi:lightbulb-off-outline', color: 'green' },
          ],
        },
        {
          domain: 'switch',
          name: 'Switches',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:power-plug-off', color: 'grey' },
            { condition: 'any_active', text: '{active_count} on', icon: 'mdi:power-plug', color: 'orange' },
            { condition: 'all_inactive', text: 'All Off', icon: 'mdi:power-plug-off-outline', color: 'green' },
          ],
        },
        {
          domain: 'binary_sensor',
          name: 'Sensors',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:alert-circle-outline', color: 'grey' },
            { condition: 'any_active', text: '{active_count} detected', icon: 'mdi:alert-circle', color: 'orange' },
            { condition: 'all_inactive', text: 'All Clear', icon: 'mdi:check-circle', color: 'green' },
          ],
        },
        {
          domain: 'climate',
          name: 'Climate',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:thermostat-box', color: 'grey' },
            { condition: 'any_active', text: '{active_count} active', icon: 'mdi:thermostat', color: 'orange' },
            { condition: 'all_inactive', text: 'All Off', icon: 'mdi:power', color: 'green' },
          ],
        },
        {
          domain: 'cover',
          name: 'Covers',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:window-shutter-alert', color: 'grey' },
            { condition: 'any_active', text: '{active_count} open', icon: 'mdi:window-shutter-open', color: 'red' },
            { condition: 'all_inactive', text: 'All Closed', icon: 'mdi:window-shutter', color: 'green' },
          ],
        },
        {
          domain: 'media_player',
          name: 'Media Players',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:cast-off', color: 'grey' },
            { condition: 'any_active', text: '{active_count} playing', icon: 'mdi:cast-connected', color: 'dodgerblue' },
            { condition: 'all_inactive', text: 'All Idle', icon: 'mdi:cast', color: 'green' },
          ],
        },
        {
          domain: 'person',
          name: 'People',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:account-question', color: 'grey' },
            { condition: 'any_active', text: '{active_count} at home', icon: 'mdi:account-group', color: 'green' },
            { condition: 'all_inactive', text: 'Everyone away', icon: 'mdi:account-group-outline', color: 'orange' },
          ],
        },
        {
          domain: 'alarm_control_panel',
          name: 'Alarm',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:shield-off', color: 'grey' },
            { condition: 'any_active', text: 'Armed!', icon: 'mdi:shield-check', color: 'red' },
            { condition: 'all_inactive', text: 'Disarmed', icon: 'mdi:shield-outline', color: 'green' },
          ],
        },
        {
          domain: 'lock',
          name: 'Locks',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:lock-alert', color: 'grey' },
            { condition: 'any_active', text: '{active_count} unlocked', icon: 'mdi:lock-open-variant', color: 'red' },
            { condition: 'all_inactive', text: 'All Locked', icon: 'mdi:lock', color: 'green' },
          ],
        },
        {
          domain: 'vacuum',
          name: 'Vacuums',
          styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:robot-vacuum-variant-alert', color: 'grey' },
            { condition: 'any_active', text: '{active_count} cleaning', icon: 'mdi:robot-vacuum-variant', color: 'dodgerblue' },
            { condition: 'all_inactive', text: 'All Docked', icon: 'mdi:robot-vacuum-variant', color: 'green' },
          ],
        },
      ],
    };
  }

  static get properties() {
    return { hass: {}, config: {} };
  }

  setConfig(config) {
    if (!config || !config.cards || !Array.isArray(config.cards)) {
      throw new Error("Configuration must be an array of 'cards'.");
    }
    this.config = config;
  }

  render() {
    if (!this.hass || !this.config) return html``;

    return html`
      <div class="grid-container" style="--grid-columns: ${this.config.columns || 3}; --card-height: ${this.config.row_height || '85px'};">
        ${this.config.cards.map((cardConfig) => this._renderCard(cardConfig))}
      </div>
    `;
  }

  _renderCard(cardConfig) {
    const entities = this._getEntities(cardConfig);
    const style = this._getStyleForEntities(entities, cardConfig);

    if (entities.length === 0 && Object.keys(style).length === 0) {
        return html``;
    }

    return html`
      <div class="status-card" style="--icon-color: ${style.color || "var(--primary-text-color)"};">
        <div class="icon">
          <ha-icon icon="${style.icon || "mdi:help-circle"}"></ha-icon>
        </div>
        <div class="info">
          <div class="primary-text">${style.text || cardConfig.name}</div>
          <!-- DEĞİŞİKLİK: secondary_text artık stil kuralından geliyor -->
          <div class="secondary-text">${style.secondary_text || ""}</div>
        </div>
      </div>
    `;
  }

  _getEntities(cardConfig) {
    if (!this.hass) return [];
    if (cardConfig.entity) return [this.hass.states[cardConfig.entity]];
    if (cardConfig.domain) {
      let domainEntities = Object.values(this.hass.states).filter((entity) =>
        entity.entity_id.startsWith(cardConfig.domain + ".")
      );
      if (cardConfig.include && Array.isArray(cardConfig.include) && cardConfig.include.length > 0) {
        const includeSet = new Set(cardConfig.include);
        return domainEntities.filter(entity => includeSet.has(entity.entity_id));
      }
      if (cardConfig.exclude && Array.isArray(cardConfig.exclude) && cardConfig.exclude.length > 0) {
        const excludeSet = new Set(cardConfig.exclude);
        return domainEntities.filter(entity => !excludeSet.has(entity.entity_id));
      }
      return domainEntities;
    }
    return [];
  }

  _getStyleForEntities(entities, cardConfig) {
    let style = {};
    if (!cardConfig.styles || !entities) {
        if (!entities || entities.length === 0) return {};
        return style;
    }

    const domain = cardConfig.domain;
    const activeStates = DOMAIN_STATE_MAP[domain]?.active || ['on'];
    const activeEntities = entities.filter(e => activeStates.includes(e.state));
    const activeCount = activeEntities.length;
    const unavailableEntities = entities.filter(e => e.state === 'unavailable');
    const unavailableCount = unavailableEntities.length;
    const inactiveCount = entities.length - activeCount - unavailableCount;

    if (entities.length === 0) {
      return {};
    }

    for (const rule of cardConfig.styles) {
      let conditionMet = false;
      switch (rule.condition) {
        case 'any_active':
          conditionMet = activeCount > 0;
          break;
        case 'all_inactive':
          conditionMet = activeCount === 0 && unavailableCount === 0 && entities.length > 0;
          break;
        case 'any_unavailable':
          conditionMet = unavailableCount > 0;
          break;
        case 'any_inactive':
          conditionMet = inactiveCount > 0;
          break;
        case 'all_active':
          conditionMet = activeCount === entities.length && entities.length > 0;
          break;
      }
      if (conditionMet) {
        style = { ...rule };
        if (style.text) {
          style.text = style.text
            .replace('{active_count}', activeCount)
            .replace('{inactive_count}', inactiveCount)
            .replace('{unavailable_count}', unavailableCount);
        }
        // YENİ: secondary_text de değişkenleri destekliyor
        if (style.secondary_text) {
          style.secondary_text = style.secondary_text
            .replace('{active_count}', activeCount)
            .replace('{inactive_count}', inactiveCount)
            .replace('{unavailable_count}', unavailableCount);
        }
        return style;
      }
    }
    return style;
  }

  static get styles() {
    return css`
      .grid-container {
        display: grid;
        grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
        gap: 8px;
      }
      .status-card {
        background: var(--ha-card-background, var(--card-background-color, #282828));
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
        height: var(--card-height, 85px);
        box-sizing: border-box;
      }
      .icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        flex-shrink: 0;
      }
      .icon::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: var(--icon-color, var(--primary-text-color));
        opacity: 0.2;
      }
      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-color, var(--primary-text-color));
        position: relative;
      }
      .info {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .primary-text {
        font-weight: bold;
      }
      .secondary-text {
        font-size: 0.9em;
        color: var(--secondary-text-color);
      }
    `;
  }
}

customElements.define("summary-card", SummaryCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "summary-card",
  name: "Summary Card",
  preview: true,
  description: "A custom card that creates a dynamic grid with filtering and conditional styles, aware of domain-specific states.",
});
