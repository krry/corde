<script>
  function copyGenie (event) {
    navigator.clipboard.writeText(window.location.origin + slug)
  }
</script>
<button type="button" on:click={copyGenie}>Copy link</button>
