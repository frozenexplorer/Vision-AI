from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

try:
    from ultralytics import YOLO
except ImportError:  # pragma: no cover - optional runtime dependency in local/dev environments.
    YOLO = None  # type: ignore[assignment]

# Import class/threshold mapping from models/
sys.path.append(str(Path(__file__).resolve().parents[3] / "models"))
try:
    from coco_mapping import COCO_ID_TO_APP, CONF_THRESHOLDS
except ImportError:  # pragma: no cover - fallback for partial checkouts.
    COCO_ID_TO_APP = {}
    CONF_THRESHOLDS = {}


class DetectorService:
    def __init__(self) -> None:
        self.model = None
        self.model_path: Path | None = None
        if YOLO is None:
            return

        model_path = self._resolve_model_path()
        if model_path is None:
            return

        try:
            self.model = YOLO(str(model_path))
            self.model_path = model_path
        except Exception:
            self.model = None
            self.model_path = None

    def _resolve_model_path(self) -> Path | None:
        models_root = Path(__file__).resolve().parents[3] / "models"
        if not models_root.exists():
            return None

        explicit = os.getenv("VISIONAI_DETECT_MODEL_PATH", "").strip()
        if explicit:
            candidate = Path(explicit)
            if not candidate.is_absolute():
                candidate = models_root / candidate
            if candidate.exists():
                return candidate

        # Prefer higher-capacity variants when available, then fall back.
        default_candidates = ("yolov8x.pt", "yolov8l.pt", "yolov8m.pt", "yolov8s.pt", "yolov8n.pt")
        for name in default_candidates:
            candidate = models_root / name
            if candidate.exists():
                return candidate

        return None

    def detect(self, image: Any) -> list[dict[str, Any]]:
        if self.model is None:
            return []

        results = self.model(image, verbose=False, imgsz=640, max_det=120)[0]
        detections: list[dict[str, Any]] = []
        boxes = results.boxes

        if boxes is None:
            return detections

        for box in boxes:
            cls_id = int(box.cls.item())
            confidence = float(box.conf.item())
            label = COCO_ID_TO_APP.get(cls_id)

            if label is None:
                continue

            if confidence < CONF_THRESHOLDS.get(label, 0.5):
                continue

            x1, y1, x2, y2 = map(float, box.xyxy[0].tolist())
            detections.append(
                {
                    "label": label,
                    "class_id": cls_id,
                    "confidence": round(confidence, 2),
                    "box": [x1, y1, x2, y2],
                }
            )

        return detections
