import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ECUADOR_COORDS = [-79.2, -0.25];

export default function RotatingEarth({ width = 800, height = 600, className = "" }) {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    const pointInPolygon = (point, polygon) => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };

    const pointInFeature = (point, feature) => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      }

      if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
        return false;
      }

      return false;
    };

    const generateDotsInPolygon = (feature, dotSpacing = 16) => {
      const dots = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }
      return dots;
    };

    const allDots = [];
    let landFeatures = null;
    let pulseElapsed = 0;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#0B0D10";
      context.fill();
      context.globalAlpha = 0.4;
      context.strokeStyle = "#F3F4F0";
      context.lineWidth = 2 * scaleFactor;
      context.stroke();
      context.globalAlpha = 1;

      if (!landFeatures) return;

      const graticule = d3.geoGraticule();
      context.beginPath();
      path(graticule());
      context.globalAlpha = 0.15;
      context.strokeStyle = "#F3F4F0";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();
      context.globalAlpha = 1;

      context.beginPath();
      landFeatures.features.forEach((feature) => path(feature));
      context.globalAlpha = 0.5;
      context.strokeStyle = "#F3F4F0";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();
      context.globalAlpha = 1;

      allDots.forEach((dot) => {
        const projected = projection([dot[0], dot[1]]);
        if (
          projected &&
          projected[0] >= 0 &&
          projected[0] <= containerWidth &&
          projected[1] >= 0 &&
          projected[1] <= containerHeight
        ) {
          context.beginPath();
          context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI);
          context.fillStyle = "#8B9097";
          context.fill();
        }
      });

      const pinProjected = projection(ECUADOR_COORDS);
      if (
        pinProjected &&
        pinProjected[0] >= 0 &&
        pinProjected[0] <= containerWidth &&
        pinProjected[1] >= 0 &&
        pinProjected[1] <= containerHeight
      ) {
        const pulseRadius = (3 + Math.sin(pulseElapsed / 300) * 1.5) * scaleFactor;

        context.beginPath();
        context.arc(pinProjected[0], pinProjected[1], pulseRadius * 2.2, 0, 2 * Math.PI);
        context.globalAlpha = 0.35;
        context.strokeStyle = "#C6FF3D";
        context.lineWidth = 1.5 * scaleFactor;
        context.stroke();
        context.globalAlpha = 1;

        context.beginPath();
        context.arc(pinProjected[0], pinProjected[1], 2.5 * scaleFactor, 0, 2 * Math.PI);
        context.fillStyle = "#C6FF3D";
        context.fill();
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/land-110m.json");
        if (!response.ok) throw new Error("Failed to load land data");

        landFeatures = await response.json();

        landFeatures.features.forEach((feature) => {
          generateDotsInPolygon(feature, 16).forEach((dot) => allDots.push(dot));
        });

        render();
        setIsLoading(false);
      } catch {
        setError("No se pudo cargar el mapa mundial");
        setIsLoading(false);
      }
    };

    const rotation = [0, 0];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let autoRotate = !prefersReducedMotion;
    const rotationSpeed = 0.5;

    const tick = (elapsed) => {
      pulseElapsed = elapsed;
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
      }
      render();
    };

    const rotationTimer = d3.timer(tick);

    const handleMouseDown = (event) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation = [...rotation];

      const handleMouseMove = (moveEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, startRotation[1] - dy * sensitivity));

        projection.rotate(rotation);
        render();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (!prefersReducedMotion) {
          setTimeout(() => {
            autoRotate = true;
          }, 10);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newRadius = Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * zoomFactor));
      projection.scale(newRadius);
      render();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    loadWorldData();

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-surface rounded-2xl p-8 ${className}`}>
        <p className="text-muted text-sm text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-surface animate-pulse" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-muted px-2 py-1 rounded-md glass">
        Arrastra para rotar • Scroll para zoom
      </div>
    </div>
  );
}
