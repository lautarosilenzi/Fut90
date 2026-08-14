import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1220",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 10,
            background: "#F2B705",
            color: "#0B1220",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          90
        </div>
      </div>
    ),
    { ...size },
  );
}
