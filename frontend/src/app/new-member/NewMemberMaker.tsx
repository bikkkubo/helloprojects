"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

type PresetKey = "left" | "center" | "right";

type MakerState = {
  scale: number;
  x: number;
  y: number;
  blend: number;
  brightness: number;
  blur: number;
};

const CANVAS_WIDTH = 590;
const CANVAS_HEIGHT = 1280;

const presets: Record<PresetKey, Pick<MakerState, "scale" | "x" | "y" | "blend">> = {
  left: { scale: 1.1, x: -90, y: 60, blend: 0.34 },
  center: { scale: 0.92, x: 0, y: 82, blend: 0.3 },
  right: { scale: 1.05, x: 86, y: 72, blend: 0.38 },
};

const initialState: MakerState = {
  ...presets.left,
  brightness: 1.03,
  blur: 14,
};

const sliders: Array<{
  key: keyof MakerState;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: "scale", label: "拡大", min: 0.45, max: 2.2, step: 0.01 },
  { key: "x", label: "左右", min: -260, max: 260, step: 1 },
  { key: "y", label: "上下", min: -240, max: 260, step: 1 },
  { key: "blend", label: "なじませ", min: 0, max: 1, step: 0.01 },
  { key: "brightness", label: "明るさ", min: 0.7, max: 1.35, step: 0.01 },
  { key: "blur", label: "背景ぼけ", min: 0, max: 26, step: 1 },
];

const posterFontFamily =
  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "Source Han Serif JP", serif';

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const imageRatio = image.width / image.height;
  const boxRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (imageRatio > boxRatio) {
    sw = image.height * boxRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / boxRatio;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  centerX: number,
  centerY: number,
  scale: number,
) {
  const targetHeight = CANVAS_HEIGHT * 0.72 * scale;
  const targetWidth = targetHeight * (image.width / image.height);
  ctx.drawImage(image, centerX - targetWidth / 2, centerY - targetHeight / 2, targetWidth, targetHeight);
}

function drawHeader(ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null) {
  ctx.fillStyle = "#0788c7";
  ctx.fillRect(0, 0, CANVAS_WIDTH, 208);

  if (logo) {
    const logoWidth = 440;
    const logoHeight = logoWidth * (logo.height / logo.width);
    ctx.drawImage(logo, (CANVAS_WIDTH - logoWidth) / 2, 78, logoWidth, logoHeight);
    return;
  }

  ctx.fillStyle = "#f3f1e9";
  ctx.textAlign = "center";
  ctx.font = "32px Georgia";
  ctx.fillText("HELLO! PROJECT", CANVAS_WIDTH / 2, 106);
  ctx.font = "20px Arial";
  ctx.fillText("SINCE1998", CANVAS_WIDTH / 2, 148);
  ctx.textAlign = "start";
}

function drawOutlinedPosterLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  strokeWidth: number,
) {
  ctx.font = `900 ${fontSize}px ${posterFontFamily}`;
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.96)";
  ctx.fillStyle = "#fffdf7";

  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.strokeText(text, x, y);

  ctx.shadowColor = "rgba(255, 255, 255, 0.36)";
  ctx.shadowBlur = 1;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = -1;
  ctx.fillText(text, x, y);
}

function drawPosterText(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  drawOutlinedPosterLine(ctx, "モーニング娘。’26の", 72, 567, 35, 8);
  drawOutlinedPosterLine(ctx, "新メンバーはー。", 65, 637, 49, 9);

  ctx.restore();
}

function drawGuide(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.setLineDash([10, 10]);
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 226, CANVAS_WIDTH - 84, 835);
  ctx.fillStyle = "rgba(7, 136, 199, 0.7)";
  ctx.font = "18px Arial";
  ctx.fillText("人物の顔・肩の目安", 58, 256);
  ctx.restore();
}

export default function NewMemberMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateRef = useRef<HTMLImageElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [state, setState] = useState<MakerState>(initialState);
  const [preset, setPreset] = useState<PresetKey>("left");
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const template = new Image();
    template.src = "/images/new-member/template.jpg";
    template.onload = () => {
      templateRef.current = template;
      renderCanvas();
    };

    const logo = new Image();
    logo.src = "/images/new-member/hello-project-logo-white.svg";
    logo.onload = () => {
      logoRef.current = logo;
      renderCanvas();
    };
  }, []);

  useEffect(() => {
    renderCanvas();
  }, [state, userImage, showGuide]);

  function renderCanvas() {
    const canvas = canvasRef.current;
    const template = templateRef.current;
    if (!canvas || !template) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();
    ctx.filter = `blur(${state.blur}px) saturate(1.1) brightness(0.82)`;
    drawCoverImage(ctx, template, -40, 166, CANVAS_WIDTH + 80, CANVAS_HEIGHT - 210);
    ctx.restore();

    ctx.fillStyle = "rgba(8, 28, 10, 0.28)";
    ctx.fillRect(0, 208, CANVAS_WIDTH, 910);

    if (userImage) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 208, CANVAS_WIDTH, 900);
      ctx.clip();
      ctx.filter = `brightness(${state.brightness}) contrast(1.02) saturate(0.96)`;
      drawContainImage(ctx, userImage, CANVAS_WIDTH / 2 + state.x, 720 + state.y, state.scale);
      ctx.restore();

      ctx.fillStyle = `rgba(13, 42, 18, ${state.blend})`;
      ctx.fillRect(0, 208, CANVAS_WIDTH, 900);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.font = "700 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("画像を選ぶとここに合成されます", CANVAS_WIDTH / 2, 800);
      ctx.textAlign = "start";
    }

    drawHeader(ctx, logoRef.current);
    drawPosterText(ctx);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 1108, CANVAS_WIDTH, 172);

    if (showGuide) drawGuide(ctx);
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setUserImage(image);
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function applyPreset(nextPreset: PresetKey) {
    setPreset(nextPreset);
    setState((current) => ({ ...current, ...presets[nextPreset] }));
  }

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "morning-new-member-style.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_16%_18%,rgba(7,136,199,0.42),transparent_28%),linear-gradient(125deg,#091009_0%,#1f3b1d_42%,#050705_100%)] text-[#f7f3e8]">
      <div className="mx-auto grid min-h-screen w-[min(1180px,calc(100%_-_32px))] grid-cols-1 items-center gap-7 py-8 lg:grid-cols-[minmax(310px,590px)_minmax(320px,440px)] lg:gap-14">
        <section className="grid place-items-center" aria-label="生成プレビュー">
          <div className="aspect-[590/1280] w-[min(100%,430px)] overflow-hidden rounded border border-white/20 bg-black shadow-[0_26px_90px_rgba(0,0,0,0.38)]">
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block h-full w-full" />
          </div>
        </section>

        <aside className="order-first rounded-lg border border-white/20 bg-[#111512]/85 p-6 shadow-[0_26px_90px_rgba(0,0,0,0.38)] backdrop-blur-lg lg:order-none lg:p-8" aria-label="編集パネル">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-sky-200">HELLO! PROJECT style</p>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">新メンバー風メーカー</h1>
          </div>

          <label className="grid min-h-24 cursor-pointer grid-cols-[48px_1fr] items-center gap-x-3 gap-y-1 rounded-md border border-white/40 bg-[#f4efe6] p-4 text-[#131412] hover:bg-[#fff8ea]">
            <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
            <span className="row-span-2 grid h-12 w-12 place-items-center rounded-full bg-[#00669c] text-3xl leading-none text-white" aria-hidden="true">+</span>
            <span className="text-lg font-bold">自分の画像を選択</span>
            <span className="text-xs text-[#405146]">人物が中央に写った縦長写真がおすすめ</span>
          </label>

          <div className="mt-5 grid grid-cols-3 gap-2" role="group" aria-label="構図プリセット">
            {(["left", "center", "right"] as PresetKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`min-h-11 rounded border px-2 text-sm ${
                  preset === key ? "border-white/40 bg-[#0788c7] text-white" : "border-white/20 bg-white/10 text-[#f7f3e8]"
                }`}
              >
                {key === "left" ? "左肩越し" : key === "center" ? "正面" : "右寄せ"}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4">
            {sliders.map((slider) => (
              <label key={slider.key} className="grid grid-cols-[82px_1fr] items-center gap-3 text-sm">
                <span>{slider.label}</span>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={state[slider.key]}
                  onChange={(event) => setState((current) => ({ ...current, [slider.key]: Number(event.target.value) }))}
                  className="w-full accent-[#0788c7]"
                />
              </label>
            ))}
          </div>

          <label className="mt-5 flex items-center gap-2 text-sm text-[#f7f3e8]/85">
            <input type="checkbox" checked={showGuide} onChange={(event) => setShowGuide(event.target.checked)} className="h-5 w-5 accent-[#0788c7]" />
            <span>セーフエリアを表示</span>
          </label>

          <div className="mt-6 grid grid-cols-[0.82fr_1.18fr] gap-2">
            <button
              type="button"
              onClick={() => {
                setPreset("left");
                setState(initialState);
              }}
              className="min-h-11 rounded border border-white/20 bg-white/10 px-3 text-sm text-[#f7f3e8]"
            >
              リセット
            </button>
            <button type="button" onClick={downloadPng} className="min-h-11 rounded border border-white/40 bg-[#0788c7] px-3 text-sm font-bold text-white">
              PNGを書き出し
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
