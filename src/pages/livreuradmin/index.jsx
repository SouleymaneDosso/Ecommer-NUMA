import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styled from "styled-components";

import { useNavigate } from "react-router-dom";

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

import { socket } from "../../services/socket";

// ======================================================
// ICÔNES CARTE
// ======================================================

const livreurIcon = new L.DivIcon({
  className: "livreur-marker",
  html: `
    <div style="
      width:46px;
      height:46px;
      border-radius:50%;
      background:#111;
      color:white;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:23px;
      border:4px solid white;
      box-shadow:0 5px 18px rgba(0,0,0,.25);
    ">
      🚴
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

const clientIcon = new L.DivIcon({
  className: "client-marker",
  html: `
    <div style="
      width:46px;
      height:46px;
      border-radius:50%;
      background:white;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:22px;
      border:4px solid #111;
      box-shadow:0 5px 18px rgba(0,0,0,.22);
    ">
      👤
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

// ======================================================
// VALIDATION POSITION
// ======================================================

const positionValide = (position) => {
  if (!position) {
    return false;
  }

  const latitude = Number(position.latitude);
  const longitude = Number(position.longitude);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

// ======================================================
// DISTANCE ENTRE DEUX POSITIONS
// ======================================================

const calculerDistanceEntrePositions = (
  position1,
  position2,
) => {
  if (
    !positionValide(position1) ||
    !positionValide(position2)
  ) {
    return Infinity;
  }

  const rayonTerre = 6371000;

  const lat1 =
    (Number(position1.latitude) * Math.PI) / 180;

  const lat2 =
    (Number(position2.latitude) * Math.PI) / 180;

  const deltaLat =
    ((Number(position2.latitude) -
      Number(position1.latitude)) *
      Math.PI) /
    180;

  const deltaLng =
    ((Number(position2.longitude) -
      Number(position1.longitude)) *
      Math.PI) /
    180;

  const a =
    Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return rayonTerre * c;
};

// ======================================================
// AJUSTEMENT AUTOMATIQUE DE LA CARTE
// ======================================================

function AjusterCarte({
  positionLivreur,
  positionClient,
  itineraire,
}) {
  const map = useMap();

  const premierCadrage = useRef(true);

  useEffect(() => {
    if (!premierCadrage.current) {
      return;
    }

    if (
      itineraire?.coordinates?.length > 1
    ) {
      const bounds = L.latLngBounds(
        itineraire.coordinates,
      );

      map.fitBounds(bounds, {
        padding: [55, 55],
        maxZoom: 16,
      });

      premierCadrage.current = false;

      return;
    }

    if (
      positionValide(positionLivreur) &&
      positionValide(positionClient)
    ) {
      const bounds = L.latLngBounds([
        [
          Number(positionLivreur.latitude),
          Number(positionLivreur.longitude),
        ],
        [
          Number(positionClient.latitude),
          Number(positionClient.longitude),
        ],
      ]);

      map.fitBounds(bounds, {
        padding: [55, 55],
        maxZoom: 16,
      });

      premierCadrage.current = false;

      return;
    }

    const position =
      positionLivreur || positionClient;

    if (positionValide(position)) {
      map.flyTo(
        [
          Number(position.latitude),
          Number(position.longitude),
        ],
        15,
        {
          duration: 0.8,
        },
      );

      premierCadrage.current = false;
    }
  }, [
    map,
    positionLivreur,
    positionClient,
    itineraire,
  ]);

  return null;
}

// ======================================================
// ITINÉRAIRE ROUTIER OSRM
// ======================================================

function ItineraireRoutier({
  positionLivreur,
  positionClient,
  onRouteUpdate,
}) {
  const [route, setRoute] = useState(null);

  const dernierePositionCalculee =
    useRef(null);

  useEffect(() => {
    if (
      !positionValide(positionLivreur) ||
      !positionValide(positionClient)
    ) {
      setRoute(null);
      onRouteUpdate(null);

      return;
    }

    const distanceDepuisDernierCalcul =
      dernierePositionCalculee.current
        ? calculerDistanceEntrePositions(
            dernierePositionCalculee.current,
            positionLivreur,
          )
        : Infinity;

    if (
      dernierePositionCalculee.current &&
      distanceDepuisDernierCalcul < 25
    ) {
      return;
    }

    const controller =
      new AbortController();

    const timer = setTimeout(
      async () => {
        try {
          const latitudeLivreur =
            Number(
              positionLivreur.latitude,
            );

          const longitudeLivreur =
            Number(
              positionLivreur.longitude,
            );

          const latitudeClient =
            Number(
              positionClient.latitude,
            );

          const longitudeClient =
            Number(
              positionClient.longitude,
            );

          const url =
            "https://router.project-osrm.org/route/v1/driving/" +
            `${longitudeLivreur},${latitudeLivreur};` +
            `${longitudeClient},${latitudeClient}` +
            "?overview=full&geometries=geojson&steps=true";

          const response = await fetch(
            url,
            {
              signal:
                controller.signal,
            },
          );

          if (!response.ok) {
            throw new Error(
              "Impossible de récupérer l'itinéraire",
            );
          }

          const data =
            await response.json();

          if (
            data.code !== "Ok" ||
            !Array.isArray(
              data.routes,
            ) ||
            data.routes.length === 0
          ) {
            throw new Error(
              "Aucun itinéraire trouvé",
            );
          }

          const routePrincipale =
            data.routes[0];

          const coordinates =
            routePrincipale.geometry.coordinates.map(
              ([
                longitude,
                latitude,
              ]) => [
                latitude,
                longitude,
              ],
            );

          const nouvelleRoute = {
            coordinates,
            distance:
              routePrincipale.distance,
            duration:
              routePrincipale.duration,
          };

          dernierePositionCalculee.current =
            {
              latitude:
                latitudeLivreur,
              longitude:
                longitudeLivreur,
            };

          setRoute(nouvelleRoute);

          onRouteUpdate(
            nouvelleRoute,
          );
        } catch (error) {
          if (
            error.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "Erreur calcul itinéraire :",
            error,
          );

          setRoute(null);

          onRouteUpdate(null);
        }
      },
      1200,
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    positionLivreur?.latitude,
    positionLivreur?.longitude,
    positionClient?.latitude,
    positionClient?.longitude,
    onRouteUpdate,
  ]);

  if (
    !route?.coordinates?.length
  ) {
    return null;
  }

  return (
    <>
      <Polyline
        positions={route.coordinates}
        pathOptions={{
          color: "#000000",
          weight: 9,
          opacity: 0.12,
        }}
      />

      <Polyline
        positions={route.coordinates}
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
// PAGE LIVREUR
// ======================================================

function LivreurAdmin() {
  const [livreur, setLivreur] =
    useState(null);

  const [
    commandesDisponibles,
    setCommandesDisponibles,
  ] = useState([]);

  const [mesCommandes, setMesCommandes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [erreur, setErreur] =
    useState("");

  const [
    commandeEnCours,
    setCommandeEnCours,
  ] = useState(null);

  const [
    positionClient,
    setPositionClient,
  ] = useState(null);

  const [
    positionLivreur,
    setPositionLivreur,
  ] = useState(null);

  const [
    itineraire,
    setItineraire,
  ] = useState(null);

  const navigate = useNavigate();

  const token =
    localStorage.getItem(
      "tokenLivreur",
    );

  const API_URL =
    import.meta.env.VITE_API_URL || "";

  const headers = {
    "Content-Type":
      "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ======================================================
  // DÉCONNEXION
  // ======================================================

  const deconnexion = () => {
    localStorage.removeItem(
      "tokenLivreur",
    );

    navigate(
      "/connexion-livreur",
      {
        replace: true,
      },
    );
  };

  // ======================================================
  // COMMANDES ACTIVES
  // ======================================================

  const commandesActives =
    mesCommandes.filter(
      (commande) =>
        commande.livraison?.livreurId &&
        commande.livraison.livreurId
          .toString() ===
          livreur?.id?.toString() &&
        [
          "ACCEPTED",
          "PICKING_UP",
          "IN_DELIVERY",
        ].includes(
          commande.livraison
            ?.statut,
        ),
    );

  // ======================================================
  // COMMANDE ACTUELLE
  // UNE SEULE IN_DELIVERY
  // ======================================================

  const commandeActive =
    commandesActives.find(
      (commande) =>
        commande.livraison
          ?.statut ===
        "IN_DELIVERY",
    );

  // ======================================================
  // COMMANDES ACCEPTÉES
  // ======================================================

  const commandesAcceptees =
    commandesActives.filter(
      (commande) =>
        commande.livraison
          ?.statut ===
        "ACCEPTED",
    );

  // ======================================================
  // COMMANDES EN RÉCUPÉRATION
  // ======================================================

  const commandesEnRecuperation =
    commandesActives.filter(
      (commande) =>
        commande.livraison
          ?.statut ===
        "PICKING_UP",
    );

  // ======================================================
  // CALLBACK ROUTE
  // ======================================================

  const mettreAJourItineraire =
    useCallback((route) => {
      setItineraire(route);
    }, []);

  // ======================================================
  // GPS TEMPS RÉEL DU LIVREUR
  // ======================================================

  useEffect(() => {
    if (!token) {
      return;
    }

    if (!navigator.geolocation) {
      console.error(
        "La géolocalisation n'est pas disponible.",
      );

      return;
    }

    if (
      livreur?.statut !==
        "AVAILABLE" &&
      livreur?.statut !==
        "BUSY"
    ) {
      return;
    }

    const envoyerPosition =
      async (position) => {
        try {
          const latitude =
            position.coords
              .latitude;

          const longitude =
            position.coords
              .longitude;

          setPositionLivreur({
            latitude,
            longitude,
          });

          const response =
            await fetch(
              `${API_URL}/api/livreurs/localisation`,
              {
                method: "PUT",
                headers: {
                  "Content-Type":
                    "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  latitude,
                  longitude,
                }),
              },
            );

          if (!response.ok) {
            const data =
              await response
                .json()
                .catch(
                  () => ({}),
                );

            throw new Error(
              data.message ||
                "Erreur mise à jour GPS",
            );
          }
        } catch (error) {
          console.error(
            "Erreur envoi GPS :",
            error,
          );
        }
      };

    const erreurGPS = (
      error,
    ) => {
      console.error(
        "Erreur GPS :",
        error.message,
      );
    };

    const watchId =
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
      navigator.geolocation.clearWatch(
        watchId,
      );
    };
  }, [
    token,
    API_URL,
    livreur?.statut,
  ]);

  // ======================================================
  // POSITION CLIENT INITIALE
  // ======================================================

  useEffect(() => {
    if (!commandeActive) {
      setPositionClient(null);
      setItineraire(null);

      return;
    }

    const localisation =
      commandeActive.client
        ?.localisation;

    if (
      localisation?.latitude !=
        null &&
      localisation?.longitude !=
        null
    ) {
      setPositionClient({
        latitude: Number(
          localisation.latitude,
        ),
        longitude: Number(
          localisation.longitude,
        ),
      });
    } else {
      setPositionClient(null);
    }
  }, [
    commandeActive?._id,
  ]);

  // ======================================================
  // POSITION LIVREUR INITIALE
  // ======================================================

  useEffect(() => {
    const localisation =
      livreur?.localisation;

    if (
      localisation?.latitude !=
        null &&
      localisation?.longitude !=
        null
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
  }, [
    livreur?.localisation
      ?.latitude,
    livreur?.localisation
      ?.longitude,
  ]);

  // ======================================================
  // SOCKET.IO
  // ======================================================

  useEffect(() => {
    if (!commandeActive?._id) {
      return;
    }

    const commandeId =
      commandeActive._id.toString();

    socket.emit(
      "join_commande",
      commandeId,
    );

    // ==================================================
    // POSITION CLIENT
    // ==================================================

    const handleClientPosition =
      (data) => {
        if (
          data?.commandeId
            ?.toString() !==
          commandeId
        ) {
          return;
        }

        const latitude =
          Number(data.latitude);

        const longitude =
          Number(data.longitude);

        if (
          !Number.isFinite(
            latitude,
          ) ||
          !Number.isFinite(
            longitude,
          )
        ) {
          return;
        }

        setPositionClient({
          latitude,
          longitude,
        });
      };

    // ==================================================
    // POSITION LIVREUR
    // ==================================================

    const handleLivreurPosition =
      (data) => {
        if (
          data?.commandeId
            ?.toString() !==
          commandeId
        ) {
          return;
        }

        const latitude =
          Number(data.latitude);

        const longitude =
          Number(data.longitude);

        if (
          !Number.isFinite(
            latitude,
          ) ||
          !Number.isFinite(
            longitude,
          )
        ) {
          return;
        }

        setPositionLivreur({
          latitude,
          longitude,
        });
      };

    socket.on(
      "client_position",
      handleClientPosition,
    );

    socket.on(
      "livreur_position",
      handleLivreurPosition,
    );

    return () => {
      socket.off(
        "client_position",
        handleClientPosition,
      );

      socket.off(
        "livreur_position",
        handleLivreurPosition,
      );

      socket.emit(
        "leave_commande",
        commandeId,
      );
    };
  }, [
    commandeActive?._id,
  ]);

  // ======================================================
  // PROFIL
  // ======================================================

  const chargerProfil =
    async () => {
      const response =
        await fetch(
          `${API_URL}/api/livreurs/profil`,
          {
            method: "GET",
            headers,
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger le profil",
        );
      }

      setLivreur(
        data.livreur,
      );
    };

  // ======================================================
  // COMMANDES DISPONIBLES
  // ======================================================

  const chargerCommandesDisponibles =
    async () => {
      const response =
        await fetch(
          `${API_URL}/api/livreurs/commandes-disponibles`,
          {
            method: "GET",
            headers,
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger les commandes disponibles",
        );
      }

      setCommandesDisponibles(
        data.commandes || [],
      );
    };

  // ======================================================
  // MES COMMANDES
  // ======================================================

  const chargerMesCommandes =
    async () => {
      const response =
        await fetch(
          `${API_URL}/api/livreurs/commandes`,
          {
            method: "GET",
            headers,
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger vos commandes",
        );
      }

      setMesCommandes(
        data.commandes || [],
      );
    };

  // ======================================================
  // CHARGEMENT GLOBAL
  // ======================================================

  const chargerTout =
    async (
      avecLoading = false,
    ) => {
      try {
        setErreur("");

        if (avecLoading) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        await Promise.all([
          chargerProfil(),
          chargerCommandesDisponibles(),
          chargerMesCommandes(),
        ]);
      } catch (error) {
        console.error(error);

        setErreur(
          error.message,
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  // ======================================================
  // INITIALISATION
  // ======================================================

  useEffect(() => {
    if (!token) {
      navigate(
        "/connexion-livreur",
        {
          replace: true,
        },
      );

      return;
    }

    chargerTout(true);
  }, [
    token,
    navigate,
  ]);

  // ======================================================
  // CHANGER STATUT
  // ======================================================

  const changerStatut =
    async (statut) => {
      try {
        setErreur("");
        setMessage("");

        if (statut === "BUSY") {
          return;
        }

        if (
          statut === "OFFLINE" &&
          commandeActive
        ) {
          setErreur(
            "Vous avez une livraison en cours. Terminez-la avant de passer hors ligne.",
          );

          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/livreurs/statut`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify({
                statut,
              }),
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de modifier le statut",
          );
        }

        setLivreur(
          (prev) => ({
            ...prev,
            statut:
              data.statut,
          }),
        );

        setMessage(
          "Votre disponibilité a été mise à jour.",
        );

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (error) {
        setErreur(
          error.message,
        );
      }
    };

  // ======================================================
  // ACCEPTER COMMANDE
  // ======================================================

  const accepterCommande =
    async (commandeId) => {
      try {
        setErreur("");
        setMessage("");

        setCommandeEnCours(
          commandeId,
        );

        const response =
          await fetch(
            `${API_URL}/api/livreurs/commandes/${commandeId}/accepter`,
            {
              method: "PUT",
              headers,
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible d'accepter la commande",
          );
        }

        setMessage(
          "Commande acceptée. Elle vous est maintenant attribuée.",
        );

        await chargerTout();
      } catch (error) {
        console.error(error);

        setErreur(
          error.message,
        );
      } finally {
        setCommandeEnCours(null);
      }
    };

  // ======================================================
  // ACCEPTED → PICKING_UP
  // ======================================================

  const commencerRecuperation =
    async (commandeId) => {
      try {
        setErreur("");
        setMessage("");

        setCommandeEnCours(
          commandeId,
        );

        const response =
          await fetch(
            `${API_URL}/api/livreurs/commandes/${commandeId}/commencer-recuperation`,
            {
              method: "PUT",
              headers,
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de commencer la récupération",
          );
        }

        setMessage(
          "Récupération de la commande commencée.",
        );

        await chargerTout();
      } catch (error) {
        console.error(error);

        setErreur(
          error.message,
        );
      } finally {
        setCommandeEnCours(null);
      }
    };

  // ======================================================
  // PICKING_UP → IN_DELIVERY
  // ======================================================

  const recupererCommande =
    async (commandeId) => {
      try {
        setErreur("");
        setMessage("");

        setCommandeEnCours(
          commandeId,
        );

        const response =
          await fetch(
            `${API_URL}/api/livreurs/commandes/${commandeId}/recuperer`,
            {
              method: "PUT",
              headers,
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de confirmer la récupération",
          );
        }

        setMessage(
          "Commande récupérée. Livraison en cours.",
        );

        await chargerTout();
      } catch (error) {
        console.error(error);

        setErreur(
          error.message,
        );
      } finally {
        setCommandeEnCours(null);
      }
    };

  // ======================================================
  // IN_DELIVERY → DELIVERED
  // ======================================================

  const livrerCommande =
    async (commandeId) => {
      try {
        setErreur("");
        setMessage("");

        setCommandeEnCours(
          commandeId,
        );

        const response =
          await fetch(
            `${API_URL}/api/livreurs/commandes/${commandeId}/livrer`,
            {
              method: "PUT",
              headers,
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de confirmer la livraison",
          );
        }

        setMessage(
          "Livraison terminée avec succès.",
        );

        setPositionClient(null);
        setItineraire(null);

        await chargerTout();
      } catch (error) {
        console.error(error);

        setErreur(
          error.message,
        );
      } finally {
        setCommandeEnCours(null);
      }
    };

  // ======================================================
  // FORMAT PRIX
  // ======================================================

  const formatPrix = (prix) =>
    Number(
      prix || 0,
    ).toLocaleString(
      "fr-FR",
    );

  // ======================================================
  // FORMAT DISTANCE
  // ======================================================

  const formatDistance =
    (metres) => {
      if (
        metres == null ||
        !Number.isFinite(
          Number(metres),
        )
      ) {
        return "—";
      }

      const valeur =
        Number(metres);

      if (valeur < 1000) {
        return `${Math.round(
          valeur,
        )} m`;
      }

      return `${(
        valeur / 1000
      ).toFixed(1)} km`;
    };

  // ======================================================
  // FORMAT DURÉE
  // ======================================================

  const formatDuree =
    (secondes) => {
      if (
        secondes == null ||
        !Number.isFinite(
          Number(secondes),
        )
      ) {
        return "—";
      }

      const minutes =
        Math.max(
          1,
          Math.round(
            Number(secondes) /
              60,
          ),
        );

      if (minutes < 60) {
        return `${minutes} min`;
      }

      const heures =
        Math.floor(
          minutes / 60,
        );

      const reste =
        minutes % 60;

      if (reste === 0) {
        return `${heures} h`;
      }

      return `${heures} h ${reste} min`;
    };

  // ======================================================
  // STATUTS
  // ======================================================

  const statutLabel = {
    OFFLINE: "Hors ligne",
    AVAILABLE: "Disponible",
    BUSY: "En livraison",
  };

  const livraisonLabel = {
    ACCEPTED: "Commande acceptée",
    PICKING_UP: "Récupération",
    IN_DELIVERY: "En livraison",
    DELIVERED: "Livrée",
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <LoadingPage>
        <LoadingLogo>
          NUMA
        </LoadingLogo>

        <LoadingSpinner />

        <LoadingText>
          Préparation de votre espace...
        </LoadingText>
      </LoadingPage>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <Page>
      {/* ==========================================
          HEADER
      ========================================== */}

      <Header>
        <HeaderInner>
          <Brand>
            NUMA
            <BrandDot />
          </Brand>

          <HeaderRight>
            <StatusPill
              $status={
                livreur?.statut
              }
            >
              <StatusDot
                $status={
                  livreur?.statut
                }
              />

              {statutLabel[
                livreur?.statut
              ] ||
                "Hors ligne"}
            </StatusPill>

            <RefreshButton
              onClick={() =>
                chargerTout()
              }
              disabled={
                refreshing
              }
            >
              <RefreshIcon
                $loading={
                  refreshing
                }
              >
                ↻
              </RefreshIcon>

              <span>
                {refreshing
                  ? "Actualisation..."
                  : "Actualiser"}
              </span>
            </RefreshButton>

            <LogoutButton
              onClick={
                deconnexion
              }
            >
              Déconnexion
            </LogoutButton>
          </HeaderRight>
        </HeaderInner>
      </Header>

      <Main>
        {/* ==========================================
            MESSAGES
        ========================================== */}

        {message && (
          <Alert $success>
            <AlertIcon>
              ✓
            </AlertIcon>

            <span>
              {message}
            </span>
          </Alert>
        )}

        {erreur && (
          <Alert>
            <AlertIcon>
              !
            </AlertIcon>

            <span>
              {erreur}
            </span>
          </Alert>
        )}

        {/* ==========================================
            HERO
        ========================================== */}

        <Hero>
          <HeroText>
            <Eyebrow>
              ESPACE LIVREUR
            </Eyebrow>

            <HeroTitle>
              Bonjour{" "}
              <HeroName>
                {livreur?.username ||
                  "Livreur"}
              </HeroName>
              .
            </HeroTitle>

            <HeroSubtitle>
              Gérez vos livraisons
              simplement,
              <br />
              depuis un seul endroit.
            </HeroSubtitle>
          </HeroText>

          <HeroAvatar>
            {livreur?.username
              ?.charAt(0)
              ?.toUpperCase() ||
              "L"}
          </HeroAvatar>
        </Hero>

        {/* ==========================================
            STATISTIQUES
        ========================================== */}

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatLabel>
                Disponibles
              </StatLabel>

              <StatIcon>
                ◉
              </StatIcon>
            </StatTop>

            <StatNumber>
              {
                commandesDisponibles.length
              }
            </StatNumber>

            <StatDescription>
              Commandes à prendre
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>
                Mes commandes
              </StatLabel>

              <StatIcon>
                ≡
              </StatIcon>
            </StatTop>

            <StatNumber>
              {
                mesCommandes.length
              }
            </StatNumber>

            <StatDescription>
              Commandes attribuées
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>
                En livraison
              </StatLabel>

              <StatIcon>
                ●
              </StatIcon>
            </StatTop>

            <StatNumber>
              {commandeActive
                ? "1"
                : "0"}
            </StatNumber>

            <StatDescription>
              Maximum une livraison à la fois
            </StatDescription>
          </StatCard>
        </StatsGrid>

        {/* ==========================================
            PROFIL
        ========================================== */}

        <Section>
          <SectionHeader>
            <div>
              <SectionEyebrow>
                VOTRE COMPTE
              </SectionEyebrow>

              <SectionTitle>
                Disponibilité
              </SectionTitle>

              <SectionDescription>
                Indiquez aux clients et au
                système si vous pouvez recevoir
                une livraison.
              </SectionDescription>
            </div>
          </SectionHeader>

          <ProfileCard>
            <ProfileInfo>
              <ProfileAvatar>
                {livreur?.username
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "L"}
              </ProfileAvatar>

              <div>
                <ProfileName>
                  {livreur?.username}
                </ProfileName>

                <ProfileEmail>
                  {livreur?.email}
                </ProfileEmail>

                <ProfilePhone>
                  {livreur?.telephone}
                </ProfilePhone>
              </div>
            </ProfileInfo>

            <StatusSelector>
              <StatusButton
                $active={
                  livreur?.statut ===
                  "AVAILABLE"
                }
                onClick={() =>
                  changerStatut(
                    "AVAILABLE",
                  )
                }
                disabled={
                  !!commandeActive
                }
              >
                <ButtonDot />

                Disponible
              </StatusButton>

              <StatusButton
                $active={
                  livreur?.statut ===
                  "OFFLINE"
                }
                onClick={() =>
                  changerStatut(
                    "OFFLINE",
                  )
                }
                disabled={
                  !!commandeActive
                }
              >
                <ButtonDot />

                Hors ligne
              </StatusButton>
            </StatusSelector>
          </ProfileCard>
        </Section>

        {/* ==========================================
            LIVRAISON ACTUELLE
        ========================================== */}

        {commandeActive && (
          <Section>
            <SectionHeader>
              <SectionEyebrow>
                MISSION EN COURS
              </SectionEyebrow>

              <SectionTitle>
                Livraison actuelle
              </SectionTitle>

              <SectionDescription>
                Cette section affiche uniquement
                la commande actuellement en route.
              </SectionDescription>
            </SectionHeader>

            <DeliveryCard>
              <DeliveryTop>
                <div>
                  <DeliveryLabel>
                    COMMANDE
                  </DeliveryLabel>

                  <DeliveryNumber>
                    #
                    {commandeActive._id.slice(
                      -6,
                    )}
                  </DeliveryNumber>
                </div>

                <DeliveryStatus
                  $status={
                    commandeActive
                      .livraison
                      ?.statut
                  }
                >
                  {livraisonLabel[
                    commandeActive
                      .livraison
                      ?.statut
                  ] ||
                    commandeActive
                      .livraison
                      ?.statut}
                </DeliveryStatus>
              </DeliveryTop>

              <DeliveryDivider />

              <DeliveryGrid>
                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    CLIENT
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {
                      commandeActive
                        .client
                        ?.prenom
                    }{" "}
                    {
                      commandeActive
                        .client
                        ?.nom
                    }
                  </DeliveryInfoValue>
                </DeliveryInfo>

                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    TÉLÉPHONE
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {commandeActive
                      .client
                      ?.numero ||
                      "Non renseigné"}
                  </DeliveryInfoValue>
                </DeliveryInfo>

                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    VILLE
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {commandeActive
                      .client
                      ?.ville ||
                      "Non renseignée"}
                  </DeliveryInfoValue>
                </DeliveryInfo>

                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    ADRESSE
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {commandeActive
                      .client
                      ?.adresse ||
                      "Non renseignée"}
                  </DeliveryInfoValue>
                </DeliveryInfo>
              </DeliveryGrid>

              {/* PRODUITS */}

              <DeliveryProducts>
                <DeliveryInfoLabel>
                  PRODUITS
                </DeliveryInfoLabel>

                {commandeActive
                  .panier
                  ?.map(
                    (
                      item,
                      index,
                    ) => (
                      <DeliveryProduct
                        key={
                          item._id ||
                          index
                        }
                      >
                        <span>
                          {
                            item.quantite
                          }{" "}
                          ×{" "}
                          {
                            item.nom
                          }
                        </span>

                        <strong>
                          {formatPrix(
                            item.prix *
                              item.quantite,
                          )}{" "}
                          FCFA
                        </strong>
                      </DeliveryProduct>
                    ),
                  )}
              </DeliveryProducts>

              {/* TOTAL */}

              <DeliveryTotal>
                <span>
                  Total produits
                </span>

                <strong>
                  {formatPrix(
                    commandeActive
                      .totalProduits,
                  )}{" "}
                  FCFA
                </strong>
              </DeliveryTotal>

              {/* ACTION */}

              <DeliveryAction>
                <DeliveryButton
                  onClick={() =>
                    livrerCommande(
                      commandeActive._id,
                    )
                  }
                  disabled={
                    commandeEnCours ===
                    commandeActive._id
                  }
                >
                  {commandeEnCours ===
                  commandeActive._id
                    ? "Confirmation..."
                    : "Confirmer la livraison"}

                  <span>
                    ✓
                  </span>
                </DeliveryButton>
              </DeliveryAction>

              {/* ========================================
                  CARTE TEMPS RÉEL
              ======================================== */}

              <MapSection>
                <MapHeader>
                  <div>
                    <MapTitle>
                      Suivi de la
                      livraison
                    </MapTitle>

                    <MapSubtitle>
                      Position du client et
                      itinéraire en temps
                      réel
                    </MapSubtitle>
                  </div>

                  <LiveBadge>
                    <LiveDot />
                    EN DIRECT
                  </LiveBadge>
                </MapHeader>

                {positionClient ||
                positionLivreur ? (
                  <>
                    <MapBox>
                      <MapContainer
                        center={[
                          Number(
                            positionLivreur
                              ?.latitude ??
                              positionClient
                                ?.latitude ??
                              5.3364,
                          ),
                          Number(
                            positionLivreur
                              ?.longitude ??
                              positionClient
                                ?.longitude ??
                              -4.0267,
                          ),
                        ]}
                        zoom={14}
                        scrollWheelZoom
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                        }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <AjusterCarte
                          positionLivreur={
                            positionLivreur
                          }
                          positionClient={
                            positionClient
                          }
                          itineraire={
                            itineraire
                          }
                        />

                        <ItineraireRoutier
                          positionLivreur={
                            positionLivreur
                          }
                          positionClient={
                            positionClient
                          }
                          onRouteUpdate={
                            mettreAJourItineraire
                          }
                        />

                        {/* LIVREUR */}

                        {positionValide(
                          positionLivreur,
                        ) && (
                          <Marker
                            position={[
                              Number(
                                positionLivreur.latitude,
                              ),
                              Number(
                                positionLivreur.longitude,
                              ),
                            ]}
                            icon={
                              livreurIcon
                            }
                            zIndexOffset={
                              1000
                            }
                          >
                            <Popup>
                              <strong>
                                🚴 Votre
                                position
                              </strong>

                              <br />

                              Position GPS
                              actuelle
                            </Popup>
                          </Marker>
                        )}

                        {/* CLIENT */}

                        {positionValide(
                          positionClient,
                        ) && (
                          <Marker
                            position={[
                              Number(
                                positionClient.latitude,
                              ),
                              Number(
                                positionClient.longitude,
                              ),
                            ]}
                            icon={
                              clientIcon
                            }
                            zIndexOffset={
                              900
                            }
                          >
                            <Popup>
                              <strong>
                                👤 Client
                              </strong>

                              <br />

                              {
                                commandeActive
                                  .client
                                  ?.prenom
                              }{" "}
                              {
                                commandeActive
                                  .client
                                  ?.nom
                              }

                              <br />

                              {commandeActive
                                .client
                                ?.adresse ||
                                "Adresse non renseignée"}
                            </Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </MapBox>

                    {/* INFORMATIONS ITINÉRAIRE */}

                    <RouteInfo>
                      <RouteInfoItem>
                        <RouteIcon>
                          🛣️
                        </RouteIcon>

                        <div>
                          <RouteLabel>
                            DISTANCE
                          </RouteLabel>

                          <RouteValue>
                            {positionClient &&
                            positionLivreur
                              ? itineraire
                                ? formatDistance(
                                    itineraire.distance,
                                  )
                                : "Calcul..."
                              : "—"}
                          </RouteValue>
                        </div>
                      </RouteInfoItem>

                      <RouteSeparator />

                      <RouteInfoItem>
                        <RouteIcon>
                          ⏱️
                        </RouteIcon>

                        <div>
                          <RouteLabel>
                            TEMPS ESTIMÉ
                          </RouteLabel>

                          <RouteValue>
                            {positionClient &&
                            positionLivreur
                              ? itineraire
                                ? formatDuree(
                                    itineraire.duration,
                                  )
                                : "Calcul..."
                              : "—"}
                          </RouteValue>
                        </div>
                      </RouteInfoItem>

                      <RouteSeparator />

                      <RouteInfoItem>
                        <RouteIcon>
                          📍
                        </RouteIcon>

                        <RouteAddress>
                          <RouteLabel>
                            DESTINATION
                          </RouteLabel>

                          <RouteValue>
                            {commandeActive
                              .client
                              ?.adresse ||
                              "Adresse client"}
                          </RouteValue>
                        </RouteAddress>
                      </RouteInfoItem>
                    </RouteInfo>

                    {/* ÉTAT GPS */}

                    <GpsStatusGrid>
                      <GpsStatus
                        $active={
                          !!positionLivreur
                        }
                      >
                        <GpsIndicator
                          $active={
                            !!positionLivreur
                          }
                        />

                        <div>
                          <GpsTitle>
                            Votre GPS
                          </GpsTitle>

                          <GpsText>
                            {positionLivreur
                              ? "Position reçue"
                              : "En attente..."}
                          </GpsText>
                        </div>
                      </GpsStatus>

                      <GpsStatus
                        $active={
                          !!positionClient
                        }
                      >
                        <GpsIndicator
                          $active={
                            !!positionClient
                          }
                        />

                        <div>
                          <GpsTitle>
                            GPS client
                          </GpsTitle>

                          <GpsText>
                            {positionClient
                              ? "Position reçue"
                              : "En attente du client..."}
                          </GpsText>
                        </div>
                      </GpsStatus>
                    </GpsStatusGrid>

                    {!positionClient && (
                      <GpsWarning>
                        <span>
                          📍
                        </span>

                        <div>
                          <strong>
                            Position du
                            client en attente
                          </strong>

                          <p>
                            Le client doit
                            ouvrir sa page de
                            suivi et autoriser
                            la géolocalisation
                            pour apparaître sur
                            votre carte.
                          </p>
                        </div>
                      </GpsWarning>
                    )}
                  </>
                ) : (
                  <MapEmpty>
                    <MapEmptyIcon>
                      📍
                    </MapEmptyIcon>

                    <strong>
                      Position GPS
                      indisponible
                    </strong>

                    <span>
                      La carte apparaîtra dès
                      que le livreur ou le
                      client partagera sa
                      position.
                    </span>
                  </MapEmpty>
                )}
              </MapSection>
            </DeliveryCard>
          </Section>
        )}

        {/* ==========================================
            COMMANDES DISPONIBLES
        ========================================== */}

        <Section>
          <SectionHeaderRow>
            <div>
              <SectionEyebrow>
                À VOUS DE JOUER
              </SectionEyebrow>

              <SectionTitle>
                Commandes disponibles
              </SectionTitle>

              <SectionDescription>
                Les nouvelles commandes en
                attente d'un livreur.
              </SectionDescription>
            </div>

            <CountBadge>
              {
                commandesDisponibles.length
              }
            </CountBadge>
          </SectionHeaderRow>

          {commandesDisponibles.length ===
          0 ? (
            <EmptyCard>
              <EmptyIcon>
                ✓
              </EmptyIcon>

              <EmptyTitle>
                Tout est calme pour le
                moment.
              </EmptyTitle>

              <EmptyText>
                Aucune nouvelle commande
                n'attend actuellement un
                livreur.
              </EmptyText>

              <EmptyButton
                onClick={() =>
                  chargerTout()
                }
              >
                Vérifier à nouveau
              </EmptyButton>
            </EmptyCard>
          ) : (
            <OrdersGrid>
              {commandesDisponibles.map(
                (commande) => (
                  <OrderCard
                    key={
                      commande._id
                    }
                  >
                    <OrderHeader>
                      <div>
                        <OrderEyebrow>
                          COMMANDE
                        </OrderEyebrow>

                        <OrderNumber>
                          #
                          {commande._id.slice(
                            -6,
                          )}
                        </OrderNumber>
                      </div>

                      <OrderBadge>
                        Nouvelle
                      </OrderBadge>
                    </OrderHeader>

                    <OrderPrice>
                      {formatPrix(
                        commande.totalProduits,
                      )}{" "}
                      <small>
                        FCFA
                      </small>
                    </OrderPrice>

                    <OrderDivider />

                    <InfoList>
                      <InfoRow>
                        <InfoIcon>
                          ●
                        </InfoIcon>

                        <InfoContent>
                          <InfoLabel>
                            CLIENT
                          </InfoLabel>

                          <InfoValue>
                            {commande
                              .client
                              ?.username ||
                              commande
                                .client
                                ?.nom ||
                              "Client"}
                          </InfoValue>
                        </InfoContent>
                      </InfoRow>

                      <InfoRow>
                        <InfoIcon>
                          ◉
                        </InfoIcon>

                        <InfoContent>
                          <InfoLabel>
                            VILLE
                          </InfoLabel>

                          <InfoValue>
                            {commande
                              .client
                              ?.ville ||
                              "Non renseignée"}
                          </InfoValue>
                        </InfoContent>
                      </InfoRow>

                      <InfoRow>
                        <InfoIcon>
                          ⌖
                        </InfoIcon>

                        <InfoContent>
                          <InfoLabel>
                            ADRESSE
                          </InfoLabel>

                          <InfoValue>
                            {commande
                              .client
                              ?.adresse ||
                              "Non renseignée"}
                          </InfoValue>
                        </InfoContent>
                      </InfoRow>

                      <InfoRow>
                        <InfoIcon>
                          ●
                        </InfoIcon>

                        <InfoContent>
                          <InfoLabel>
                            NUMÉRO
                          </InfoLabel>

                          <InfoValue>
                            {commande
                              .client
                              ?.numero ||
                              "Non renseigné"}
                          </InfoValue>
                        </InfoContent>
                      </InfoRow>
                    </InfoList>

                    <OrderFooter>
                      <ArticleCount>
                        {commande
                          .panier
                          ?.length ||
                          0}{" "}
                        article
                        {commande
                          .panier
                          ?.length >
                        1
                          ? "s"
                          : ""}
                      </ArticleCount>

                      <AcceptButton
                        onClick={() =>
                          accepterCommande(
                            commande._id,
                          )
                        }
                        disabled={
                          commandeEnCours ===
                          commande._id
                        }
                      >
                        {commandeEnCours ===
                        commande._id
                          ? "Acceptation..."
                          : "Accepter"}

                        <span>
                          →
                        </span>
                      </AcceptButton>
                    </OrderFooter>
                  </OrderCard>
                ),
              )}
            </OrdersGrid>
          )}
        </Section>

        {/* ==========================================
            MES COMMANDES
        ========================================== */}

        <Section>
          <SectionHeaderRow>
            <div>
              <SectionEyebrow>
                VOTRE ACTIVITÉ
              </SectionEyebrow>

              <SectionTitle>
                Mes commandes
              </SectionTitle>

              <SectionDescription>
                Toutes les commandes qui vous
                sont actuellement attribuées.
              </SectionDescription>
            </div>

            <CountBadge>
              {
                mesCommandes.length
              }
            </CountBadge>
          </SectionHeaderRow>

          {mesCommandes.length ===
          0 ? (
            <EmptyCard>
              <EmptyIcon>
                —
              </EmptyIcon>

              <EmptyTitle>
                Aucune commande.
              </EmptyTitle>

              <EmptyText>
                Vos commandes apparaîtront
                ici lorsqu'elles vous seront
                attribuées.
              </EmptyText>
            </EmptyCard>
          ) : (
            <MyOrders>
              {mesCommandes.map(
                (commande) => {
                  const statut =
                    commande
                      .livraison
                      ?.statut;

                  const enTraitement =
                    commandeEnCours ===
                    commande._id;

                  return (
                    <MyOrderCard
                      key={
                        commande._id
                      }
                    >
                      <MyOrderMain>
                        <MyOrderNumber>
                          #
                          {commande._id.slice(
                            -6,
                          )}
                        </MyOrderNumber>

                        <MyOrderLocation>
                          {commande
                            .client
                            ?.ville ||
                            "Ville inconnue"}
                        </MyOrderLocation>

                        <MyOrderAddress>
                          {commande
                            .client
                            ?.adresse ||
                            "Adresse non renseignée"}
                        </MyOrderAddress>
                      </MyOrderMain>

                      <MyOrderStatus
                        $status={
                          statut
                        }
                      >
                        {livraisonLabel[
                          statut
                        ] ||
                          statut ||
                          "INCONNU"}
                      </MyOrderStatus>

                      <MyOrderPrice>
                        {formatPrix(
                          commande.totalProduits,
                        )}{" "}
                        FCFA
                      </MyOrderPrice>

                      <MyOrderAction>
                        {statut ===
                          "ACCEPTED" && (
                          <SmallActionButton
                            onClick={() =>
                              commencerRecuperation(
                                commande._id,
                              )
                            }
                            disabled={
                              enTraitement
                            }
                          >
                            {enTraitement
                              ? "Préparation..."
                              : "Commencer la récupération"}

                            <span>
                              →
                            </span>
                          </SmallActionButton>
                        )}

                        {statut ===
                          "PICKING_UP" && (
                          <SmallActionButton
                            onClick={() =>
                              recupererCommande(
                                commande._id,
                              )
                            }
                            disabled={
                              enTraitement
                            }
                          >
                            {enTraitement
                              ? "Confirmation..."
                              : "J'ai récupéré"}

                            <span>
                              →
                            </span>
                          </SmallActionButton>
                        )}

                        {statut ===
                          "IN_DELIVERY" && (
                          <SmallActionButton
                            onClick={() =>
                              livrerCommande(
                                commande._id,
                              )
                            }
                            disabled={
                              enTraitement
                            }
                          >
                            {enTraitement
                              ? "Confirmation..."
                              : "Confirmer la livraison"}

                            <span>
                              ✓
                            </span>
                          </SmallActionButton>
                        )}

                        {statut ===
                          "DELIVERED" && (
                          <DeliveredLabel>
                            Terminée
                          </DeliveredLabel>
                        )}
                      </MyOrderAction>
                    </MyOrderCard>
                  );
                },
              )}
            </MyOrders>
          )}
        </Section>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <Footer>
          <FooterBrand>
            NUMA
          </FooterBrand>

          <FooterText>
            Espace professionnel livreur
          </FooterText>
        </Footer>
      </Main>
    </Page>
  );
}

// ======================================================
// STYLED COMPONENTS
// ======================================================

const Page = styled.div`
  min-height: 100vh;
  background: #f5f5f7;
  color: #1d1d1f;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid
    rgba(0, 0, 0, 0.07);
  backdrop-filter: blur(20px);
`;

const HeaderInner = styled.div`
  width: min(
    1180px,
    calc(100% - 40px)
  );
  min-height: 72px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 650px) {
    width: min(
      calc(100% - 24px),
      1180px
    );
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const BrandDot = styled.span`
  width: 6px;
  height: 6px;
  margin: 5px 0 0 3px;
  border-radius: 50%;
  background: #0071e3;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 650px) {
    gap: 6px;
  }
`;

const StatusPill = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 13px;
  background: ${({ $status }) =>
    $status === "AVAILABLE"
      ? "#ecfdf3"
      : $status === "BUSY"
        ? "#fff7ed"
        : "#f2f2f4"};
  border-radius: 999px;
  color: ${({ $status }) =>
    $status === "AVAILABLE"
      ? "#087a35"
      : $status === "BUSY"
        ? "#b45309"
        : "#6e6e73"};
  font-size: 12px;
  font-weight: 750;

  @media (max-width: 500px) {
    padding: 0 10px;
    font-size: 11px;
  }
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === "AVAILABLE"
      ? "#16a34a"
      : $status === "BUSY"
        ? "#f59e0b"
        : "#8e8e93"};
`;

const RefreshButton = styled.button`
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dedee3;
  border-radius: 11px;
  background: white;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f7f7f8;
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }

  @media (max-width: 500px) {
    span {
      display: none;
    }
  }
`;

const RefreshIcon = styled.span`
  display: inline-block;
  font-size: 18px;
  animation: ${({ $loading }) =>
    $loading
      ? "rotation 0.8s linear infinite"
      : "none"};

  @keyframes rotation {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

const LogoutButton = styled.button`
  min-height: 38px;
  padding: 0 13px;
  border: 0;
  border-radius: 11px;
  background: #111;
  color: white;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;

  &:hover {
    background: #2c2c2e;
  }

  @media (max-width: 500px) {
    padding: 0 10px;
    font-size: 10px;
  }
`;

const Main = styled.main`
  width: min(
    1180px,
    calc(100% - 40px)
  );
  margin: 0 auto;
  padding: 40px 0 60px;

  @media (max-width: 650px) {
    width: min(
      calc(100% - 24px),
      1180px
    );
    padding-top: 25px;
  }
`;

const Alert = styled.div`
  margin-bottom: 16px;
  padding: 13px 15px;
  border-radius: 13px;
  background: ${({ $success }) =>
    $success
      ? "#ecfdf3"
      : "#fff0f0"};
  border: 1px solid
    ${({ $success }) =>
      $success
        ? "#c5f1d3"
        : "#ffd1d1"};
  color: ${({ $success }) =>
    $success
      ? "#087a35"
      : "#bb1e1e"};
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 650;
`;

const AlertIcon = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: currentColor;
  color: white;
  display: grid;
  place-items: center;
  font-size: 12px;
`;

const Hero = styled.section`
  min-height: 270px;
  padding: 45px;
  margin-bottom: 28px;
  border-radius: 30px;
  background: #111;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  @media (max-width: 650px) {
    min-height: 220px;
    padding: 30px 24px;
    border-radius: 22px;
  }
`;

const HeroText = styled.div``;

const Eyebrow = styled.div`
  margin-bottom: 16px;
  color: #a1a1a6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(
    36px,
    6vw,
    62px
  );
  line-height: 0.98;
  letter-spacing: -3px;
`;

const HeroName = styled.span`
  color: #8e8e93;
`;

const HeroSubtitle = styled.p`
  margin: 22px 0 0;
  color: #b9b9bd;
  font-size: 16px;
  line-height: 1.6;
`;

const HeroAvatar = styled.div`
  width: 115px;
  height: 115px;
  border-radius: 50%;
  background: #242426;
  border: 1px solid #333336;
  display: grid;
  place-items: center;
  font-size: 42px;
  font-weight: 800;

  @media (max-width: 650px) {
    width: 70px;
    height: 70px;
    font-size: 26px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    3,
    minmax(0, 1fr)
  );
  gap: 15px;
  margin-bottom: 55px;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  min-height: 165px;
  padding: 23px;
  background: white;
  border: 1px solid #e7e7ea;
  border-radius: 20px;
`;

const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StatLabel = styled.div`
  color: #6e6e73;
  font-size: 12px;
  font-weight: 700;
`;

const StatIcon = styled.div`
  color: #a1a1a6;
`;

const StatNumber = styled.div`
  margin-top: 23px;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -1.5px;
`;

const StatDescription = styled.div`
  margin-top: 5px;
  color: #9a9a9f;
  font-size: 11px;
`;

const Section = styled.section`
  margin-top: 55px;
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

const SectionHeaderRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
`;

const SectionEyebrow = styled.div`
  margin-bottom: 7px;
  color: #86868b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.3px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #1d1d1f;
  font-size: 27px;
  line-height: 1.15;
  letter-spacing: -1px;
`;

const SectionDescription = styled.p`
  max-width: 570px;
  margin: 8px 0 0;
  color: #86868b;
  font-size: 13px;
  line-height: 1.6;
`;

const ProfileCard = styled.div`
  padding: 24px;
  border-radius: 21px;
  background: white;
  border: 1px solid #e7e7ea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProfileAvatar = styled.div`
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #111;
  color: white;
  display: grid;
  place-items: center;
  font-size: 21px;
  font-weight: 800;
`;

const ProfileName = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

const ProfileEmail = styled.div`
  margin-top: 3px;
  color: #86868b;
  font-size: 12px;
`;

const ProfilePhone = styled.div`
  margin-top: 2px;
  color: #86868b;
  font-size: 12px;
`;

const StatusSelector = styled.div`
  padding: 4px;
  border-radius: 13px;
  background: #f1f1f3;
  display: flex;
  gap: 4px;

  @media (max-width: 650px) {
    width: 100%;
  }
`;

const StatusButton = styled.button`
  min-height: 42px;
  padding: 0 17px;
  border: 0;
  border-radius: 10px;
  background: ${({ $active }) =>
    $active
      ? "white"
      : "transparent"};
  color: ${({ $active }) =>
    $active
      ? "#111"
      : "#86868b"};
  box-shadow: ${({ $active }) =>
    $active
      ? "0 2px 8px rgba(0,0,0,.06)"
      : "none"};
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 650px) {
    flex: 1;
    justify-content: center;
  }
`;

const ButtonDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`;

const DeliveryCard = styled.div`
  padding: 28px;
  border-radius: 25px;
  background: #111;
  color: white;

  @media (max-width: 650px) {
    padding: 20px;
    border-radius: 20px;
  }
`;

const DeliveryTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`;

const DeliveryLabel = styled.div`
  color: #77777d;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
`;

const DeliveryNumber = styled.div`
  margin-top: 4px;
  font-size: 22px;
  font-weight: 800;
`;

const DeliveryStatus = styled.div`
  padding: 8px 11px;
  border-radius: 999px;
  background: ${({ $status }) =>
    $status ===
    "IN_DELIVERY"
      ? "#ecfdf3"
      : "#29292c"};
  color: ${({ $status }) =>
    $status ===
    "IN_DELIVERY"
      ? "#138a42"
      : "#d6d6da"};
  font-size: 10px;
  font-weight: 750;
`;

const DeliveryDivider = styled.div`
  height: 1px;
  margin: 23px 0;
  background: #29292c;
`;

const DeliveryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    4,
    minmax(0, 1fr)
  );
  gap: 25px;

  @media (max-width: 800px) {
    grid-template-columns: repeat(
      2,
      1fr
    );
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

const DeliveryInfo = styled.div`
  min-width: 0;
`;

const DeliveryInfoLabel = styled.div`
  margin-bottom: 5px;
  color: #77777d;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
`;

const DeliveryInfoValue = styled.div`
  font-size: 13px;
  font-weight: 650;
  overflow-wrap: anywhere;
`;

const DeliveryProducts = styled.div`
  margin-top: 26px;
  padding: 18px;
  background: #1b1b1d;
  border-radius: 15px;
`;

const DeliveryProduct = styled.div`
  padding: 9px 0;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  border-bottom: 1px solid #2b2b2e;
  font-size: 12px;

  &:last-child {
    border-bottom: 0;
  }

  span {
    color: #c3c3c7;
  }

  strong {
    white-space: nowrap;
  }
`;

const DeliveryTotal = styled.div`
  padding: 18px 0;
  display: flex;
  justify-content: space-between;
  font-size: 13px;

  strong {
    font-size: 15px;
  }
`;

const DeliveryAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DeliveryButton = styled.button`
  min-height: 48px;
  padding: 0 20px;
  border: none;
  border-radius: 13px;
  background: white;
  color: #111;
  display: flex;
  align-items: center;
  gap: 25px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #eeeeef;
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }

  @media (max-width: 550px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// ======================================================
// CARTE
// ======================================================

const MapSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: white;
  color: #1d1d1f;
  border-radius: 20px;

  @media (max-width: 550px) {
    padding: 14px;
  }
`;

const MapHeader = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
`;

const MapTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

const MapSubtitle = styled.div`
  margin-top: 3px;
  color: #86868b;
  font-size: 11px;
`;

const LiveBadge = styled.div`
  flex-shrink: 0;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #138a42;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.5px;
`;

const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  box-shadow: 0 0 0 4px
    rgba(22, 163, 74, 0.12);
`;

const MapBox = styled.div`
  width: 100%;
  height: 460px;
  overflow: hidden;
  border-radius: 17px;
  border: 1px solid #e5e5e7;

  .leaflet-container {
    font-family: inherit;
    background: #eeeeef;
  }

  .leaflet-control-zoom {
    border: none;
    box-shadow: 0 4px 18px
      rgba(0, 0, 0, 0.12);
  }

  .leaflet-control-zoom a {
    border: 0;
  }

  @media (max-width: 700px) {
    height: 390px;
  }

  @media (max-width: 450px) {
    height: 340px;
  }
`;

const RouteInfo = styled.div`
  margin-top: 13px;
  padding: 14px 16px;
  border: 1px solid #e7e7ea;
  border-radius: 15px;
  background: #f7f7f8;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    gap: 11px;
  }
`;

const RouteInfoItem = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RouteIcon = styled.div`
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #e4e4e7;
  background: white;
  display: grid;
  place-items: center;
  font-size: 16px;
`;

const RouteAddress = styled.div`
  min-width: 0;
`;

const RouteLabel = styled.div`
  color: #86868b;
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 0.8px;
`;

const RouteValue = styled.div`
  margin-top: 2px;
  color: #1d1d1f;
  font-size: 13px;
  font-weight: 750;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RouteSeparator = styled.div`
  width: 1px;
  height: 34px;
  flex-shrink: 0;
  background: #dedee1;

  @media (max-width: 720px) {
    width: 100%;
    height: 1px;
  }
`;

const GpsStatusGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(
    2,
    minmax(0, 1fr)
  );
  gap: 10px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const GpsStatus = styled.div`
  min-height: 58px;
  padding: 10px 13px;
  border: 1px solid
    ${({ $active }) =>
      $active
        ? "#cfeedd"
        : "#e6e6e9"};
  border-radius: 13px;
  background: ${({ $active }) =>
    $active
      ? "#f4fff8"
      : "#fafafa"};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GpsIndicator = styled.div`
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $active }) =>
    $active
      ? "#16a34a"
      : "#b8b8bd"};
  box-shadow: ${({ $active }) =>
    $active
      ? "0 0 0 5px rgba(22,163,74,.10)"
      : "none"};
`;

const GpsTitle = styled.div`
  font-size: 11px;
  font-weight: 800;
`;

const GpsText = styled.div`
  margin-top: 2px;
  color: #86868b;
  font-size: 10px;
`;

const GpsWarning = styled.div`
  margin-top: 12px;
  padding: 13px;
  border-radius: 13px;
  border: 1px solid #ffe1a8;
  background: #fffaf0;
  color: #8a5b08;
  display: flex;
  gap: 10px;
  font-size: 11px;

  strong {
    font-size: 11px;
  }

  p {
    margin: 3px 0 0;
    color: #9a711f;
    line-height: 1.5;
  }
`;

const MapEmpty = styled.div`
  min-height: 260px;
  border-radius: 17px;
  border: 1px dashed #d9d9dd;
  background: #f7f7f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  text-align: center;

  strong {
    font-size: 14px;
  }

  span {
    max-width: 340px;
    color: #86868b;
    font-size: 11px;
    line-height: 1.5;
  }
`;

const MapEmptyIcon = styled.div`
  margin-bottom: 3px;
  font-size: 28px;
`;

// ======================================================
// COMMANDES DISPONIBLES
// ======================================================

const CountBadge = styled.div`
  min-width: 35px;
  height: 35px;
  padding: 0 10px;
  border-radius: 999px;
  background: #111;
  color: white;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    2,
    minmax(0, 1fr)
  );
  gap: 15px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const OrderCard = styled.div`
  padding: 22px;
  background: white;
  border: 1px solid #e6e6e9;
  border-radius: 20px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const OrderEyebrow = styled.div`
  color: #9a9a9f;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
`;

const OrderNumber = styled.div`
  margin-top: 3px;
  font-size: 18px;
  font-weight: 800;
`;

const OrderBadge = styled.div`
  padding: 6px 9px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #138a42;
  font-size: 9px;
  font-weight: 800;
`;

const OrderPrice = styled.div`
  margin-top: 20px;
  font-size: 28px;
  font-weight: 850;
  letter-spacing: -1px;

  small {
    font-size: 11px;
    color: #86868b;
    letter-spacing: 0;
  }
`;

const OrderDivider = styled.div`
  height: 1px;
  margin: 20px 0;
  background: #ededf0;
`;

const InfoList = styled.div`
  display: grid;
  gap: 13px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 10px;
`;

const InfoIcon = styled.div`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: #86868b;
  font-size: 10px;
  background: #f4f4f5;
  border-radius: 8px;
`;

const InfoContent = styled.div`
  min-width: 0;
`;

const InfoLabel = styled.div`
  color: #9a9a9f;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.7px;
`;

const InfoValue = styled.div`
  margin-top: 1px;
  font-size: 12px;
  font-weight: 650;
  overflow-wrap: anywhere;
`;

const OrderFooter = styled.div`
  margin-top: 20px;
  padding-top: 17px;
  border-top: 1px solid #ededf0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
`;

const ArticleCount = styled.div`
  color: #86868b;
  font-size: 10px;
`;

const AcceptButton = styled.button`
  min-height: 40px;
  padding: 0 15px;
  border: 0;
  border-radius: 10px;
  background: #111;
  color: white;
  display: flex;
  align-items: center;
  gap: 13px;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #2c2c2e;
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

// ======================================================
// MES COMMANDES
// ======================================================

const MyOrders = styled.div`
  display: grid;
  gap: 10px;
`;

const MyOrderCard = styled.div`
  padding: 18px 20px;
  background: white;
  border: 1px solid #e7e7ea;
  border-radius: 16px;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    auto
    auto
    auto;

  align-items: center;
  gap: 20px;

  @media (max-width: 850px) {
    grid-template-columns:
      minmax(0, 1fr)
      auto;

    ${MyOrderAction} {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 10px;

    ${MyOrderAction} {
      grid-column: auto;
    }
  }
`;

const MyOrderMain = styled.div`
  min-width: 0;
`;

const MyOrderNumber = styled.div`
  font-size: 13px;
  font-weight: 800;
`;

const MyOrderLocation = styled.div`
  margin-top: 5px;
  font-size: 12px;
  font-weight: 650;
`;

const MyOrderAddress = styled.div`
  margin-top: 2px;
  color: #86868b;
  font-size: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const MyOrderStatus = styled.div`
  padding: 7px 10px;
  border-radius: 999px;

  background: ${({ $status }) =>
    $status === "DELIVERED"
      ? "#ecfdf3"
      : $status === "IN_DELIVERY"
        ? "#eef6ff"
        : $status ===
            "PICKING_UP"
          ? "#fff7ed"
          : "#f2f2f4"};

  color: ${({ $status }) =>
    $status === "DELIVERED"
      ? "#138a42"
      : $status === "IN_DELIVERY"
        ? "#0071e3"
        : $status ===
            "PICKING_UP"
          ? "#b45309"
          : "#6e6e73"};

  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
`;

const MyOrderPrice = styled.div`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 800;
`;

const MyOrderAction = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: 190px;

  @media (max-width: 650px) {
    justify-content: stretch;
    min-width: 0;
  }
`;

const SmallActionButton =
  styled.button`
    min-height: 38px;
    padding: 0 13px;
    border: 0;
    border-radius: 10px;
    background: #111;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    font-size: 10px;
    font-weight: 750;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: #2c2c2e;
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }

    @media (max-width: 650px) {
      width: 100%;
    }
  `;

const DeliveredLabel = styled.div`
  padding: 9px 11px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #138a42;
  font-size: 9px;
  font-weight: 800;
`;

// ======================================================
// EMPTY
// ======================================================

const EmptyCard = styled.div`
  min-height: 245px;
  padding: 25px;
  border: 1px dashed #d4d4d8;
  border-radius: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f1f1f3;
  color: #77777c;
  display: grid;
  place-items: center;
  margin-bottom: 12px;
  font-weight: 800;
`;

const EmptyTitle = styled.div`
  font-size: 15px;
  font-weight: 800;
`;

const EmptyText = styled.div`
  max-width: 380px;
  margin-top: 6px;
  color: #86868b;
  font-size: 11px;
  line-height: 1.55;
`;

const EmptyButton = styled.button`
  margin-top: 16px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dedee2;
  border-radius: 10px;
  background: white;
  font-size: 10px;
  font-weight: 750;
  cursor: pointer;

  &:hover {
    background: #f5f5f7;
  }
`;

// ======================================================
// FOOTER
// ======================================================

const Footer = styled.footer`
  margin-top: 70px;
  padding: 25px 0 10px;
  border-top: 1px solid #dedee1;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  color: #86868b;
`;

const FooterBrand = styled.div`
  color: #1d1d1f;
  font-size: 12px;
  font-weight: 900;
`;

const FooterText = styled.div`
  font-size: 10px;
`;

// ======================================================
// LOADING
// ======================================================

const LoadingPage = styled.div`
  min-height: 100vh;
  background: #f5f5f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingLogo = styled.div`
  margin-bottom: 25px;
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid #dedee2;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 14px;
  color: #86868b;
  font-size: 11px;
`;

export default LivreurAdmin;