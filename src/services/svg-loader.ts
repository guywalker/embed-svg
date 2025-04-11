let svgCache: Record<string, Promise<string | null> | string> = {};

export function clearCache() {
  svgCache = {};
}

export function loadSVG(src: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    // Check if the SVG is already in the cache
    if (svgCache[src]) {
      resolve(svgCache[src]);
      return;
    }

    const promise = fetch(src)
      .then((response) => response.text())
      .then((svgText) => {
        // Create a temporary div to parse the SVG
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = svgText.trim();

        // Get the SVG element
        // const svgElement = tempDiv.querySelector("svg")!;
        svgCache[src] = svgText;
        resolve(svgText);
        return svgText;
      })
      .catch((error) => {
        reject(error);
        return null;
      });

      svgCache[src] = promise;
  });
}
