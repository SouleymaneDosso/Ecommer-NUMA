import { useEffect, useState } from "react";

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
// AJUSTEMENT AUTOMATIQUE DE LA CARTE
// ======================================================

function AjusterCarte({ positionLivreur, positionClient }) {
  const map = useMap();

  useEffect(() => {
    if (positionLivreur && positionClient) {
      const bounds = L.latLngBounds([
        [positionLivreur.latitude, positionLivreur.longitude],
        [positionClient.latitude, positionClient.longitude],
      ]);

      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16,
      });

      return;
    }

    const position = positionLivreur || positionClient;

    if (position) {
      map.flyTo([position.latitude, position.longitude], 15, {
        duration: 0.8,
      });
    }
  }, [map, positionLivreur, positionClient]);

  return null;
}

// ======================================================
// PAGE LIVREUR ADMIN
// ======================================================

function LivreurAdmin() {
  const [livreur, setLivreur] = useState(null);

  const [commandesDisponibles, setCommandesDisponibles] = useState([]);

  const [mesCommandes, setMesCommandes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState("");

  const [erreur, setErreur] = useState("");

  const [commandeEnCours, setCommandeEnCours] = useState(null);

  const [positionClient, setPositionClient] = useState(null);

  const [positionLivreur, setPositionLivreur] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("tokenLivreur");

  const API_URL = import.meta.env.VITE_API_URL;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ======================================================
  // COMMANDE ACTIVE
  // ======================================================

  const commandeActive = mesCommandes.find(
    (commande) =>
      commande.livraison?.livreurId &&
      commande.livraison.livreurId.toString() ===
        livreur?.id?.toString() &&
      ["ACCEPTED", "PICKING_UP", "IN_DELIVERY"].includes(
        commande.livraison?.statut,
      ),
  );

  // ======================================================
  // GPS TEMPS RÉEL DU LIVREUR
  // ======================================================

  useEffect(() => {
    if (!token) return;

    if (!navigator.geolocation) {
      console.error("La géolocalisation n'est pas disponible.");
      return;
    }

    if (
      livreur?.statut !== "AVAILABLE" &&
      livreur?.statut !== "BUSY"
    ) {
      return;
    }

    const envoyerPosition = async (position) => {
      try {
        const latitude = position.coords.latitude;

        const longitude = position.coords.longitude;

        // Mise à jour immédiate de la position locale
        setPositionLivreur({
          latitude,
          longitude,
        });

        await fetch(`${API_URL}/api/livreurs/localisation`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude,
            longitude,
          }),
        });
      } catch (error) {
        console.error("Erreur envoi GPS :", error);
      }
    };

    const erreurGPS = (error) => {
      console.error("Erreur GPS :", error.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      envoyerPosition,
      erreurGPS,
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [token, API_URL, livreur?.statut]);

  // ======================================================
  // POSITION CLIENT INITIALE
  // ======================================================

  useEffect(() => {
    if (!commandeActive) {
      setPositionClient(null);
      return;
    }

    const localisation = commandeActive.client?.localisation;

    if (
      localisation?.latitude != null &&
      localisation?.longitude != null
    ) {
      setPositionClient({
        latitude: Number(localisation.latitude),
        longitude: Number(localisation.longitude),
      });
    } else {
      setPositionClient(null);
    }
  }, [commandeActive]);

  // ======================================================
  // POSITION LIVREUR INITIALE
  // ======================================================

  useEffect(() => {
    const localisation = livreur?.localisation;

    if (
      localisation?.latitude != null &&
      localisation?.longitude != null
    ) {
      setPositionLivreur({
        latitude: Number(localisation.latitude),
        longitude: Number(localisation.longitude),
      });
    }
  }, [livreur]);

  // ======================================================
  // SOCKET.IO — SUIVI TEMPS RÉEL
  // ======================================================

  useEffect(() => {
    if (!commandeActive?._id) {
      return;
    }

    const commandeId = commandeActive._id.toString();

    // Rejoindre la room de la commande
    socket.emit("join_commande", commandeId);

    // ==================================================
    // POSITION CLIENT
    // ==================================================

    const handleClientPosition = (data) => {
      if (data?.commandeId?.toString() !== commandeId) {
        return;
      }

      const latitude = Number(data.latitude);

      const longitude = Number(data.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
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

    const handleLivreurPosition = (data) => {
      if (data?.commandeId?.toString() !== commandeId) {
        return;
      }

      const latitude = Number(data.latitude);

      const longitude = Number(data.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      setPositionLivreur({
        latitude,
        longitude,
      });
    };

    socket.on("client_position", handleClientPosition);

    socket.on("livreur_position", handleLivreurPosition);

    return () => {
      socket.off("client_position", handleClientPosition);

      socket.off("livreur_position", handleLivreurPosition);

      socket.emit("leave_commande", commandeId);
    };
  }, [commandeActive?._id]);

  // ======================================================
  // PROFIL
  // ======================================================

  const chargerProfil = async () => {
    const response = await fetch(`${API_URL}/api/livreurs/profil`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de charger le profil",
      );
    }

    setLivreur(data.livreur);
  };

  // ======================================================
  // COMMANDES DISPONIBLES
  // ======================================================

  const chargerCommandesDisponibles = async () => {
    const response = await fetch(
      `${API_URL}/api/livreurs/commandes-disponibles`,
      {
        method: "GET",
        headers,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Impossible de charger les commandes disponibles",
      );
    }

    setCommandesDisponibles(data.commandes || []);
  };

  // ======================================================
  // MES COMMANDES
  // ======================================================

  const chargerMesCommandes = async () => {
    const response = await fetch(
      `${API_URL}/api/livreurs/commandes`,
      {
        method: "GET",
        headers,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de charger vos commandes",
      );
    }

    setMesCommandes(data.commandes || []);
  };

  // ======================================================
  // CHARGEMENT GLOBAL
  // ======================================================

  const chargerTout = async (avecLoading = false) => {
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

      setErreur(error.message);
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
      navigate("/connexion-livreur", {
        replace: true,
      });

      return;
    }

    chargerTout(true);
  }, [token, navigate]);

  // ======================================================
  // CHANGER STATUT
  // ======================================================

  const changerStatut = async (statut) => {
    try {
      setErreur("");

      setMessage("");

      if (statut === "BUSY") {
        return;
      }

      if (statut === "OFFLINE" && livreur?.commandeActuelle) {
        setErreur(
          "Vous avez une livraison en cours. Terminez-la avant de passer hors ligne.",
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/api/livreurs/statut`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ statut }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de modifier le statut",
        );
      }

      setLivreur((prev) => ({
        ...prev,
        statut: data.statut,
      }));

      setMessage("Votre disponibilité a été mise à jour.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setErreur(error.message);
    }
  };

  // ======================================================
  // ACCEPTER COMMANDE
  // ======================================================

  const accepterCommande = async (commandeId) => {
    try {
      setErreur("");

      setMessage("");

      setCommandeEnCours(commandeId);

      const response = await fetch(
        `${API_URL}/api/livreurs/commandes/${commandeId}/accepter`,
        {
          method: "PUT",
          headers,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible d'accepter la commande",
        );
      }

      setMessage(
        "Commande acceptée. Elle vous est maintenant attribuée.",
      );

      await chargerTout();
    } catch (error) {
      setErreur(error.message);
    } finally {
      setCommandeEnCours(null);
    }
  };

  // ======================================================
  // COMMENCER RÉCUPÉRATION
  // ACCEPTED → PICKING_UP
  // ======================================================

  const commencerRecuperation = async (commandeId) => {
    try {
      setErreur("");

      setMessage("");

      setCommandeEnCours(commandeId);

      const response = await fetch(
        `${API_URL}/api/livreurs/commandes/${commandeId}/commencer-recuperation`,
        {
          method: "PUT",
          headers,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de commencer la récupération",
        );
      }

      setMessage("Récupération de la commande commencée.");

      await chargerTout();
    } catch (error) {
      console.error(error);

      setErreur(error.message);
    } finally {
      setCommandeEnCours(null);
    }
  };

  // ======================================================
  // COMMANDE RÉCUPÉRÉE
  // PICKING_UP → IN_DELIVERY
  // ======================================================

  const recupererCommande = async (commandeId) => {
    try {
      setErreur("");

      setMessage("");

      setCommandeEnCours(commandeId);

      const response = await fetch(
        `${API_URL}/api/livreurs/commandes/${commandeId}/recuperer`,
        {
          method: "PUT",
          headers,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de confirmer la récupération",
        );
      }

      setMessage("Commande récupérée. Livraison en cours.");

      await chargerTout();
    } catch (error) {
      console.error(error);

      setErreur(error.message);
    } finally {
      setCommandeEnCours(null);
    }
  };

  // ======================================================
  // LIVRER
  // IN_DELIVERY → DELIVERED
  // ======================================================

  const livrerCommande = async (commandeId) => {
    try {
      setErreur("");

      setMessage("");

      setCommandeEnCours(commandeId);

      const response = await fetch(
        `${API_URL}/api/livreurs/commandes/${commandeId}/livrer`,
        {
          method: "PUT",
          headers,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de confirmer la livraison",
        );
      }

      setMessage("Livraison terminée avec succès.");

      await chargerTout();
    } catch (error) {
      console.error(error);

      setErreur(error.message);
    } finally {
      setCommandeEnCours(null);
    }
  };

  // ======================================================
  // FORMAT PRIX
  // ======================================================

  const formatPrix = (prix) => {
    return Number(prix || 0).toLocaleString("fr-FR");
  };

  // ======================================================
  // STATUT
  // ======================================================

  const statutLabel = {
    OFFLINE: "Hors ligne",
    AVAILABLE: "Disponible",
    BUSY: "En livraison",
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <LoadingPage>
        <LoadingLogo>NUMA</LoadingLogo>

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
            <StatusPill $status={livreur?.statut}>
              <StatusDot $status={livreur?.statut} />

              {statutLabel[livreur?.statut] || "Hors ligne"}
            </StatusPill>

            <RefreshButton
              onClick={() => chargerTout()}
              disabled={refreshing}
            >
              <RefreshIcon $loading={refreshing}>
                ↻
              </RefreshIcon>

              <span>
                {refreshing
                  ? "Actualisation..."
                  : "Actualiser"}
              </span>
            </RefreshButton>
          </HeaderRight>
        </HeaderInner>
      </Header>

      <Main>
        {/* ==========================================
            MESSAGES
        ========================================== */}

        {message && (
          <Alert $success>
            <AlertIcon>✓</AlertIcon>

            <span>{message}</span>
          </Alert>
        )}

        {erreur && (
          <Alert>
            <AlertIcon>!</AlertIcon>

            <span>{erreur}</span>
          </Alert>
        )}

        {/* ==========================================
            HERO
        ========================================== */}

        <Hero>
          <HeroText>
            <Eyebrow>ESPACE LIVREUR</Eyebrow>

            <HeroTitle>
              Bonjour{" "}
              <HeroName>
                {livreur?.username || "Livreur"}
              </HeroName>
              .
            </HeroTitle>

            <HeroSubtitle>
              Gérez vos livraisons simplement,
              <br />
              depuis un seul endroit.
            </HeroSubtitle>
          </HeroText>

          <HeroAvatar>
            {livreur?.username
              ?.charAt(0)
              ?.toUpperCase() || "L"}
          </HeroAvatar>
        </Hero>

        {/* ==========================================
            STATISTIQUES
        ========================================== */}

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatLabel>Disponibles</StatLabel>

              <StatIcon>◉</StatIcon>
            </StatTop>

            <StatNumber>
              {commandesDisponibles.length}
            </StatNumber>

            <StatDescription>
              Commandes à prendre
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Mes commandes</StatLabel>

              <StatIcon>≡</StatIcon>
            </StatTop>

            <StatNumber>
              {mesCommandes.length}
            </StatNumber>

            <StatDescription>
              Commandes attribuées
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>État actuel</StatLabel>

              <StatIcon>●</StatIcon>
            </StatTop>

            <StatStatus $status={livreur?.statut}>
              {statutLabel[livreur?.statut] ||
                "Hors ligne"}
            </StatStatus>

            <StatDescription>
              Votre disponibilité
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
                Indiquez aux clients et au système si vous
                pouvez recevoir une livraison.
              </SectionDescription>
            </div>
          </SectionHeader>

          <ProfileCard>
            <ProfileInfo>
              <ProfileAvatar>
                {livreur?.username
                  ?.charAt(0)
                  ?.toUpperCase() || "L"}
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
                $active={livreur?.statut === "AVAILABLE"}
                onClick={() =>
                  changerStatut("AVAILABLE")
                }
                disabled={!!commandeActive}
              >
                <ButtonDot />

                Disponible
              </StatusButton>

              <StatusButton
                $active={livreur?.statut === "OFFLINE"}
                onClick={() =>
                  changerStatut("OFFLINE")
                }
                disabled={!!commandeActive}
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
                Suivez les différentes étapes de votre
                livraison depuis cet espace.
              </SectionDescription>
            </SectionHeader>

            <DeliveryCard>
              <DeliveryTop>
                <div>
                  <DeliveryLabel>
                    COMMANDE
                  </DeliveryLabel>

                  <DeliveryNumber>
                    #{commandeActive._id.slice(-6)}
                  </DeliveryNumber>
                </div>

                <DeliveryStatus
                  $status={
                    commandeActive.livraison?.statut
                  }
                >
                  {commandeActive.livraison?.statut}
                </DeliveryStatus>
              </DeliveryTop>

              <DeliveryDivider />

              <DeliveryGrid>
                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    CLIENT
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {commandeActive.client?.prenom}{" "}
                    {commandeActive.client?.nom}
                  </DeliveryInfoValue>
                </DeliveryInfo>

                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    TÉLÉPHONE
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {commandeActive.client?.numero ||
                      "Non renseigné"}
                  </DeliveryInfoValue>
                </DeliveryInfo>

                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    VILLE
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {commandeActive.client?.ville ||
                      "Non renseignée"}
                  </DeliveryInfoValue>
                </DeliveryInfo>

                <DeliveryInfo>
                  <DeliveryInfoLabel>
                    ADRESSE
                  </DeliveryInfoLabel>

                  <DeliveryInfoValue>
                    {commandeActive.client?.adresse ||
                      "Non renseignée"}
                  </DeliveryInfoValue>
                </DeliveryInfo>
              </DeliveryGrid>

              {/* ========================================
                  PRODUITS
              ======================================== */}

              <DeliveryProducts>
                <DeliveryInfoLabel>
                  PRODUITS
                </DeliveryInfoLabel>

                {commandeActive.panier?.map(
                  (item, index) => (
                    <DeliveryProduct key={index}>
                      <span>
                        {item.quantite} × {item.nom}
                      </span>

                      <strong>
                        {formatPrix(
                          item.prix * item.quantite,
                        )}{" "}
                        FCFA
                      </strong>
                    </DeliveryProduct>
                  ),
                )}
              </DeliveryProducts>

              {/* ========================================
                  TOTAL
              ======================================== */}

              <DeliveryTotal>
                <span>Total produits</span>

                <strong>
                  {formatPrix(
                    commandeActive.totalProduits,
                  )}{" "}
                  FCFA
                </strong>
              </DeliveryTotal>

              {/* ========================================
                  ACTION
              ======================================== */}

              <DeliveryAction>
                {commandeActive.livraison?.statut ===
                  "ACCEPTED" && (
                  <DeliveryButton
                    onClick={() =>
                      commencerRecuperation(
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
                      ? "Préparation..."
                      : "Commencer la récupération"}

                    <span>→</span>
                  </DeliveryButton>
                )}

                {commandeActive.livraison?.statut ===
                  "PICKING_UP" && (
                  <DeliveryButton
                    onClick={() =>
                      recupererCommande(
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
                      : "J'ai récupéré la commande"}

                    <span>→</span>
                  </DeliveryButton>
                )}

                {commandeActive.livraison?.statut ===
                  "IN_DELIVERY" && (
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

                    <span>✓</span>
                  </DeliveryButton>
                )}
              </DeliveryAction>

              {/* ========================================
                  CARTE TEMPS RÉEL
              ======================================== */}

              <MapSection>
                <MapHeader>
                  <div>
                    <MapTitle>
                      Suivi de la livraison
                    </MapTitle>

                    <MapSubtitle>
                      Position du client et du livreur en
                      temps réel
                    </MapSubtitle>
                  </div>

                  <LiveBadge>
                    <LiveDot />

                    EN DIRECT
                  </LiveBadge>
                </MapHeader>

                {positionClient || positionLivreur ? (
                  <MapBox>
                    <MapContainer
                      center={[
                        positionLivreur?.latitude ||
                          positionClient?.latitude ||
                          5.3364,

                        positionLivreur?.longitude ||
                          positionClient?.longitude ||
                          -4.0267,
                      ]}
                      zoom={14}
                      scrollWheelZoom={true}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <AjusterCarte
                        positionLivreur={
                          positionLivreur
                        }
                        positionClient={
                          positionClient
                        }
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
                              🚴 Votre position
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
                          icon={clientIcon}
                        >
                          <Popup>
                            <strong>
                              👤 Client
                            </strong>

                            <br />

                            {commandeActive.client
                              ?.prenom || ""}{" "}
                            {commandeActive.client
                              ?.nom || ""}

                            <br />

                            {commandeActive.client
                              ?.adresse ||
                              "Adresse non renseignée"}
                          </Popup>
                        </Marker>
                      )}

                      {/* TRAJET DIRECT */}

                      {positionLivreur &&
                        positionClient && (
                          <Polyline
                            positions={[
                              [
                                positionLivreur.latitude,
                                positionLivreur.longitude,
                              ],
                              [
                                positionClient.latitude,
                                positionClient.longitude,
                              ],
                            ]}
                          />
                        )}
                    </MapContainer>
                  </MapBox>
                ) : (
                  <MapEmpty>
                    <MapEmptyIcon>
                      📍
                    </MapEmptyIcon>

                    <strong>
                      Position GPS indisponible
                    </strong>

                    <span>
                      La carte apparaîtra dès que le
                      livreur ou le client partagera sa
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
                Les nouvelles commandes en attente d'un
                livreur.
              </SectionDescription>
            </div>

            <CountBadge>
              {commandesDisponibles.length}
            </CountBadge>
          </SectionHeaderRow>

          {commandesDisponibles.length === 0 ? (
            <EmptyCard>
              <EmptyIcon>✓</EmptyIcon>

              <EmptyTitle>
                Tout est calme pour le moment.
              </EmptyTitle>

              <EmptyText>
                Aucune nouvelle commande n'attend
                actuellement un livreur.
              </EmptyText>

              <EmptyButton
                onClick={() => chargerTout()}
              >
                Vérifier à nouveau
              </EmptyButton>
            </EmptyCard>
          ) : (
            <OrdersGrid>
              {commandesDisponibles.map((commande) => (
                <OrderCard key={commande._id}>
                  <OrderHeader>
                    <div>
                      <OrderEyebrow>
                        COMMANDE
                      </OrderEyebrow>

                      <OrderNumber>
                        #{commande._id.slice(-6)}
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
                    <small>FCFA</small>
                  </OrderPrice>

                  <OrderDivider />

                  <InfoList>
                    <InfoRow>
                      <InfoIcon>●</InfoIcon>

                      <InfoContent>
                        <InfoLabel>
                          CLIENT
                        </InfoLabel>

                        <InfoValue>
                          {commande.client
                            ?.username ||
                            commande.client?.nom ||
                            "Client"}
                        </InfoValue>
                      </InfoContent>
                    </InfoRow>

                    <InfoRow>
                      <InfoIcon>◉</InfoIcon>

                      <InfoContent>
                        <InfoLabel>
                          VILLE
                        </InfoLabel>

                        <InfoValue>
                          {commande.client?.ville ||
                            "Non renseignée"}
                        </InfoValue>
                      </InfoContent>
                    </InfoRow>

                    <InfoRow>
                      <InfoIcon>⌖</InfoIcon>

                      <InfoContent>
                        <InfoLabel>
                          ADRESSE
                        </InfoLabel>

                        <InfoValue>
                          {commande.client?.adresse ||
                            "Non renseignée"}
                        </InfoValue>
                      </InfoContent>
                    </InfoRow>

                    <InfoRow>
                      <InfoIcon>●</InfoIcon>

                      <InfoContent>
                        <InfoLabel>
                          NUMÉRO
                        </InfoLabel>

                        <InfoValue>
                          {commande.client?.numero ||
                            "Non renseigné"}
                        </InfoValue>
                      </InfoContent>
                    </InfoRow>
                  </InfoList>

                  <OrderFooter>
                    <ArticleCount>
                      {commande.panier?.length || 0}{" "}
                      article
                      {commande.panier?.length > 1
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
                        livreur?.statut === "BUSY" ||
                        !!livreur?.commandeActuelle ||
                        commandeEnCours ===
                          commande._id
                      }
                    >
                      {commandeEnCours ===
                      commande._id
                        ? "Acceptation..."
                        : "Accepter"}

                      <span>→</span>
                    </AcceptButton>
                  </OrderFooter>
                </OrderCard>
              ))}
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
                Les commandes actuellement associées à
                votre compte.
              </SectionDescription>
            </div>

            <CountBadge>
              {mesCommandes.length}
            </CountBadge>
          </SectionHeaderRow>

          {mesCommandes.length === 0 ? (
            <EmptyCard>
              <EmptyIcon>—</EmptyIcon>

              <EmptyTitle>
                Aucune commande.
              </EmptyTitle>

              <EmptyText>
                Vos commandes apparaîtront ici lorsqu'elles
                vous seront attribuées.
              </EmptyText>
            </EmptyCard>
          ) : (
            <MyOrders>
              {mesCommandes.map((commande) => (
                <MyOrderCard key={commande._id}>
                  <MyOrderMain>
                    <MyOrderNumber>
                      #{commande._id.slice(-6)}
                    </MyOrderNumber>

                    <MyOrderLocation>
                      {commande.client?.ville ||
                        "Ville inconnue"}
                    </MyOrderLocation>

                    <MyOrderAddress>
                      {commande.client?.adresse ||
                        "Adresse non renseignée"}
                    </MyOrderAddress>
                  </MyOrderMain>

                  <MyOrderStatus
                    $status={
                      commande.livraison?.statut
                    }
                  >
                    {commande.livraison?.statut ||
                      "INCONNU"}
                  </MyOrderStatus>

                  <MyOrderPrice>
                    {formatPrix(
                      commande.totalProduits,
                    )}{" "}
                    FCFA
                  </MyOrderPrice>
                </MyOrderCard>
              ))}
            </MyOrders>
          )}
        </Section>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <Footer>
          <FooterBrand>NUMA</FooterBrand>

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

  background: radial-gradient(
    circle at 50% -20%,
    rgba(255, 255, 255, 1) 0%,
    rgba(246, 246, 248, 1) 45%,
    rgba(242, 242, 245, 1) 100%
  );

  color: #1d1d1f;

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Display",
    "SF Pro Text",
    "Helvetica Neue",
    Arial,
    sans-serif;

  -webkit-font-smoothing: antialiased;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;

  background: rgba(255, 255, 255, 0.78);

  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);

  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
`;

const HeaderInner = styled.div`
  max-width: 1280px;

  margin: auto;

  padding: 18px 28px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 650px) {
    padding: 16px 18px;
  }
`;

const Brand = styled.div`
  font-size: 21px;

  font-weight: 800;

  letter-spacing: -1px;
`;

const BrandDot = styled.span`
  display: inline-block;

  width: 6px;
  height: 6px;

  background: #0071e3;

  border-radius: 50%;

  margin-left: 3px;
`;

const HeaderRight = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;
`;

const StatusPill = styled.div`
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 12px;

  background: rgba(0, 0, 0, 0.045);

  border-radius: 999px;

  font-size: 13px;

  font-weight: 600;

  @media (max-width: 600px) {
    display: none;
  }
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: ${({ $status }) =>
    $status === "AVAILABLE"
      ? "#34c759"
      : $status === "BUSY"
        ? "#ff9f0a"
        : "#8e8e93"};
`;

const RefreshButton = styled.button`
  border: none;

  background: #1d1d1f;

  color: white;

  padding: 9px 15px;

  border-radius: 999px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  display: flex;

  align-items: center;

  gap: 7px;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }

  &:disabled {
    opacity: 0.6;

    cursor: default;
  }
`;

const RefreshIcon = styled.span`
  display: inline-block;

  font-size: 17px;

  ${({ $loading }) =>
    $loading &&
    `
      animation: spin 0.8s linear infinite;
    `}

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

const Main = styled.main`
  max-width: 1280px;

  margin: auto;

  padding: 55px 28px 80px;

  @media (max-width: 650px) {
    padding: 35px 18px 60px;
  }
`;

const Alert = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 14px 18px;

  margin-bottom: 25px;

  border-radius: 16px;

  background: ${({ $success }) =>
    $success ? "#eaf8ef" : "#fff0f0"};

  color: ${({ $success }) =>
    $success ? "#16743a" : "#b42318"};

  font-size: 14px;

  font-weight: 500;
`;

const AlertIcon = styled.span`
  width: 23px;
  height: 23px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: currentColor;

  color: white;

  font-size: 12px;

  font-weight: 800;
`;

const Hero = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 55px;
`;

const HeroText = styled.div``;

const Eyebrow = styled.div`
  color: #86868b;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 1.5px;

  margin-bottom: 13px;
`;

const HeroTitle = styled.h1`
  margin: 0;

  font-size: clamp(42px, 6vw, 72px);

  line-height: 0.98;

  letter-spacing: -4px;

  font-weight: 700;

  color: #1d1d1f;

  @media (max-width: 600px) {
    letter-spacing: -2.5px;
  }
`;

const HeroName = styled.span`
  color: #0071e3;
`;

const HeroSubtitle = styled.p`
  margin: 22px 0 0;

  color: #6e6e73;

  font-size: 19px;

  line-height: 1.45;

  letter-spacing: -0.3px;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const HeroAvatar = styled.div`
  width: 86px;
  height: 86px;

  border-radius: 28px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #1d1d1f;

  color: white;

  font-size: 34px;

  font-weight: 700;

  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.15);

  @media (max-width: 600px) {
    width: 58px;
    height: 58px;

    border-radius: 20px;

    font-size: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  margin-bottom: 75px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  padding: 27px;

  min-height: 155px;

  background: rgba(255, 255, 255, 0.72);

  border: 1px solid rgba(0, 0, 0, 0.07);

  border-radius: 24px;

  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.035);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-3px);

    box-shadow:
      0 18px 50px rgba(0, 0, 0, 0.08);
  }
`;

const StatTop = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;
`;

const StatLabel = styled.span`
  color: #86868b;

  font-size: 13px;

  font-weight: 600;
`;

const StatIcon = styled.span`
  color: #0071e3;

  font-size: 18px;
`;

const StatNumber = styled.div`
  margin-top: 25px;

  font-size: 38px;

  font-weight: 700;

  letter-spacing: -2px;
`;

const StatDescription = styled.div`
  margin-top: 4px;

  color: #86868b;

  font-size: 13px;
`;

const StatStatus = styled.div`
  margin-top: 25px;

  font-size: 25px;

  font-weight: 700;

  letter-spacing: -1px;

  color: ${({ $status }) =>
    $status === "AVAILABLE"
      ? "#248a3d"
      : $status === "BUSY"
        ? "#b45309"
        : "#6e6e73"};
`;

const Section = styled.section`
  margin-bottom: 75px;
`;

const SectionHeader = styled.div`
  margin-bottom: 25px;
`;

const SectionHeaderRow = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  margin-bottom: 25px;
`;

const SectionEyebrow = styled.div`
  color: #86868b;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 1.4px;

  margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  font-size: 34px;

  letter-spacing: -1.7px;

  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

const SectionDescription = styled.p`
  max-width: 600px;

  margin: 10px 0 0;

  color: #86868b;

  font-size: 15px;

  line-height: 1.5;
`;

const CountBadge = styled.div`
  min-width: 40px;

  height: 40px;

  padding: 0 13px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #1d1d1f;

  color: white;

  font-size: 13px;

  font-weight: 700;
`;

const ProfileCard = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

  padding: 25px;

  background: rgba(255, 255, 255, 0.8);

  border: 1px solid rgba(0, 0, 0, 0.07);

  border-radius: 24px;

  @media (max-width: 800px) {
    flex-direction: column;

    align-items: stretch;
  }
`;

const ProfileInfo = styled.div`
  display: flex;

  align-items: center;

  gap: 16px;
`;

const ProfileAvatar = styled.div`
  width: 56px;
  height: 56px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #f2f2f7;

  border-radius: 18px;

  font-size: 21px;

  font-weight: 700;
`;

const ProfileName = styled.div`
  font-size: 17px;

  font-weight: 700;
`;

const ProfileEmail = styled.div`
  margin-top: 3px;

  color: #86868b;

  font-size: 13px;
`;

const ProfilePhone = styled.div`
  margin-top: 2px;

  color: #86868b;

  font-size: 13px;
`;

const StatusSelector = styled.div`
  display: flex;

  gap: 8px;

  padding: 5px;

  background: #f2f2f7;

  border-radius: 14px;

  @media (max-width: 600px) {
    display: grid;

    grid-template-columns: 1fr;
  }
`;

const StatusButton = styled.button`
  border: none;

  padding: 11px 15px;

  border-radius: 10px;

  background: ${({ $active }) =>
    $active ? "#fff" : "transparent"};

  color: ${({ $active }) =>
    $active ? "#1d1d1f" : "#6e6e73"};

  box-shadow: ${({ $active }) =>
    $active
      ? "0 2px 8px rgba(0,0,0,.08)"
      : "none"};

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  transition: all 0.2s ease;

  &:hover {
    color: #1d1d1f;
  }

  &:disabled {
    opacity: 0.45;

    cursor: not-allowed;
  }
`;

const ButtonDot = styled.span`
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
`;

const OrdersGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const OrderCard = styled.article`
  padding: 26px;

  background: #fff;

  border: 1px solid rgba(0, 0, 0, 0.08);

  border-radius: 25px;

  box-shadow:
    0 12px 45px rgba(0, 0, 0, 0.045);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);

    box-shadow:
      0 22px 60px rgba(0, 0, 0, 0.09);
  }
`;

const OrderHeader = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: flex-start;
`;

const OrderEyebrow = styled.div`
  color: #86868b;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.5px;
`;

const OrderNumber = styled.div`
  margin-top: 4px;

  font-size: 21px;

  font-weight: 700;

  letter-spacing: -0.8px;
`;

const OrderBadge = styled.span`
  padding: 7px 10px;

  background: #eaf4ff;

  color: #0071e3;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 700;
`;

const OrderPrice = styled.div`
  margin-top: 30px;

  font-size: 32px;

  font-weight: 700;

  letter-spacing: -1.5px;

  small {
    font-size: 14px;

    font-weight: 600;

    letter-spacing: 0;

    color: #86868b;
  }
`;

const OrderDivider = styled.div`
  height: 1px;

  background: #eeeeef;

  margin: 24px 0;
`;

const InfoList = styled.div`
  display: flex;

  flex-direction: column;

  gap: 17px;
`;

const InfoRow = styled.div`
  display: flex;

  gap: 12px;
`;

const InfoIcon = styled.div`
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  background: #f5f5f7;

  border-radius: 9px;

  color: #0071e3;

  font-size: 12px;
`;

const InfoContent = styled.div`
  min-width: 0;
`;

const InfoLabel = styled.div`
  color: #86868b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 1px;

  margin-bottom: 3px;
`;

const InfoValue = styled.div`
  font-size: 14px;

  font-weight: 600;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
`;

const OrderFooter = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-top: 25px;
`;

const ArticleCount = styled.span`
  color: #86868b;

  font-size: 12px;
`;

const AcceptButton = styled.button`
  border: none;

  background: #1d1d1f;

  color: white;

  padding: 12px 17px;

  border-radius: 999px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  display: flex;

  align-items: center;

  gap: 12px;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  span {
    font-size: 18px;

    line-height: 0;
  }

  &:hover:not(:disabled) {
    transform: scale(1.035);
  }

  &:disabled {
    opacity: 0.45;

    cursor: not-allowed;
  }
`;

const EmptyCard = styled.div`
  text-align: center;

  padding: 70px 25px;

  background: rgba(255, 255, 255, 0.7);

  border: 1px solid rgba(0, 0, 0, 0.06);

  border-radius: 25px;
`;

const EmptyIcon = styled.div`
  width: 54px;
  height: 54px;

  margin: 0 auto 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background: #f2f2f7;

  color: #0071e3;

  font-size: 22px;

  font-weight: 700;
`;

const EmptyTitle = styled.h3`
  margin: 0;

  font-size: 20px;

  letter-spacing: -0.5px;
`;

const EmptyText = styled.p`
  max-width: 400px;

  margin: 9px auto 20px;

  color: #86868b;

  font-size: 14px;

  line-height: 1.5;
`;

const EmptyButton = styled.button`
  border: none;

  background: #1d1d1f;

  color: white;

  padding: 11px 18px;

  border-radius: 999px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;
`;

const MyOrders = styled.div`
  display: flex;

  flex-direction: column;

  gap: 10px;
`;

const MyOrderCard = styled.div`
  display: grid;

  grid-template-columns:
    1.2fr 1fr auto auto;

  align-items: center;

  gap: 25px;

  padding: 21px 23px;

  background: rgba(255, 255, 255, 0.75);

  border: 1px solid rgba(0, 0, 0, 0.06);

  border-radius: 18px;

  transition: background 0.2s ease;

  &:hover {
    background: #fff;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr auto;
  }
`;

const MyOrderMain = styled.div``;

const MyOrderNumber = styled.div`
  font-size: 15px;

  font-weight: 700;
`;

const MyOrderLocation = styled.div`
  margin-top: 5px;

  font-size: 13px;

  font-weight: 600;
`;

const MyOrderAddress = styled.div`
  margin-top: 2px;

  color: #86868b;

  font-size: 12px;
`;

const MyOrderStatus = styled.div`
  padding: 7px 10px;

  background: #f2f2f7;

  border-radius: 999px;

  font-size: 10px;

  font-weight: 700;

  color: ${({ $status }) =>
    $status === "ACCEPTED"
      ? "#248a3d"
      : $status === "PICKING_UP"
        ? "#b45309"
        : $status === "IN_DELIVERY"
          ? "#0071e3"
          : "#6e6e73"};

  @media (max-width: 800px) {
    justify-self: end;
  }
`;

const MyOrderPrice = styled.div`
  font-size: 14px;

  font-weight: 700;

  white-space: nowrap;

  @media (max-width: 800px) {
    grid-column: 2;

    justify-self: end;
  }
`;

const Footer = styled.footer`
  padding-top: 25px;

  border-top: 1px solid rgba(0, 0, 0, 0.07);

  display: flex;

  justify-content: space-between;

  color: #86868b;

  @media (max-width: 600px) {
    flex-direction: column;

    gap: 8px;
  }
`;

const FooterBrand = styled.div`
  color: #1d1d1f;

  font-size: 15px;

  font-weight: 800;

  letter-spacing: -0.5px;
`;

const FooterText = styled.div`
  font-size: 12px;
`;

// ======================================================
// LIVRAISON ACTIVE
// ======================================================

const DeliveryCard = styled.article`
  padding: 30px;

  background: #1d1d1f;

  color: white;

  border-radius: 28px;

  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.15);

  @media (max-width: 600px) {
    padding: 20px;

    border-radius: 22px;
  }
`;

const DeliveryTop = styled.div`
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;
`;

const DeliveryLabel = styled.div`
  color: #86868b;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.5px;
`;

const DeliveryNumber = styled.div`
  margin-top: 6px;

  font-size: 27px;

  font-weight: 700;

  letter-spacing: -1px;
`;

const DeliveryStatus = styled.div`
  padding: 8px 12px;

  border-radius: 999px;

  background: ${({ $status }) =>
    $status === "ACCEPTED"
      ? "rgba(52,199,89,.15)"
      : $status === "PICKING_UP"
        ? "rgba(255,159,10,.15)"
        : "rgba(0,113,227,.15)"};

  color: ${({ $status }) =>
    $status === "ACCEPTED"
      ? "#34c759"
      : $status === "PICKING_UP"
        ? "#ff9f0a"
        : "#5aa9ff"};

  font-size: 10px;

  font-weight: 700;
`;

const DeliveryDivider = styled.div`
  height: 1px;

  margin: 25px 0;

  background: rgba(255, 255, 255, 0.1);
`;

const DeliveryGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 25px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const DeliveryInfo = styled.div`
  min-width: 0;
`;

const DeliveryInfoLabel = styled.div`
  margin-bottom: 6px;

  color: #86868b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 1px;
`;

const DeliveryInfoValue = styled.div`
  font-size: 15px;

  font-weight: 600;

  line-height: 1.4;
`;

const DeliveryProducts = styled.div`
  margin-top: 30px;

  padding-top: 25px;

  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const DeliveryProduct = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

  padding: 10px 0;

  color: #d2d2d7;

  font-size: 13px;

  strong {
    color: white;

    white-space: nowrap;
  }
`;

const DeliveryTotal = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-top: 20px;

  padding-top: 20px;

  border-top: 1px solid rgba(255, 255, 255, 0.1);

  color: #86868b;

  font-size: 13px;

  strong {
    color: white;

    font-size: 18px;
  }
`;

const DeliveryAction = styled.div`
  margin-top: 28px;
`;

const DeliveryButton = styled.button`
  width: 100%;

  border: none;

  padding: 15px 20px;

  border-radius: 14px;

  background: white;

  color: #1d1d1f;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  span {
    font-size: 18px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;

    cursor: not-allowed;
  }
`;

// ======================================================
// CARTE
// ======================================================

const MapSection = styled.div`
  margin-top: 28px;

  padding: 22px;

  background: #fff;

  color: #111;

  border-radius: 22px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 600px) {
    padding: 15px;

    border-radius: 18px;
  }
`;

const MapHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 16px;

  margin-bottom: 16px;

  @media (max-width: 600px) {
    align-items: flex-start;
  }
`;

const MapTitle = styled.div`
  font-size: 17px;

  font-weight: 800;

  color: #111;
`;

const MapSubtitle = styled.div`
  margin-top: 4px;

  font-size: 13px;

  color: #777;
`;

const LiveBadge = styled.div`
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 11px;

  flex-shrink: 0;

  border-radius: 999px;

  background: #f3f3f3;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 0.04em;

  color: #222;
`;

const LiveDot = styled.span`
  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #22c55e;

  display: block;

  box-shadow:
    0 0 0 4px rgba(34, 197, 94, 0.12);
`;

const MapBox = styled.div`
  width: 100%;

  height: 390px;

  overflow: hidden;

  border-radius: 20px;

  border: 1px solid #e8e8e8;

  .leaflet-container {
    width: 100%;

    height: 100%;

    font-family: inherit;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 12px;
  }

  .leaflet-popup-content {
    font-size: 13px;

    line-height: 1.5;
  }

  @media (max-width: 600px) {
    height: 320px;

    border-radius: 16px;
  }
`;

const MapEmpty = styled.div`
  min-height: 220px;

  border-radius: 20px;

  border: 1px dashed #d8d8d8;

  background: #fafafa;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 30px;

  color: #111;

  span {
    margin-top: 7px;

    max-width: 380px;

    color: #777;

    font-size: 13px;

    line-height: 1.6;
  }
`;

const MapEmptyIcon = styled.div`
  font-size: 30px;

  margin-bottom: 10px;
`;

// ======================================================
// LOADING
// ======================================================

const LoadingPage = styled.div`
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  background: #f5f5f7;

  color: #1d1d1f;

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Display",
    "Helvetica Neue",
    Arial,
    sans-serif;
`;

const LoadingLogo = styled.div`
  font-size: 28px;

  font-weight: 800;

  letter-spacing: -1.5px;
`;

const LoadingSpinner = styled.div`
  width: 22px;

  height: 22px;

  margin-top: 30px;

  border: 2px solid #d2d2d7;

  border-top-color: #1d1d1f;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 15px;

  color: #86868b;

  font-size: 13px;
`;

export default LivreurAdmin;

