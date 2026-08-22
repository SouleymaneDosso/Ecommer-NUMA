import { useState, useEffect } from "react";
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

  // Maintenant c'est un tableau
  const [videoFiles, setVideoFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);

  const ajouterVideo = async (e) => {
    e.preventDefault();

    if (videoFiles.length === 0) {
      setMessage("Veuillez sélectionner au moins une vidéo.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formdata = new FormData();

      formdata.append("title", title);
      formdata.append("description", description);

      // Ajouter toutes les vidéos
      videoFiles.forEach((file) => {
        formdata.append("videos", file);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/videos/upload`,
        {
          method: "POST",
          body: formdata,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout");
      }

      setMessage("Vidéos ajoutées avec succès !");

      setTitle("");
      setDescription("");
      setVideoFiles([]);

      e.target.reset();
    } catch (error) {
      console.log(error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/videos/videos`,
      );
      const data = await response.json();
      setVideos(data.videos);
    } catch (error) {
      console.log(error.message);
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Container>
      <h1>Ajouter des vidéos</h1>

      <Form onSubmit={ajouterVideo}>
        <div>
          <Label htmlFor="title">Titre</Label>

          <Input
            id="title"
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>

          <Textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="videos">Vidéos</Label>

          <Input
            id="videos"
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => {
              setVideoFiles(Array.from(e.target.files));
            }}
            required
          />
        </div>

        {videoFiles.length > 0 && (
          <div>
            <p>{videoFiles.length} vidéo(s) sélectionnée(s)</p>

            {videoFiles.map((file, index) => (
              <p key={index}>{file.name}</p>
            ))}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Upload en cours..." : "Ajouter les vidéos"}
        </Button>

        {message && <p>{message}</p>}
      </Form>

      <div>
        {videos.map((video) => (
          <div key={video._id}>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <video controls width="400">
              <source src={video.url} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Video;
