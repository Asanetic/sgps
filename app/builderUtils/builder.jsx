"use client";
import { usePathname } from "next/navigation";
import React, { useState, useRef } from "react";
import routeBank from "./builderDnaRoutes.json"

export function BuilderButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState(Date.now()); // reload iframe each time

  function handleClick() {
    setModalKey(Date.now());
    setModalVisible(true);
  }

  const pathname = usePathname(); // e.g., "/flourishpos/clienttransactions/list"
  
  // Extract key like "clienttransactions/list"
  const routeKey = pathname.replace("/symphonygps/", "");

  // Get URL from JSON bank
  const iframeURL = routeBank[routeKey];

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "15px 18px",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          background: "#0d6efd",
          color: "#fff",
          zIndex: 9999,
        }}
      >
        Edit module
      </button>

      {modalVisible && (
        <SmartUserModal
          title="Edit module"
          initialWidth={800}
          initialHeight={500}
          onClose={() => setModalVisible(false)}
          key={modalKey}
        >
          <iframe
            src={iframeURL}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "12px",
            }}
          ></iframe>
        </SmartUserModal>
      )}
    </>
  );
}

export function SmartUserModal({
  children,
  title = "Modal",
  initialWidth = 900,
  initialHeight = 600,
  onClose,
}) {
  const [maximized, setMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const modalRef = useRef();

  const toggleMaximize = () => setMaximized(!maximized);

  const handleMouseDown = (e) => {
    if (maximized) return;
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <>
      {/* Modal Window */}
      <div
        ref={modalRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: "fixed",
          top: maximized ? 0 : position.y || "50%",
          left: maximized ? 0 : position.x || "50%",
          transform: maximized ? "none" : position.x === 0 && position.y === 0 ? "translate(-50%, -50%)" : "none",
          width: maximized ? "100%" : initialWidth,
          height: maximized ? "100%" : initialHeight,
          background: "#fff",
          borderRadius: maximized ? 0 : "12px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* Header */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            background: "#0d6efd",
            color: "#fff",
            cursor: maximized ? "default" : "grab",
            userSelect: "none",
          }}
        >
          <span>{title}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={toggleMaximize}
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              {maximized ? "🗗" : "🗖"}
            </button>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "12px", overflow: "auto" }}>{children}</div>
      </div>
    </>
  );
}
