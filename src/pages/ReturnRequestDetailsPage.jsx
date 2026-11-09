import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const API_BASE = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

const reasons = [
  "Taille trop petite",
  "Taille trop grande",
  "Article différent de la commande",
  "Article défectueux ou endommagé",
  "Commande incomplète",
  "Changement d’avis",
  "Autre raison",
];

const solutions = [
  {
    value: "exchange",
    label: "Échange",
    description: "Recevoir un autre article en remplacement.",
  },
  {
    value: "refund",
    label: "Remboursement",
    description: "Recevoir un remboursement après validation.",
  },
];

const initialDetails = (products) =>
  products.map((product) => ({
    id: product.id,
    reason: "",
    description: "",
    photos: [],
  }));

const ReturnRequestDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const selectedProducts = location.state?.selectedProducts || [];

  const [details, setDetails] = useState(() =>
    initialDetails(selectedProducts),
  );

  const [solution, setSolution] = useState("refund");
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [numeroWhatsApp, setNumeroWhatsApp] = useState("");

  const detailsRef = useRef(details);
  detailsRef.current = details;

  useEffect(() => {
    return () => {
      detailsRef.current.forEach((item) => {
        item.photos.forEach((photo) => {
          URL.revokeObjectURL(photo.preview);
        });
      });
    };
  }, []);

  // Vérification des données reçues depuis la première page
  useEffect(() => {
    if (!order || !order._id || selectedProducts.length === 0) {
      navigate("/returns", { replace: true });
    }
  }, [order, selectedProducts, navigate]);

  const updateDetail = (index, field, value) => {
    setDetails((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addPhotos = (index, event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validFiles = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError("Seules les images JPG, PNG et WEBP sont acceptées.");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Chaque photo ne doit pas dépasser 5 Mo.");
        continue;
      }

      validFiles.push(file);
    }

    setDetails((previous) =>
      previous.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const remaining = Math.max(0, 4 - item.photos.length);
        const filesToAdd = validFiles.slice(0, remaining);

        const newPhotos = filesToAdd.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        return {
          ...item,
          photos: [...item.photos, ...newPhotos],
        };
      }),
    );

    setError("");
    event.target.value = "";
  };

  const removePhoto = (detailIndex, photoIndex) => {
    setDetails((previous) =>
      previous.map((item, index) => {
        if (index !== detailIndex) return item;

        const photoToRemove = item.photos[photoIndex];

        if (photoToRemove?.preview) {
          URL.revokeObjectURL(photoToRemove.preview);
        }

        return {
          ...item,
          photos: item.photos.filter(
            (_, indexPhoto) => indexPhoto !== photoIndex,
          ),
        };
      }),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!numeroWhatsApp.trim()) {
      setError("Veuillez renseigner votre numéro WhatsApp.");
      return;
    }

    if (!order?._id) {
      setError("Les informations de la commande sont introuvables.");
      return;
    }

    if (order.statusCommande !== "DELIVERED") {
      setError(
        "Une demande de retour est possible uniquement après la livraison.",
      );
      return;
    }

    if (!selectedProducts.length) {
      setError("Aucun article n'a été sélectionné.");
      return;
    }

    if (details.length !== selectedProducts.length) {
      setError("Les informations des articles sont incomplètes.");
      return;
    }

    for (let index = 0; index < selectedProducts.length; index++) {
      const product = selectedProducts[index];
      const detail = details[index];

      if (!Number.isInteger(product.panierIndex)) {
        setError(
          "Une erreur est survenue avec les articles sélectionnés. Recommence la recherche de ta commande.",
        );
        return;
      }

      if (!detail.reason) {
        setError(`Veuillez sélectionner un motif pour ${product.name}.`);
        return;
      }

      if (!detail.description.trim()) {
        setError(`Veuillez expliquer le problème pour ${product.name}.`);
        return;
      }
    }

    if (!["exchange", "refund"].includes(solution)) {
      setError("Veuillez sélectionner une solution.");
      return;
    }

    if (!accepted) {
      setError("Veuillez accepter les conditions de retour.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Votre session a expiré. Veuillez vous reconnecter.");
      return;
    }

    const items = details.map((detail, index) => ({
      panierIndex: selectedProducts[index].panierIndex,
      motif: detail.reason,
    }));

    const description = details
      .map((detail, index) => {
        const product = selectedProducts[index];

        return [
          `Article : ${product.name}`,
          `Motif : ${detail.reason}`,
          `Explication : ${detail.description.trim()}`,
        ].join("\n");
      })
      .join("\n\n");

    const formData = new FormData();

    formData.append("commandeId", order._id);
    formData.append("items", JSON.stringify(items));
    formData.append(
      "solutionSouhaitee",
      solution === "exchange" ? "ECHANGE" : "REMBOURSEMENT",
    );
    formData.append("description", description);
    formData.append("numeroWhatsApp", numeroWhatsApp.trim());

    details.forEach((detail) => {
      detail.photos.forEach((photo) => {
        formData.append("photos", photo.file);
      });
    });

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/returns`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Une erreur est survenue lors de l'envoi.",
        );
      }

      const returnedRequest =
        data.returnRequest || data.demande || data.return || data;

      setRequestNumber(
        returnedRequest?._id ||
          returnedRequest?.numeroDemande ||
          returnedRequest?.numero ||
          "",
      );

      setSubmitted(true);
    } catch (err) {
      console.error("ERREUR DEMANDE DE RETOUR :", err);
      setError(err.message || "Impossible d'envoyer votre demande. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (!order || selectedProducts.length === 0) {
    return null;
  }

  if (submitted) {
    return (
      <PageContainer>
        <SuccessCard>
          <SuccessIcon>✓</SuccessIcon>

          <h1>Demande envoyée !</h1>

          <p>
            Votre demande de retour a bien été enregistrée. Notre équipe va
            examiner votre demande.
          </p>

          {requestNumber && (
            <RequestNumber>
              Numéro de demande : <strong>{requestNumber}</strong>
            </RequestNumber>
          )}

          <p className="small-text">
            Vous pourrez suivre l'évolution de votre demande depuis votre espace
            client.
          </p>

          <PrimaryButton type="button" onClick={() => navigate("/")}>
            RETOUR À L'ACCUEIL
          </PrimaryButton>
        </SuccessCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <button type="button" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <h1>Détails de votre demande</h1>

        <p>Décrivez le problème rencontré avec chaque article sélectionné.</p>
      </PageHeader>

      <OrderSummary>
        <div>
          <span>Commande</span>
          <strong>{order.numeroCommande || "Commande"}</strong>
        </div>

        <div>
          <span>Articles sélectionnés</span>
          <strong>{selectedProducts.length}</strong>
        </div>
      </OrderSummary>

      <form onSubmit={handleSubmit}>
        <SectionTitle>Articles concernés</SectionTitle>

        {selectedProducts.map((product, index) => {
          const detail = details[index];

          if (!detail) return null;

          return (
            <ProductCard key={product.id || index}>
              <ProductHeader>
                <ProductImage
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                />

                <ProductInfo>
                  <h3>{product.name}</h3>

                  {product.color && <p>Couleur : {product.color}</p>}

                  {product.size && <p>Taille : {product.size}</p>}

                  <p>Quantité : {product.quantity}</p>
                </ProductInfo>
              </ProductHeader>

              <FormGroup>
                <label htmlFor={`reason-${index}`}>
                  Pourquoi souhaitez-vous retourner cet article ?
                </label>

                <Select
                  id={`reason-${index}`}
                  value={detail.reason}
                  onChange={(event) =>
                    updateDetail(index, "reason", event.target.value)
                  }
                  required
                >
                  <option value="">Sélectionner un motif</option>

                  {reasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <label htmlFor={`description-${index}`}>
                  Décrivez le problème
                </label>

                <TextArea
                  id={`description-${index}`}
                  value={detail.description}
                  onChange={(event) =>
                    updateDetail(index, "description", event.target.value)
                  }
                  placeholder="Expliquez-nous pourquoi vous souhaitez retourner cet article..."
                  rows={4}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Photos (facultatif)</label>

                <UploadBox>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) => addPhotos(index, event)}
                    disabled={detail.photos.length >= 4}
                  />

                  <span>Ajouter des photos ({detail.photos.length}/4)</span>

                  <small>JPG, PNG ou WEBP — 5 Mo maximum par photo</small>
                </UploadBox>

                {detail.photos.length > 0 && (
                  <PhotoGrid>
                    {detail.photos.map((photo, photoIndex) => (
                      <PhotoItem key={`${photo.preview}-${photoIndex}`}>
                        <img src={photo.preview} alt="Aperçu" />

                        <button
                          type="button"
                          onClick={() => removePhoto(index, photoIndex)}
                          aria-label="Supprimer cette photo"
                        >
                          ×
                        </button>
                      </PhotoItem>
                    ))}
                  </PhotoGrid>
                )}
              </FormGroup>
            </ProductCard>
          );
        })}

        <SectionTitle>Solution souhaitée</SectionTitle>

        <SolutionContainer>
          {solutions.map((item) => (
            <SolutionCard
              key={item.value}
              $selected={solution === item.value}
              onClick={() => setSolution(item.value)}
            >
              <input
                type="radio"
                name="solution"
                value={item.value}
                checked={solution === item.value}
                onChange={() => setSolution(item.value)}
              />

              <div>
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </div>
            </SolutionCard>
          ))}
        </SolutionContainer>

        <WhatsAppSection>
          <WhatsAppLabel htmlFor="numeroWhatsApp">
            Numéro WhatsApp pour le remboursement
          </WhatsAppLabel>

          <WhatsAppDescription>
            Renseignez le numéro WhatsApp sur lequel NUMA pourra vous contacter
            et effectuer le suivi de votre demande.
          </WhatsAppDescription>

          <WhatsAppInputWrapper>
            <WhatsAppIcon>W</WhatsAppIcon>

            <WhatsAppInput
              id="numeroWhatsApp"
              type="tel"
              name="numeroWhatsApp"
              placeholder="+225 07 00 00 00 00"
              value={numeroWhatsApp}
              onChange={(e) => setNumeroWhatsApp(e.target.value)}
              required
            />
          </WhatsAppInputWrapper>

          <WhatsAppHint>
            Exemple : +225 07 00 00 00 00. Utilisez un numéro sur lequel vous
            êtes joignable.
          </WhatsAppHint>
        </WhatsAppSection>

        <Conditions>
          <input
            type="checkbox"
            id="accept-conditions"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />

          <label htmlFor="accept-conditions">
            Je confirme que les informations fournies sont exactes et j'accepte
            les conditions de retour de NUMA.
          </label>
        </Conditions>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "ENVOI EN COURS..." : "ENVOYER MA DEMANDE"}
        </SubmitButton>
      </form>
    </PageContainer>
  );
};

export default ReturnRequestDetailsPage;

// ---------------- STYLES ----------------

const PageContainer = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px 80px;
  color: #252525;

  @media (max-width: 600px) {
    padding: 25px 15px 50px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 30px;

  button {
    border: none;
    background: none;
    color: #555;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 28px;
    margin: 0 0 10px;
    font-weight: 600;
  }

  p {
    color: #777;
    font-size: 14px;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 23px;
    }
  }
`;

const OrderSummary = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  background: #f8f7f4;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 35px;

  div {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  span {
    font-size: 12px;
    color: #888;
  }

  strong {
    font-size: 14px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 19px;
  font-weight: 600;
  margin: 35px 0 20px;
`;

const ProductCard = styled.div`
  border: 1px solid #e9e9e9;
  border-radius: 9px;
  padding: 22px;
  margin-bottom: 22px;
  background: #fff;

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const ProductHeader = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 22px;
`;

const ProductImage = styled.img`
  width: 90px;
  height: 110px;
  object-fit: cover;
  border-radius: 5px;
  background: #f5f5f5;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  h3 {
    font-size: 15px;
    margin: 0 0 5px;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #777;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;

  label {
    font-size: 14px;
    font-weight: 500;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 13px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #333;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
  font-family: inherit;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #333;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const UploadBox = styled.label`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px dashed #bbb;
  padding: 22px;
  border-radius: 6px;
  cursor: pointer;
  background: #fafafa;
  text-align: center;

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  span {
    font-size: 13px;
    font-weight: 500;
  }

  small {
    color: #999;
    font-size: 11px;
  }
`;

const PhotoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const PhotoItem = styled.div`
  position: relative;
  width: 85px;
  height: 95px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  button {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 23px;
    height: 23px;
    border: none;
    border-radius: 50%;
    background: #252525;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }
`;

const SolutionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SolutionCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 18px;
  border: 1px solid ${({ $selected }) => ($selected ? "#252525" : "#e5e5e5")};
  border-radius: 7px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? "#faf9f6" : "#fff")};

  input {
    margin-top: 3px;
    accent-color: #252525;
  }

  strong {
    font-size: 14px;
  }

  p {
    font-size: 12px;
    color: #888;
    margin: 6px 0 0;
  }
`;

const Conditions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 30px 0;

  input {
    margin-top: 3px;
    accent-color: #252525;
  }

  label {
    font-size: 12px;
    color: #666;
    line-height: 1.6;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  background: #fff1f0;
  color: #bd2929;
  border: 1px solid #f2cccc;
  padding: 13px;
  border-radius: 5px;
  font-size: 13px;
  margin-bottom: 18px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 17px;
  border: none;
  border-radius: 5px;
  background: #252525;
  color: white;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.7px;
  cursor: pointer;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background: #444;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessCard = styled.div`
  max-width: 550px;
  margin: 70px auto;
  text-align: center;
  padding: 40px 25px;
  border: 1px solid #eee;
  border-radius: 10px;

  h1 {
    font-size: 25px;
    margin: 20px 0 12px;
  }

  p {
    color: #777;
    font-size: 14px;
    line-height: 1.7;
  }

  .small-text {
    font-size: 12px;
    margin: 20px 0 25px;
  }
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 30px;
`;

const RequestNumber = styled.div`
  margin-top: 20px;
  padding: 13px;
  background: #f8f7f4;
  border-radius: 5px;
  font-size: 13px;
`;

const PrimaryButton = styled.button`
  padding: 15px 25px;
  background: #252525;
  border: none;
  color: white;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #444;
  }
`;

const WhatsAppSection = styled.div`
  margin: 30px 0;
  padding: 22px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 14px;

  @media (max-width: 600px) {
    padding: 17px;
  }
`;

const WhatsAppLabel = styled.label`
  display: block;
  margin-bottom: 9px;
  color: #171717;
  font-size: 14px;
  font-weight: 600;
`;

const WhatsAppDescription = styled.p`
  margin: 0 0 15px;
  color: #777;
  font-size: 12px;
  line-height: 1.6;
`;

const WhatsAppInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid #dedede;
  border-radius: 9px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus-within {
    border-color: #25d366;
    box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
  }
`;

const WhatsAppIcon = styled.div`
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e8f9ee;
  color: #25a75a;
  font-size: 19px;
  font-weight: 700;
`;

const WhatsAppInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 15px 0;
  border: none;
  outline: none;
  background: transparent;
  color: #171717;
  font-size: 16px;

  &::placeholder {
    color: #aaa;
  }
`;

const WhatsAppHint = styled.small`
  display: block;
  margin-top: 10px;
  color: #888;
  font-size: 11px;
  line-height: 1.5;
`;
