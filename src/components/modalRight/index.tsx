import React, { useEffect } from "react";
import cx from "classnames";

import "./style.scss";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "center" | "left" | "right"; // Default: center
  height?: string; // Example: "400px" yoki "90vh"
  width?: string; // Example: "400px" yoki "50vw"
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  position = "center",
  height = "auto",
  width = "400px",
}) => {
  // Escape bilan yopish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // translate uchun boshlang‘ich va animate transform klasslari
  const getInitialTransform = () => {
    switch (position) {
      case "left":
        return "translate-x-[-100%]";
      case "right":
        return "translate-x-[100%]";
      case "center":
        return "translate-y-[-100%]";
      default:
        return "";
    }
  };

  const getAnimateInTransform = () => {
    switch (position) {
      case "left":
      case "right":
        return "translate-x-0";
      case "center":
        return "translate-y-0";
      default:
        return "";
    }
  };

  return (
    <div
      className={cx(
        "animation-modal fixed inset-0 z-50 flex bg-black/50 transition-opacity duration-300",
        {
          "opacity-100 pointer-events-auto": isOpen,
          "opacity-0 pointer-events-none": !isOpen,
        }
      )}
      onClick={onClose}
    >
      <div
        className={cx(
          "flex w-full h-full ",
          {
            "items-center justify-center": position === "center",
            "items-center justify-start": position === "left",
            "items-center justify-end": position === "right",
          }
        )}
      >
        <div
          className={cx(
            "bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden",
            isOpen ? getAnimateInTransform() : getInitialTransform()
          )}
          style={{
            width,
            height,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedModal;
