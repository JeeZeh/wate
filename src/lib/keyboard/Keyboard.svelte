<script lang="ts">
  // Dispatches one of three events:
  // * backspace
  // * enter
  // * press - with letters limited to the appropriate alphabet

  import type { State } from "$lib/game";
  import { _ } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  import { wordy } from "$static/config.json";
  import Key from "$lib/keyboard/Key.svelte";
  import Row from "$lib/keyboard/Row.svelte";

  export let letterStates = new Map<string, State>();
  export let highlightEnter = false;
  const dispatch = createEventDispatcher();
  const qwerty = wordy;

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey) return;

    const key = event.key;
    const alphabet = wordy ? "abcdefghijklmnopqrstuvwxyz" : "aeijklmnopstuw";

    if (key === "Backspace") {
      dispatch("backspace");
    }

    // Only check now, we want repeat backspace.
    if (event.repeat) return;

    if (key === "Enter") {
      dispatch("enter");
    } else if (key.length === 1 && alphabet.includes(key)) {
      dispatch("press", key);
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<div class="keyboard" style:grid="auto-flow / repeat({qwerty ? 20 : 12}, 1fr)">
  <Row
    offset={!qwerty}
    letters={qwerty ? "qwertyuiop" : "aeijk"}
    on:press
    {letterStates}
  />
  <Row
    offset={qwerty}
    letters={qwerty ? "asdfghjkl" : "lmnops"}
    on:press
    {letterStates}
  />
  <Key
    big
    slot="start"
    highlight={highlightEnter}
    on:click={() => dispatch("enter")}
  >
    {$_("key.enter")}
  </Key>
  <Row letters={qwerty ? "zxcvbnm" : "tuw"} on:press {letterStates} />
  <Key big slot="end" on:click={() => dispatch("backspace")}>
    {$_("key.backspace")}
  </Key>
</div>

<style>
  div.keyboard {
    width: 100%;
    /* Disable tap to zoom if you miss-tap a key. */
    touch-action: manipulation;
    display: grid;
    gap: 8px;
    /* Visually center the wordle. */
    margin-top: 16px;
  }
</style>
