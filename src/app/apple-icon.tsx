import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2596be 0%, #0e4054 100%)",
          borderRadius: 36,
          color: "white",
          fontSize: 108,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        L
      </div>
    ),
    { ...size },
  );
}
