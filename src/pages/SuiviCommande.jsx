import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";
import styled from "styled-components";

import {
  FaArrowLeft,
  FaPhone,
  FaComments,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaCheck,
  FaBox,
  FaLocationArrow,
  FaClock,
  FaShieldAlt,
  FaCircle,
  FaSearch,
} from "react-icons/fa";

import { socket } from "../services/socket";

import "leaflet/dist/leaflet.css";

// ======================================================
// CONFIG
// ======================================================

const ABIDJAN = {
  latitude: 5.3364,
  longitude: -4.0267,
};

// ======================================================
// ICONE LIVREUR
// ======================================================

const livreurIcon = new L.DivIcon({
  className: "livreur-marker",
  html: `
    <div class="driver-marker">
      <div class="driver-marker-inner">
        <span>🚴</span>
      </div>
      <div class="driver-pulse"></div>
    </div>
  `,
  iconSize: [58, 58],
  iconAnchor: [29, 29],
});

// ======================================================
// ICONE DESTINATION
// ======================================================

const destinationIcon = new L.DivIcon({
  className: "destination-marker",
  html: `
    <div class="destination-marker-inner">
      <span>📍</span>
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 42],
});

// ======================================================
// RECENTRER AUTOMATIQUEMENT SUR LE LIVREUR
// ======================================================

function RecentrerCarte({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    const latitude = Number(position.latitude);
    const longitude = Number(position.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    map.panTo([latitude, longitude], {
      animate: true,
      duration: 0.8,
    });
  }, [position, map]);

  return null;
}

// ======================================================
// ITINERAIRE ROUTIER
// ======================================================

function ItineraireRoutier({
  positionLivreur,
  positionClient,
}) {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (!positionLivreur || !positionClient) {
      setRoute(null);
      return;
    }

    const latitudeLivreur = Number(
      positionLivreur.latitude,
    );

    const longitudeLivreur = Number(
      positionLivreur.longitude,
    );

    const latitudeClient = Number(
      positionClient.latitude,
    );

    const longitudeClient = Number(
      positionClient.longitude,
    );

    if (
      !Number.isFinite(latitudeLivreur) ||
      !Number.isFinite(longitudeLivreur) ||
      !Number.isFinite(latitudeClient) ||
      !Number.isFinite(longitudeClient)
    ) {
      setRoute(null);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${longitudeLivreur},${latitudeLivreur};` +
          `${longitudeClient},${latitudeClient}` +
          `?overview=full&geometries=geojson`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            "Erreur récupération itinéraire",
          );
        }

        const data = await response.json();

        if (
          data.code !== "Ok" ||
          !data.routes?.length
        ) {
          setRoute(null);
          return;
        }

        const coordinates =
          data.routes[0].geometry.coordinates.map(
            ([longitude, latitude]) => [
              latitude,
              longitude,
            ],
          );

        setRoute(coordinates);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(
          "Erreur itinéraire :",
          error,
        );

        setRoute(null);
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [positionLivreur, positionClient]);

  if (!route?.length) {
    return null;
  }

  return (
    <>
      <Polyline
        positions={route}
        pathOptions={{
          color: "#000",
          weight: 9,
          opacity: 0.15,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      <Polyline
        positions={route}
        pathOptions={{
          color: "#0071e3",
          weight: 6,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </>
  );
}

// ======================================================
// PAGE
// ======================================================

export default function SuiviCommande() {
  const { commandeId, id } = useParams();
  const navigate = useNavigate();

  const currentCommandeId = commandeId || id;

  const API_URL = import.meta.env.VITE_API_URL;

  const [commande, setCommande] = useState(null);

  const [positionLivreur, setPositionLivreur] =
    useState(null);

  const [positionClient, setPositionClient] =
    useState(null);

  const [livreur, setLivreur] = useState(null);

  const [loading, setLoading] = useState(true);

  const [rechercheEnCours, setRechercheEnCours] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const [messageRecherche, setMessageRecherche] =
    useState("");

  // ====================================================
  // GPS CLIENT
  // ====================================================

  useEffect(() => {
    if (!currentCommandeId) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    if (!navigator.geolocation) {
      console.warn(
        "La géolocalisation n'est pas disponible sur ce navigateur.",
      );
      return;
    }

    let watchId = null;

    let dernierePositionEnvoyee = null;

    let dernierEnvoi = 0;

    const distanceEntrePositions = (
      lat1,
      lng1,
      lat2,
      lng2,
    ) => {
      const R = 6371000;

      const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

      const dLng =
        ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a),
        );

      return R * c;
    };

    const envoyerPosition = async (position) => {
      const latitude = Number(
        position.coords.latitude,
      );

      const longitude = Number(
        position.coords.longitude,
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      const nouvellePosition = {
        latitude,
        longitude,
      };

      setPositionClient(nouvellePosition);

      const maintenant = Date.now();

      if (dernierePositionEnvoyee) {
        const distance =
          distanceEntrePositions(
            dernierePositionEnvoyee.latitude,
            dernierePositionEnvoyee.longitude,
            latitude,
            longitude,
          );

        const tempsEcoule =
          maintenant - dernierEnvoi;

        if (
          distance < 20 &&
          tempsEcoule < 5000
        ) {
          return;
        }
      }

      try {
        const response = await fetch(
          `${API_URL}/api/commandes/${currentCommandeId}/localisation-client`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              latitude,
              longitude,
            }),
          },
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          console.error(
            "Erreur envoi GPS client :",
            data.message ||
              response.statusText,
          );

          return;
        }

        dernierePositionEnvoyee =
          nouvellePosition;

        dernierEnvoi = maintenant;
      } catch (error) {
        console.error(
          "GPS CLIENT ERROR :",
          error,
        );
      }
    };

    const erreurGPS = (error) => {
      console.warn(
        "Impossible de récupérer la position du client :",
        error.message,
      );
    };

    watchId =
      navigator.geolocation.watchPosition(
        envoyerPosition,
        erreurGPS,
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000,
        },
      );

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(
          watchId,
        );
      }
    };
  }, [API_URL, currentCommandeId]);

  // ====================================================
  // CHARGER LA COMMANDE
  // ====================================================

  useEffect(() => {
    if (!currentCommandeId) {
      setErreur(
        "Identifiant de commande manquant.",
      );

      setLoading(false);
      return;
    }

    const chargerCommande = async () => {
      try {
        setLoading(true);
        setErreur("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/commandes/${currentCommandeId}`,
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

        // ==============================================
        // LIVREUR
        // ==============================================

        if (
          commandeData.livraison?.livreur
        ) {
          setLivreur(
            commandeData.livraison.livreur,
          );
        }

        // ==============================================
        // POSITION CLIENT
        // ==============================================

        const localisationClient =
          commandeData.client?.localisation;

        if (
          localisationClient &&
          localisationClient.latitude !==
            null &&
          localisationClient.longitude !==
            null
        ) {
          const latitude = Number(
            localisationClient.latitude,
          );

          const longitude = Number(
            localisationClient.longitude,
          );

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            setPositionClient({
              latitude,
              longitude,
            });
          }
        }

        // ==============================================
        // POSITION LIVREUR
        // ==============================================

        if (
          commandeData.livraison?.localisation
        ) {
          const localisation =
            commandeData.livraison.localisation;

          const latitude = Number(
            localisation.latitude,
          );

          const longitude = Number(
            localisation.longitude,
          );

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            setPositionLivreur({
              latitude,
              longitude,
            });
          }
        }

        // ==============================================
        // FALLBACK LIVREUR
        // ==============================================

        if (
          commandeData.livraison?.livreur
            ?.localisation
        ) {
          const localisation =
            commandeData.livraison.livreur
              .localisation;

          const latitude = Number(
            localisation.latitude,
          );

          const longitude = Number(
            localisation.longitude,
          );

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            setPositionLivreur({
              latitude,
              longitude,
            });
          }
        }
      } catch (error) {
        console.error(
          "SUIVI COMMANDE ERROR:",
          error,
        );

        setErreur(
          error.message ||
            "Impossible de charger le suivi.",
        );
      } finally {
        setLoading(false);
      }
    };

    chargerCommande();
  }, [
    API_URL,
    currentCommandeId,
    navigate,
  ]);

  // ====================================================
  // LANCER RECHERCHE LIVREUR
  // ====================================================

  const lancerRechercheLivreur =
    async () => {
      if (!currentCommandeId) return;

      if (!commande) return;

      if (
        commande.statusCommande !==
        "CONFIRMED"
      ) {
        setMessageRecherche(
          "Cette commande doit être confirmée avant de rechercher un livreur.",
        );

        return;
      }

      if (
        commande.livraison?.livreurId ||
        livreur
      ) {
        setMessageRecherche(
          "Un livreur est déjà attribué à cette commande.",
        );

        return;
      }

      if (
        commande.livraison?.statut !==
        "NOT_STARTED"
      ) {
        return;
      }

      try {
        setRechercheEnCours(true);
        setMessageRecherche("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/livreurs/commande/${currentCommandeId}/rechercher-livreur`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          },
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de lancer la recherche.",
          );
        }

        const nouvelleCommande =
          data.commande || data;

        setCommande((prev) => ({
          ...prev,
          ...(nouvelleCommande || {}),
          livraison: {
            ...prev?.livraison,
            ...(nouvelleCommande?.livraison ||
              {}),
            statut: "SEARCHING",
          },
        }));

        setMessageRecherche(
          "Recherche d'un livreur lancée. Nous recherchons un livreur disponible.",
        );
      } catch (error) {
        console.error(
          "RECHERCHE LIVREUR ERROR:",
          error,
        );

        setMessageRecherche(
          error.message ||
            "Impossible de lancer la recherche.",
        );
      } finally {
        setRechercheEnCours(false);
      }
    };

  // ====================================================
  // SOCKET.IO
  // ====================================================

  useEffect(() => {
    if (!currentCommandeId) return;

    socket.emit(
      "join_commande",
      currentCommandeId,
    );

    const token =
      localStorage.getItem("token");

    try {
      if (token) {
        const payload = JSON.parse(
          atob(
            token
              .split(".")[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/"),
          ),
        );

        if (payload?.userId) {
          socket.emit(
            "join_room",
            payload.userId,
          );
        }
      }
    } catch (error) {
      console.warn(
        "Impossible de lire le token client",
      );
    }

    // ================================================
    // POSITION LIVREUR
    // ================================================

    const handlePositionLivreur = (
      data,
    ) => {
      if (
        data.commandeId?.toString() !==
        currentCommandeId.toString()
      ) {
        return;
      }

      const latitude = Number(
        data.latitude,
      );

      const longitude = Number(
        data.longitude,
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      setPositionLivreur({
        latitude,
        longitude,
      });
    };

    // ================================================
    // POSITION CLIENT
    // ================================================

    const handlePositionClient = (
      data,
    ) => {
      if (
        data.commandeId?.toString() !==
        currentCommandeId.toString()
      ) {
        return;
      }

      const latitude = Number(
        data.latitude,
      );

      const longitude = Number(
        data.longitude,
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      setPositionClient({
        latitude,
        longitude,
      });
    };

    // ================================================
    // UPDATE COMMANDE
    // ================================================

    const handleCommandeUpdate = (
      data,
    ) => {
      if (
        data.id?.toString() !==
        currentCommandeId.toString()
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

      // ==============================================
      // NOUVEAU LIVREUR
      // ==============================================

      if (data.livreur) {
        setLivreur(data.livreur);

        setMessageRecherche("");

        if (
          data.livreur.localisation
        ) {
          const localisation =
            data.livreur.localisation;

          const latitude = Number(
            localisation.latitude,
          );

          const longitude = Number(
            localisation.longitude,
          );

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            setPositionLivreur({
              latitude,
              longitude,
            });
          }
        }
      }
    };

    socket.on(
      "livreur_position",
      handlePositionLivreur,
    );

    socket.on(
      "client_position",
      handlePositionClient,
    );

    socket.on(
      "commande_update",
      handleCommandeUpdate,
    );

    return () => {
      socket.off(
        "livreur_position",
        handlePositionLivreur,
      );

      socket.off(
        "client_position",
        handlePositionClient,
      );

      socket.off(
        "commande_update",
        handleCommandeUpdate,
      );

      socket.emit(
        "leave_commande",
        currentCommandeId,
      );
    };
  }, [currentCommandeId]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <Page>
        <LoadingScreen>
          <LoadingSpinner />

          <LoadingTitle>
            Préparation de votre suivi
          </LoadingTitle>

          <LoadingText>
            Nous récupérons les informations
            de votre livraison...
          </LoadingText>
        </LoadingScreen>
      </Page>
    );
  }

  // ====================================================
  // ERREUR
  // ====================================================

  if (erreur) {
    return (
      <Page>
        <ErrorScreen>
          <ErrorIcon>!</ErrorIcon>

          <h2>
            Impossible d'afficher le suivi
          </h2>

          <p>{erreur}</p>

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
  // COMMANDE ABSENTE
  // ====================================================

  if (!commande) {
    return (
      <Page>
        <ErrorScreen>
          <ErrorIcon>!</ErrorIcon>

          <h2>Commande introuvable</h2>

          <BackButton
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </BackButton>
        </ErrorScreen>
      </Page>
    );
  }

  // ====================================================
  // DONNÉES
  // ====================================================

  const statut =
    commande.livraison?.statut ||
    "NOT_STARTED";

  const destination = positionClient;

  const positionCarte =
    positionLivreur ||
    destination ||
    ABIDJAN;

  const statutInfo =
    statutConfig[statut] ||
    statutConfig.NOT_STARTED;

  const livreurDisponible =
    Boolean(livreur);

  const peutRechercherLivreur =
    commande.statusCommande ===
      "CONFIRMED" &&
    !commande.livraison?.livreurId &&
    !livreur &&
    statut === "NOT_STARTED";

  // ====================================================
  // RENDU
  // ====================================================

  return (
    <Page>
      {/* =================================================
          HEADER
      ================================================= */}

      <TopHeader>
        <HeaderLeft>
          <BackIcon
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </BackIcon>

          <div>
            <SmallTitle>
              SUIVI DE LIVRAISON
            </SmallTitle>

            <OrderNumber>
              #
              {currentCommandeId
                ?.slice(-8)
                .toUpperCase()}
            </OrderNumber>
          </div>
        </HeaderLeft>

        <StatusBadge
          $type={statutInfo.type}
        >
          <FaCircle />

          <span>
            {statutInfo.label}
          </span>
        </StatusBadge>
      </TopHeader>

      {/* =================================================
          MAP
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
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControl position="bottomright" />

          {/* RECENTRAGE AUTOMATIQUE LIVREUR */}

          <RecentrerCarte
            position={positionLivreur}
          />

          {/* LIVREUR */}

          {positionLivreur && (
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

                Livreur en temps réel
              </Popup>
            </Marker>
          )}

          {/* CLIENT */}

          {positionClient && (
            <Marker
              position={[
                positionClient.latitude,
                positionClient.longitude,
              ]}
              icon={destinationIcon}
            >
              <Popup>
                <strong>
                  Votre position
                </strong>

                <br />

                Position GPS en temps réel
              </Popup>
            </Marker>
          )}

          {/* TRAJET */}

          {positionLivreur &&
            positionClient && (
              <ItineraireRoutier
                positionLivreur={
                  positionLivreur
                }
                positionClient={
                  positionClient
                }
              />
            )}
        </MapContainer>

        {/* OVERLAY */}

        <MapOverlay>
          <LiveBadge>
            <LiveDot />
            LIVE
          </LiveBadge>

          <MapInfo>
            <MapInfoIcon>
              <FaLocationArrow />
            </MapInfoIcon>

            <div>
              <MapInfoTitle>
                Position du livreur
              </MapInfoTitle>

              <MapInfoText>
                Mise à jour en temps réel
              </MapInfoText>
            </div>
          </MapInfo>
        </MapOverlay>

        {/* ATTENTE LIVREUR */}

        {!positionLivreur &&
          statut !== "DELIVERED" && (
            <WaitingMapCard>
              <WaitingMapIcon>
                <FaMotorcycle />
              </WaitingMapIcon>

              <div>
                <strong>
                  En attente de localisation
                </strong>

                <span>
                  La position du livreur
                  apparaîtra ici dès qu'il
                  sera connecté.
                </span>
              </div>
            </WaitingMapCard>
          )}
      </MapSection>

      {/* =================================================
          CONTENU
      ================================================= */}

      <Content>
        <MainGrid>
          {/* =================================================
              COLONNE PRINCIPALE
          ================================================= */}

          <MainColumn>
            {/* STATUT */}

            <StatusCard>
              <StatusCardTop>
                <StatusTextBlock>
                  <Eyebrow>
                    ÉTAT DE LA LIVRAISON
                  </Eyebrow>

                  <StatusTitle>
                    {statutInfo.label}
                  </StatusTitle>

                  <StatusDescription>
                    {statutInfo.description}
                  </StatusDescription>
                </StatusTextBlock>

                <BigStatusIcon
                  $type={statutInfo.type}
                >
                  {statutInfo.icon}
                </BigStatusIcon>
              </StatusCardTop>
            </StatusCard>

            {/* =================================================
                RECHERCHE LIVREUR
            ================================================= */}

            {peutRechercherLivreur && (
              <SearchDriverCard>
                <SearchDriverIcon>
                  <FaMotorcycle />
                </SearchDriverIcon>

                <SearchDriverContent>
                  <SearchDriverTitle>
                    Aucun livreur attribué
                  </SearchDriverTitle>

                  <SearchDriverText>
                    Votre commande est confirmée.
                    Vous pouvez maintenant
                    rechercher un livreur
                    disponible.
                  </SearchDriverText>

                  <SearchDriverButton
                    onClick={
                      lancerRechercheLivreur
                    }
                    disabled={
                      rechercheEnCours
                    }
                  >
                    <FaSearch />

                    {rechercheEnCours
                      ? "Recherche en cours..."
                      : "Rechercher un livreur"}
                  </SearchDriverButton>
                </SearchDriverContent>
              </SearchDriverCard>
            )}

            {/* MESSAGE RECHERCHE */}

            {messageRecherche && (
              <SearchMessage
                $error={
                  messageRecherche.includes(
                    "doit être",
                  ) ||
                  messageRecherche.includes(
                    "Impossible",
                  ) ||
                  messageRecherche.includes(
                    "déjà attribué",
                  )
                }
              >
                <FaSearch />

                <span>
                  {messageRecherche}
                </span>
              </SearchMessage>
            )}

            {/* =================================================
                TIMELINE
            ================================================= */}

            <Card>
              <CardHeader>
                <CardHeaderIcon>
                  <FaBox />
                </CardHeaderIcon>

                <div>
                  <CardEyebrow>
                    PROGRESSION
                  </CardEyebrow>

                  <CardTitle>
                    Votre commande
                  </CardTitle>
                </div>
              </CardHeader>

              <Timeline>
                {/* COMMANDE CONFIRMÉE */}

                <TimelineItem
                  $active={
                    commande.statusCommande ===
                      "CONFIRMED" ||
                    [
                      "SEARCHING",
                      "ACCEPTED",
                      "PICKING_UP",
                      "IN_DELIVERY",
                      "DELIVERED",
                    ].includes(statut)
                  }
                >
                  <TimelineLine />

                  <TimelineDot
                    $active={
                      commande.statusCommande ===
                        "CONFIRMED" ||
                      [
                        "SEARCHING",
                        "ACCEPTED",
                        "PICKING_UP",
                        "IN_DELIVERY",
                        "DELIVERED",
                      ].includes(statut)
                    }
                  >
                    <FaCheck />
                  </TimelineDot>

                  <TimelineContent>
                    <TimelineItemTitle>
                      Commande confirmée
                    </TimelineItemTitle>

                    <TimelineItemText>
                      Votre commande a été
                      confirmée.
                    </TimelineItemText>
                  </TimelineContent>
                </TimelineItem>

                {/* LIVREUR */}

                <TimelineItem
                  $active={[
                    "SEARCHING",
                    "ACCEPTED",
                    "PICKING_UP",
                    "IN_DELIVERY",
                    "DELIVERED",
                  ].includes(statut)}
                >
                  <TimelineLine />

                  <TimelineDot
                    $active={[
                      "SEARCHING",
                      "ACCEPTED",
                      "PICKING_UP",
                      "IN_DELIVERY",
                      "DELIVERED",
                    ].includes(statut)}
                  >
                    <FaMotorcycle />
                  </TimelineDot>

                  <TimelineContent>
                    <TimelineItemTitle>
                      Livreur
                    </TimelineItemTitle>

                    <TimelineItemText>
                      {livreur?.username
                        ? `${livreur.username} prend en charge votre commande.`
                        : statut ===
                          "SEARCHING"
                        ? "Nous recherchons actuellement un livreur disponible."
                        : "Aucun livreur n'a encore été attribué."}
                    </TimelineItemText>
                  </TimelineContent>
                </TimelineItem>

                {/* RÉCUPÉRATION */}

                <TimelineItem
                  $active={[
                    "PICKING_UP",
                    "IN_DELIVERY",
                    "DELIVERED",
                  ].includes(statut)}
                >
                  <TimelineLine />

                  <TimelineDot
                    $active={[
                      "PICKING_UP",
                      "IN_DELIVERY",
                      "DELIVERED",
                    ].includes(statut)}
                  >
                    <FaBox />
                  </TimelineDot>

                  <TimelineContent>
                    <TimelineItemTitle>
                      Commande en préparation
                    </TimelineItemTitle>

                    <TimelineItemText>
                      Le livreur récupère votre
                      commande.
                    </TimelineItemText>
                  </TimelineContent>
                </TimelineItem>

                {/* LIVRAISON */}

                <TimelineItem
                  $active={[
                    "IN_DELIVERY",
                    "DELIVERED",
                  ].includes(statut)}
                  $last
                >
                  <TimelineDot
                    $active={[
                      "IN_DELIVERY",
                      "DELIVERED",
                    ].includes(statut)}
                  >
                    <FaLocationArrow />
                  </TimelineDot>

                  <TimelineContent>
                    <TimelineItemTitle>
                      Livraison
                    </TimelineItemTitle>

                    <TimelineItemText>
                      {statut === "DELIVERED"
                        ? "Votre commande a été livrée."
                        : "Votre commande est en route vers vous."}
                    </TimelineItemText>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Card>
          </MainColumn>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <SideColumn>
            {/* LIVREUR */}

            {livreurDisponible && (
              <DriverCard>
                <DriverCardHeader>
                  <DriverLabel>
                    VOTRE LIVREUR
                  </DriverLabel>

                  <OnlineBadge>
                    <LiveDot />
                    EN LIGNE
                  </OnlineBadge>
                </DriverCardHeader>

                <DriverMain>
                  <DriverAvatar>
                    {livreur.username
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "L"}
                  </DriverAvatar>

                  <DriverIdentity>
                    <DriverName>
                      {livreur.username}
                    </DriverName>

                    <DriverRole>
                      Livreur partenaire
                    </DriverRole>

                    {positionLivreur && (
                      <DriverLocation>
                        <FaLocationArrow />
                        Position active
                      </DriverLocation>
                    )}
                  </DriverIdentity>
                </DriverMain>

                <DriverActions>
                  {livreur.telephone && (
                    <DriverAction
                      as="a"
                      href={`tel:${livreur.telephone}`}
                    >
                      <FaPhone />

                      <span>
                        Appeler
                      </span>
                    </DriverAction>
                  )}

                  <DriverAction
                    onClick={() =>
                      alert(
                        "Le chat sera activé à la prochaine étape.",
                      )
                    }
                  >
                    <FaComments />

                    <span>
                      Discuter
                    </span>
                  </DriverAction>
                </DriverActions>
              </DriverCard>
            )}

            {/* DESTINATION */}

            <DestinationCard>
              <DestinationIcon>
                <FaMapMarkerAlt />
              </DestinationIcon>

              <div>
                <DestinationLabel>
                  DESTINATION
                </DestinationLabel>

                <DestinationAddress>
                  {commande.client?.adresse ||
                    "Adresse de livraison"}
                </DestinationAddress>

                {commande.client?.ville && (
                  <DestinationCity>
                    {commande.client.ville}
                  </DestinationCity>
                )}
              </div>
            </DestinationCard>

            {/* SÉCURITÉ */}

            <SecurityCard>
              <SecurityIcon>
                <FaShieldAlt />
              </SecurityIcon>

              <div>
                <SecurityTitle>
                  Suivi sécurisé
                </SecurityTitle>

                <SecurityText>
                  La position du livreur est
                  transmise en temps réel
                  pendant votre livraison.
                </SecurityText>
              </div>
            </SecurityCard>

            {/* TEMPS RÉEL */}

            <RealtimeCard>
              <RealtimeIcon>
                <FaClock />
              </RealtimeIcon>

              <div>
                <RealtimeTitle>
                  Suivi en temps réel
                </RealtimeTitle>

                <RealtimeText>
                  Cette page se met
                  automatiquement à jour
                  sans avoir besoin de la
                  recharger.
                </RealtimeText>
              </div>
            </RealtimeCard>
          </SideColumn>
        </MainGrid>
      </Content>
    </Page>
  );
}

// ======================================================
// STATUTS
// ======================================================

const statutConfig = {
  NOT_STARTED: {
    label: "Recherche non démarrée",
    description:
      "La recherche d'un livreur n'a pas encore commencé.",
    icon: "⏳",
    type: "neutral",
  },

  SEARCHING: {
    label: "Recherche d'un livreur",
    description:
      "Nous recherchons actuellement un livreur disponible.",
    icon: "🔎",
    type: "searching",
  },

  REQUESTED: {
    label: "Livreur recherché",
    description:
      "Votre demande de livraison est en cours.",
    icon: "🔎",
    type: "searching",
  },

  ACCEPTED: {
    label: "Livreur attribué",
    description:
      "Un livreur a accepté votre commande.",
    icon: "🚴",
    type: "success",
  },

  PICKING_UP: {
    label: "Récupération en cours",
    description:
      "Votre livreur récupère actuellement votre commande.",
    icon: "📦",
    type: "warning",
  },

  IN_DELIVERY: {
    label: "Votre commande est en route",
    description:
      "Votre livreur se dirige vers votre adresse.",
    icon: "🚚",
    type: "success",
  },

  DELIVERED: {
    label: "Commande livrée",
    description:
      "Votre commande a été livrée avec succès.",
    icon: "✓",
    type: "success",
  },

  CANCELLED: {
    label: "Commande annulée",
    description:
      "Cette livraison a été annulée.",
    icon: "×",
    type: "danger",
  },
};

// ======================================================
// PAGE
// ======================================================

const Page = styled.div`
  min-height: 100vh;
  background: #f4f5f7;
  color: #111;
`;

// ======================================================
// HEADER
// ======================================================

const TopHeader = styled.header`
  height: 78px;
  padding: 0 5%;

  background: rgba(255, 255, 255, 0.96);

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #e9e9eb;

  position: relative;
  z-index: 20;

  @media (max-width: 700px) {
    padding: 0 18px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BackIcon = styled.button`
  width: 40px;
  height: 40px;

  border: 1px solid #e5e5e7;
  border-radius: 12px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const SmallTitle = styled.div`
  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.13em;

  color: #8a8a8f;
`;

const OrderNumber = styled.div`
  margin-top: 3px;

  font-size: 19px;
  font-weight: 800;

  letter-spacing: -0.02em;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 10px 14px;

  border-radius: 999px;

  background: ${({ $type }) => {
    if ($type === "success")
      return "#e9f8ef";

    if ($type === "searching")
      return "#fff7df";

    if ($type === "danger")
      return "#ffecec";

    return "#f1f1f3";
  }};

  color: ${({ $type }) => {
    if ($type === "success")
      return "#168344";

    if ($type === "searching")
      return "#946d00";

    if ($type === "danger")
      return "#b42318";

    return "#555";
  }};

  font-size: 12px;
  font-weight: 800;

  svg {
    font-size: 7px;
  }

  @media (max-width: 550px) {
    span {
      display: none;
    }

    padding: 10px;
  }
`;

// ======================================================
// MAP
// ======================================================

const MapSection = styled.section`
  height: 57vh;
  min-height: 430px;

  position: relative;

  background: #dfe2e5;

  overflow: hidden;

  .leaflet-container {
    font-family: inherit;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 14px;
  }

  .leaflet-popup-content {
    margin: 13px 16px;
  }

  .driver-marker {
    position: relative;
    width: 58px;
    height: 58px;
  }

  .driver-marker-inner {
    width: 48px;
    height: 48px;

    margin: 5px;

    border-radius: 50%;

    background: #111;

    border: 4px solid white;

    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.3);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 23px;

    position: relative;
    z-index: 2;
  }

  .driver-pulse {
    position: absolute;

    width: 48px;
    height: 48px;

    top: 5px;
    left: 5px;

    border-radius: 50%;

    border: 2px solid
      rgba(17, 17, 17, 0.25);

    animation: driverPulse 2s infinite;
  }

  .destination-marker-inner {
    width: 42px;
    height: 42px;

    border-radius: 50%;

    background: white;

    border: 3px solid #111;

    box-shadow:
      0 5px 18px rgba(0, 0, 0, 0.22);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 22px;
  }

  @keyframes driverPulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }

    70% {
      transform: scale(1.45);
      opacity: 0;
    }

    100% {
      opacity: 0;
    }
  }

  @media (max-width: 700px) {
    min-height: 400px;
    height: 52vh;
  }
`;

const MapOverlay = styled.div`
  position: absolute;

  top: 18px;
  left: 20px;

  z-index: 500;

  display: flex;
  flex-direction: column;
  gap: 10px;

  pointer-events: none;
`;

const LiveBadge = styled.div`
  width: fit-content;

  display: flex;
  align-items: center;
  gap: 7px;

  padding: 7px 11px;

  border-radius: 999px;

  background: rgba(17, 17, 17, 0.92);

  color: white;

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 0.08em;

  backdrop-filter: blur(10px);
`;

const LiveDot = styled.span`
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #23c66b;

  box-shadow:
    0 0 0 4px rgba(35, 198, 107, 0.15);
`;

const MapInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 11px 14px;

  background: rgba(255, 255, 255, 0.94);

  border-radius: 15px;

  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.12);

  backdrop-filter: blur(12px);
`;

const MapInfoIcon = styled.div`
  width: 34px;
  height: 34px;

  border-radius: 10px;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;
`;

const MapInfoTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
`;

const MapInfoText = styled.div`
  margin-top: 2px;

  color: #777;

  font-size: 10px;
`;

const WaitingMapCard = styled.div`
  position: absolute;

  bottom: 20px;
  left: 50%;

  transform: translateX(-50%);

  z-index: 500;

  display: flex;
  align-items: center;
  gap: 12px;

  width: min(420px, calc(100% - 40px));

  padding: 13px 15px;

  background: rgba(255, 255, 255, 0.95);

  border-radius: 17px;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.14);

  backdrop-filter: blur(12px);

  strong {
    display: block;
    font-size: 12px;
  }

  span {
    display: block;
    margin-top: 3px;

    color: #777;

    font-size: 10px;
    line-height: 1.4;
  }
`;

const WaitingMapIcon = styled.div`
  width: 38px;
  height: 38px;

  flex: 0 0 auto;

  border-radius: 12px;

  background: #f0f0f2;

  display: flex;
  align-items: center;
  justify-content: center;
`;

// ======================================================
// CONTENT
// ======================================================

const Content = styled.main`
  max-width: 1180px;

  margin: -48px auto 0;

  position: relative;
  z-index: 10;

  padding: 0 22px 60px;

  @media (max-width: 700px) {
    margin-top: -25px;
    padding: 0 14px 40px;
  }
`;

const MainGrid = styled.div`
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    350px;

  gap: 22px;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// ======================================================
// STATUS CARD
// ======================================================

const StatusCard = styled.section`
  padding: 25px;

  border-radius: 24px;

  background: #111;
  color: white;

  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.16);
`;

const StatusCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
`;

const StatusTextBlock = styled.div``;

const Eyebrow = styled.div`
  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.13em;

  color: #96969c;
`;

const StatusTitle = styled.h2`
  margin: 7px 0 6px;

  font-size: 25px;

  letter-spacing: -0.03em;
`;

const StatusDescription = styled.p`
  margin: 0;

  color: #aaaab0;

  font-size: 13px;

  line-height: 1.5;
`;

const BigStatusIcon = styled.div`
  width: 62px;
  height: 62px;

  flex: 0 0 auto;

  border-radius: 19px;

  background: ${({ $type }) =>
    $type === "success"
      ? "#1d5f3b"
      : $type === "danger"
        ? "#672525"
        : "#29292d"};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 27px;
`;

// ======================================================
// RECHERCHE LIVREUR
// ======================================================

const SearchDriverCard = styled.section`
  display: flex;
  align-items: center;
  gap: 17px;

  padding: 22px;

  background: white;

  border: 1px solid #e8e8ea;

  border-radius: 24px;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.045);

  @media (max-width: 600px) {
    align-items: flex-start;
  }
`;

const SearchDriverIcon = styled.div`
  width: 54px;
  height: 54px;

  flex: 0 0 auto;

  border-radius: 17px;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
`;

const SearchDriverContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SearchDriverTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

const SearchDriverText = styled.div`
  margin-top: 5px;

  color: #777;

  font-size: 12px;

  line-height: 1.5;
`;

const SearchDriverButton = styled.button`
  margin-top: 15px;

  min-height: 44px;

  padding: 0 17px;

  border: 0;

  border-radius: 13px;

  background: #111;

  color: white;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.2s;

  &:hover:not(:disabled) {
    background: #2a2a2a;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

const SearchMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 14px 16px;

  border-radius: 15px;

  background: ${({ $error }) =>
    $error ? "#fff0f0" : "#eef8f2"};

  color: ${({ $error }) =>
    $error ? "#b42318" : "#168344"};

  border: 1px solid
    ${({ $error }) =>
      $error ? "#ffd4d4" : "#d6efdf"};

  font-size: 12px;

  font-weight: 700;
`;

// ======================================================
// CARD
// ======================================================

const Card = styled.section`
  background: white;

  border: 1px solid #e8e8ea;

  border-radius: 24px;

  padding: 25px;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.045);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const CardHeaderIcon = styled.div`
  width: 42px;
  height: 42px;

  border-radius: 13px;

  background: #f1f1f3;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
`;

const CardEyebrow = styled.div`
  font-size: 9px;

  font-weight: 800;

  letter-spacing: 0.12em;

  color: #96969c;
`;

const CardTitle = styled.h3`
  margin: 3px 0 0;

  font-size: 18px;

  letter-spacing: -0.02em;
`;

// ======================================================
// TIMELINE
// ======================================================

const Timeline = styled.div`
  margin-top: 28px;
`;

const TimelineItem = styled.div`
  display: grid;

  grid-template-columns: 42px 1fr;

  column-gap: 14px;

  min-height: 78px;

  opacity: ${({ $active }) =>
    $active ? 1 : 0.35};

  position: relative;
`;

const TimelineLine = styled.div`
  position: absolute;

  left: 20px;
  top: 42px;

  height: 60px;

  width: 1px;

  background: #dedee1;
`;

const TimelineDot = styled.div`
  width: 42px;
  height: 42px;

  border-radius: 50%;

  background: ${({ $active }) =>
    $active ? "#111" : "#f0f0f2"};

  color: ${({ $active }) =>
    $active ? "white" : "#999"};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;

  position: relative;
  z-index: 2;
`;

const TimelineContent = styled.div`
  padding-top: 3px;
`;

const TimelineItemTitle = styled.div`
  font-size: 14px;

  font-weight: 800;
`;

const TimelineItemText = styled.div`
  margin-top: 5px;

  color: #777;

  font-size: 12px;

  line-height: 1.5;
`;

// ======================================================
// DRIVER
// ======================================================

const DriverCard = styled.section`
  padding: 22px;

  background: white;

  border: 1px solid #e8e8ea;

  border-radius: 24px;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.045);
`;

const DriverCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DriverLabel = styled.div`
  font-size: 10px;

  color: #888;

  font-weight: 800;

  letter-spacing: 0.12em;
`;

const OnlineBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  font-size: 9px;

  font-weight: 900;

  color: #168344;
`;

const DriverMain = styled.div`
  display: flex;

  align-items: center;

  gap: 14px;

  margin-top: 19px;
`;

const DriverAvatar = styled.div`
  width: 58px;
  height: 58px;

  border-radius: 18px;

  background: #111;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;

  font-weight: 800;
`;

const DriverIdentity = styled.div`
  min-width: 0;
`;

const DriverName = styled.div`
  font-size: 17px;

  font-weight: 800;
`;

const DriverRole = styled.div`
  margin-top: 3px;

  font-size: 11px;

  color: #888;
`;

const DriverLocation = styled.div`
  margin-top: 7px;

  display: flex;

  align-items: center;

  gap: 5px;

  color: #168344;

  font-size: 10px;

  font-weight: 700;
`;

const DriverActions = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 9px;

  margin-top: 20px;
`;

const DriverAction = styled.button`
  min-height: 45px;

  border: 1px solid #e3e3e5;

  border-radius: 13px;

  background: white;

  color: #111;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  font-size: 12px;

  font-weight: 800;

  text-decoration: none;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: #f4f4f5;
  }
`;

// ======================================================
// DESTINATION
// ======================================================

const DestinationCard = styled.section`
  display: flex;

  align-items: flex-start;

  gap: 13px;

  padding: 18px;

  background: white;

  border: 1px solid #e8e8ea;

  border-radius: 20px;
`;

const DestinationIcon = styled.div`
  width: 42px;
  height: 42px;

  flex: 0 0 auto;

  border-radius: 13px;

  background: #f2f2f3;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DestinationLabel = styled.div`
  font-size: 9px;

  font-weight: 800;

  color: #999;

  letter-spacing: 0.12em;
`;

const DestinationAddress = styled.div`
  margin-top: 5px;

  font-size: 13px;

  font-weight: 800;

  line-height: 1.4;
`;

const DestinationCity = styled.div`
  margin-top: 3px;

  font-size: 11px;

  color: #888;
`;

// ======================================================
// SECURITY
// ======================================================

const SecurityCard = styled.section`
  display: flex;

  gap: 12px;

  padding: 17px;

  border-radius: 18px;

  background: #f0f7f3;

  color: #1b6c42;
`;

const SecurityIcon = styled.div`
  width: 34px;
  height: 34px;

  flex: 0 0 auto;

  border-radius: 10px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
`;

const SecurityTitle = styled.div`
  font-size: 12px;

  font-weight: 800;
`;

const SecurityText = styled.div`
  margin-top: 3px;

  font-size: 10px;

  line-height: 1.5;

  color: #4b8064;
`;

// ======================================================
// REALTIME
// ======================================================

const RealtimeCard = styled.section`
  display: flex;

  gap: 12px;

  padding: 17px;

  border-radius: 18px;

  background: #f6f6f7;
`;

const RealtimeIcon = styled.div`
  width: 34px;
  height: 34px;

  flex: 0 0 auto;

  border-radius: 10px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
`;

const RealtimeTitle = styled.div`
  font-size: 12px;

  font-weight: 800;
`;

const RealtimeText = styled.div`
  margin-top: 3px;

  font-size: 10px;

  line-height: 1.5;

  color: #777;
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

  background: #f5f5f6;

  text-align: center;

  padding: 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;

  border: 3px solid #ddd;

  border-top-color: #111;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingTitle = styled.h2`
  margin: 18px 0 5px;

  font-size: 18px;
`;

const LoadingText = styled.p`
  margin: 0;

  color: #777;

  font-size: 13px;
`;

// ======================================================
// ERROR
// ======================================================

const ErrorScreen = styled.div`
  max-width: 450px;

  margin: 100px auto;

  padding: 35px 25px;

  text-align: center;

  background: white;

  border-radius: 25px;

  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.08);

  h2 {
    margin: 15px 0 8px;
  }

  p {
    color: #777;

    font-size: 13px;

    line-height: 1.5;
  }
`;

const ErrorIcon = styled.div`
  width: 55px;
  height: 55px;

  margin: auto;

  border-radius: 50%;

  background: #ffecec;

  color: #c62828;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;

  font-weight: 900;
`;

const BackButton = styled.button`
  margin-top: 15px;

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 11px 16px;

  border: 0;

  border-radius: 12px;

  background: #111;

  color: white;

  cursor: pointer;

  font-weight: 700;
`;