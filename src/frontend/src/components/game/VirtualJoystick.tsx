import { useCallback, useEffect, useRef, useState } from "react";

interface JoystickOutput {
  x: number;
  y: number;
}

interface VirtualJoystickProps {
  onChange: (direction: JoystickOutput) => void;
}

export function VirtualJoystick({ onChange }: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);
  const originRef = useRef({ x: 0, y: 0 });
  const RADIUS = 50;

  const getRelativePos = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, RADIUS);
    const angle = Math.atan2(dy, dx);
    return {
      x: clampedDist * Math.cos(angle),
      y: clampedDist * Math.sin(angle),
    };
  }, []);

  const handleStart = useCallback(
    (clientX: number, clientY: number, touchId?: number) => {
      setActive(true);
      if (touchId !== undefined) touchIdRef.current = touchId;
      const pos = getRelativePos(clientX, clientY);
      setKnobPos(pos);
      originRef.current = { x: clientX, y: clientY };
      onChange({
        x: pos.x / RADIUS,
        y: pos.y / RADIUS,
      });
    },
    [getRelativePos, onChange],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!active) return;
      const pos = getRelativePos(clientX, clientY);
      setKnobPos(pos);
      onChange({
        x: pos.x / RADIUS,
        y: pos.y / RADIUS,
      });
    },
    [active, getRelativePos, onChange],
  );

  const handleEnd = useCallback(() => {
    setActive(false);
    touchIdRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    onChange({ x: 0, y: 0 });
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleStart(touch.clientX, touch.clientY, touch.identifier);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchIdRef.current) {
          handleMove(t.clientX, t.clientY);
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          handleEnd();
          break;
        }
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      data-ocid="game.joystick.canvas_target"
      onMouseDown={(e) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleMove(e.clientX, e.clientY);
      }}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      style={{
        position: "relative",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(10px)",
        border: active
          ? "2px solid rgba(255,0,51,0.9)"
          : "2px solid rgba(255,0,51,0.4)",
        boxShadow: active
          ? "0 0 20px rgba(255,0,51,0.7), inset 0 0 20px rgba(255,0,51,0.15)"
          : "0 0 12px rgba(255,0,51,0.3), inset 0 0 10px rgba(255,0,51,0.08)",
        cursor: "pointer",
        touchAction: "none",
        userSelect: "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        flexShrink: 0,
      }}
    >
      {/* Crosshair lines */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          right: "10%",
          height: "1px",
          background: "rgba(255,0,51,0.25)",
          transform: "translateY(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "10%",
          bottom: "10%",
          width: "1px",
          background: "rgba(255,0,51,0.25)",
          transform: "translateX(-50%)",
        }}
      />
      {/* Knob */}
      <div
        style={{
          position: "absolute",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: active
            ? "radial-gradient(circle, rgba(255,0,51,0.8) 0%, rgba(255,0,51,0.4) 70%)"
            : "radial-gradient(circle, rgba(255,0,51,0.5) 0%, rgba(255,0,51,0.2) 70%)",
          border: "2px solid rgba(255,0,51,0.8)",
          boxShadow: "0 0 12px rgba(255,0,51,0.6)",
          left: `calc(50% + ${knobPos.x}px - 25px)`,
          top: `calc(50% + ${knobPos.y}px - 25px)`,
          transition: active ? "none" : "left 0.12s ease, top 0.12s ease",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
