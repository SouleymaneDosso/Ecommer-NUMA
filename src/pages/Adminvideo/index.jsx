import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 150px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #111;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function Video() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const ajouterVideo = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setMessage("Veuillez sélectionner une vidéo.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formdata = new FormData();

      formdata.append("title", title);
      formdata.append("description", description);


      formdata.append("videos", videoFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/videos/upload`,
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout");
      }

      setMessage("Vidéo ajoutée avec succès !");

      // Réinitialiser le formulaire
      setTitle("");
      setDescription("");
      setVideoFile(null);

      // Réinitialiser l'input file
      e.target.reset();

    } catch (error) {
      console.log(error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Ajouter une vidéo</h1>

      <Form onSubmit={ajouterVideo}>

        <div>
          <Label htmlFor="title">
            Titre
          </Label>

          <Input
            id="title"
            type="text"
            placeholder="Titre de la vidéo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">
            Description
          </Label>

          <Textarea
            id="description"
            placeholder="Description de la vidéo"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="video">
            Vidéo
          </Label>

          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => {
              setVideoFile(e.target.files[0]);
            }}
            required
          />
        </div>

        {videoFile && (
          <p>
            Fichier sélectionné : {videoFile.name}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Ajout en cours..." : "Ajouter la vidéo"}
        </Button>

        {message && (
          <p>{message}</p>
        )}

      </Form>
    </Container>
  );
}

export default Video;