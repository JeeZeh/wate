<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    sitelenLocale,
    gameState,
    tokiPonaMode,
    guessMode,
  } from "$lib/settings";
  import { wordy } from "$static/config.json";
  import { showToast } from "$lib/Toasts.svelte";
  import { gameWon, generateEmojiArt } from "$lib/game";
  import { recordEvent } from "$lib/countClick";
  import Button from "$lib/Button.svelte";
  import Countdown from "$lib/modals/atoms/Countdown.svelte";
  import GameDistribution from "$lib/modals/atoms/GameDistribution.svelte";

  export let gameDay = 0;
  export let solution = "";

  async function share(discord: boolean) {
    recordEvent("share", discord ? "discord" : "classic");
    const art = generateEmojiArt(gameDay, solution, $gameState[$tokiPonaMode], {
      name: wordy ? "Wordy" : $sitelenLocale ? "wate" : "Wate",
      guessMode: $guessMode,
      discord,
    });
    const share = { text: art };
    try {
      if (
        // Sharing in desktop browsers sucks.
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) &&
        navigator.canShare?.(share)
      ) {
        await navigator.share(share);
      } else {
        await navigator.clipboard.writeText(art);
        // This is a one time toast so give it more time.
        showToast($_("toast.clipboard"), { delay: 2 });
      }
    } catch (e) {
      console.log("Share Exception", e);
      // I have no idea what could go wrong here but I don't want to find out.
    }
  }
</script>

<div class="grid" class:sitelen={$sitelenLocale}>
  <div style:grid-area="share">
    <Button on:click={() => share(false)}>{$_("share.button")}</Button>
  </div>
  <div style:grid-area="discord">
    <Button subtle on:click={() => share(true)}
      >{$_("share.button-discord")}</Button
    >
  </div>
  <div style:grid-area="stats" style:width="100%">
    <GameDistribution
      mode={$tokiPonaMode}
      highlight={gameWon(solution, $gameState[$tokiPonaMode])
        ? $gameState[$tokiPonaMode].length - 1
        : -1}
    />
  </div>
  <div style:grid-area="count">
    <Countdown />
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid:
      "stats stats"
      "count share"
      "count discord" / 1fr 1fr;
    grid-gap: 12px 8px;
    align-items: center;
    justify-items: center;
  }
  .grid.sitelen {
    grid:
      "share discord"
      "stats stats"
      "count count" / auto 1fr;
    grid-gap: 30px 8px;
    align-items: center;
    justify-items: start;
  }
</style>
