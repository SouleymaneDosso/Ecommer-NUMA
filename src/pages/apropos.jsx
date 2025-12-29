// src/pages/About.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icône personnalisée pour Abidjan
const abidjanIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // icône du marqueur
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Apropos = () => {
  const abidjanPosition = [5.347, -4.012]; // Latitude, Longitude

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>À propos de Numa</h1>

      <section style={{ marginBottom: "2rem" }}>
        <p>
          Numa est une marque de vêtements <strong>premium</strong>, créée par des stylistes spécialisés dans la mode depuis 6 ans.
          Elle incarne <strong>l’originalité</strong>, <strong>la simplicité</strong> et le <strong>confort</strong>. Chaque pièce est conçue
          comme une œuvre d’art, avec une attention particulière portée aux détails et à l’authenticité.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <p>
          Numa a pour objectif de dynamiser la mode ivoirienne en y apportant des styles uniques inspirés des tendances
          européennes et américaines. Nos créations se distinguent par leur <strong>originalité</strong> et leur
          <strong> persistance</strong> dans le temps : nos designs ne se démodent pas. Le logo Numa, toujours brodé,
          reflète notre engagement envers la qualité et l’élégance.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <p>
          Née à Abidjan le <strong>17 décembre 2025</strong>, Numa se concentre sur le <strong>e-commerce</strong> pour faciliter
          l’achat à distance. Chaque article est accompagné de toutes les informations nécessaires pour permettre à nos clients
          de faire leur choix en toute confiance. Nous privilégions une communication basée sur le respect et l’attention au client,
          et proposons une <strong>livraison express</strong> pour garantir une expérience rapide et agréable.
        </p>
      </section>

      <section style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>Notre présence en Afrique</h2>
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
            center={[5, 20]} // centre de l’Afrique
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
                <strong>Numa</strong> est basée à Abidjan, Côte d'Ivoire.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Basée à Abidjan, Numa ambitionne de rayonner dans toute l’Afrique grâce à ses créations uniques et son e-commerce performant.
        </p>
      </section>
    </div>
  );
};

export default Apropos;
