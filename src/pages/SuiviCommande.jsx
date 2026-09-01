import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { socket } from "../services/socket";

import styled from "styled-components";

// ======================================================
// ICONE LIVREUR
// ======================================================

const livreurIcon = new L.DivIcon({
  className: "livreur-marker",
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#111;
      color:white;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:22px;
      border:4px solid white;
      box-shadow:0 4px 15px rgba(0,0,0,.25);
    ">
      🚴
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// ======================================================
// CENTRER LA CARTE
// ======================================================

function RecentrerCarte({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(
      [position.latitude, position.longitude],
      15,
      {
        duration: 0.8,
      },
    );
  }, [position, map]);

  return null;
}

// ======================================================
// PAGE
// ======================================================

export default function SuiviCommande() {
  const { commandeId } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  const [commande, setCommande] = useState(null);

  const [positionLivreur, setPositionLivreur] =
    useState(null);

  const [livreur, setLivreur] = useState(null);

  const [loading, setLoading] = useState(true);

  const [erreur, setErreur] = useState("");

  // ====================================================
  // CHARGER COMMANDE
  // ====================================================

  useEffect(() => {
    const chargerCommande = async () => {
      try {
        setLoading(true);
        setErreur("");

        const token =
          localStorage.getItem("token");

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

        const commandeData =
          data.commande || data;

        setCommande(commandeData);

        if (
          commandeData.livraison?.livreurId
        ) {
          setLivreur(
            commandeData.livraison.livreur ||
              null,
          );
        }

        if (
          commandeData.livraison?.localisation
        ) {
          setPositionLivreur(
            commandeData.livraison.localisation,
          );
        }
      } catch (error) {
        console.error(error);

        setErreur(error.message);
      } finally {
        setLoading(false);
      }
    };

    chargerCommande();
  }, [API_URL, commandeId]);

  // ====================================================
  // SOCKET
  // ====================================================

  useEffect(() => {
    if (!commandeId) return;

    // Rejoindre la commande
    socket.emit(
      "join_commande",
      commandeId,
    );

    // ================================================
    // POSITION LIVREUR
    // ================================================

    const handlePosition = (data) => {
      if (
        data.commandeId?.toString() !==
        commandeId.toString()
      ) {
        return;
      }

      setPositionLivreur({
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      });
    };

    // ================================================
    // CHANGEMENT STATUT
    // ================================================

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
              data.statutLivraison,
            livreurId:
              data.livreurId ||
              prev.livraison?.livreurId,
          },
        };
      });

      if (data.livreur) {
        setLivreur(data.livreur);

        if (data.livreur.localisation) {
          setPositionLivreur(
            data.livreur.localisation,
          );
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
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <Page>
        <Loading>
          Chargement du suivi...
        </Loading>
      </Page>
    );
  }

  if (erreur) {
    return (
      <Page>
        <ErrorBox>
          {erreur}
        </ErrorBox>
      </Page>
    );
  }

  if (!commande) {
    return (
      <Page>
        <ErrorBox>
          Commande introuvable.
        </ErrorBox>
      </Page>
    );
  }

  // ====================================================
  // DONNÉES
  // ====================================================

  const statut =
    commande.livraison?.statut ||
    "NOT_STARTED";

  const destination =
    commande.client?.latitude &&
    commande.client?.longitude
      ? {
          latitude:
            Number(
              commande.client.latitude,
            ),

          longitude:
            Number(
              commande.client.longitude,
            ),
        }
      : null;

  const positionCarte =
    positionLivreur ||
    destination || {
      latitude: 5.3364,
      longitude: -4.0267,
    };

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <Page>
      <Header>
        <div>
          <SmallTitle>
            SUIVI DE COMMANDE
          </SmallTitle>

          <Title>
            #{commande._id.slice(-6)}
          </Title>
        </div>

        <Status>
          {statutLabel[statut] || statut}
        </Status>
      </Header>

      <MapWrapper>
        <MapContainer
          center={[
            positionCarte.latitude,
            positionCarte.longitude,
          ]}
          zoom={14}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecentrerCarte
            position={positionLivreur}
          />

          {positionLivreur && (
            <Marker
              position={[
                positionLivreur.latitude,
                positionLivreur.longitude,
              ]}
              icon={livreurIcon}
            >
              <Popup>
                {livreur?.username ||
                  "Votre livreur"}
              </Popup>
            </Marker>
          )}

          {destination && (
            <Marker
              position={[
                destination.latitude,
                destination.longitude,
              ]}
            >
              <Popup>
                Votre adresse
              </Popup>
            </Marker>
          )}

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
              />
            )}
        </MapContainer>
      </MapWrapper>

      <Content>
        <TrackingCard>
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

            <TrackingIcon>
              {statutIcon[statut]}
            </TrackingIcon>
          </TrackingHeader>

          <Timeline>
            <TimelineItem $active>
              <TimelineDot>
                ✓
              </TimelineDot>

              <div>
                <TimelineTitle>
                  Commande confirmée
                </TimelineTitle>

                <TimelineText>
                  Votre commande est
                  enregistrée.
                </TimelineText>
              </div>
            </TimelineItem>

            <TimelineItem
              $active={[
                "ACCEPTED",
                "PICKING_UP",
                "IN_DELIVERY",
                "DELIVERED",
              ].includes(statut)}
            >
              <TimelineDot>
                🚴
              </TimelineDot>

              <div>
                <TimelineTitle>
                  Livreur attribué
                </TimelineTitle>

                <TimelineText>
                  {livreur?.username
                    ? `${livreur.username} s'occupe de votre commande.`
                    : "Un livreur a été attribué."}
                </TimelineText>
              </div>
            </TimelineItem>

            <TimelineItem
              $active={[
                "IN_DELIVERY",
                "DELIVERED",
              ].includes(statut)}
            >
              <TimelineDot>
                📦
              </TimelineDot>

              <div>
                <TimelineTitle>
                  En livraison
                </TimelineTitle>

                <TimelineText>
                  Votre commande est en
                  route.
                </TimelineText>
              </div>
            </TimelineItem>

            <TimelineItem
              $active={statut === "DELIVERED"}
            >
              <TimelineDot>
                ✓
              </TimelineDot>

              <div>
                <TimelineTitle>
                  Livrée
                </TimelineTitle>

                <TimelineText>
                  Bonne réception !
                </TimelineText>
              </div>
            </TimelineItem>
          </Timeline>

          {livreur && (
            <LivreurCard>
              <Avatar>
                {livreur.username
                  ?.charAt(0)
                  ?.toUpperCase() || "L"}
              </Avatar>

              <LivreurInfo>
                <LivreurLabel>
                  VOTRE LIVREUR
                </LivreurLabel>

                <LivreurName>
                  {livreur.username}
                </LivreurName>
              </LivreurInfo>

              <Actions>
                {livreur.telephone && (
                  <ActionButton
                    as="a"
                    href={`tel:${livreur.telephone}`}
                  >
                    📞
                  </ActionButton>
                )}

                <ActionButton>
                  💬
                </ActionButton>
              </Actions>
            </LivreurCard>
          )}
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
    "Livreur recherché",

  ACCEPTED:
    "Livreur attribué",

  PICKING_UP:
    "Livreur récupère votre commande",

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
// STYLE
// ======================================================

const Page = styled.div`
  min-height: 100vh;
  background: #f5f5f7;
  color: #111;
`;

const Header = styled.header`
  padding: 24px 5%;
  background: white;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #eee;
`;

const SmallTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #777;
`;

const Title = styled.h1`
  margin: 5px 0 0;
  font-size: 28px;
`;

const Status = styled.div`
  padding: 10px 15px;
  border-radius: 999px;
  background: #111;
  color: white;
  font-size: 13px;
  font-weight: 700;
`;

const MapWrapper = styled.div`
  height: 55vh;
  min-height: 400px;
  background: #ddd;
`;

const Content = styled.main`
  max-width: 900px;
  margin: -40px auto 0;
  position: relative;
  padding: 0 20px 50px;
`;

const TrackingCard = styled.section`
  background: white;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
`;

const TrackingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Eyebrow = styled.div`
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #777;
  font-weight: 700;
`;

const TrackingTitle = styled.h2`
  margin: 7px 0 0;
  font-size: 25px;
`;

const TrackingIcon = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 18px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
`;

const Timeline = styled.div`
  margin-top: 35px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 27px;

  opacity: ${({ $active }) =>
    $active ? 1 : 0.35};
`;

const TimelineDot = styled.div`
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  border-radius: 50%;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimelineTitle = styled.div`
  font-weight: 700;
`;

const TimelineText = styled.div`
  margin-top: 5px;
  color: #777;
  font-size: 14px;
`;

const LivreurCard = styled.div`
  margin-top: 10px;
  padding: 18px;

  border-radius: 20px;
  background: #f7f7f7;

  display: flex;
  align-items: center;
  gap: 15px;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;

  border-radius: 50%;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
  font-size: 20px;
`;

const LivreurInfo = styled.div`
  flex: 1;
`;

const LivreurLabel = styled.div`
  font-size: 10px;
  color: #888;
  letter-spacing: 0.1em;
`;

const LivreurName = styled.div`
  font-weight: 700;
  margin-top: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  width: 45px;
  height: 45px;

  border: 0;
  border-radius: 14px;

  background: white;

  font-size: 19px;

  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

const Loading = styled.div`
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
`;

const ErrorBox = styled.div`
  max-width: 500px;
  margin: 100px auto;
  padding: 25px;

  background: white;
  border-radius: 20px;

  color: #c00;
`;
