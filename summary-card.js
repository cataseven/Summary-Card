import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

const DOMAIN_CONDITIONS = {
  light: {
    if_any_on: { label: 'If Any On', logic: 'any_active' },
    if_all_off: { label: 'If All Off', logic: 'all_inactive' },
    if_any_off: { label: 'If Any Off', logic: 'any_inactive' },
    if_all_on: { label: 'If All On', logic: 'all_active' },
    any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  switch: {
    if_any_on: { label: 'If Any On', logic: 'any_active' },
    if_all_off: { label: 'If All Off', logic: 'all_inactive' },
    if_any_off: { label: 'If Any Off', logic: 'any_inactive' },
    if_all_on: { label: 'If All On', logic: 'all_active' },
    any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  binary_sensor: {
    if_any_true: { label: 'If Any True/On', logic: 'any_active' },
    if_all_false: { label: 'If All False/Off', logic: 'all_inactive' },
    if_any_false: { label: 'If Any False/Off', logic: 'any_inactive' },
    if_all_true: { label: 'If All True/On', logic: 'all_active' },
    any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  cover: {
    if_any_open: { label: 'If Any Open', logic: 'any_active' },
    if_all_closed: { label: 'If All Closed', logic: 'all_inactive' },
    if_any_closed: { label: 'If Any Closed', logic: 'any_inactive' },
    if_all_open: { label: 'If All Open', logic: 'all_active' },
    any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  media_player: {
      if_any_playing: { label: 'If Any Playing', logic: 'any_active' },
      if_all_idle: { label: 'If All Idle', logic: 'all_inactive' },
      if_any_idle: { label: 'If Any Idle', logic: 'any_inactive' },
      if_all_playing: { label: 'If All Playing', logic: 'all_active' },
      any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  person: {
      if_any_at_home: { label: 'If Any At Home', logic: 'any_active' },
      if_everyone_away: { label: 'If Everyone Away', logic: 'all_inactive' },
      if_any_away: { label: 'If Any Away', logic: 'any_inactive' },
      if_everyone_at_home: { label: 'If Everyone At Home', logic: 'all_active' },
      any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  alarm_control_panel: {
      if_any_armed: { label: 'If Any Armed', logic: 'any_active' },
      if_all_disarmed: { label: 'If All Disarmed', logic: 'all_inactive' },
      if_any_disarmed: { label: 'If Any Disarmed', logic: 'any_inactive' },
      if_all_armed: { label: 'If All Armed', logic: 'all_active' },
      any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  lock: {
      if_any_unlocked: { label: 'If Any Unlocked', logic: 'any_active' },
      if_all_locked: { label: 'If All Locked', logic: 'all_inactive' },
      if_any_locked: { label: 'If Any Locked', logic: 'any_inactive' },
      if_all_unlocked: { label: 'If All Unlocked', logic: 'all_active' },
      any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  vacuum: {
      if_any_docked: { label: 'If Any Docked', logic: 'any_active' },
      if_all_not_docked: { label: 'If All Not Docked', logic: 'all_inactive' },
      if_any_not_docked: { label: 'If Any Not Docked', logic: 'any_inactive' },
      if_all_docked: { label: 'If All Docked', logic: 'all_active' },
      any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  camera: {
    if_any_streaming: { label: 'If Any Streaming', logic: 'any_active' },
    if_all_idle: { label: 'If All Idle', logic: 'all_inactive' },
    if_any_idle: { label: 'If Any Idle', logic: 'any_inactive' },
    if_all_streaming: { label: 'If All Streaming', logic: 'all_active' },
    any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  climate: {
    if_any_active: { label: 'If Any Active', logic: 'any_active' },
    if_all_inactive: { label: 'If All Inactive', logic: 'all_inactive' },
    if_any_inactive: { label: 'If Any Inactive', logic: 'any_inactive' },
    if_all_active: { label: 'If All Active', logic: 'all_active' },
    any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  },
  sensor: {
    if_any_above: { label: 'If Any Above Value', logic: 'above' },
    if_any_below: { label: 'If Any Below Value', logic: 'below' },
    if_any_equal: { label: 'If Any Equal to Value', logic: 'equal' },
    if_any_not_equal: { label: 'If Any Not Equal to Value', logic: 'not_equal' },
    any_unavailable: { label: 'If Any Unavailable', logic: 'any_unavailable' }
  }
};

const editorDomains = Object.keys(DOMAIN_CONDITIONS);

const DOMAIN_STATE_MAP = {
  light: { active: ['on'] },
  switch: { active: ['on'] },
  binary_sensor: { active: ['on', 'true'] },
  climate: { active: ['heat', 'cool', 'heat_cool', 'auto', 'dry', 'fan_only'] },
  cover: { active: ['open', 'opening', 'closing', 'stopped'] },
  media_player: { active: ['playing', 'paused', 'buffering', 'on'] },
  person: { active: ['home'] },
  alarm_control_panel: { active: ['armed_home', 'armed_away', 'armed_night', 'pending', 'triggered', 'arming'] },
  lock: { active: ['unlocked', 'unlocking', 'locking', 'jammed'] },
  vacuum: { active: ['charging', 'docked'] },
  camera: { active: ['streaming', 'on', 'idle'] },
};

class SummaryCard extends LitElement {

  static get properties() {
    return {
      hass: {},
      config: {},
      _cardComputedStyles: { state: true },
    };
  }

  constructor() {
    super();
    this._cardComputedStyles = new Map();
    this._debouncedComputeStyles = this._debounce(() => this._updateAllCardStyles(), 100);
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateInterval = setInterval(() => {
      if (this.config && this.config.cards.some(c => c.domain === 'clock')) {
        this.requestUpdate();
      }
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  static async getConfigElement() {
    return document.createElement('summary-card-editor');
  }

  static getStubConfig() {
    return {
      columns: 6,
      row_height: '55px',
      cards: [
        {
          domain: 'light', name: 'Lights', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:lightbulb-off', color: 'grey' },
            { condition: 'if_any_on', text: '{{ active_count }} on', icon: 'mdi:lightbulb-on', color: 'orange' },
            { condition: 'if_all_off', text: 'All Off', icon: 'mdi:lightbulb-off-outline', color: 'green' }
          ],
        },
        {
          domain: 'switch', name: 'Switches', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:power-plug-off', color: 'grey' },
            { condition: 'if_any_on', text: '{{ active_count }} on', icon: 'mdi:power-plug', color: 'orange' },
            { condition: 'if_all_off', text: 'All Off', icon: 'mdi:power-plug-off-outline', color: 'green' }
          ],
        },
        {
          domain: 'binary_sensor', name: 'Sensors', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:alert-circle-outline', color: 'grey' },
            { condition: 'if_any_true', text: '{{ active_count }} detected', icon: 'mdi:alert-circle', color: 'orange' },
            { condition: 'if_all_false', text: 'All Clear', icon: 'mdi:check-circle', color: 'green' }
          ],
        },
        {
          domain: 'climate', name: 'Climate', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:thermostat-box', color: 'grey' },
            { condition: 'if_any_active', text: '{{ active_count }} active', icon: 'mdi:thermostat', color: 'orange' },
            { condition: 'if_all_inactive', text: 'All Off', icon: 'mdi:power', color: 'green' }
          ],
        },
        {
          domain: 'cover', name: 'Covers', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:window-shutter-alert', color: 'grey' },
            { condition: 'if_any_open', text: '{{ active_count }} open', icon: 'mdi:window-shutter-open', color: 'red' },
            { condition: 'if_all_closed', text: 'All Closed', icon: 'mdi:window-shutter', color: 'green' }
          ],
        },
        {
          domain: 'media_player', name: 'Media Players', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:cast-off', color: 'grey' },
            { condition: 'if_any_playing', text: '{{ active_count }} playing', icon: 'mdi:cast-connected', color: 'dodgerblue' },
            { condition: 'if_all_idle', text: 'All Idle', icon: 'mdi:cast', color: 'green' }
          ],
        },
        {
          domain: 'person', name: 'People', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:account-question', color: 'grey' },
            { condition: 'if_any_at_home', text: '{{ active_count }} at home', icon: 'mdi:account-group', color: 'green' },
            { condition: 'if_everyone_away', text: 'Everyone away', icon: 'mdi:account-group-outline', color: 'orange' }
          ],
        },
        {
          domain: 'alarm_control_panel', name: 'Alarm', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:shield-off', color: 'grey' },
            { condition: 'if_any_armed', text: 'Armed!', icon: 'mdi:shield-check', color: 'red' },
            { condition: 'if_all_disarmed', text: 'Disarmed', icon: 'mdi:shield-outline', color: 'green' }
          ],
        },
        {
          domain: 'lock', name: 'Locks', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:lock-alert', color: 'grey' },
            { condition: 'if_any_unlocked', text: '{{ active_count }} unlocked', icon: 'mdi:lock-open-variant', color: 'red' },
            { condition: 'if_all_locked', text: 'All Locked', icon: 'mdi:lock', color: 'green' }
          ],
        },
        {
          domain: 'vacuum', name: 'Vacuums', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:robot-vacuum-variant-alert', color: 'grey' },
            { condition: 'if_any_not_docked', text: '{{ active_count }} cleaning', icon: 'mdi:robot-vacuum-variant', color: 'dodgerblue' },
            { condition: 'if_all_docked', text: 'All Docked', icon: 'mdi:robot-vacuum-variant', color: 'green' }
          ],
        },
        {
          domain: 'camera', name: 'Cameras', styles: [
            { condition: 'any_unavailable', text: 'Unavailable', icon: 'mdi:camera-off', color: 'grey' },
            { condition: 'if_any_streaming', text: '{{ active_count }} streaming', icon: 'mdi:camera-wireless', color: 'orange' },
            { condition: 'if_all_idle', text: 'All idle', icon: 'mdi:camera', color: 'green' }
          ],
        },
      ],
    };
  }

  setConfig(config) {
    if (!config || !config.cards || !Array.isArray(config.cards)) {
      throw new Error("Configuration must be an array of 'cards'.");
    }
    this.config = config;
    this._cardComputedStyles = new Map();
    this._debouncedComputeStyles();
  }

  updated(changedProperties) {
    if (changedProperties.has('hass') || changedProperties.has('config')) {
      this._debouncedComputeStyles();
    }
  }

  async _updateAllCardStyles() {
    if (!this.hass || !this.config || !this.config.cards) {
      return;
    }

    const newComputedStyles = new Map();
    const promises = this.config.cards.map(async (cardConfig, index) => {
      const style = await this._computeCardStyleAsync(cardConfig);
      newComputedStyles.set(index, style);
    });

    await Promise.all(promises);
    this._cardComputedStyles = newComputedStyles;
    this.requestUpdate('_cardComputedStyles');
  }

  _debounce(func, delay) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  _handleClick(cardConfig) {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: {
        entityId: cardConfig.entity || (cardConfig.domain ? `${cardConfig.domain}.summary` : null)
      },
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this.config) return html ``;

    return html `
      <div class="grid-container" style="--grid-columns: ${this.config.columns || 6}; --card-height: ${this.config.row_height || '55px'};">
        ${this.config.cards.map((cardConfig, index) => this._renderCard(cardConfig, index))}
      </div>
    `;
  }

  _renderCard(cardConfig, index) {
    if (cardConfig.domain === 'clock') {
      const now = new Date();
      const primaryText = now.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
      const datePart = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(now);
      const dayPart = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
      const secondaryText = `${datePart}, ${dayPart}`;
      const iconColor = cardConfig.color || 'green';

      return html`
        <div class="status-card" style="--icon-color: ${iconColor};" @click="${() => this._handleClick(cardConfig)}">
          <div class="icon"><ha-icon icon="mdi:clock"></ha-icon></div>
          <div class="info">
            <div class="primary-text">${primaryText}</div>
            <div class="secondary-text">${secondaryText}</div>
          </div>
        </div>
      `;
    }

    const style = this._cardComputedStyles.get(index) || {};

    if (Object.keys(style).length === 0) {
      return html`
        <div class="status-card" style="--icon-color: var(--primary-text-color);">
          <div class="icon"><ha-icon icon="mdi:loading"></ha-icon></div>
          <div class="info">
            <div class="primary-text">No Condition Match</div>
            <div class="secondary-text"></div>
          </div>
        </div>
      `;
    }

    const primaryText = style.text || cardConfig.name;
    const secondaryText = style.secondary_text || "";
    const hasText = primaryText || secondaryText;
    return html`
      <div class="status-card ${!hasText ? 'icon-only' : ''}" style="--icon-color: ${style.color || "var(--primary-text-color)"};" @click="${() => this._handleClick(cardConfig)}">
        <div class="icon">
          <ha-icon icon="${style.icon || "mdi:help-circle"}"></ha-icon>
        </div>
        ${hasText ? html`
          <div class="info">
            <div class="primary-text">${primaryText}</div>
            <div class="secondary-text">${secondaryText}</div>
          </div>
        ` : ''}
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

  async _computeCardStyleAsync(cardConfig) {
    if (!this.hass || !cardConfig.styles || !this.hass.states) {
        return {};
    }

    if (cardConfig.domain === 'clock') {
        const now = new Date();
        const primaryText = now.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        const datePart = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(now);
        const dayPart = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
        const secondaryText = `${datePart}, ${dayPart}`;
        return { icon: 'mdi:clock', text: primaryText, secondary_text: secondaryText, color: cardConfig.color || 'green' };
    }

    const entities = this._getEntities(cardConfig);
    if (entities.length === 0) {
        return {};
    }

    const domain = cardConfig.domain;
    const activeStates = DOMAIN_STATE_MAP[domain]?.active || ['on'];
    const activeCount = entities.filter(e => activeStates.includes(e.state)).length;
    const unavailableCount = entities.filter(e => e.state === 'unavailable').length;
    const inactiveCount = entities.length - activeCount - unavailableCount;

    for (const rule of cardConfig.styles) {
        let conditionMet = false;

        const logicType = DOMAIN_CONDITIONS[domain]?.[rule.condition]?.logic;

        if (!logicType) {
          continue;
        }

        if (cardConfig.domain === 'sensor') {
            const ruleValue = parseFloat(rule.value);
            if (logicType === 'any_unavailable' && unavailableCount > 0) {
                conditionMet = true;
            } else if (!isNaN(ruleValue)) {
                switch (logicType) {
                    case 'above': conditionMet = entities.some(e => !isNaN(parseFloat(e.state)) && parseFloat(e.state) > ruleValue); break;
                    case 'below': conditionMet = entities.some(e => !isNaN(parseFloat(e.state)) && parseFloat(e.state) < ruleValue); break;
                    case 'equal': conditionMet = entities.some(e => !isNaN(parseFloat(e.state)) && parseFloat(e.state) === ruleValue); break;
                    case 'not_equal': conditionMet = entities.some(e => !isNaN(parseFloat(e.state)) && parseFloat(e.state) !== ruleValue); break;
                }
            }
        } else {
            switch (logicType) {
                case 'any_active': conditionMet = activeCount > 0; break;
                case 'all_inactive': conditionMet = activeCount === 0 && unavailableCount === 0 && entities.length > 0; break;
                case 'any_unavailable': conditionMet = unavailableCount > 0; break;
                case 'any_inactive': conditionMet = inactiveCount > 0; break;
                case 'all_active': conditionMet = activeCount === entities.length && entities.length > 0; break;
            }
        }

        if (conditionMet) {
            const templateConditions = rule.template_conditions || [];
            let allTemplatesValid = true;

            for (const tpl of templateConditions) {
                try {
                    const response = await fetch('/api/template', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.hass.auth.data.access_token}` },
                        body: JSON.stringify({ template: tpl })
                    });
                    if (!response.ok) {
                        console.error(`Backend template evaluation API error (${response.status}):`, await response.text());
                        allTemplatesValid = false;
                        break;
                    }
                    const result = await response.text();
                    if (result.trim().toLowerCase() !== 'true') {
                        allTemplatesValid = false;
                        break;
                    }
                } catch (e) {
                    console.error("Network or other error during backend template evaluation:", tpl, e);
                    allTemplatesValid = false;
                    break;
                }
            }

            if (allTemplatesValid) {
                let style = { ...rule };
                const templateVariables = { active_count: activeCount, inactive_count: inactiveCount, unavailable_count: unavailableCount };

                if (style.text) {
                    try {
                        const response = await fetch('/api/template', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.hass.auth.data.access_token}` },
                            body: JSON.stringify({ template: style.text, variables: templateVariables })
                        });
                        if (response.ok) { style.text = await response.text(); }
                        else { console.error(`Error rendering text template (${response.status}):`, await response.text()); style.text = `Template Error: ${style.text}`; }
                    } catch (e) { console.error("Network or other error during text template evaluation:", style.text, e); style.text = `Template Error: ${style.text}`; }
                }

                if (style.secondary_text) {
                    try {
                        const response = await fetch('/api/template', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.hass.auth.data.access_token}` },
                            body: JSON.stringify({ template: style.secondary_text, variables: templateVariables })
                        });
                        if (response.ok) { style.secondary_text = await response.text(); }
                        else { console.error(`Error rendering secondary text template (${response.status}):`, await response.text()); style.secondary_text = `Template Error: ${style.secondary_text}`; }
                    } catch (e) { console.error("Network or other error during secondary text template evaluation:", style.secondary_text, e); style.secondary_text = `Template Error: ${style.secondary_text}`; }
                }

                return style;
            }
        }
    }
    return {};
}

  static get styles() {
    return css`
      .grid-container {
        display: grid;
        grid-template-columns: repeat(var(--grid-columns, 6), 1fr);
        gap: 4px;
      }
      .status-card {
        background: var(--ha-card-background, var(--card-background-color, #282828));
        border-radius: 6px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
        height: var(--card-height, 55px);
        box-sizing: border-box;
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
      }
      .status-card.icon-only {
        justify-content: center;
        gap: 0;
      }
      .status-card:hover {
        transform: translateY(-2px);
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
        color: var(--primary-text-color);
      }
      .secondary-text {
        font-size: 0.9em;
        color: var(--secondary-text-color);
      }
    `;
  }
}

customElements.define("summary-card", SummaryCard);

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
    if (this.hass && this._config && !this._didInitialFilter) {
      const defaultConfig = SummaryCard.getStubConfig();
      const isDefaultConfig = JSON.stringify(this._config) === JSON.stringify(defaultConfig);

      if (isDefaultConfig) {
        const allEntities = Object.values(this.hass.states);
        const presentDomains = new Set(allEntities.map(e => e.entity_id.split('.')[0]));
        const filteredCards = defaultConfig.cards.filter(card => presentDomains.has(card.domain));
        const newConfig = { ...this._config, cards: filteredCards };

        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: newConfig },
          bubbles: true,
          composed: true,
        }));
        this.setConfig(newConfig);
      }
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
    } else if (path[path.length - 2] === 'template_conditions' && lastKey === String(parseInt(lastKey, 10))) {
      const index = parseInt(lastKey, 10);
      if (value === "") {
        current.splice(index, 1);
      } else {
        current[index] = value;
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

  _addOrDelete(action, path, type = null) {
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
        if (type === 'clock') {
          newItem = { domain: 'clock', name: 'Clock', color: 'green' };
        } else {
          newItem = { domain: 'light', name: 'New Card', styles: [{ condition: 'if_all_off', text: 'All Off', icon: 'mdi:power-off', color: 'grey' }] };
        }
        this._cardEditorStates.push(true);
      } else if (lastKey === 'styles') {
        newItem = { condition: 'if_any_on', text: 'Active' };
      } else if (lastKey === 'template_conditions') {
        newItem = '';
      }
      current[lastKey].push(newItem);
    } else {
      const indexToDelete = parseInt(lastKey, 10);
      current.splice(indexToDelete, 1);

      const parentKey = path[path.length - 2];
      if (parentKey === 'cards') {
        this._cardEditorStates.splice(indexToDelete, 1);
      }
    }

    this.requestUpdate('_cardEditorStates');
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
  }

  _addTemplateCondition(cardIndex, styleIndex) {
    const newConfig = JSON.parse(JSON.stringify(this._config));
    if (!newConfig.cards[cardIndex].styles[styleIndex].template_conditions) {
      newConfig.cards[cardIndex].styles[styleIndex].template_conditions = [];
    }
    newConfig.cards[cardIndex].styles[styleIndex].template_conditions.push('');
    this.setConfig(newConfig);
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (!this.hass || !this._config) return html ``;

    return html `
      <div class="card-config">
        <h3>General Settings</h3>
        <ha-textfield label="Cards per Row" .value="${this._config.columns || ''}" .configValue=${"columns"} @input="${this._valueChanged}" type="text" placeholder="Default: 6"></ha-textfield>
        <ha-textfield label="Card Height (e.g. 55px)" .value="${this._config.row_height || ''}" .configValue=${"row_height"} @input="${this._valueChanged}" placeholder="Default: 55px"></ha-textfield>

        <div class="cards-container">
          <h3>Cards</h3>
          ${(this._config.cards || []).map((card, cardIndex) => this._renderCard(card, cardIndex))}
          <div class="buttons">
            <mwc-button @click="${() => this._addOrDelete('add', ['cards'], 'domain')}" outlined><ha-icon icon="mdi:plus"></ha-icon> Add Domain Card</mwc-button>
            <mwc-button @click="${() => this._addOrDelete('add', ['cards'], 'clock')}" outlined><ha-icon icon="mdi:clock-plus-outline"></ha-icon> Add Clock</mwc-button>
          </div>
        </div>
      </div>
    `;
  }

  _renderCard(card, cardIndex) {
    const isOpen = this._cardEditorStates[cardIndex];
    const isClockCard = card.domain === 'clock';

    return html `
      <div class="card-editor">
        <div class="toolbar" @click="${this._toggleCardEditor}" .cardIndex="${cardIndex}">
          <h4 class="card-title">Card ${cardIndex + 1}: ${card.name || (isClockCard ? 'Clock' : (card.domain || 'New Card'))}</h4>
          <div class="actions">
            <ha-icon class="toggle-icon" icon="${isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}"></ha-icon>
            <ha-icon class="delete-btn" icon="mdi:close" @click="${(e) => { e.stopPropagation(); this._addOrDelete('delete', ['cards', cardIndex]); }}"></ha-icon>
          </div>
        </div>
        ${isOpen ? html`
          <div class="card-content">
            ${isClockCard ? html`
              <ha-textfield label="Color" .value="${card.color || ''}" .configValue="cards.${cardIndex}.color" @input="${this._valueChanged}" placeholder="Default: text color (e.g., dodgerblue)"></ha-textfield>
            ` : html`
              <ha-select label="Domain" .value="${card.domain || 'light'}" .configValue="cards.${cardIndex}.domain" @selected="${this._valueChanged}" @closed="${(e) => e.stopPropagation()}">
                ${editorDomains.map(d => html`<mwc-list-item .value="${d}">${d.charAt(0).toUpperCase() + d.slice(1)}</mwc-list-item>`)}
              </ha-select>
              <ha-textfield label="Name" .value="${card.name || ''}" .configValue="cards.${cardIndex}.name" @input="${this._valueChanged}"></ha-textfield>
              <ha-textfield label="Included Entities (comma-separated)" .value="${(card.include || []).join(', ')}" .configValue="cards.${cardIndex}.include" @input="${this._valueChanged}" placeholder="e.g. sensor.living_room_temperature"></ha-textfield>
              <ha-textfield label="Excluded Entities (comma-separated)" .value="${(card.exclude || []).join(', ')}" .configValue="cards.${cardIndex}.exclude" @input="${this._valueChanged}" placeholder="e.g. sensor.outside_temperature"></ha-textfield>
              <div class="styles-container">
                <h5>Scenarios</h5>
                ${(card.styles || []).map((style, styleIndex) => this._renderStyle(style, card, cardIndex, styleIndex))}
                <mwc-button @click="${() => this._addOrDelete('add', ['cards', cardIndex, 'styles'])}" outlined><ha-icon icon="mdi:plus"></ha-icon> Add Scenario</mwc-button>
              </div>
            `}
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderStyle(style, card, cardIndex, styleIndex) {
    const domain = card.domain;
    const conditionsForDomain = DOMAIN_CONDITIONS[domain] || {};
    const conditionKeys = Object.keys(conditionsForDomain);
    const isSensorDomain = domain === 'sensor';
    const sensorValueConditions = ['if_any_above', 'if_any_below', 'if_any_equal', 'if_any_not_equal'];

    return html`
      <div class="style-editor">
        <div class="toolbar">
          <h6>Scenario ${styleIndex + 1}</h6>
          <ha-icon class="delete-btn" icon="mdi:close" @click="${() => this._addOrDelete('delete', ['cards', cardIndex, 'styles', styleIndex])}"></ha-icon>
        </div>
        <ha-select
            label="Condition"
            .value="${style.condition}"
            .configValue="cards.${cardIndex}.styles.${styleIndex}.condition"
            @selected="${this._valueChanged}"
            @closed="${(e) => e.stopPropagation()}"
        >
            ${conditionKeys.map(key => html`<mwc-list-item .value="${key}">${conditionsForDomain[key].label}</mwc-list-item>`)}
        </ha-select>

        ${isSensorDomain && sensorValueConditions.includes(style.condition) ? html`
          <ha-textfield label="Value" .value="${style.value || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.value" @input="${this._valueChanged}" placeholder="e.g. 25"></ha-textfield>
        ` : ''}

        <ha-textfield label="Text" .value="${style.text || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.text" @input="${this._valueChanged}" placeholder="e.g., {{ active_count }} on"></ha-textfield>
        <ha-textfield label="Secondary Text" .value="${style.secondary_text || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.secondary_text" @input="${this._valueChanged}" placeholder="e.g., All active"></ha-textfield>
        <ha-icon-picker label="Icon" .value="${style.icon || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.icon" @value-changed="${this._valueChanged}"></ha-icon-picker>
        <ha-textfield label="Color" .value="${style.color || ''}" .configValue="cards.${cardIndex}.styles.${styleIndex}.color" @input="${this._valueChanged}"></ha-textfield>

        <div class="template-conditions-container">
          <h5>Template Conditions</h5>
          ${(style.template_conditions || []).map((tpl, i) => html`
            <div class="template-condition-item">
              <ha-textfield label="Template Condition ${i + 1}" .value="${tpl}" .configValue="cards.${cardIndex}.styles.${styleIndex}.template_conditions.${i}" @input="${this._valueChanged}" placeholder="{{ is_state('light.living_room', 'on') }}"></ha-textfield>
              <ha-icon class="delete-btn" icon="mdi:close" @click="${() => this._addOrDelete('delete', ['cards', cardIndex, 'styles', styleIndex, 'template_conditions', i])}"></ha-icon>
            </div>
          `)}
          <mwc-button @click="${() => this._addTemplateCondition(cardIndex, styleIndex)}" outlined><ha-icon icon="mdi:plus"></ha-icon> Add Template Condition</mwc-button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      h3, h5, h4, h6 { margin: 0; font-weight: 500; color: var(--primary-text-color); }
      h3 { margin-bottom: 8px; }
      h5 { margin-top: 16px; margin-bottom: 8px; }
      .card-editor, .style-editor {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 12px;
        margin-top: 12px;
        background-color: var(--card-background-color, #282828);
      }
      .toolbar { display: flex; justify-content: space-between; align-items: center; }
      .card-editor > .toolbar { cursor: pointer; }
      .card-content { padding-top: 12px; }
      .card-title { flex-grow: 1; text-transform: capitalize; }
      .actions { display: flex; align-items: center; color: var(--secondary-text-color); }
      .delete-btn { cursor: pointer; margin-left: 8px; color: var(--secondary-text-color); }
      .delete-btn:hover { color: var(--error-color, #f44336); }
      ha-textfield, ha-select, ha-icon-picker {
        display: block;
        margin-bottom: 8px;
        --mdc-text-field-ink-color: var(--primary-text-color);
        --mdc-text-field-label-ink-color: var(--secondary-text-color);
      }
      mwc-button { margin-top: 8px; --mdc-theme-primary: var(--primary-color); }
      .buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
      .template-conditions-container { margin-top: 16px; padding-top: 8px; border-top: 1px dashed var(--divider-color); }
      .template-condition-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
      .template-condition-item ha-textfield { flex-grow: 1; margin-bottom: 0; }
    `;
  }
}

customElements.define("summary-card-editor", SummaryCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "summary-card",
  name: "Summary Card",
  preview: true,
  description: "A custom card that creates a dynamic grid with filtering and conditional styles, aware of domain-specific states, and supports template conditions.",
});
