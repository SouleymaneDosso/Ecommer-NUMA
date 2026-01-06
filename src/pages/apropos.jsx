// src/pages/About.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";

// Icône personnalisée pour Abidjan
const abidjanIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Apropos = () => {
  const { t } = useTranslation();
  const abidjanPosition = [5.347, -4.012];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>{t("ourStory")}</h1>

      <section style={{ marginBottom: "2rem" }}>
        <p>{t("aboutParagraph1")}</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <p>{t("aboutParagraph2")}</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <p>{t("aboutParagraph3")}</p>
      </section>

      <section style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>{t("ourPresence")}</h2>
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "2rem auto",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          <MapContainer
            center={[5, 20]}
            zoom={3}
            style={{ height: "450px", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={abidjanPosition} icon={abidjanIcon}>
              <Popup>
                <strong>{t("numaInAbidjan")}</strong>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          {t("numaAfrica")}
        </p>
      </section>
    </div>
  );
};

export default Apropos;
