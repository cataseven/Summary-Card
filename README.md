<a href="https://www.buymeacoffee.com/cataseven" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" style="height: 60px !important;width: 217px !important;" >
</a>      

# Summary Card for Home Assistant
---
![image11](images/top.png)

Transform your Home Assistant dashboard into a responsive, intelligent, and beautiful control center. **Summary Card** lets you create compact, domain-based visual summaries with dynamic styling, real-time templating, and smart defaults.

This is not just another Lovelace card. It's a highly customizable system for building status dashboards that feel alive.

![image8](images/sample.png)
---

## ✨ Features

- **Responsive Grid Layout:** Define the number of columns and height per row.
- **Domain-Aware Conditions:** Each domain has intelligent predefined conditions like `if_any_on`, `if_all_idle`, `if_any_heating`, etc.
- **Template-Backed Conditions:** Use full Jinja templates for advanced logic in combination with default logic.
- **Clock Support:** Add a live-updating card showing the current time and date.
- **Auto-Fill on First Use:** Automatically fills in cards based on detected domains on first load.
- **Fully Visual Editor:** No YAML required. Add/edit cards, conditions, and templates via a clean UI.
- **Jinja in Text:** Use domain-specific count placeholders like `{{ on_count }}`, `{{ heating_count }}` or full backend-evaluated Jinja strings inside `text` and `secondary_text`.
- **Tap & Hold Actions:** More Info, Navigate, URL, Perform Action, Toggle, Nothing — with full **confirmation dialog** support (HA native).
- **Vacuum Popup with Input Select:** Optionally display `input_select` entities (e.g., map selection) directly inside the vacuum more-info popup.
  
---

## 🛠 Installation

### HACS (Recommended)

1. Go to **HACS > Frontend**.
2. Click "Explore & Download Repositories".
3. Search for **Summary Card** and install it.
4. Refresh your browser.

### Manual

1. Download `summary-card.js` from the [releases](https://github.com/YOUR_USERNAME/summary-card/releases).
2. Place it in `config/www/`.
3. Add as a resource:

```yaml
# Configuration > Dashboards > Resources
url: /local/summary-card.js
type: module
```

---

## ⚙ Configuration Options

### ADDING CARD TO DASHBOARD
Search from the picker: Summary Card
Card detects your available domains automatically. You can modify as you want
![image6](images/picker.png)


### UI EDITOR
![image7](images/ui1.png)


### HIERARCHY

ADD DOMAIN CARD -> SELECT DOMAIN -> ADD SCENARIO -> SET OUTPUTS<br>
<p>Also you can OPTIONALLY: add template conditions to your scenarios<br>
Also you can OPTIONALLY: include only spesific entities of the domain<br>
Also you can OPTIONALLY: exclude spesific entities from the domain<br>

Card try to create card for all available domains. You can modify auto-prepared card!

<br>
<br>

### Root Config

| Option        | Type     | Required | Description                                 | Default |
| ------------- | -------- | -------- | ------------------------------------------- | ------- |
| `type`        | string   | ✅       | Always `custom:summary-card`                | -       |
| `columns`     | integer  | ❌       | Number of cards per row                     | `6`     |
| `row_height`  | string   | ❌       | CSS height like `60px`, `10vh`, etc.        | `55px`  |
| `cards`       | array    | ✅       | List of cards (domain or clock)             | -       |

---

#### 1. **Domain Card**

| Option         | Type     | Required | Description                                      |
| -------------- | -------- | -------- | ------------------------------------------------ |
| `domain`       | string   | ✅       | Domain like `light`, `switch`, `sensor`, etc.    |
| `name`         | string   | ❌       | Optional - Display name                        |
| `include`      | array    | ❌       | Optional - List of `entity_id`s to include. Only consider these entities. Forget the others               |
| `exclude`      | array    | ❌       | Optional - List of `entity_id`s to exclude. Consider all entities of the domain but exlude this ones                 |
| `styles`       | array    | ✅       | Array of style rules based on conditions         |
| `tap_action`   | object   | ❌       | Action on tap (default: `more-info`). Supports `confirmation` |
| `hold_action`  | object   | ❌       | Action on hold (default: `none`). Supports `confirmation` |
| `show_input_select` | boolean | ❌  | **Vacuum only.** Show input_select entities in more-info popup |
| `input_select_entities` | array | ❌ | **Vacuum only.** List of `input_select` entity_ids to display |

#### 2. **Clock Card**

| Option            | Type     | Required | Description                                      |
| ----------------- | -------- | -------- | ------------------------------------------------ |
| `domain`          | string   | ✅       | Must be `"clock"`                                |
| `name`            | string   | ❌       | Display name                                     |
| `color`           | string   | ❌       | Icon circle color (`green`, `#ff0000`, etc.)     |
| `hour_format`     | string   | ❌       | `"24h"` or `"12h"` (default: `24h`)             |
| `time_locale`     | string   | ❌       | Time locale (e.g. `en-US`, `tr-TR`). Auto-detect |
| `date_locale`     | string   | ❌       | Date locale (e.g. `en-US`, `de-DE`). Auto-detect |
| `language_locale` | string   | ❌       | Weekday language (e.g. `en-US`). Auto-detect     |

---

### Style Rules (Inside `styles`)

Each style block is evaluated top to bottom. The first matching rule is applied.

| Option              | Type     | Required | Description |
| -------------------| -------- | -------- | ----------- |
| `condition`         | string   | ✅       | One of the predefined domain-aware keywords like `if_any_on`, `if_all_closed`, `any_unavailable`, etc. |
| `text`              | string   | ❌       | Main line (can include Jinja placeholders) |
| `secondary_text`    | string   | ❌       | Subtext (also supports Jinja)              |
| `icon`              | string   | ❌       | Material Design Icon (`mdi:`)              |
| `color`             | string   | ❌       | CSS color or theme variable                |
| `value`             | number/string | ❌   | Required only for sensor domain rules like `if_any_equal`, `if_any_above`, `if_any_below`, etc. |
| `template_conditions` | array | ❌       | List of Jinja template strings that must evaluate to `true` |

---

### Domain Conditions

Each domain exposes a tailored set of conditions. All domains also include `any_unavailable`.

| Domain | Available Conditions |
|---|---|
| `light`, `switch`, `input_boolean` | `if_any_on`, `if_all_on`, `if_any_off`, `if_all_off` |
| `binary_sensor` | `if_any_true`, `if_all_true`, `if_any_false`, `if_all_false` |
| `cover` | `if_any_open`, `if_all_open`, `if_any_closed`, `if_all_closed`, `if_any_opening`, `if_all_opening`, `if_any_closing`, `if_all_closing`, `if_any_stopped`, `if_all_stopped` |
| `media_player` | `if_any_playing`, `if_all_playing`, `if_any_idle`, `if_all_idle`, `if_any_paused`, `if_all_paused`, `if_any_buffering`, `if_all_buffering`, `if_any_on`, `if_all_on`, `if_any_off`, `if_all_off` |
| `person` | `if_any_at_home`, `if_all_at_home`, `if_any_away`, `if_all_away` |
| `alarm_control_panel` | `if_any_armed`, `if_all_armed`, `if_any_disarmed`, `if_all_disarmed`, `if_any_triggered`, `if_all_triggered`, `if_any_arming`, `if_all_arming`, `if_any_pending`, `if_all_pending` |
| `lock` | `if_any_unlocked`, `if_all_unlocked`, `if_any_locked`, `if_all_locked`, `if_any_locking`, `if_all_locking`, `if_any_unlocking`, `if_all_unlocking`, `if_any_jammed`, `if_all_jammed` |
| `vacuum` | `if_any_cleaning`, `if_all_cleaning`, `if_any_docked`, `if_all_docked`, `if_any_returning`, `if_all_returning`, `if_any_paused`, `if_all_paused`, `if_any_idle`, `if_all_idle`, `if_any_error`, `if_all_error` |
| `camera` | `if_any_streaming`, `if_all_streaming`, `if_any_idle`, `if_all_idle`, `if_any_recording`, `if_all_recording` |
| `climate` (HVAC mode) | `if_any_heat`, `if_all_heat`, `if_any_cool`, `if_all_cool`, `if_any_heat_cool`, `if_all_heat_cool`, `if_any_auto`, `if_all_auto`, `if_any_dry`, `if_all_dry`, `if_any_fan_only`, `if_all_fan_only`, `if_any_off`, `if_all_off` |
| `climate` (hvac_action) | `if_any_heating`, `if_all_heating`, `if_any_cooling`, `if_all_cooling`, `if_any_idle`, `if_all_idle`, `if_any_fan`, `if_all_fan`, `if_any_drying`, `if_all_drying`, `if_any_preheating`, `if_all_preheating`, `if_any_defrosting`, `if_all_defrosting` |
| `fan` | `if_any_on`, `if_all_on`, `if_any_off`, `if_all_off` |
| `humidifier` | `if_any_on`, `if_all_on`, `if_any_off`, `if_all_off` |
| `plant` | `if_any_problem`, `if_all_problem`, `if_any_ok`, `if_all_ok` |
| `sensor` | `if_any_above`, `if_any_below`, `if_any_equal`, `if_any_not_equal`, `any_unavailable` |
| `siren` | `if_any_on`, `if_all_on`, `if_any_off`, `if_all_off` |
| `update` | `if_any_on`, `if_all_on`, `if_any_off`, `if_all_off` |
| `water_heater` | `if_any_on`, `if_all_on`, `if_any_off`, `if_all_off`, `if_any_eco`, `if_all_eco`, `if_any_electric`, `if_all_electric`, `if_any_performance`, `if_all_performance`, `if_any_high_demand`, `if_all_high_demand`, `if_any_heat_pump`, `if_all_heat_pump`, `if_any_gas`, `if_all_gas` |
| `zone` | `if_any_occupied`, `if_all_empty`, `if_any_above`, `if_any_below`, `if_any_equal`, `if_any_not_equal`, `any_unavailable` |

> **Climate note:** HVAC mode conditions (e.g. `if_any_heat`) reflect what mode the thermostat is *set to*. hvac_action conditions (e.g. `if_any_heating`) reflect what the device is *physically doing right now* — a thermostat set to `heat` may have `hvac_action: idle` if the target temperature is already reached.

For example:

```yaml
- domain: sensor
  name: Temperature
  include:
    - sensor.living_room_temp
  styles:
    - condition: if_any_above
      value: 28
      text: "Hot! ({{ unavailable_count }} unavailable)"
      icon: mdi:thermometer
      color: red
```

---

### Dynamic Template Variables

The following count variables are available in `text` and `secondary_text`. All domains also provide `{{ total_count }}` and `{{ unavailable_count }}`.

| Domain | Available count variables |
|---|---|
| `light` | `{{ on_count }}` `{{ off_count }}` |
| `switch` | `{{ on_count }}` `{{ off_count }}` |
| `input_boolean` | `{{ on_count }}` `{{ off_count }}` |
| `binary_sensor` | `{{ true_count }}` `{{ false_count }}` |
| `cover` | `{{ open_count }}` `{{ closed_count }}` `{{ opening_count }}` `{{ closing_count }}` `{{ stopped_count }}` |
| `media_player` | `{{ playing_count }}` `{{ idle_count }}` `{{ paused_count }}` `{{ buffering_count }}` `{{ on_count }}` `{{ off_count }}` |
| `person` | `{{ at_home_count }}` `{{ away_count }}` |
| `alarm_control_panel` | `{{ armed_count }}` `{{ disarmed_count }}` `{{ triggered_count }}` `{{ arming_count }}` `{{ pending_count }}` |
| `lock` | `{{ unlocked_count }}` `{{ locked_count }}` `{{ locking_count }}` `{{ unlocking_count }}` `{{ jammed_count }}` |
| `vacuum` | `{{ cleaning_count }}` `{{ docked_count }}` `{{ returning_count }}` `{{ paused_count }}` `{{ idle_count }}` `{{ error_count }}` |
| `camera` | `{{ streaming_count }}` `{{ idle_count }}` `{{ recording_count }}` |
| `climate` (HVAC mode) | `{{ heat_count }}` `{{ cool_count }}` `{{ heat_cool_count }}` `{{ auto_count }}` `{{ dry_count }}` `{{ fan_only_count }}` `{{ off_count }}` |
| `climate` (hvac_action) | `{{ heating_count }}` `{{ cooling_count }}` `{{ idle_count }}` `{{ fan_count }}` `{{ drying_count }}` `{{ preheating_count }}` `{{ defrosting_count }}` |
| `fan` | `{{ on_count }}` `{{ off_count }}` |
| `humidifier` | `{{ on_count }}` `{{ off_count }}` |
| `plant` | `{{ problem_count }}` `{{ ok_count }}` |
| `siren` | `{{ on_count }}` `{{ off_count }}` |
| `update` | `{{ on_count }}` `{{ off_count }}` |
| `water_heater` | `{{ on_count }}` `{{ off_count }}` `{{ eco_count }}` `{{ electric_count }}` `{{ performance_count }}` `{{ high_demand_count }}` `{{ heat_pump_count }}` `{{ gas_count }}` |
| `zone` | `{{ occupied_count }}` `{{ empty_count }}` `{{ total_persons }}` `{{ total_persons_list }}` |

You can also use full Jinja expressions, including custom Home Assistant state queries inside `template_conditions`.

Example:

```yaml
template_conditions:
  - "{{ is_state_attr('switch.kitchen', 'current', 0) }}"
  - "{{ now().hour >= 0 and now().hour < 5 }}"
```

---

### Include / Exclude Entities
Via Include Enitites option, you can easily create card for only one entity of the selected domain (or two, or three.. depens on your need)
Via Exlude Enitites option, you can easily exclude one entitiy (or two, or three.. depens on your needs) from your selected domain and create card for the rest of the domain

### Tap & Hold Actions
![image15](images/tap.png)

Both `tap_action` and `hold_action` support the standard HA action types: **More Info**, **Toggle**, **Navigate**, **URL**, **Perform Action**, **Assist**, and **Nothing**.

Actions like `perform-action`, `navigate`, `url`, and `assist` are delegated to Home Assistant's native action handler, which means **confirmation dialogs** work out of the box:

```yaml
tap_action:
  action: perform-action
  confirmation:
    text: "Are you sure you want to restart?"
  perform_action: script.restart
```

#### Vacuum: Input Select in Popup

For vacuum domain cards, when tap or hold action is set to **More Info**, you can optionally display `input_select` entities inside the popup (e.g., for map selection):

```yaml
- domain: vacuum
  name: Robot Vacuum
  show_input_select: true
  input_select_entities:
    - input_select.vacuum_map
  tap_action:
    action: more-info
  styles:
    - condition: if_any_cleaning
      text: "Cleaning"
      icon: mdi:robot-vacuum
      color: green
```


## 🎨 Tap Action - More Info Screenshots
![image2](images/media.png)

![image1](images/cover.png)


## 🎨 Configuration Examples
### Example 1: Example form my own Dashboard. This is the start point of this project.
![image1](images/1.png)
![image2](images/2.png)
![image3](images/3.png)
![image4](images/4.png)
![image5](images/5.png)

```yaml
type: custom:summary-card # Specifies the card type.
columns: "6"
row_height: 60px
cards:
  - domain: switch # The domain of the entities to be monitored (e.g., switch, light, sensor).
    name: Kitchen Wall Socket # A friendly name for the card.
    include: # only this entity will be listened
      - switch.kitchen
    styles: 
      # Style for when the socket is unavailable.
      - condition: any_unavailable # If any of the included entities are unavailable.
        text: Kitchen Wall Socket is Unavailable # The main text to display.
        secondary_text: Check Device # The smaller text below the main text.
        icon: mdi:lightning-bolt # The icon to show.
        color: red # The color of the icon.
      # Style for when the socket is off and drawing no power.
      - condition: if_all_off # If all of the included entities are off.
        text: Kitchen Wall Socket is Off
        secondary_text: Secure
        icon: mdi:lightning-bolt
        color: green
        template_conditions: # Additional conditions using templates.
          # This template checks if the 'current' attribute of the switch is 0.
          - "{{ is_state_attr('switch.kitchen', 'current', 0) }}"
      # Style for when the socket is on and drawing power.
      - condition: if_any_on # If any of the included entities are on.
        text: Kitchen Wall Socket is On
        secondary_text: >- # The '>' allows for multi-line strings.
          Warning! Check the Device! Current value is
          {{state_attr('switch.kitchen', 'current')}} # Displays the current power draw.
        icon: mdi:lightning-bolt
        color: red
        template_conditions:
          # This template checks if the 'current' attribute is not 0.
          - "{{ not is_state_attr('switch.kitchen', 'current', 0) }}"
  - domain: sensor
    name: Water Level
    include:
      - sensor.current_water_level
    styles:
      # Style for when the sensor is unavailable.
      - condition: any_unavailable
        text: Water Level is Unavailable
        secondary_text: Check Device
        icon: mdi:water-percent-alert
        color: red
      # Style for when the water level is at 0.
      - condition: if_any_equal # Condition based on the sensor's value.
        value: 0 # The value to compare against.
        text: Water Level is 0
        secondary_text: Secure
        icon: mdi:water-percent
        color: green
        template_conditions: [] # No extra template conditions needed here.
      # Style for when the water level is not 0.
      - condition: if_any_not_equal
        value: "0" # The value to compare against (as a string).
        text: >-
          Water Level is {{state_attr('sensor.current_water_level', 'raw_state')}}
        secondary_text: >-
          Warning! Check the Engine Room! Current value is
          {{state_attr('sensor.current_water_level', 'raw_state')}}
        icon: mdi:water-percent-alert
        color: red
        template_conditions: []
  - domain: cover
    name: Shutters & Garage
    styles:
      # Style for when the garage door is open.
      - condition: if_any_open
        text: Garage Door is Open
        secondary_text: Warning!
        icon: mdi:garage-alert-variant
        color: red
        template_conditions:
          # Checks if the garage door binary sensor is 'on'.
          - "{{ is_state('binary_sensor.garage_door', 'on') }}"
      # Style for when all shutters are closed and available.
      - condition: if_all_closed
        text: All Shutters are Closed
        secondary_text: Secure
        icon: mdi:window-shutter
        color: green
        template_conditions:
          # A complex template to check the state of all covers.
          - >-
            {% set un_shutters = states.cover | selectattr('state', 'eq', 'unavailable') | map(attribute='entity_id') | list %}
            {% set open_shutters = states.cover | selectattr('state', 'ne', 'unavailable') | selectattr('attributes.current_position', 'ge', 1) | map(attribute='entity_id') | list %}
            {{ open_shutters | length == 0 and un_shutters | length == 0 }}
      # Style for when any shutter is open during the night.
      - condition: if_any_open
        text: Shutters Open (Night)
        secondary_text: Check Security
        icon: mdi:window-shutter-open
        color: red
        template_conditions:
          # Checks if the current time is between midnight and 5 AM.
          - "{{ now().hour >= 0 and now().hour < 5 }}"
      # Style for when any shutter is open and the family is away.
      - condition: if_any_open
        text: Shutters Open (Away)
        secondary_text: Check Security
        icon: mdi:window-shutter-open
        color: red
        template_conditions:
          - "{{ is_state('group.family', 'away') }}"
      # Style for when any shutter is unavailable and the family is away.
      - condition: any_unavailable
        text: Unavailable Shutters (Away)
        secondary_text: Immediate Attention Needed!
        icon: mdi:window-shutter-alert
        color: red
        template_conditions:
          - "{{ is_state('group.family', 'away') }}"
      # Style for when any shutter is unavailable and the family is home.
      - condition: any_unavailable
        text: Unavailable Shutters (Home)
        secondary_text: Check Devices!
        icon: mdi:window-shutter-alert
        color: orange
        template_conditions:
          - "{{ is_state('group.family', 'home') }}"
      # Style for when any shutter is open during the day and the family is home.
      - condition: if_any_open
        text: Shutters Open (Daytime)
        secondary_text: Enjoy the View!
        icon: mdi:window-shutter-open
        color: green
        template_conditions:
          # Checks if the family is home and the time is between 5 AM and 11:59 PM.
          - >-
            {{ is_state('group.family', 'home') and ('05:00' <= now().strftime('%H:%M') <= '23:59')}}
  - domain: switch
    name: Sprinklers
    include:
      - switch.zone_1
      - switch.zone_2
      - switch.zone_3
      - switch.zone_4
      - switch.zone_5
      - switch.zone_6
      - switch.zone_7
      - switch.zone_8
      - switch.zone_9
      - switch.zone_10
      - switch.zone_11
    styles:
      # Style for when any sprinkler switch is unavailable.
      - condition: any_unavailable
        text: Unavailable
        secondary_text: Check Device
        icon: mdi:wifi-off
        color: red
      # Style for when all sprinklers are off.
      - condition: if_all_off
        text: Sprinklers are Off
        secondary_text: Secure
        icon: mdi:sprinkler
        color: green
      # Style for when any sprinkler is on.
      - condition: if_any_on
      # Displays the name of the active sprinkler.
        text: >-
          {% set zone_switches = expand('switch.zone_1', 'switch.zone_2', 'switch.zone_3', 'switch.zone_4', 'switch.zone_5', 'switch.zone_6', 'switch.zone_7', 'switch.zone_8', 'switch.zone_9', 'switch.zone_10', 'switch.zone_11') %}
          {% set on_switch = zone_switches | selectattr('state', 'eq', 'on') | first %}
          {{on_switch.name}} is On
        secondary_text: Watering
        icon: mdi:sprinkler-variant
        color: blue
  - domain: camera
    name: Cameras
    styles:
      # Style for when one or more cameras are offline.
      - condition: any_unavailable
        text: One or More Cameras are Offline
        secondary_text: Check Cameras
        icon: mdi:video-box-off
        color: red
      # Style for when all cameras are streaming.
      - condition: if_all_streaming
        text: Cameras are Online
        secondary_text: Secure
        icon: mdi:video-check
        color: green
    include:
      - camera.front
      - camera.garage
      - camera.side
      - camera.pool
  - domain: clock
    name: Clock
    color: green # The color of the clock icon.
```


### Example 2: Basic Lights & Switches Setup

A great starting point that covers the most common use case.

```yaml
# The card type must always be 'custom:summary-card'.
type: custom:summary-card

#================================================
# GENERAL SETTINGS
#================================================
# Defines how many cards are displayed in a single row.
columns: 2
# Sets the height of each card in pixels.
row_height: 80px

#================================================
# CARDS LIST
# Each section starting with a dash (-) defines a new card.
#================================================
cards:
  # --- EXAMPLE 1: LIGHTS CARD ---
  # This card tracks all entities in the 'light' domain.
  # Use 'include' or 'exclude' to specify which lights to track.
  - domain: light
    name: Lights

    # STYLES (SCENARIOS)
    # The card evaluates these styles from top to bottom and applies the FIRST one that meets the conditions.
    # Therefore, you should place your most specific or highest-priority conditions at the top.
    styles:
      # Scenario 1: Is at least one light currently on?
      - condition: if_any_on
        # '{{ on_count }}' shows the number of lights that are currently on.
        text: '{{ on_count }} On'
        icon: mdi:lightbulb-on
        color: 'rgb(255, 193, 7)' # Amber color for the icon

      # Scenario 2: Are all lights off? (And not unavailable)
      # This acts as the default state if no other condition is met.
      - condition: if_all_off
        text: All Off
        icon: mdi:lightbulb-off-outline
        # Uses your theme's primary text color.
        color: 'var(--primary-text-color)'

  # --- EXAMPLE 2: SWITCHES CARD ---
  # This card tracks all entities in the 'switch' domain.
  - domain: switch
    name: Switches
    styles:
      # Scenario 1 (HIGHEST PRIORITY): Is any switch unavailable/offline?
      # This condition is checked first to immediately report connectivity issues.
      - condition: any_unavailable
        # '{{ unavailable_count }}' shows how many entities are unavailable.
        text: '{{ unavailable_count }} Offline'
        icon: mdi:power-plug-off
        color: 'grey'

      # Scenario 2: If none are unavailable, is at least one switch on?
      - condition: if_any_on
        text: '{{ on_count }} Active'
        icon: mdi:power-plug
        color: 'dodgerblue'

      # Scenario 3: If all switches are available and none are on, they must all be off.
      - condition: if_all_off
        text: All Off
        icon: mdi:power-plug-off-outline
        color: 'var(--primary-text-color)'
```
### Example 3: Advanced "Home Status" Dashboard

This example demonstrates filtering, multiple conditions, and a mix of card types for a comprehensive overview.

```yaml
type: custom:summary-card
columns: 4
row_height: 95px
cards:
  # --- CARD 1: Clock ---
  # This is a special card that doesn't track any entities; it simply displays the current time.
  - domain: clock
    # Uses your theme's primary color for the icon.
    color: 'var(--primary-color)'

  # --- CARD 2: Person Status Summary ---
  # This card tracks entities in the 'person' domain to summarize who is at home.
  - domain: person
    name: People
    styles:
      # Rule 1: If at least one person is home...
      # For the 'person' domain, the 'home' state is considered "active".
      - condition: if_any_at_home
        # '{{ at_home_count }}' shows the number of people currently at home.
        text: '{{ at_home_count }} at Home'
        icon: mdi:home-account
        color: '#4CAF50' # Green

      # Rule 2: If everyone is away...
      - condition: if_all_away
        text: Everyone Away
        icon: mdi:home-export-outline
        color: '#FF9800' # Orange

  # --- CARD 3: Security (Door/Window) Summary ---
  # This card only tracks the specified door and window sensors.
  - domain: binary_sensor
    name: Security
    # With 'include', only the status of sensors in this list is considered.
    include:
      - binary_sensor.front_door
      - binary_sensor.back_door
      - binary_sensor.living_room_window
    styles:
      # Rule 1: If any door or window is open...
      # For 'binary_sensor', the 'on' (true) state is considered "active".
      - condition: if_any_true
        text: '{{ true_count }} Open!'
        secondary_text: Unsecured
        icon: mdi:shield-alert
        color: 'crimson'

      # Rule 2: If all doors and windows are closed...
      - condition: if_all_false
        text: All Secure
        secondary_text: House is locked down
        icon: mdi:shield-check
        color: 'teal'

  # --- CARD 4: Media Player Summary ---
  # This card summarizes media players, EXCLUDING the one in the guest room.
  - domain: media_player
    name: Media
    # With 'exclude', entities in this list are not included in the summary calculation.
    exclude:
      - media_player.guest_room_display
    styles:
      # Rule 1: If any media player is playing...
      - condition: if_any_playing
        text: '{{ playing_count }} Playing'
        icon: mdi:cast-connected
        color: 'deepskyblue'

      # Rule 2: If any media player is paused...
      - condition: if_any_paused
        text: '{{ paused_count }} Paused'
        icon: mdi:pause-circle
        color: 'var(--secondary-text-color)'

      # Rule 3: If all media players are idle...
      - condition: if_all_idle
        text: All Idle
        icon: mdi:cast
        color: 'var(--secondary-text-color)'
```


### Example 4: Creative Use Case - Plant Care Dashboard
Do you have plant moisture sensors? You can create a card to tell you when your plants are thirsty! This assumes your moisture sensors are binary_sensors that are 'on' (active) when the plant is dry.

```yaml
type: custom:summary-card
columns: 1
cards:
  # --- PLANT CARE CARD ---
  # This card summarizes the status of multiple plant moisture sensors.
  - domain: binary_sensor
    name: Plant Care
    # You should list the entity_ids of your own plant moisture sensors in the 'include' section.
    # This list ensures that only the specified sensors are tracked.
    include:
      - binary_sensor.fiddle_leaf_fig_moisture
      - binary_sensor.snake_plant_moisture
      - binary_sensor.monstera_moisture

    # STYLES (SCENARIOS)
    # The card evaluates conditions from top to bottom and applies the first style that matches.
    styles:
      # Rule 1: Does any plant need water?
      # For a 'binary_sensor', the 'on' (true) state is considered "active".
      # In this example, an 'on' state from the sensor means the soil is dry.
      - condition: if_any_true
        # '{{ true_count }}' shows the number of plants that need water.
        text: '{{ true_count }} Thirsty Plant(s)'
        secondary_text: Time to get the watering can!
        icon: mdi:water-alert
        color: '#E53935' # Red

      # Rule 2: Are all plants sufficiently watered?
      # If the above condition is not met, this will be shown as the default state.
      - condition: if_all_false
        text: Plants are Happy
        secondary_text: All watered and content
        icon: mdi:leaf
        color: '#388E3C' # Green
```

### Example 5: Just Icons For Mobile Phone
No need to words? Are icons are ok for your small screen?

![image10](images/mobile.png)
```yaml
type: custom:summary-card
columns: "10"
row_height: 60px
cards:
  - domain: switch
    include:
      - switch.kitchen
    styles:
      - condition: any_unavailable
        icon: mdi:lightning-bolt
        color: red
      - condition: if_all_off
        icon: mdi:lightning-bolt
        color: green
        template_conditions:
          - "{{ is_state_attr('switch.kitchen', 'current', 0) }}"
      - condition: if_any_on
        icon: mdi:lightning-bolt
        color: red
        template_conditions:
          - "{{ not is_state_attr('switch.kitchen', 'current', 0) }}"
  - domain: sensor
    include:
      - sensor.current_water_level
    styles:
      - condition: any_unavailable
        icon: mdi:water-percent-alert
        color: red
      - condition: if_any_equal
        value: "0"
        icon: mdi:water-percent
        color: green
        template_conditions: []
      - condition: if_any_not_equal
        value: "0"
        icon: mdi:water-percent-alert
        color: red
        template_conditions: []
  - domain: cover
    styles:
      - condition: if_any_open
        icon: mdi:garage-alert-variant
        color: red
        template_conditions:
          - "{{ is_state('binary_sensor.garage_door', 'on') }}"
      - condition: if_all_closed
        icon: mdi:window-shutter
        color: green
        template_conditions:
          - >-
            {% set un_shutters = states.cover | selectattr('state', 'eq',
            'unavailable') | map(attribute='entity_id') | list %} {% set
            open_shutters = states.cover | selectattr('state', 'ne',
            'unavailable') | selectattr('attributes.current_position', 'ge', 1)
            | map(attribute='entity_id') | list %} {{ open_shutters | length ==
            0 and un_shutters | length == 0 }}
      - condition: if_any_open
        icon: mdi:window-shutter-open
        color: red
        template_conditions:
          - "{{ now().hour >= 0 and now().hour < 5 }}"
      - condition: if_any_open
        icon: mdi:window-shutter-open
        color: red
        template_conditions:
          - "{{ is_state('group.family', 'away') }}"
      - condition: any_unavailable
        icon: mdi:window-shutter-alert
        color: red
        template_conditions:
          - "{{ is_state('group.family', 'away') }}"
      - condition: any_unavailable
        icon: mdi:window-shutter-alert
        color: orange
        template_conditions:
          - "{{ is_state('group.family', 'home') }}"
      - condition: if_any_open
        icon: mdi:window-shutter-open
        color: green
        template_conditions:
          - >-
            {{ is_state('group.family', 'home') and ('05:00' <=
            now().strftime('%H:%M') <= '23:59')}}
  - domain: switch
    include:
      - switch.zone_1
      - switch.zone_2
      - switch.zone_3
      - switch.zone_4
      - switch.zone_5
      - switch.zone_6
      - switch.zone_7
      - switch.zone_8
      - switch.zone_9
      - switch.zone_10
      - switch.zone_11
    styles:
      - condition: any_unavailable
        icon: mdi:wifi-off
        color: red
      - condition: if_all_off
        icon: mdi:sprinkler
        color: green
      - condition: if_any_on
        text: >-
          {% set zone_switches = expand('switch.zone_1', 'switch.zone_2',
          'switch.zone_3', 'switch.zone_4', 'switch.zone_5', 'switch.zone_6',
          'switch.zone_7', 'switch.zone_8', 'switch.zone_9', 'switch.zone_10',
          'switch.zone_11') %} {% set on_switch = zone_switches |
          selectattr('state', 'eq', 'on') | first %} {{on_switch.name}} is On
        icon: mdi:sprinkler-variant
        color: blue
  - domain: camera
    styles:
      - condition: any_unavailable
        icon: mdi:video-box-off
        color: red
      - condition: if_any_streaming
        icon: mdi:video-check
        color: green

```
### Example 6: Just Icons For Mobile Phone with more info popups

![image10](images/moreinfos.png)
```
type: custom:summary-card
row_height: 73px
cards:
  - domain: light
    styles:
      - condition: any_unavailable
        color: red
        icon: mdi:lightbulb-alert
      - condition: if_any_on
        value: "0.0"
        icon: mdi:lightbulb-on
        template_conditions: []
        color: "#ffa500"
      - condition: if_all_off
        value: "0.0"
        icon: mdi:lightbulb-outline
        color: "#4caf50"
        template_conditions: []
    tap_action:
      action: more-info
    include:
      - light.veranda_back_2
      - light.veranda_back_1
      - light.backyard
      - light.veranda_front
      - light.on_bahce
      - light.pool_light
      - light.salon_aplik
  - domain: cover
    styles:
      - condition: if_any_open
        icon: mdi:garage-alert-variant
        color: red
        template_conditions:
          - "{{ is_state('binary_sensor.garage_door', 'on') }}"
      - condition: if_all_closed
        icon: mdi:window-shutter
        color: "#4caf50"
        template_conditions: []
      - condition: if_any_open
        icon: mdi:window-shutter-open
        color: red
        template_conditions:
          - "{{ now().hour >= 0 and now().hour < 5 }}"
      - condition: if_any_open
        icon: mdi:window-shutter-open
        color: red
        template_conditions:
          - "{{ is_state('group.family', 'not_home') }}"
      - condition: any_unavailable
        icon: mdi:window-shutter-alert
        color: red
        template_conditions:
          - "{{ is_state('group.family', 'not_home') }}"
      - condition: any_unavailable
        icon: mdi:window-shutter-alert
        color: orange
        template_conditions:
          - "{{ is_state('group.family', 'home') }}"
      - condition: if_any_open
        icon: mdi:window-shutter-open
        color: "#4caf50"
        template_conditions:
          - >-
            {{ is_state('group.family', 'home') and ('05:00' <=
            now().strftime('%H:%M') <= '23:59')}}
    tap_action:
      action: more-info
  - domain: switch
    include:
      - switch.zone_1
      - switch.zone_2
      - switch.zone_3
      - switch.zone_4
      - switch.zone_5
      - switch.zone_6
      - switch.zone_7
      - switch.zone_8
      - switch.zone_9
      - switch.zone_10
      - switch.zone_11
    styles:
      - condition: any_unavailable
        icon: mdi:wifi-off
        color: red
      - condition: if_all_off
        icon: mdi:sprinkler
        color: "#4caf50"
      - condition: if_any_on
        text: >-
          {% set zone_switches = expand('switch.zone_1', 'switch.zone_2',
          'switch.zone_3', 'switch.zone_4', 'switch.zone_5', 'switch.zone_6',
          'switch.zone_7', 'switch.zone_8', 'switch.zone_9', 'switch.zone_10',
          'switch.zone_11') %} {% set on_switch = zone_switches |
          selectattr('state', 'eq', 'on') | first %} {{on_switch.name}} is On
        icon: mdi:sprinkler-variant
        color: "#3399ff"
    tap_action:
      action: navigate
      navigation_path: /lovelace-phone/garden?y=940
    hold_action:
      action: more-info
  - domain: media_player
    styles:
      - condition: if_any_playing
        icon: mdi:television
        color: "#ffa500"
      - condition: if_any_off
        icon: mdi:television-off
        color: "#4caf50"
        template_conditions: []
      - condition: if_any_paused
        icon: mdi:television
        color: "#ffa500"
      - condition: if_any_idle
        icon: mdi:television
        color: "#ffa500"
      - condition: if_any_on
        icon: mdi:television
        color: "#ffa500"
    include:
      - media_player.living_room
      - media_player.toshiba
      - media_player.spotify_cenkataseven
  - domain: alarm_control_panel
    styles:
      - condition: any_unavailable
        icon: mdi:wifi-off
        color: "#ff0000"
      - condition: if_any_disarmed
        icon: mdi:security
        color: red
        template_conditions:
          - "{{ is_state('group.family', 'not_home') }}"
      - condition: if_any_disarmed
        template_conditions:
          - "{{ is_state('group.family', 'home') }}"
        color: "#4caf50"
        icon: mdi:shield-off
      - condition: if_any_armed
        icon: mdi:shield-lock
        color: "#4caf50"
        template_conditions: []
      - condition: if_any_triggered
        color: "#ff0000"
        text: Triggered
        icon: mdi:alarm-light
    include:
      - alarm_control_panel.alarm_home_alarm
    tap_action:
      action: navigate
      navigation_path: /lovelace-phone/Alarm
  - domain: camera
    styles:
      - condition: any_unavailable
        icon: mdi:video-box-off
        color: red
      - condition: if_any_idle
        icon: mdi:video-check
        color: "#4caf50"
    tap_action:
      action: more-info
      navigation_path: /lovelace-phone/garden
    include:
      - camera.front
      - camera.garage
      - camera.side
      - camera.pool
  - domain: vacuum
    styles:
      - condition: if_all_docked
        icon: mdi:robot-vacuum
        color: "#4caf50"
      - condition: if_any_cleaning
        color: "#0000ff"
      - condition: if_any_returning
        color: "#ffff00"
      - condition: if_any_error
        text: Active
        color: "#ff0000"
      - condition: any_unavailable
        text: Active
        color: "#ff0000"
    include:
      - vacuum.viomi_v13
    tap_action:
      action: more-info
    show_input_select: true
    input_select_entities:
      - input_select.map
    hold_action:
      action: navigate
      navigation_path: /lovelace-phone/vacuum-media
  - domain: switch
    styles:
      - condition: any_unavailable
        icon: mdi:pool
        color: "#ff0000"
      - condition: if_any_on
        color: "#00d5ff"
        icon: mdi:pool
      - condition: if_all_off
        color: "#4caf50"
        icon: mdi:pool
    include:
      - switch.pool
  - domain: binary_sensor
    include:
      - binary_sensor.garage_door
    styles:
      - condition: any_unavailable
        icon: mdi:gate-alert
        color: red
      - condition: if_all_false
        icon: mdi:garage-variant
        color: "#4caf50"
        template_conditions: []
      - condition: if_any_true
        icon: mdi:garage-open-variant
        color: "#ffa500"
    tap_action:
      action: perform-action
      confirmation:
        text: Are you sure to toggle Garage Door?
      perform_action: switch.toggle
      target:
        entity_id: switch.garage_door
      data: {}
    hold_action:
      action: perform-action
      confirmation:
        text: Are you sure to toggle Driveway Gate?
      perform_action: switch.toggle
      target:
        entity_id: switch.driveway
      data: {}
  - domain: zone
    styles:
      - condition: if_any_above
        icon: mdi:account
        color: "#4caf50"
        value: 0
        template_conditions:
          - >-
            {{ is_state('person.cenk', 'home') and is_state('person.derya',
            'home') }}
      - condition: if_any_equal
        icon: mdi:account
        color: "#ff0000"
        template_conditions: []
        value: 0
      - condition: if_any_above
        template_conditions:
          - >-
            {{ is_state('person.cenk', 'not_home') or is_state('person.derya',
            'not_home') }}
        value: 0
        color: "#ffa500"
        icon: mdi:account
    include:
      - zone.home
    tap_action:
      action: navigate
      navigation_path: /lovelace-phone/navigation
    hold_action:
      action: more-info
  - domain: sensor
    include:
      - sensor.current_water_level
    styles:
      - condition: any_unavailable
        icon: mdi:water-percent-alert
        color: red
      - condition: if_any_equal
        value: "0.0"
        icon: mdi:water-percent
        color: "#4caf50"
        template_conditions: []
      - condition: if_any_not_equal
        value: "0.0"
        icon: mdi:water-percent-alert
        color: red
        template_conditions: []
    hold_action:
      action: none
    double_tap_action:
      action: more-info
    tap_action:
      action: more-info
  - domain: input_boolean
    styles:
      - condition: if_all_off
        icon: mdi:exclamation-thick
        color: "#ff0000"
      - condition: if_any_on
        color: "#4caf50"
        template_conditions:
          - "{{ is_state('input_boolean.home', 'on') }}"
        icon: mdi:home-circle-outline
      - condition: if_any_on
        icon: mdi:food-turkey
        template_conditions:
          - "{{ is_state('input_boolean.guest', 'on') }}"
        color: "#ffa500"
      - condition: if_any_on
        template_conditions:
          - "{{ is_state('input_boolean.holiday', 'on') }}"
        color: "#00fffb"
        icon: mdi:beach
    include:
      - input_boolean.home
      - input_boolean.guest
      - input_boolean.holiday
columns: "4"

```
---
## ⭐ Support

<a href="https://www.buymeacoffee.com/cataseven" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" style="height: 60px !important;width: 217px !important;" >
</a>      

If you like this card, feel free to ⭐ star the project on GitHub and share it with the Home Assistant community!
---

## 📄 License

MIT © [cataseven]

---
