"use client";

import * as React from "react";
import { ArrowUpRight, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotchedProjectCardProps {
  href?: string;
  title: string;
  description?: string;
  /** cover photograph */
  image: string;
  imageAlt?: string;
  /** a pill at the top of the cover, e.g. the year */
  badge?: string;
  tags?: string[];
  /** a product screen over the photo (transparent PNG/WebP works best) */
  screen?: { src: string; alt: string; className?: string };
  /** a dark wash between the photo and the screen, 0 to 1 */
  dim?: number;
  monochrome?: boolean;
  /** the colour behind the card or card body; the notch is painted in it */
  surface?: string;
  /** the arrow disc's fill on hover (any CSS colour); defaults to the theme's primary */
  accent?: string;
  /** the arrow's colour on that fill; pick one that contrasts with `accent` */
  accentForeground?: string;
  className?: string;
  onActionClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  actionIcon?: React.ReactNode;
  actionLabel?: string;
}

const DISC = 64; // the arrow disc, px
const BLOCK = 80; // the notch block, px (radius = BLOCK - DISC / 2 = 48px)
const FILLET = 28; // the curve where the cut meets the cover's edges, px

export function NotchedProjectCard({
  href = "#",
  title,
  description,
  image,
  imageAlt = "",
  badge,
  tags = [],
  screen,
  dim = screen ? 0.45 : 0,
  monochrome = false,
  surface = "#ffffff", // Default matches the white card container
  accent = "#2563eb",
  accentForeground = "#ffffff",
  className,
  onActionClick,
  onEdit,
  onDelete,
  actionIcon,
  actionLabel,
}: NotchedProjectCardProps) {
  const [imgSrc, setImgSrc] = React.useState(image);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (image?.startsWith('/uploads/')) {
      const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
      setImgSrc(`${backendBase}${image}`)
    } else {
      setImgSrc(image)
    }
  }, [image]);

  const handleArrowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else if (onActionClick) {
      onActionClick();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onEdit) {
      e.preventDefault();
      onEdit();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("notched-card-wrapper", className)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        borderRadius: "28px",
        padding: "1.25rem",
        boxShadow: isHovered
          ? "0 16px 36px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)"
          : "0 2px 12px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)",
        border: "1px solid #f1f5f9",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: onEdit ? "pointer" : "default",
        overflow: "visible",
      }}
    >
      {/* Top Media Container with Notch */}
      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "visible",
        }}
      >
        {/* Cover Photo */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 3",
            borderRadius: "22px",
            overflow: "hidden",
            background: "#0f172a",
          }}
        >
          <img
            src={imgSrc || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"}
            alt={screen ? "" : imageAlt || title}
            onError={() => {
              setImgSrc("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80");
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: monochrome && !isHovered ? "grayscale(100%)" : "none",
              transform: isHovered && !screen ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.5s ease, filter 0.5s ease",
              display: "block",
            }}
          />

          {dim > 0 && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: `rgba(0, 0, 0, ${dim})`,
              }}
            />
          )}

          {screen && (
            <img
              src={screen.src}
              alt={screen.alt}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "82%",
                transformOrigin: "bottom right",
                filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.5))",
                transform: isHovered ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
            />
          )}

          {/* Badge at top */}
          {badge && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                zIndex: 6,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  background: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "0.025em",
                }}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Optional Delete Button at top-right */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 6,
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.85)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#dc2626";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.85)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="Delete project from MongoDB"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* The Notch Block (Concave Bite Out of Bottom-Right) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: `${BLOCK}px`,
            height: `${BLOCK}px`,
            borderTopLeftRadius: `${BLOCK - DISC / 2}px`,
            background: surface,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* The Notch Fillets (Smooth curve where notch meets cover edges) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: `${BLOCK}px`,
            right: 0,
            width: `${FILLET}px`,
            height: `${FILLET}px`,
            background: `radial-gradient(circle at top left, transparent ${FILLET - 0.5}px, ${surface} ${FILLET}px)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            right: `${BLOCK}px`,
            width: `${FILLET}px`,
            height: `${FILLET}px`,
            background: `radial-gradient(circle at top left, transparent ${FILLET - 0.5}px, ${surface} ${FILLET}px)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* The Action Button (Nested Inside Notch) */}
        <button
          type="button"
          onClick={handleArrowClick}
          aria-label={actionLabel || (onEdit ? "Edit project" : "Open link")}
          title={actionLabel || (onEdit ? "Click to Edit Project" : "Open link")}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: `${DISC}px`,
            height: `${DISC}px`,
            borderRadius: "50%",
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isHovered ? accent : "#0f172a",
            color: isHovered ? accentForeground : "#ffffff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {actionIcon || (
            onEdit ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Edit3 size={18} style={{ transform: isHovered ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }} />
                <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>
                  Edit
                </span>
              </div>
            ) : (
              <ArrowUpRight size={22} style={{ transform: isHovered ? "translate(2px, -2px)" : "none", transition: "transform 0.2s" }} />
            )
          )}
        </button>
      </div>

      {/* Card Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: "1rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: isHovered ? accent : "#0f172a",
            margin: "0 0 0.4rem 0",
            letterSpacing: "-0.015em",
            transition: "color 0.2s ease",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.5,
              color: "#64748b",
              margin: "0 0 0.85rem 0",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginTop: "auto",
              paddingTop: "0.75rem",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            {tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  background: "#f1f5f9",
                  color: "#334155",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "3px 8px",
                  borderRadius: "6px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Action Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0.85rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <button
            type="button"
            onClick={handleArrowClick}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              color: "#2563eb",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Edit3 size={13} />
            <span>Edit Details</span>
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#ef4444",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotchedProjectCard;
