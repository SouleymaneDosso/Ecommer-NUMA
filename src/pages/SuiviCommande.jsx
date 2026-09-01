import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import styled from "styled-components";

import {
  FaArrowLeft,
  FaPhone,
  FaComments,
  FaLocationArrow,
  FaCheck,
  FaBox,
  FaMotorcycle,
  FaMapMarkerAlt,
  FaClock,
  FaCircle,
} from "react-icons/fa";

import { socket } from "../services/socket";

// ======================================================
// ICONE LIVREUR
// ======================================================

const livreurIcon = new L.DivIcon({
  className: "custom-livreur-marker",
  html: `
    <div class="livreur-marker-wrapper">
      <div class="livreur-marker-pulse"></div>

      <div class="livreur-marker">
        <span>🚴</span>
      </div>
    </div>
  `,
  iconSize: [58, 58],
  iconAnchor: [29, 29],
});

// ======================================================
// ICONE DESTINATION
// ======================================================

const destinationIcon = new L.DivIcon({
  className: "custom-destination-marker",
  html: `
    <div class="destination-marker">
      <span>📍</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 38],
});

// ======================================================
// RECENTRER
// ======================================================

function RecentrerCarte({ position, zoom = 15 }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(
      [position.latitude, position.longitude],
      zoom,
      {
        duration: 0.8,
      },
    );
  }, [position, zoom, map]);

  return null;
}

// ======================================================
// FIT BOUNDS LIVREUR + DESTINATION
// ======================================================

function AjusterVue({ livreur, destination }) {
  const map = useMap();

  useEffect(() => {
    if (!livreur || !destination) return;

    const bounds = L.latLngBounds(
      [livreur.latitude, livreur.longitude],
      [destination.latitude, destination.longitude],
    );

    map.fitBounds(bounds, {
      padding: [80, 80],
      maxZoom: 15,
      animate: true,
    });
  }, [livreur, destination, map]);

  return null;
}

// ======================================================
// PAGE
// ======================================================

export default function SuiviCommande() {
  const { commandeId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [commande, setCommande] = useState(null);
  const [livreur, setLivreur] = useState(null);
  const [positionLivreur, setPositionLivreur] = useState(null);

  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  const [mapReady, setMapReady] = useState(false);

  // ====================================================
  // CHARGER COMMANDE
  // ====================================================

  useEffect(() => {
    if (!commandeId) return;

    const chargerCommande = async () => {
      try {
        setLoading(true);
        setErreur("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/commandes/${commandeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de charger la commande",
          );
        }

        const commandeData = data.commande || data;

        setCommande(commandeData);

        // ------------------------------------------------
        // LIVREUR
        // ------------------------------------------------

        if (commandeData.livraison?.livreur) {
          setLivreur(
            commandeData.livraison.livreur,
          );
        }

        // ------------------------------------------------
        // LOCALISATION
        // ------------------------------------------------

        const localisation =
          commandeData.livraison?.localisation ||
          commandeData.livreur?.localisation ||
          commandeData.livraison?.livreur
            ?.localisation;

        if (
          localisation?.latitude !== null &&
          localisation?.longitude !== null &&
          localisation?.latitude !== undefined &&
          localisation?.longitude !== undefined
        ) {
          setPositionLivreur({
            latitude: Number(localisation.latitude),
            longitude: Number(localisation.longitude),
          });
        }
      } catch (error) {
        console.error(
          "CHARGEMENT SUIVI ERROR:",
          error,
        );

        setErreur(error.message);
      } finally {
        setLoading(false);
      }
    };

    chargerCommande();
  }, [API_URL, commandeId, navigate]);

  // ====================================================
  // SOCKET
  // ====================================================

  useEffect(() => {
    if (!commandeId) return;

    // rejoindre la room de la commande
    socket.emit(
      "join_commande",
      commandeId,
    );

    // --------------------------------------------------
    // POSITION LIVREUR
    // --------------------------------------------------

    const handlePosition = (data) => {
      if (
        data.commandeId?.toString() !==
        commandeId.toString()
      ) {
        return;
      }

      const latitude = Number(data.latitude);
      const longitude = Number(data.longitude);

      if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        return;
      }

      setPositionLivreur({
        latitude,
        longitude,
      });

      // si le socket envoie également les infos
      if (data.livreur) {
        setLivreur(data.livreur);
      }
    };

    // --------------------------------------------------
    // UPDATE COMMANDE
    // --------------------------------------------------

    const handleCommandeUpdate = (data) => {
      if (
        data.id?.toString() !==
        commandeId.toString()
      ) {
        return;
      }

      setCommande((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          livraison: {
            ...prev.livraison,

            statut:
              data.statutLivraison ||
              prev.livraison?.statut,

            livreurId:
              data.livreurId ||
              prev.livraison?.livreurId,
          },
        };
      });

      if (data.livreur) {
        setLivreur(data.livreur);

        if (data.livreur.localisation) {
          const localisation =
            data.livreur.localisation;

          if (
            localisation.latitude !== null &&
            localisation.longitude !== null
          ) {
            setPositionLivreur({
              latitude: Number(
                localisation.latitude,
              ),
              longitude: Number(
                localisation.longitude,
              ),
            });
          }
        }
      }
    };

    socket.on(
      "livreur_position",
      handlePosition,
    );

    socket.on(
      "commande_update",
      handleCommandeUpdate,
    );

    return () => {
      socket.off(
        "livreur_position",
        handlePosition,
      );

      socket.off(
        "commande_update",
        handleCommandeUpdate,
      );

      socket.emit(
        "leave_commande",
        commandeId,
      );
    };
  }, [commandeId]);

  // ====================================================
  // DONNÉES
  // ====================================================

  const statut =
    commande?.livraison?.statut ||
    "NOT_STARTED";

  const destination = useMemo(() => {
    const latitude =
      commande?.client?.latitude;

    const longitude =
      commande?.client?.longitude;

    if (
      latitude === undefined ||
      latitude === null ||
      longitude === undefined ||
      longitude === null
    ) {
      return null;
    }

    return {
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  }, [commande]);

  const positionCarte =
    positionLivreur ||
    destination || {
      latitude: 5.3364,
      longitude: -4.0267,
    };

  // ====================================================
  // PROGRESSION
  // ====================================================

  const etapes = [
    {
      key: "CONFIRMED",
      title: "Commande confirmée",
      text: "Votre commande est enregistrée.",
      icon: <FaCheck />,
      active: true,
    },
    {
      key: "ACCEPTED",
      title: "Livreur attribué",
      text: livreur?.username
        ? `${livreur.username} prend en charge votre commande.`
        : "Un livreur prend en charge votre commande.",
      icon: <FaMotorcycle />,
      active: [
        "ACCEPTED",
        "PICKING_UP",
        "IN_DELIVERY",
        "DELIVERED",
      ].includes(statut),
    },
    {
      key: "IN_DELIVERY",
      title: "En livraison",
      text: "Votre commande est actuellement en route.",
      icon: <FaBox />,
      active: [
        "IN_DELIVERY",
        "DELIVERED",
      ].includes(statut),
    },
    {
      key: "DELIVERED",
      title: "Livrée",
      text: "Votre commande est arrivée.",
      icon: <FaCheck />,
      active: statut === "DELIVERED",
    },
  ];

  // ====================================================
  // RECHERCHE
  // ====================================================

  const rechercheActive =
    statut === "SEARCHING" ||
    statut === "REQUESTED";

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <Page>
        <LoadingScreen>
          <LoadingSpinner />

          <LoadingText>
            Préparation du suivi...
          </LoadingText>
        </LoadingScreen>
      </Page>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (erreur || !commande) {
    return (
      <Page>
        <ErrorScreen>
          <ErrorIcon>!</ErrorIcon>

          <h2>
            Impossible de charger le suivi
          </h2>

          <p>
            {erreur ||
              "Commande introuvable."}
          </p>

          <BackButton
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Retour
          </BackButton>
        </ErrorScreen>
      </Page>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <Page>
      {/* =================================================
          TOP BAR
      ================================================= */}

      <TopBar>
        <BackButton
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </BackButton>

        <OrderHeader>
          <OrderEyebrow>
            SUIVI DE LIVRAISON
          </OrderEyebrow>

          <OrderNumber>
            #{commande._id.slice(-8).toUpperCase()}
          </OrderNumber>
        </OrderHeader>

        <LiveBadge>
          <LiveDot />
          EN DIRECT
        </LiveBadge>
      </TopBar>

      {/* =================================================
          CARTE
      ================================================= */}

      <MapSection>
        <MapContainer
          center={[
            positionCarte.latitude,
            positionCarte.longitude,
          ]}
          zoom={14}
          zoomControl={false}
          style={{
            width: "100%",
            height: "100%",
          }}
          whenReady={() => setMapReady(true)}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Vue globale au chargement */}
          {mapReady &&
            positionLivreur &&
            destination && (
              <AjusterVue
                livreur={positionLivreur}
                destination={destination}
              />
            )}

          {/* Position actuelle */}
          {positionLivreur && (
            <>
              <Marker
                position={[
                  positionLivreur.latitude,
                  positionLivreur.longitude,
                ]}
                icon={livreurIcon}
              >
                <Popup>
                  <strong>
                    {livreur?.username ||
                      "Votre livreur"}
                  </strong>

                  <br />

                  Votre livreur est ici.
                </Popup>
              </Marker>

              <Circle
                center={[
                  positionLivreur.latitude,
                  positionLivreur.longitude,
                ]}
                radius={80}
                pathOptions={{
                  color: "#111",
                  fillColor: "#111",
                  fillOpacity: 0.08,
                  weight: 1,
                }}
              />
            </>
          )}

          {/* Destination */}
          {destination && (
            <Marker
              position={[
                destination.latitude,
                destination.longitude,
              ]}
              icon={destinationIcon}
            >
              <Popup>
                <strong>
                  Destination
                </strong>

                <br />

                {commande.client?.adresse}
              </Popup>
            </Marker>
          )}

          {/* Ligne livreur → destination */}
          {positionLivreur &&
            destination && (
              <Polyline
                positions={[
                  [
                    positionLivreur.latitude,
                    positionLivreur.longitude,
                  ],
                  [
                    destination.latitude,
                    destination.longitude,
                  ],
                ]}
                pathOptions={{
                  color: "#111",
                  weight: 4,
                  opacity: 0.75,
                  dashArray: "8 10",
                }}
              />
            )}

          <RecentrerCarte
            position={positionLivreur}
          />
        </MapContainer>

        {/* =================================================
            CARTE INFO FLOTTANTE
        ================================================= */}

        <MapInfoCard>
          <MapInfoTop>
            <MapInfoIcon>
              {rechercheActive ? (
                <FaLocationArrow />
              ) : (
                <FaMotorcycle />
              )}
            </MapInfoIcon>

            <div>
              <MapInfoLabel>
                {rechercheActive
                  ? "RECHERCHE EN COURS"
                  : "LIVRAISON"}
              </MapInfoLabel>

              <MapInfoTitle>
                {statutLabel[statut] ||
                  statut}
              </MapInfoTitle>
            </div>
          </MapInfoTop>

          {positionLivreur && (
            <LocationLive>
              <LiveDot />

              Position du livreur mise à jour
            </LocationLive>
          )}
        </MapInfoCard>

        {/* =================================================
            RECENTRER
        ================================================= */}

        <LocateButton
          onClick={() => {
            if (!positionLivreur) return;

            setMapReady(false);
            setTimeout(
              () => setMapReady(true),
              50,
            );
          }}
          disabled={!positionLivreur}
        >
          <FaLocationArrow />
        </LocateButton>
      </MapSection>

      {/* =================================================
          PANNEAU
      ================================================= */}

      <Content>
        <TrackingCard>
          {/* ---------------------------------------------
              HEADER
          --------------------------------------------- */}

          <TrackingHeader>
            <div>
              <Eyebrow>
                ÉTAT DE LA LIVRAISON
              </Eyebrow>

              <TrackingTitle>
                {statutLabel[statut] ||
                  statut}
              </TrackingTitle>
            </div>

            <StatusIcon $active>
              {statutIcon[statut]}
            </StatusIcon>
          </TrackingHeader>

          {/* ---------------------------------------------
              TIMELINE
          --------------------------------------------- */}

          <Timeline>
            {etapes.map(
              (etape, index) => (
                <TimelineItem
                  key={etape.key}
                  $active={etape.active}
                  $last={
                    index ===
                    etapes.length - 1
                  }
                >
                  <TimelineSide>
                    <TimelineDot
                      $active={etape.active}
                    >
                      {etape.icon}
                    </TimelineDot>

                    {index <
                      etapes.length - 1 && (
                      <TimelineLine
                        $active={
                          etapes.active
                        }
                      />
                    )}
                  </TimelineSide>

                  <TimelineContent>
                    <TimelineTitle
                      $active={etape.active}
                    >
                      {etape.title}
                    </TimelineTitle>

                    <TimelineText>
                      {etape.text}
                    </TimelineText>
                  </TimelineContent>
                </TimelineItem>
              ),
            )}
          </Timeline>

          {/* ---------------------------------------------
              LIVREUR
          --------------------------------------------- */}

          {livreur && (
            <LivreurSection>
              <SectionLabel>
                VOTRE LIVREUR
              </SectionLabel>

              <LivreurCard>
                <Avatar>
                  {livreur.username
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "L"}
                </Avatar>

                <LivreurInfo>
                  <LivreurName>
                    {livreur.username}
                  </LivreurName>

                  <LivreurStatus>
                    <StatusOnlineDot />

                    {statut ===
                    "IN_DELIVERY"
                      ? "En route vers vous"
                      : "Votre livreur"}
                  </LivreurStatus>
                </LivreurInfo>

                <Actions>
                  {livreur.telephone && (
                    <ActionButton
                      as="a"
                      href={`tel:${livreur.telephone}`}
                      aria-label="Appeler le livreur"
                    >
                      <FaPhone />
                    </ActionButton>
                  )}

                  <ActionButton
                    onClick={() =>
                      navigate(
                        `/commande/${commandeId}/chat`,
                      )
                    }
                    aria-label="Discuter avec le livreur"
                  >
                    <FaComments />
                  </ActionButton>
                </Actions>
              </LivreurCard>
            </LivreurSection>
          )}

          {/* ---------------------------------------------
              DESTINATION
          --------------------------------------------- */}

          <DestinationCard>
            <DestinationIcon>
              <FaMapMarkerAlt />
            </DestinationIcon>

            <DestinationInfo>
              <DestinationLabel>
                ADRESSE DE LIVRAISON
              </DestinationLabel>

              <DestinationText>
                {commande.client?.adresse ||
                  "Adresse de livraison"}
              </DestinationText>

              <DestinationCity>
                {commande.client?.ville}
                {commande.client
                  ?.codePostal
                  ? ` · ${commande.client.codePostal}`
                  : ""}
              </DestinationCity>
            </DestinationInfo>
          </DestinationCard>

          {/* ---------------------------------------------
              INFORMATIONS
          --------------------------------------------- */}

          <InfoRow>
            <InfoItem>
              <FaClock />

              <div>
                <InfoLabel>
                  STATUT
                </InfoLabel>

                <InfoValue>
                  {statutLabel[statut] ||
                    statut}
                </InfoValue>
              </div>
            </InfoItem>

            <InfoItem>
              <FaBox />

              <div>
                <InfoLabel>
                  COMMANDE
                </InfoLabel>

                <InfoValue>
                  #{commande._id.slice(-6)}
                </InfoValue>
              </div>
            </InfoItem>
          </InfoRow>
        </TrackingCard>
      </Content>
    </Page>
  );
}

// ======================================================
// LABELS
// ======================================================

const statutLabel = {
  NOT_STARTED:
    "Recherche non démarrée",

  SEARCHING:
    "Recherche d'un livreur...",

  REQUESTED:
    "Recherche d'un livreur...",

  ACCEPTED:
    "Livreur attribué",

  PICKING_UP:
    "Récupération de votre commande",

  IN_DELIVERY:
    "Votre commande est en route",

  DELIVERED:
    "Commande livrée",

  CANCELLED:
    "Commande annulée",
};

const statutIcon = {
  NOT_STARTED: "⏳",
  SEARCHING: "🔎",
  REQUESTED: "🔎",
  ACCEPTED: "🚴",
  PICKING_UP: "📦",
  IN_DELIVERY: "🚚",
  DELIVERED: "✓",
  CANCELLED: "×",
};

// ======================================================
// STYLES
// ======================================================

const Page = styled.div`
  min-height: 100vh;
  background: #f4f4f2;
  color: #111;
`;

const TopBar = styled.header`
  height: 82px;
  padding: 0 28px;

  background: rgba(255, 255, 255, 0.96);

  display: flex;
  align-items: center;
  gap: 18px;

  border-bottom: 1px solid #e8e8e6;

  position: relative;
  z-index: 20;

  backdrop-filter: blur(18px);

  @media (max-width: 600px) {
    height: 72px;
    padding: 0 16px;
  }
`;

const BackButton = styled.button`
  width: 44px;
  height: 44px;

  border: 1px solid #e5e5e3;
  border-radius: 14px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: translateX(-2px);
    background: #f6f6f4;
  }
`;

const OrderHeader = styled.div`
  flex: 1;
`;

const OrderEyebrow = styled.div`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #888;
`;

const OrderNumber = styled.div`
  margin-top: 4px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 9px 13px;

  border-radius: 999px;

  background: #f0f0ed;

  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;

  @media (max-width: 500px) {
    font-size: 0;
    width: 10px;
    height: 10px;
    padding: 0;
  }
`;

const LiveDot = styled.span`
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #1e9b58;

  box-shadow:
    0 0 0 4px rgba(30, 155, 88, 0.12);
`;

// ======================================================
// MAP
// ======================================================

const MapSection = styled.section`
  height: min(62vh, 650px);

  min-height: 430px;

  position: relative;

  background: #dededb;

  .leaflet-container {
    font-family: inherit;
  }

  .leaflet-control-attribution {
    font-size: 9px;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 14px;
  }

  .livreur-marker-wrapper {
    position: relative;

    width: 58px;
    height: 58px;
  }

  .livreur-marker-pulse {
    position: absolute;

    width: 58px;
    height: 58px;

    border-radius: 50%;

    background: rgba(17, 17, 17, 0.12);

    animation: pulse 2s infinite;
  }

  .livreur-marker {
    position: absolute;

    width: 48px;
    height: 48px;

    top: 5px;
    left: 5px;

    border-radius: 50%;

    background: #111;

    border: 4px solid white;

    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.3);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 22px;
  }

  .destination-marker {
    width: 42px;
    height: 42px;

    border-radius: 50% 50% 50% 0;

    background: white;

    border: 3px solid #111;

    box-shadow:
      0 5px 18px rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    transform: rotate(-45deg);
  }

  .destination-marker span {
    transform: rotate(45deg);
    font-size: 18px;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }

    70% {
      transform: scale(1.5);
      opacity: 0;
    }

    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  @media (max-width: 600px) {
    height: 55vh;
    min-height: 380px;
  }
`;

const MapInfoCard = styled.div`
  position: absolute;

  top: 24px;
  left: 24px;

  z-index: 500;

  width: min(360px, calc(100% - 48px));

  padding: 18px;

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.94);

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.14);

  backdrop-filter: blur(18px);

  @media (max-width: 600px) {
    top: 16px;
    left: 16px;

    width: calc(100% - 32px);
  }
`;

const MapInfoTop = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const MapInfoIcon = styled.div`
  width: 44px;
  height: 44px;

  border-radius: 14px;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapInfoLabel = styled.div`
  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.13em;

  color: #888;
`;

const MapInfoTitle = styled.div`
  margin-top: 3px;

  font-size: 16px;
  font-weight: 800;
`;

const LocationLive = styled.div`
  margin-top: 13px;

  display: flex;
  align-items: center;
  gap: 9px;

  font-size: 11px;
  color: #666;
`;

const LocateButton = styled.button`
  position: absolute;

  right: 24px;
  bottom: 24px;

  z-index: 500;

  width: 48px;
  height: 48px;

  border: 0;
  border-radius: 15px;

  background: white;

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: scale(1.04);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

// ======================================================
// CONTENT
// ======================================================

const Content = styled.main`
  max-width: 900px;

  margin: -55px auto 0;

  padding: 0 20px 60px;

  position: relative;

  z-index: 10;
`;

const TrackingCard = styled.section`
  background: white;

  border-radius: 30px;

  padding: 30px;

  box-shadow:
    0 18px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    padding: 22px;

    border-radius: 24px;
  }
`;

const TrackingHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;
`;

const Eyebrow = styled.div`
  font-size: 10px;

  letter-spacing: 0.14em;

  color: #888;

  font-weight: 800;
`;

const TrackingTitle = styled.h2`
  margin: 7px 0 0;

  font-size: 27px;

  letter-spacing: -0.04em;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const StatusIcon = styled.div`
  width: 55px;
  height: 55px;

  border-radius: 18px;

  background: #111;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
`;

// ======================================================
// TIMELINE
// ======================================================

const Timeline = styled.div`
  margin-top: 34px;
`;

const TimelineItem = styled.div`
  display: flex;

  gap: 15px;

  min-height: 76px;

  opacity: ${({ $active }) =>
    $active ? 1 : 0.32};
`;

const TimelineSide = styled.div`
  width: 38px;

  display: flex;

  flex-direction: column;

  align-items: center;
`;

const TimelineDot = styled.div`
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  border-radius: 50%;

  background: ${({ $active }) =>
    $active ? "#111" : "#e8e8e6"};

  color: ${({ $active }) =>
    $active ? "white" : "#999"};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;

  transition: 0.3s;
`;

const TimelineLine = styled.div`
  width: 2px;

  flex: 1;

  margin: 5px 0;

  background: #e5e5e3;
`;

const TimelineContent = styled.div`
  padding-top: 2px;

  padding-bottom: 15px;
`;

const TimelineTitle = styled.div`
  font-weight: 800;

  font-size: 14px;

  color: ${({ $active }) =>
    $active ? "#111" : "#999"};
`;

const TimelineText = styled.div`
  margin-top: 5px;

  color: #777;

  font-size: 13px;

  line-height: 1.5;
`;

// ======================================================
// LIVREUR
// ======================================================

const LivreurSection = styled.div`
  margin-top: 8px;
`;

const SectionLabel = styled.div`
  margin-bottom: 10px;

  font-size: 10px;

  letter-spacing: 0.13em;

  font-weight: 800;

  color: #888;
`;

const LivreurCard = styled.div`
  padding: 16px;

  border-radius: 20px;

  background: #f5f5f3;

  display: flex;

  align-items: center;

  gap: 13px;
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;

  flex: 0 0 52px;

  border-radius: 17px;

  background: #111;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;

  font-weight: 800;
`;

const LivreurInfo = styled.div`
  flex: 1;

  min-width: 0;
`;

const LivreurName = styled.div`
  font-size: 15px;

  font-weight: 800;
`;

const LivreurStatus = styled.div`
  margin-top: 5px;

  display: flex;

  align-items: center;

  gap: 6px;

  color: #777;

  font-size: 12px;
`;

const StatusOnlineDot = styled.span`
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #1e9b58;
`;

const Actions = styled.div`
  display: flex;

  gap: 8px;
`;

const ActionButton = styled.button`
  width: 43px;
  height: 43px;

  border: 1px solid #e3e3e1;

  border-radius: 14px;

  background: white;

  color: #111;

  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: #111;
    color: white;
  }
`;

// ======================================================
// DESTINATION
// ======================================================

const DestinationCard = styled.div`
  margin-top: 18px;

  padding: 17px;

  border: 1px solid #ececea;

  border-radius: 20px;

  display: flex;

  align-items: center;

  gap: 13px;
`;

const DestinationIcon = styled.div`
  width: 43px;
  height: 43px;

  border-radius: 14px;

  background: #f1f1ef;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DestinationInfo = styled.div`
  flex: 1;

  min-width: 0;
`;

const DestinationLabel = styled.div`
  font-size: 9px;

  letter-spacing: 0.13em;

  color: #999;

  font-weight: 800;
`;

const DestinationText = styled.div`
  margin-top: 4px;

  font-size: 13px;

  font-weight: 700;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
`;

const DestinationCity = styled.div`
  margin-top: 3px;

  font-size: 11px;

  color: #888;
`;

// ======================================================
// INFO
// ======================================================

const InfoRow = styled.div`
  margin-top: 20px;

  padding-top: 20px;

  border-top: 1px solid #eeeeec;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 15px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;

  align-items: center;

  gap: 11px;

  color: #888;

  font-size: 13px;
`;

const InfoLabel = styled.div`
  font-size: 9px;

  letter-spacing: 0.1em;

  font-weight: 800;

  color: #999;
`;

const InfoValue = styled.div`
  margin-top: 3px;

  color: #111;

  font-size: 12px;

  font-weight: 700;
`;

// ======================================================
// LOADING
// ======================================================

const LoadingScreen = styled.div`
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 18px;
`;

const LoadingSpinner = styled.div`
  width: 38px;
  height: 38px;

  border-radius: 50%;

  border: 3px solid #ddd;

  border-top-color: #111;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 13px;

  color: #777;

  font-weight: 600;
`;

// ======================================================
// ERROR
// ======================================================

const ErrorScreen = styled.div`
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 30px;

  text-align: center;

  h2 {
    margin: 18px 0 6px;
  }

  p {
    color: #777;
    font-size: 14px;
  }
`;

const ErrorIcon = styled.div`
  width: 58px;
  height: 58px;

  border-radius: 18px;

  background: #111;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 25px;
  font-weight: 800;
`;