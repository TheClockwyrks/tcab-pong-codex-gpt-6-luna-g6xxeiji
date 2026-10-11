import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  MATCHOVER_ITEMS,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_W,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PAUSE_ITEMS,
  PADDLE_H,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  SPEED_CAP,
  SPEED_MULT,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";
export type Mode = "solo" | "versus";
export type Side = "left" | "right";
export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}
export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}
export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}
export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}
export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}
export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
  readonly muted: boolean;
}

export interface Snapshot {
  version: number;
  screen: Screen;
  mode: Mode;
  menuIndex: number;
  titleIndex: number;
  resumeScreen: "countdown" | "playing";
  score: { p1: number; p2: number };
  winner: Side | null;
  muted: boolean;
  paddles: { left: PaddleState; right: PaddleState };
  ai: AiState;
  receiver: Side;
  ball: (BallState & { speed: number }) | null;
  obstacles: readonly ObstacleState[];
  simTime: number;
}
export interface CaromDebugApi {
  readonly version: number;
  clearWorld(s: DeepReadonly<CaromState>): CaromState;
  spawnBall(s: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(s: DeepReadonly<CaromState>, index: number): CaromState;
  reset(s: DeepReadonly<CaromState>): CaromState;
  reconcile(s: DeepReadonly<CaromState>): CaromState;
  setScreen(s: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(s: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(s: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(s: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    s: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(s: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(s: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(s: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(s: DeepReadonly<CaromState>, side: Side, cy: number): CaromState;
  setPaddleVy(s: DeepReadonly<CaromState>, side: Side, vy: number): CaromState;
  setPaddleDriven(
    s: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    s: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    s: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(s: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(s: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(s: DeepReadonly<CaromState>, seconds: number): CaromState;
  setBallServeSign(s: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(s: DeepReadonly<CaromState>): CaromState;
  setAiTracking(s: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(s: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(s: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(s: DeepReadonly<CaromState>): Snapshot;
  menuItemRect(
    s: DeepReadonly<CaromState>,
    index: number,
  ): { x: number; y: number; w: number; h: number } | null;
}

export const BACKGROUND = "#07111f";
const COLORS = {
  ink: "#f4f8ff",
  muted: "#8092a8",
  cyan: "#52e3d2",
  coral: "#ff7185",
  gold: "#ffc86b",
  panel: "rgba(7,17,31,.91)",
  line: "rgba(136,175,205,.18)",
};
const randSign = (): 1 | -1 => (Math.random() < 0.5 ? -1 : 1);
const parkedBall = (): BallState => ({
  x: FIELD_CX,
  y: FIELD_CY,
  vx: 0,
  vy: 0,
  spin: 0,
  held: true,
  holdTimer: HOLD_TIME,
  serveSign: randSign(),
  trail: [],
});
const paddle = (cy = FIELD_CY): PaddleState => ({
  cy,
  vy: 0,
  driven: false,
  drivenVy: 0,
});
const obstacles = (): ObstacleState[] =>
  OBSTACLE_CENTERS.map((p, index) => ({ index, cx: p.x, cy: p.y }));
const initial = (muted: boolean, titleIndex = 0, simTime = 0): CaromState => ({
  screen: "title",
  mode: "solo",
  menuIndex: titleIndex,
  titleIndex,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  paddles: { left: paddle(), right: paddle() },
  ai: { tracking: true, movement: true },
  receiver: "left",
  ball: parkedBall(),
  obstacles: obstacles(),
  simTime,
  muted,
});
const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));
const menuItems = (screen: Screen): readonly string[] | null =>
  screen === "title"
    ? TITLE_ITEMS
    : screen === "paused"
      ? PAUSE_ITEMS
      : screen === "matchover"
        ? MATCHOVER_ITEMS
        : screen === "howto"
          ? ["BACK TO TITLE"]
          : null;
const rectFor = (
  index: number,
): { x: number; y: number; w: number; h: number } => ({
  x: 440,
  y: 366 + index * 64,
  w: 400,
  h: 48,
});

function makeDebug(setMuted: (value: boolean) => void): CaromDebugApi {
  const requireBall = (s: DeepReadonly<CaromState>): BallState => {
    if (!s.ball) throw new Error("Carom debug: no ball present");
    return s.ball as BallState;
  };
  const patchBall = (
    s: DeepReadonly<CaromState>,
    f: Partial<BallState>,
  ): CaromState => ({ ...s, ball: { ...requireBall(s), ...f } });
  const patchPaddle = (
    s: DeepReadonly<CaromState>,
    side: Side,
    f: Partial<PaddleState>,
  ): CaromState => ({
    ...s,
    paddles: { ...s.paddles, [side]: { ...s.paddles[side], ...f } },
  });
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (s) => ({ ...s, ball: null, obstacles: [] }),
    spawnBall: (s) => ({ ...s, ball: parkedBall() }),
    spawnObstacle: (s, index) => {
      const p = OBSTACLE_CENTERS[index];
      if (!p) throw new Error(`Carom debug: invalid obstacle index ${index}`);
      return {
        ...s,
        obstacles: [
          ...s.obstacles.filter((o) => o.index !== index),
          { index, cx: p.x, cy: p.y },
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (s) => initial(s.muted),
    reconcile: (s) => ({ ...s }),
    setScreen: (s, screen) => ({ ...s, screen }),
    setMode: (s, mode) => ({ ...s, mode }),
    setMenuIndex: (s, menuIndex) => ({ ...s, menuIndex }),
    setTitleIndex: (s, titleIndex) => ({ ...s, titleIndex }),
    setResumeScreen: (s, resumeScreen) => ({ ...s, resumeScreen }),
    setScore: (s, p1, p2) => ({ ...s, score: { p1, p2 } }),
    setWinner: (s, winner) => ({ ...s, winner }),
    setReceiver: (s, receiver) => ({ ...s, receiver }),
    setPaddleCy: (s, side, cy) => patchPaddle(s, side, { cy }),
    setPaddleVy: (s, side, drivenVy) => patchPaddle(s, side, { drivenVy }),
    setPaddleDriven: (s, side, driven) => patchPaddle(s, side, { driven }),
    setBallPosition: (s, x, y) => patchBall(s, { x, y }),
    setBallVelocity: (s, vx, vy) => patchBall(s, { vx, vy }),
    setBallSpin: (s, spin) => patchBall(s, { spin }),
    setBallHeld: (s, held) => patchBall(s, { held }),
    setBallHoldTimer: (s, holdTimer) => patchBall(s, { holdTimer }),
    setBallServeSign: (s, serveSign) => patchBall(s, { serveSign }),
    drawBallServeSign: (s) => patchBall(s, { serveSign: randSign() }),
    setAiTracking: (s, tracking) => ({ ...s, ai: { ...s.ai, tracking } }),
    setAiMovement: (s, movement) => ({ ...s, ai: { ...s.ai, movement } }),
    setMuted: (s, value) => {
      setMuted(value);
      return { ...s, muted: value };
    },
    snapshot: (s) => ({
      version: CAROM_DEBUG_VERSION,
      screen: s.screen,
      mode: s.mode,
      menuIndex: s.menuIndex,
      titleIndex: s.titleIndex,
      resumeScreen: s.resumeScreen,
      score: { ...s.score },
      winner: s.winner,
      muted: s.muted,
      paddles: { left: { ...s.paddles.left }, right: { ...s.paddles.right } },
      ai: { ...s.ai },
      receiver: s.receiver,
      ball: s.ball
        ? { ...s.ball, speed: Math.hypot(s.ball.vx, s.ball.vy) }
        : null,
      obstacles: s.obstacles.map((o) => ({ ...o })),
      simTime: s.simTime,
    }),
    menuItemRect: (s, index) => {
      const items = menuItems(s.screen);
      return items && index >= 0 && index < items.length
        ? rectFor(index)
        : null;
    },
  };
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    ACTIONS.forEach((name) =>
      api.input.register(name, { keys: [...BINDINGS[name]] }),
    );
    const cueSpecs = [
      [
        CUES.paddleHit,
        {
          wave: "triangle",
          freq: 620,
          freqTo: 300,
          durationMs: 70,
          gain: 0.16,
        },
      ],
      [
        CUES.wallBounce,
        { wave: "sine", freq: 420, freqTo: 260, durationMs: 55, gain: 0.12 },
      ],
      [
        CUES.obstacleBounce,
        { wave: "square", freq: 330, freqTo: 500, durationMs: 65, gain: 0.1 },
      ],
      [
        CUES.score,
        {
          wave: "triangle",
          freq: 520,
          freqTo: 880,
          durationMs: 220,
          gain: 0.18,
        },
      ],
    ] as const;
    cueSpecs.forEach(([name, spec]) => api.audio.define(name, spec));
    for (const [name, read] of Object.entries({
      screen: (s: DeepReadonly<CaromState>) => s.screen,
      mode: (s: DeepReadonly<CaromState>) => s.mode,
      score: (s: DeepReadonly<CaromState>) => `${s.score.p1}–${s.score.p2}`,
      ball: (s: DeepReadonly<CaromState>) =>
        s.ball ? `${s.ball.x.toFixed(0)},${s.ball.y.toFixed(0)}` : "absent",
      velocity: (s: DeepReadonly<CaromState>) =>
        s.ball ? `${s.ball.vx.toFixed(0)},${s.ball.vy.toFixed(0)}` : "—",
      speed: (s: DeepReadonly<CaromState>) =>
        s.ball ? Math.hypot(s.ball.vx, s.ball.vy).toFixed(1) : "—",
      spin: (s: DeepReadonly<CaromState>) => s.ball?.spin.toFixed(1) ?? "—",
      left: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.left.cy.toFixed(0)} / ${s.paddles.left.vy.toFixed(0)}`,
      right: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.right.cy.toFixed(0)} / ${s.paddles.right.vy.toFixed(0)}`,
    }))
      api.diagnostics.register(name, read);
    return [initial(false), makeDebug(() => undefined)];
  },
  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    const pressed = (a: string) => api.input.pressed(a),
      value = (a: string) => api.input.value(a);
    if (state.muted !== api.audio.muted()) api.audio.setMuted(state.muted);
    let s: CaromState = {
      ...state,
      simTime: state.simTime + dt,
      muted: api.audio.muted(),
    };
    if (pressed("mute")) {
      api.audio.setMuted(!api.audio.muted());
      s = { ...s, muted: api.audio.muted() };
    }
    const startMatch = (mode = s.mode): CaromState => ({
      ...s,
      screen: "countdown",
      mode,
      resumeScreen: "playing",
      menuIndex: 0,
      score: { p1: 0, p2: 0 },
      winner: null,
      receiver: "left",
      ball: parkedBall(),
      paddles: { left: paddle(), right: paddle() },
    });
    const toTitle = (): CaromState => ({
      ...initial(s.muted, s.titleIndex, s.simTime),
      menuIndex: s.titleIndex,
    });
    const confirm = (): CaromState => {
      if (s.screen === "title") {
        s = { ...s, titleIndex: s.menuIndex };
        if (s.menuIndex === 0) return startMatch("solo");
        if (s.menuIndex === 1) return startMatch("versus");
        return { ...s, screen: "howto", menuIndex: 0 };
      }
      if (s.screen === "howto") return toTitle();
      if (s.screen === "paused") {
        if (s.menuIndex === 0) return { ...s, screen: s.resumeScreen };
        if (s.menuIndex === 1) return startMatch();
        return toTitle();
      }
      if (s.screen === "matchover") {
        if (s.menuIndex === 0) return startMatch();
        return toTitle();
      }
      return s;
    };
    const up = pressed("p1-up") || pressed("p2-up"),
      down = pressed("p1-down") || pressed("p2-down");
    const count = menuItems(s.screen)?.length ?? 0;
    if (s.screen === "paused" && (pressed("pause") || pressed("back")))
      s = { ...s, screen: s.resumeScreen };
    else if (
      (s.screen === "countdown" || s.screen === "playing") &&
      pressed("pause")
    )
      s = { ...s, resumeScreen: s.screen, screen: "paused", menuIndex: 0 };
    else if (count) {
      if (s.screen === "howto" && (pressed("confirm") || pressed("back")))
        s = toTitle();
      else if (s.screen === "matchover" && pressed("back")) s = toTitle();
      else if (up || down)
        s = { ...s, menuIndex: (s.menuIndex + (up ? -1 : 1) + count) % count };
      else if (pressed("confirm")) s = confirm();
    }
    // Menus use the same rects reported by the debug surface.
    if (menuItems(s.screen)) {
      const pointer = api.input.pointer();
      const samples = api.input.pointerSamples();
      for (const sample of samples) {
        const i = menuItems(s.screen)!.findIndex((_, n) => {
          const r = rectFor(n);
          return (
            sample.x >= r.x &&
            sample.x <= r.x + r.w &&
            sample.y >= r.y &&
            sample.y <= r.y + r.h
          );
        });
        if (i >= 0) s = { ...s, menuIndex: i };
      }
      if (api.input.pointerPressed() || api.input.pointerReleased()) {
        const i = menuItems(s.screen)!.findIndex((_, n) => {
          const r = rectFor(n);
          return (
            pointer.x >= r.x &&
            pointer.x <= r.x + r.w &&
            pointer.y >= r.y &&
            pointer.y <= r.y + r.h
          );
        });
        if (i >= 0) {
          s = { ...s, menuIndex: i };
          if (api.input.pointerReleased()) s = confirm();
        }
      }
    }
    if (s.screen !== "countdown" && s.screen !== "playing") return s;
    const moving = (side: Side): PaddleState => {
      const old = s.paddles[side];
      let vy = 0;
      if (old.driven) vy = old.drivenVy;
      else if (side === "left") {
        const upv =
          s.mode === "solo"
            ? Math.max(value("p1-up"), value("p2-up"))
            : value("p1-up");
        const dnv =
          s.mode === "solo"
            ? Math.max(value("p1-down"), value("p2-down"))
            : value("p1-down");
        vy = (dnv - upv) * PADDLE_SPEED;
      } else if (s.mode === "versus")
        vy = (value("p2-down") - value("p2-up")) * PADDLE_SPEED;
      else if (s.ai.movement) {
        let target = AI_HOME_Y,
          dead = AI_HOME_DEADZONE;
        if (
          s.ai.tracking &&
          s.screen === "playing" &&
          s.ball &&
          !s.ball.held &&
          s.ball.vx > 0
        ) {
          target = s.ball.y - s.ball.vy * AI_REACT;
          dead = AI_DEADZONE;
        }
        const diff = target - old.cy;
        vy =
          Math.abs(diff) <= dead || dt <= 0
            ? 0
            : Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
      }
      const cy = clamp(old.cy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
      if (dt > 0) vy = (cy - old.cy) / dt;
      return { ...old, cy, vy };
    };
    s = { ...s, paddles: { left: moving("left"), right: moving("right") } };
    if (!s.ball) return s;
    let b = { ...s.ball };
    if (s.screen === "countdown" && b.held) {
      const timer = b.holdTimer - dt;
      if (timer <= 0) {
        const dir = s.receiver === "left" ? -1 : 1;
        b = {
          ...b,
          held: false,
          holdTimer: 0,
          vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
          vy: b.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
          trail: [],
        };
        s = { ...s, screen: "playing" };
      } else b = { ...b, holdTimer: timer };
    }
    if (s.screen === "playing" && !b.held) {
      const speed = Math.hypot(b.vx, b.vy),
        n = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP)),
        h = dt / n;
      let paddleHit = false,
        wallHit = false,
        obstacleHit = false;
      for (let step = 0; step < n; step++) {
        const sp = Math.hypot(b.vx, b.vy);
        if (sp > 0) {
          const a = (b.spin / sp) * h,
            c = Math.cos(a),
            sn = Math.sin(a);
          b = { ...b, vx: b.vx * c - b.vy * sn, vy: b.vx * sn + b.vy * c };
        }
        b = {
          ...b,
          spin: b.spin * Math.pow(0.5, h / SPIN_HALFLIFE),
          x: b.x + b.vx * h,
          y: b.y + b.vy * h,
        };
        if (b.y - BALL_R < 0 && b.vy < 0) {
          b = { ...b, y: BALL_R, vy: -b.vy };
          wallHit = true;
        } else if (b.y + BALL_R > FIELD_H && b.vy > 0) {
          b = { ...b, y: FIELD_H - BALL_R, vy: -b.vy };
          wallHit = true;
        }
        for (const side of ["left", "right"] as const) {
          const p = s.paddles[side],
            x0 = side === "left" ? P1_X0 : P2_X0,
            x1 = side === "left" ? P1_X1 : P2_X1;
          const hit = resolve(
            b,
            x0,
            x1,
            p.cy - PADDLE_HALF,
            p.cy + PADDLE_HALF,
          );
          if (hit) {
            b = { ...b, ...hit };
            if (hit.face === "left" || hit.face === "right") {
              const off = clamp((b.y - p.cy) / PADDLE_HALF, -1, 1),
                theta = off * MAX_BOUNCE_ANGLE,
                sp2 = Math.min(Math.hypot(b.vx, b.vy) * SPEED_MULT, SPEED_CAP),
                dir = side === "left" ? 1 : -1;
              b = {
                ...b,
                x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
                vx: dir * sp2 * Math.cos(theta),
                vy: sp2 * Math.sin(theta),
                spin: clamp(
                  b.spin + p.vy * SPIN_FROM_PADDLE,
                  -SPIN_CLAMP,
                  SPIN_CLAMP,
                ),
              };
              paddleHit = true;
            } else wallHit = true;
          }
        }
        s.obstacles.forEach((o) => {
          const r = OBSTACLES[o.index];
          if (!r) return;
          const hit = resolve(b, r.x0, r.x1, r.y0, r.y1);
          if (hit) {
            b = { ...b, ...hit };
            obstacleHit = true;
          }
        });
      }
      if (paddleHit) api.audio.play(CUES.paddleHit);
      if (wallHit) api.audio.play(CUES.wallBounce);
      if (obstacleHit) api.audio.play(CUES.obstacleBounce);
      if (b.x - BALL_R > FIELD_W || b.x + BALL_R < 0) {
        const p1 = b.x - BALL_R > FIELD_W,
          score = {
            p1: s.score.p1 + (p1 ? 1 : 0),
            p2: s.score.p2 + (p1 ? 0 : 1),
          };
        api.audio.play(CUES.score);
        const won = p1
          ? score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD
          : score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD;
        s = {
          ...s,
          score,
          winner: won ? (p1 ? "left" : "right") : null,
          screen: won ? "matchover" : "countdown",
          menuIndex: won ? 0 : s.menuIndex,
          receiver: p1 ? "right" : "left",
          ball: won ? b : parkedBall(),
        };
        return s;
      }
    }
    const trail = [...b.trail, { x: b.x, y: b.y, t: s.simTime }].filter(
      (p) => s.simTime - p.t <= TRAIL_TIME,
    );
    return { ...s, ball: { ...b, trail } };
  },
  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const c = api.ctx;
    c.fillStyle = BACKGROUND;
    c.fillRect(0, 0, FIELD_W, FIELD_H);
    c.strokeStyle = COLORS.line;
    c.lineWidth = 1;
    c.strokeRect(24, 24, FIELD_W - 48, FIELD_H - 48);
    c.setLineDash([10, 14]);
    c.strokeStyle = "rgba(160,190,220,.25)";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(NET_X, 30);
    c.lineTo(NET_X, FIELD_H - 30);
    c.stroke();
    c.setLineDash([]);
    state.obstacles.forEach((o) => {
      c.shadowColor = COLORS.gold;
      c.shadowBlur = 18;
      c.fillStyle = COLORS.gold;
      roundRect(
        c,
        o.cx - OBSTACLE_W / 2,
        o.cy - OBSTACLE_H / 2,
        OBSTACLE_W,
        OBSTACLE_H,
        10,
      );
    });
    c.shadowBlur = 0;
    for (const side of ["left", "right"] as const) {
      const p = state.paddles[side];
      c.shadowColor = side === "left" ? COLORS.cyan : COLORS.coral;
      c.shadowBlur = 22;
      c.fillStyle = side === "left" ? COLORS.cyan : COLORS.coral;
      roundRect(
        c,
        side === "left" ? P1_X0 : P2_X0,
        p.cy - PADDLE_H / 2,
        PADDLE_W,
        PADDLE_H,
        8,
      );
    }
    c.shadowBlur = 0;
    if (state.ball) {
      const b = state.ball;
      for (let i = 0; i < b.trail.length; i++) {
        const t = b.trail[i]!,
          alpha = (i + 1) / b.trail.length;
        c.globalAlpha = alpha * 0.35;
        c.fillStyle = COLORS.ink;
        c.beginPath();
        c.arc(t.x, t.y, BALL_R * alpha, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
      if (!b.held) {
        c.shadowColor = COLORS.ink;
        c.shadowBlur = 22;
      }
      c.fillStyle = COLORS.ink;
      c.beginPath();
      c.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
    }
    if (
      state.screen === "playing" ||
      state.screen === "countdown" ||
      state.screen === "paused" ||
      state.screen === "matchover"
    ) {
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "700 52px system-ui";
      c.fillStyle = COLORS.ink;
      c.fillText(String(state.score.p1), FIELD_CX - 100, 74);
      c.fillText(String(state.score.p2), FIELD_CX + 100, 74);
      c.font = "600 13px system-ui";
      c.fillStyle = COLORS.muted;
      c.fillText(
        state.mode === "solo" ? "SOLO · VS MACHINE" : "LOCAL VERSUS",
        FIELD_CX,
        112,
      );
    }
    if (state.screen === "countdown" && state.ball?.held) {
      c.textAlign = "center";
      c.font = "600 15px system-ui";
      c.fillStyle = COLORS.muted;
      c.fillText("GET READY", FIELD_CX, FIELD_CY - 64);
    }
    if (state.screen === "title") {
      drawMenu(c, state, "title");
    }
    if (state.screen === "howto") {
      c.fillStyle = COLORS.panel;
      c.fillRect(0, 0, FIELD_W, FIELD_H);
      c.textAlign = "center";
      c.fillStyle = COLORS.ink;
      c.font = "800 48px system-ui";
      c.fillText("HOW TO PLAY", FIELD_CX, 176);
      c.font = "500 19px system-ui";
      c.fillStyle = COLORS.muted;
      [
        "W / S  or  ↑ / ↓   ·   Move paddles",
        "Move as you strike to add spin to the ball.",
        "Bank shots off the gold obstacles to outplay your rival.",
        "First to 11, win by 2.",
      ].forEach((t, i) => c.fillText(t, FIELD_CX, 250 + i * 40));
      drawMenu(c, state, "howto");
    }
    if (state.screen === "paused") {
      c.fillStyle = COLORS.panel;
      c.fillRect(0, 0, FIELD_W, FIELD_H);
      c.textAlign = "center";
      c.fillStyle = COLORS.ink;
      c.font = "800 50px system-ui";
      c.fillText("PAUSED", FIELD_CX, 250);
      drawMenu(c, state, "paused");
    }
    if (state.screen === "matchover") {
      c.fillStyle = COLORS.panel;
      c.fillRect(0, 0, FIELD_W, FIELD_H);
      c.textAlign = "center";
      c.fillStyle = COLORS.ink;
      c.font = "800 46px system-ui";
      c.fillText(
        state.winner === "left" ? "PLAYER ONE WINS" : "PLAYER TWO WINS",
        FIELD_CX,
        210,
      );
      drawMenu(c, state, "matchover");
    }
    if (state.muted) {
      c.textAlign = "right";
      c.font = "600 13px system-ui";
      c.fillStyle = COLORS.muted;
      c.fillText("SOUND OFF", FIELD_W - 34, FIELD_H - 28);
    }
  },
};

function resolve(
  b: BallState,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): (Partial<BallState> & { face: "left" | "right" | "top" | "bottom" }) | null {
  const l = x0 - BALL_R,
    r = x1 + BALL_R,
    t = y0 - BALL_R,
    bt = y1 + BALL_R;
  if (!(b.x > l && b.x < r && b.y > t && b.y < bt)) return null;
  const depths = [b.x - l, r - b.x, b.y - t, bt - b.y],
    i = depths.indexOf(Math.min(...depths));
  if (i === 0)
    return { x: x0 - BALL_R, vx: b.vx > 0 ? -b.vx : b.vx, face: "left" };
  if (i === 1)
    return { x: x1 + BALL_R, vx: b.vx < 0 ? -b.vx : b.vx, face: "right" };
  if (i === 2)
    return { y: y0 - BALL_R, vy: b.vy > 0 ? -b.vy : b.vy, face: "top" };
  return { y: y1 + BALL_R, vy: b.vy < 0 ? -b.vy : b.vy, face: "bottom" };
}
function roundRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}
function drawMenu(
  c: CanvasRenderingContext2D,
  s: DeepReadonly<CaromState>,
  screen: Screen,
): void {
  const items = menuItems(screen) ?? [];
  c.textAlign = "center";
  c.textBaseline = "middle";
  if (screen === "title") {
    c.textAlign = "left";
    c.font = "800 88px system-ui";
    c.fillStyle = COLORS.ink;
    c.fillText(TITLE_TEXT, 460, 205);
    c.font = "600 15px system-ui";
    c.fillStyle = COLORS.cyan;
    c.fillText("THE BANK SHOT DUEL", 466, 253);
  }
  items.forEach((item, i) => {
    const r = rectFor(i);
    c.fillStyle =
      i === s.menuIndex ? "rgba(82,227,210,.13)" : "rgba(255,255,255,.025)";
    c.strokeStyle = i === s.menuIndex ? COLORS.cyan : COLORS.line;
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(r.x, r.y, r.w, r.h, 10);
    c.fill();
    c.stroke();
    c.font = `${i === s.menuIndex ? 700 : 550} 17px system-ui`;
    c.fillStyle = i === s.menuIndex ? COLORS.cyan : COLORS.ink;
    c.fillText(item, FIELD_CX, r.y + r.h / 2);
  });
  c.font = "500 13px system-ui";
  c.fillStyle = COLORS.muted;
  c.fillText(
    "W / S or ↑ / ↓ to navigate   ·   ENTER to select   ·   M to mute",
    FIELD_CX,
    FIELD_H - 42,
  );
}
