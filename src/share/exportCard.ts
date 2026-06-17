import { toPng } from "html-to-image";

// Render the off-screen 1080x1920 ShareCard node to a PNG and trigger a download.
// Returns true on success; the prize screen still works if this fails.
export async function saveShareCard(
  node: HTMLElement,
  username: string,
): Promise<boolean> {
  try {
    // Make sure the display font is ready, or the wordmark/headers capture blank.
    if (document.fonts?.ready) await document.fonts.ready;

    const opts = {
      width: 1080,
      height: 1920,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: "#FFD6E8",
    };

    // First pass warms image/font embedding (a known html-to-image quirk where
    // images are blank on the very first render); the second pass is the keeper.
    await toPng(node, opts);
    const dataUrl = await toPng(node, opts);

    const safeName = username.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "player";
    const link = document.createElement("a");
    link.download = `illuspeak-${safeName}.png`;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (err) {
    console.error("share card export failed", err);
    return false;
  }
}
