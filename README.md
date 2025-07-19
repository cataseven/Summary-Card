# Summary Card for Home Assistant

[Build Status] [Version] [License]

Transform your Home Assistant dashboard from a simple list of entities into a smart, dynamic, "at-a-glance" overview of your entire home. The **Summary Card** is your canvas for creativity, allowing you to group entities by domain (lights, switches, sensors, etc.) and create a grid of cards that dynamically change their appearance based on the state of your devices.

This isn't just another card; it's a tool to build a dashboard that truly understands and reflects the state of your home. You control the layout, the logic, and the look. Unleash your creativity and design a control panel that is uniquely yours.



## ✨ Key Features

-   **Dynamic Grid Layout:** Arrange your cards in any number of columns and set a uniform height for a clean, organized look.
-   **Conditional Styling:** Define rules to change a card's text, icon, and color based on entity states. For example, "Show a green icon if all lights are off" or "Show an orange icon and display the count if any lights are on."
-   **Advanced Entity Filtering:** Summarize an entire domain, or drill down by including or excluding specific entities to create highly focused summary cards.
-   **Specialized Clock Card:** Add a sleek, modern, real-time clock to your dashboard.
-   **User-Friendly Visual Editor:** Configure everything through the UI without needing to write a single line of YAML. Add new cards, define conditions, and see your changes in real-time.
-   **Auto-Discovery on First Use:** When you first add the card, it intelligently scans your Home Assistant instance and creates a default configuration based on the domains you actually use.

## 🛠️ Installation

### HACS (Home Assistant Community Store) - Recommended

1.  Navigate to HACS in your Home Assistant instance.
2.  Go to the `Frontend` section.
3.  Click the `+` button in the bottom right and select "Explore & Download Repositories".
4.  Search for "Summary Card" and select the repository.
5.  Click the "Download" button to complete the installation.

### Manual Installation

1.  Download the latest `summary-card.js` file from the [Releases](https://github.com/YOUR_USERNAME/summary-card/releases) page.
2.  Copy the `summary-card.js` file to your Home Assistant `config/www` directory.
3.  In the Home Assistant UI, navigate to `Settings` > `Dashboards`.
4.  Click the three-dot menu in the top right and select `Resources`.
5.  Click `Add Resource` and enter the following:
    -   **URL:** `/local/summary-card.js`
    -   **Resource Type:** JavaScript Module
6.  Click `Create`.

## ⚙️ Configuration

You can configure the card either through the visual editor or by using YAML. The visual editor provides an intuitive interface for all the options below.



### Main Options

| Key          | Type   | Required | Description                                                                 | Default |
| :----------- | :----- | :------- | :-------------------------------------------------------------------------- | :------ |
| `type`       | string | Yes      | Must be `custom:summary-card`.                                              | -       |
| `columns`    | number | No       | The number of cards to display per row.                                     | `3`     |
| `row_height` | string | No       | The height for each card. Use any valid CSS value like `85px` or `10vh`.    | `85px`  |
| `cards`      | list   | Yes      | The list of card objects to display in the grid.                            | `[]`    |

---

### The `cards` Array

Each item in the `cards` list defines a single card in your grid. There are two main types of cards:

#### 1. Domain Card

This is the standard card for summarizing a group of entities.

| Key       | Type   | Required | Description                                                                                             |
| :-------- | :----- | :------- | :------------------------------------------------------------------------------------------------------ |
| `domain`  | string | Yes      | The domain of entities to summarize (e.g., `light`, `switch`, `climate`).                               |
| `name`    | string | No       | A title for the card, mainly for identification in the editor.                                          |
| `include` | list   | No       | A list of `entity_id`s. If provided, **only** these entities will be considered from the domain.         |
| `exclude` | list   | No       | A list of `entity_id`s. These entities will be ignored from the domain.                                 |
| `styles`  | list   | Yes      | A list of conditional styling rules that determine the card's appearance.                               |

#### 2. Clock Card

A special card for displaying the current time.

| Key      | Type   | Required | Description                                  |
| :------- | :----- | :------- | :------------------------------------------- |
| `domain` | string | Yes      | Must be `clock`.                             |
| `color`  | string | No       | Sets the color for the icon and its backdrop. |

---

### The `styles` Array - The Heart of Creativity ❤️

This is where the magic happens. For each Domain Card, you define a list of style rules. The card evaluates these rules from top to bottom and applies the **first rule that matches the current state**. This creates a priority system for your styles.

| Key              | Type   | Required | Description                                                                                                                                                             |
| :--------------- | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`      | string | Yes      | The condition that must be met for this style to be applied.                                                                                                            |
| `text`           | string | No       | The primary text to display on the card when the condition is met.                                                                                                      |
| `secondary_text` | string | No       | The smaller, secondary text to display on the card.                                                                                                                     |
| `icon`           | string | No       | The Material Design Icon to display (e.g., `mdi:lightbulb-on`).                                                                                                         |
| `color`          | string | No       | The color for the icon and its backdrop (e.g., `orange`, `green`, `dodgerblue`, `#FF5733`).                                                                              |

#### Available Conditions (`condition`)

| Condition         | Description                                                               | Practical Use Case Example                                |
| :---------------- | :------------------------------------------------------------------------ | :-------------------------------------------------------- |
| `any_active`      | True if at least one entity is active (e.g., a light is 'on').            | "Are any of the media players currently playing?"         |
| `all_inactive`    | True if **all** entities are inactive (and none are unavailable).         | "Are all the windows and doors closed?"                   |
| `any_unavailable` | True if at least one entity is in the 'unavailable' state.                | "Is one of my smart plugs offline?" (Highest priority rule) |
| `any_inactive`    | True if at least one entity is inactive.                                  | "Are any of the fans currently off?"                      |
| `all_active`      | True if **all** entities are active.                                      | "Is the whole house alarm system fully armed?"            |

#### Dynamic Text Placeholders

You can make your `text` and `secondary_text` fields dynamic by using these placeholders. They will be automatically replaced with live counts.

-   `{active_count}`: The number of active entities.
-   `{inactive_count}`: The number of inactive entities.
-   `{unavailable_count}`: The number of unavailable entities.

---

## 🎨 Configuration Examples

### Example 1: Basic Lights & Switches Setup

A great starting point that covers the most common use case.

```yaml
type: custom:summary-card
columns: 2
row_height: 80px
cards:
  - domain: light
    name: Lights
    styles:
      - condition: any_active
        text: '{active_count} On'
        icon: mdi:lightbulb-on
        color: 'rgb(255, 193, 7)' # Amber
      - condition: all_inactive
        text: All Off
        icon: mdi:lightbulb-off-outline
        color: 'var(--primary-text-color)'

  - domain: switch
    name: Switches
    styles:
      - condition: any_unavailable
        text: '{unavailable_count} Offline'
        icon: mdi:power-plug-off
        color: 'grey'
      - condition: any_active
        text: '{active_count} Active'
        icon: mdi:power-plug
        color: 'dodgerblue'
      - condition: all_inactive
        text: All Off
        icon: mdi:power-plug-off-outline
        color: 'var(--primary-text-color)'
```
### Example 2: Advanced "Home Status" Dashboard

This example demonstrates filtering, multiple conditions, and a mix of card types for a comprehensive overview.

```yaml
type: custom:summary-card
columns: 4
row_height: 95px
cards:
  # Card 1: A stylish clock for context
  - domain: clock
    color: 'var(--primary-color)' # Use theme's primary color

  # Card 2: A detailed summary of who is home
  - domain: person
    name: People
    styles:
      # Rule 1: Show how many people are home
      - condition: any_active # For 'person' domain, 'home' is the active state
        text: '{active_count} at Home'
        icon: mdi:home-account
        color: '#4CAF50' # Green
      # Rule 2: If no one is home, show this
      - condition: all_inactive
        text: Everyone Away
        icon: mdi:home-export-outline
        color: '#FF9800' # Orange

  # Card 3: A security overview for doors and windows
  - domain: binary_sensor
    name: Security
    # We only want to see sensors that report open/close states
    include:
      - binary_sensor.front_door
      - binary_sensor.back_door
      - binary_sensor.living_room_window
    styles:
      - condition: any_active # 'on' state means a door/window is open
        text: '{active_count} Open!'
        secondary_text: Unsecured
        icon: mdi:shield-alert
        color: 'crimson'
      - condition: all_inactive
        text: All Secure
        secondary_text: House is locked down
        icon: mdi:shield-check
        color: 'teal'

  # Card 4: Media Players - but ignore the one in the guest room
  - domain: media_player
    name: Media
    exclude:
      - media_player.guest_room_display
    styles:
      - condition: any_active # 'playing' or 'on' are active states
        text: '{active_count} Playing'
        icon: mdi:cast-connected
        color: 'deepskyblue'
      - condition: all_inactive
        text: All Idle
        icon: mdi:cast
        color: 'var(--secondary-text-color)'
```

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
      - condition: all_inactive # If all of the included entities are off.
        text: Kitchen Wall Socket is Off
        secondary_text: Secure
        icon: mdi:lightning-bolt
        color: green
        template_conditions: # Additional conditions using templates.
          # This template checks if the 'current' attribute of the switch is 0.
          - "{{ is_state_attr('switch.kitchen', 'current', 0) }}"
      # Style for when the socket is on and drawing power.
      - condition: any_active # If any of the included entities are on.
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
      - condition: equal # Condition based on the sensor's value.
        value: 0 # The value to compare against.
        text: Water Level is 0
        secondary_text: Secure
        icon: mdi:water-percent
        color: green
        template_conditions: [] # No extra template conditions needed here.
      # Style for when the water level is not 0.
      - condition: not_equal
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
      - condition: any_active
        text: Garage Door is Open
        secondary_text: Warning!
        icon: mdi:garage-alert-variant
        color: red
        template_conditions:
          # Checks if the garage door binary sensor is 'on'.
          - "{{ is_state('binary_sensor.garage_door', 'on') }}"
      # Style for when all shutters are closed and available.
      - condition: all_inactive
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
      - condition: any_active
        text: Shutters Open (Night)
        secondary_text: Check Security
        icon: mdi:window-shutter-open
        color: red
        template_conditions:
          # Checks if the current time is between midnight and 5 AM.
          - "{{ now().hour >= 0 and now().hour < 5 }}"
      # Style for when any shutter is open and the family is away.
      - condition: any_active
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
      - condition: any_active
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
      - condition: all_inactive
        text: Sprinklers are Off
        secondary_text: Secure
        icon: mdi:sprinkler
        color: green
      # Style for when any sprinkler is on.
      - condition: any_active
        text: >-
          {% set zone_switches = expand('switch.zone_1', 'switch.zone_2', 'switch.zone_3', 'switch.zone_4', 'switch.zone_5', 'switch.zone_6', 'switch.zone_7', 'switch.zone_8', 'switch.zone_9', 'switch.zone_10', 'switch.zone_11') %}
          {% set on_switch = zone_switches | selectattr('state', 'eq', 'on') | first %}
          {{on_switch.name}} is On # Displays the name of the active sprinkler zone.
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
      # Style for when all cameras are online.
      - condition: all_active
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
### Example 3: Creative Use Case - Plant Care Dashboard
Do you have plant moisture sensors? You can create a card to tell you when your plants are thirsty! This assumes your moisture sensors are binary_sensors that are 'on' (active) when the plant is dry.

```yaml
type: custom:summary-card
columns: 1
cards:
  - domain: binary_sensor
    name: Plant Care
    # Assuming your plant sensors all have 'moisture' in their entity_id
    # You would use the 'include' property to list them specifically.
    include:
      - binary_sensor.fiddle_leaf_fig_moisture
      - binary_sensor.snake_plant_moisture
      - binary_sensor.monstera_moisture
    styles:
      - condition: any_active # 'on' means a plant is dry and needs water
        text: '{active_count} Thirsty Plant(s)'
        secondary_text: Time to get the watering can!
        icon: mdi:water-alert
        color: '#E53935' # Red
      - condition: all_inactive
        text: Plants are Happy
        secondary_text: All watered and content
        icon: mdi:leaf
        color: '#388E3C' # Green
```
