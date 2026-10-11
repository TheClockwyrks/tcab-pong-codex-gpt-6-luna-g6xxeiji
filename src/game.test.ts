import { describe, expect, it } from "vitest";
import { game } from "./game";
import type { CaromState } from "./game";
import type { UpdateApi } from "@clockwyrks/simple-2d";

const api = (
  pressed = new Set<string>(),
  values: Record<string, number> = {},
) =>
  ({
    input: {
      pressed: (name: string) => pressed.has(name),
      value: (name: string) => values[name] ?? 0,
      pointer: () => ({
        x: 0,
        y: 0,
        down: false,
        device: "mouse",
        buttons: [],
      }),
      pointerSamples: () => [],
      pointerPressed: () => false,
      pointerReleased: () => false,
      pointerContacts: () => [],
      wheel: () => ({ x: 0, y: 0 }),
    },
    audio: {
      muted: () => false,
      setMuted: () => undefined,
      play: () => undefined,
      loop: () => undefined,
      stop: () => undefined,
      looping: () => false,
    },
  }) as unknown as UpdateApi;

const initial = (): CaromState => ({
  screen: "title",
  mode: "solo",
  menuIndex: 0,
  titleIndex: 0,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  paddles: {
    left: { cy: 360, vy: 0, driven: false, drivenVy: 0 },
    right: { cy: 360, vy: 0, driven: false, drivenVy: 0 },
  },
  ai: { tracking: true, movement: true },
  receiver: "left",
  ball: {
    x: 640,
    y: 360,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: 1,
    serveSign: 1,
    trail: [],
  },
  obstacles: [
    { index: 0, cx: 490, cy: 220 },
    { index: 1, cx: 790, cy: 500 },
  ],
  simTime: 0,
  muted: false,
});

describe("Carom transitions", () => {
  it("starts a solo match from the title and counts down", () => {
    const started = game.update(initial(), api(new Set(["confirm"])), 0.25);
    expect(started.screen).toBe("countdown");
    expect(started.mode).toBe("solo");
    expect(started.score).toEqual({ p1: 0, p2: 0 });
    const next = game.update(started, api(), 1);
    expect(next.screen).toBe("playing");
    expect(next.ball?.held).toBe(false);
    expect(Math.hypot(next.ball?.vx ?? 0, next.ball?.vy ?? 0)).toBeCloseTo(520);
  });

  it("moves and clamps a driven paddle using elapsed seconds", () => {
    const state = initial();
    const driven = {
      ...state,
      screen: "playing" as const,
      paddles: {
        ...state.paddles,
        left: { ...state.paddles.left, driven: true, drivenVy: -900 },
      },
    };
    const next = game.update(driven, api(), 0.5);
    expect(next.paddles.left.cy).toBe(55);
    expect(next.paddles.left.vy).toBe(-610);
  });

  it("pauses a live match without advancing its ball", () => {
    const state = {
      ...initial(),
      screen: "playing" as const,
      ball: { ...initial().ball!, held: false, vx: 200, vy: 0 },
    };
    const next = game.update(state, api(new Set(["pause"])), 1);
    expect(next.screen).toBe("paused");
    expect(next.ball?.x).toBe(640);
  });
});
