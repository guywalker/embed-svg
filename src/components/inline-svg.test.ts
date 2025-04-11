import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll,
} from "vitest";
import "./inline-svg";
import { InlineSVG } from "./inline-svg";
import CAR_SVG from "../../public/car.svg?raw";
import ROCKET_SVG from "../../public/rocket.svg?raw";
import fetchMock from "fetch-mock";
import { clearCache } from "../services/svg-loader";

function waitForElement(func: Function, timeout = 5000) {
  return new Promise<Element | null>((resolve, reject) => {
    const startTime = Date.now();
    const checkForElement = () => {
      const element = func();
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element not found after ${timeout}ms`));
      } else {
        requestAnimationFrame(checkForElement);
      }
    };
    checkForElement();
  });
}

describe("InlineSVG Component", () => {
  let element: InlineSVG;
  let container: HTMLDivElement;
  let consoleErrorSpy: any;

  beforeAll(() => {
    fetchMock
      .mockGlobal()
      .get("/public/car.svg", CAR_SVG)
      .get("/public/rocket.svg", ROCKET_SVG)
      .get("/public/invalid.svg", 404);
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.resetAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
    consoleErrorSpy.mockRestore();
    fetchMock.clearHistory();
    clearCache();
  });

  afterAll(() => {
    fetchMock.unmockGlobal();
  });

  it("should load and render an SVG correctly", async () => {
    container.innerHTML = `<inline-svg src="/public/car.svg" width="200" height="150" fill="#f44336"></inline-svg>`;
    element = document.querySelector("inline-svg") as InlineSVG;

    await waitForElement(() => element.shadowRoot?.querySelector("svg"));

    const svg = element.shadowRoot?.querySelector("svg");

    expect(svg).not.toBeNull();
    expect(svg).toMatchSnapshot();
    const callHistory = fetchMock.callHistory.calls();
    expect(callHistory.length).toBe(1);
    expect(callHistory[0].url).toMatch("/public/car.svg");

    // Verify attributes were transferred
    expect(svg?.getAttribute("width")).toBe("200");
    expect(svg?.getAttribute("height")).toBe("150");
    expect(svg?.getAttribute("fill")).toBe("#f44336");
  });

  it("should update the SVG when src attribute changes", async () => {
    element = document.createElement("inline-svg") as InlineSVG;
    element.setAttribute("src", "/public/car.svg");
    container.appendChild(element);

    await waitForElement(() =>
      element.shadowRoot?.querySelector('svg[viewBox="0 0 901.08774 624"]')
    );

    expect(fetchMock.callHistory.calls().length).toBe(1);
    expect(fetchMock.callHistory.calls()[0].url).toMatch("/public/car.svg");
    expect(element.shadowRoot?.querySelector("svg")).not.toBeNull();
    expect(element.shadowRoot?.innerHTML).toContain("Limpitsouni");

    // Now change to rocket SVG
    element.setAttribute("src", "/public/rocket.svg");

    await waitForElement(() =>
      element.shadowRoot?.querySelector('svg[viewBox="0 0 512 512"]')
    );

    expect(element.shadowRoot?.innerHTML).not.toContain("Limpitsouni");
    expect(element.shadowRoot?.innerHTML).toContain("@fontawesome");
    expect(fetchMock.callHistory.calls().length).toBe(2);
    expect(fetchMock.callHistory.calls()[0].url).toMatch("/public/car.svg");
    expect(fetchMock.callHistory.calls()[1].url).toMatch("/public/rocket.svg");
  });

  it("should apply replacements to SVG content", async () => {
    container.innerHTML = `<inline-svg src="/public/car.svg">
      <inline-svg-replace pattern="#2f2e43" value="#725C42"></inline-svg-replace>
    </inline-svg>`;
    element = document.querySelector("inline-svg") as InlineSVG;

    await waitForElement(() => element.shadowRoot?.querySelector("svg"));

    const svg = element.shadowRoot?.querySelector("svg");

    // Verify the replacement was applied
    expect(svg?.innerHTML.match(/#2f2e43/)).toBeFalsy();
    expect(svg?.innerHTML.match(/#725C42/g)?.length).toBe(20);
  });

  it("should handle missing src attribute", async () => {
    container.innerHTML = `<inline-svg></inline-svg>`;

    // Give time for the component to process
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Missing src attribute");
    expect(fetchMock.callHistory.calls().length).toBe(0);
  });

  it("should handle SVG loading errors", async () => {
    container.innerHTML = `<inline-svg src="/public/invalid.svg"></inline-svg>`;
    container.querySelector("inline-svg") as InlineSVG;

    // Give time for the error to be caught and logged
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify error was handled
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should only fetch the SVG once", async () => {
    container.innerHTML = `
    <inline-svg src="/public/car.svg" width="200" height="150" fill="#f44336"></inline-svg>
    <inline-svg src="/public/car.svg" width="200" height="150" fill="#f44336"></inline-svg>`;
    const inline1: InlineSVG = document.querySelectorAll(
      "inline-svg"
    )[0] as InlineSVG;

    const inline2: InlineSVG = document.querySelectorAll(
      "inline-svg"
    )[1] as InlineSVG;

    await waitForElement(() => inline1.shadowRoot?.querySelector("svg"));
    await waitForElement(() => inline2.shadowRoot?.querySelector("svg"));

    expect(fetchMock.callHistory.calls().length).toBe(1);
    expect(fetchMock.callHistory.calls()[0].url).toMatch("/public/car.svg");
  });

  it("should render to the light DOM when shadow is false", async () => {
    container.innerHTML = `<inline-svg src="/public/car.svg" shadow="false"></inline-svg>`;
    const element = container.querySelector("inline-svg") as InlineSVG;
    await waitForElement(() => element.querySelector("svg"));

    expect(element.shadowRoot).toBeNull();
    expect(element.querySelector("svg")).not.toBeNull();
  });
});
