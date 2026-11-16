import { useState, useEffect, useMemo, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Bounds,
  Environment,
} from "@react-three/drei";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiBox,
} from "react-icons/fi";

/* ========================================
   ANIMATIONS
======================================== */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const zoomIn = keyframes`
  from { opacity: 0; transform: scale(1.035); }
  to { opacity: 1; transform: scale(1); }
`;

/* ========================================
   STYLES
======================================== */

const Wrapper = styled.div`
  width: 100%;
  min-width: 0;
  color: #171717;
  font-family: inherit;
  animation: ${fadeIn} 0.6s ease both;
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: ${({ $hasThumbnails }) =>
    $hasThumbnails ? "76px minmax(0, 1fr)" : "minmax(0, 1fr)"};
  gap: 14px;
  align-items: stretch;
  width: 100%;

  @media (max-width: 650px) {
    display: flex;
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

const Thumbnails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 780px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 650px) {
    flex-direction: row;
    width: 100%;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 4px;
  }
`;

const Thumbnail = styled.button`
  position: relative;
  flex-shrink: 0;
  width: 76px;
  height: 94px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: #f0efed;
  border: 1px solid ${({ $active }) => ($active ? "#171717" : "#e7e5e2")};
  opacity: ${({ $active }) => ($active ? 1 : 0.68)};
  transition: 0.25s ease;

  &:hover {
    opacity: 1;
    border-color: #171717;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 650px) {
    width: 65px;
    height: 76px;
  }
`;

const ThreeThumbnail = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: #e8e6e2;
  color: #222;

  svg {
    font-size: 23px;
  }

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
  }
`;

const Stage = styled.div`
  position: relative;
  width: 100%;
  height: min(78vh, 820px);
  min-height: 480px;
  overflow: hidden;
  isolation: isolate;
  background: #eae8e4;
  animation: ${zoomIn} 0.55s ease both;

  @media (max-width: 650px) {
    width: 100vw;
    height: 100svh;
    min-height: 100svh;
    margin-left: calc((100% - 100vw) / 2);
  }
`;

const ProductImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  cursor: zoom-in;
  animation: ${zoomIn} 0.6s ease both;
`;

const ModelStage = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #eae8e4;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: pan-y;
  }
`;

const Label = styled.div`
  position: absolute;
  z-index: 5;
  top: 20px;
  left: 20px;
  padding: 10px 13px;
  background: rgba(255, 255, 255, 0.78);
  color: #222;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  backdrop-filter: blur(12px);

  @media (max-width: 650px) {
    top: 13px;
    left: 13px;
    font-size: 8px;
  }
`;

const Controls = styled.div`
  position: absolute;
  z-index: 6;
  right: 18px;
  bottom: 18px;
  display: flex;
  gap: 9px;
`;

const IconButton = styled.button`
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #171717;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: #171717;
    color: white;
    transform: scale(1.08);
  }
`;

const Navigation = styled.div`
  position: absolute;
  z-index: 6;
  top: 50%;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
`;

const NavButton = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
  color: #171717;
  cursor: pointer;
  pointer-events: auto;
  transition: 0.25s ease;

  &:hover {
    background: #171717;
    color: white;
  }
`;

const Counter = styled.div`
  position: absolute;
  z-index: 5;
  bottom: 31px;
  left: 20px;
  color: #555;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  pointer-events: none;
`;

const Fullscreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  width: 100%;
  height: 100%;
  background: #111;
  overflow: hidden;
`;

const FullscreenImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  height: auto;
  max-width: 90vw;
  max-height: 82vh;
  object-fit: contain;
  display: block;
  transform: translate(-50%, -50%);
`;

const FullscreenModel = styled.div`
  position: absolute;
  inset: 0;
  background: #eae8e4;

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  z-index: 10;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
`;

const FullscreenNavigation = styled(Navigation)`
  left: 20px;
  right: 20px;
`;

/* ========================================
   3D MODEL
======================================== */

function ProductModel({ url }) {
  const { scene } = useGLTF(url);

  return (
    <Bounds fit clip observe margin={1.3}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

function ModelViewer({ url }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#eae8e4"]} />

      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 5]} intensity={2} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={1} />

      <Environment preset="studio" />

      <ProductModel url={url} />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={2}
        maxDistance={8}
      />
    </Canvas>
  );
}

/* ========================================
   MAIN COMPONENT
======================================== */

export default function ProductImages({ images = [], model3D = null }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const thumbnailRefs = useRef([]);

  const urls = useMemo(() => {
    return images
      .filter((img) => img?.url)
      .map((img) => ({
        url: img.url,
        title: img.title || "",
        type: "image",
      }));
  }, [images]);

  const hasModel = Boolean(model3D?.url);

  const items = useMemo(() => {
    return [
      ...urls,
      ...(hasModel
        ? [
            {
              url: model3D.url,
              title: "Modèle 3D",
              type: "3d",
            },
          ]
        : []),
    ];
  }, [urls, hasModel, model3D?.url]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items.length, model3D?.url]);

  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedIndex]);

  useEffect(() => {
    if (!isFullscreen) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);

      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
      }

      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, items.length]);

  const previousItem = () => {
    setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextItem = () => {
    setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (!items.length) return null;

  const activeItem = items[selectedIndex];

  const renderActiveContent = (fullscreen = false) => {
    if (activeItem.type === "3d") {
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModelViewer key={activeItem.url} url={activeItem.url} />
        </div>
      );
    }

    if (fullscreen) {
      return (
        <FullscreenImage
          src={activeItem.url}
          alt={activeItem.title || "Photo du produit"}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    return (
      <ProductImage
        key={activeItem.url}
        src={activeItem.url}
        alt={activeItem.title || "Photo du produit"}
        onClick={() => setIsFullscreen(true)}
      />
    );
  };

  return (
    <Wrapper>
      <Gallery $hasThumbnails={items.length > 1}>
        {items.length > 1 && (
          <Thumbnails>
            {items.map((item, index) => (
              <Thumbnail
                key={`${item.url}-${index}`}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                type="button"
                $active={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
                aria-label={
                  item.type === "3d"
                    ? "Voir le modèle 3D"
                    : `Voir la photo ${index + 1}`
                }
              >
                {item.type === "3d" ? (
                  <ThreeThumbnail>
                    <FiBox />
                    <span>3D VIEW</span>
                  </ThreeThumbnail>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title || `Photo ${index + 1}`}
                  />
                )}
              </Thumbnail>
            ))}
          </Thumbnails>
        )}

        <Stage>
          <Label>
            {activeItem.type === "3d"
              ? "NUMA · 3D EXPERIENCE"
              : "NUMA · COLLECTION"}
          </Label>

          {activeItem.type === "3d" ? (
            <ModelStage>
              <ModelViewer key={activeItem.url} url={activeItem.url} />
            </ModelStage>
          ) : (
            renderActiveContent()
          )}

          {items.length > 1 && (
            <Navigation>
              <NavButton
                type="button"
                onClick={previousItem}
                aria-label="Élément précédent"
              >
                <FiChevronLeft size={20} />
              </NavButton>

              <NavButton
                type="button"
                onClick={nextItem}
                aria-label="Élément suivant"
              >
                <FiChevronRight size={20} />
              </NavButton>
            </Navigation>
          )}

          <Counter>
            {String(selectedIndex + 1).padStart(2, "0")}
            {" / "}
            {String(items.length).padStart(2, "0")}
          </Counter>

          <Controls>
            <IconButton
              type="button"
              onClick={() => setIsFullscreen(true)}
              aria-label="Plein écran"
            >
              <FiMaximize2 size={18} />
            </IconButton>
          </Controls>
        </Stage>
      </Gallery>

      {isFullscreen && (
        <Fullscreen onClick={() => setIsFullscreen(false)}>
          {activeItem.type === "3d" ? (
            <FullscreenModel>
              <ModelViewer
                key={`fullscreen-${activeItem.url}`}
                url={activeItem.url}
              />
            </FullscreenModel>
          ) : (
            renderActiveContent(true)
          )}

          <CloseButton
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Fermer"
          >
            <FiX size={21} />
          </CloseButton>

          {items.length > 1 && (
            <FullscreenNavigation>
              <NavButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  previousItem();
                }}
                aria-label="Élément précédent"
              >
                <FiChevronLeft size={22} />
              </NavButton>

              <NavButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextItem();
                }}
                aria-label="Élément suivant"
              >
                <FiChevronRight size={22} />
              </NavButton>
            </FullscreenNavigation>
          )}
        </Fullscreen>
      )}
    </Wrapper>
  );
}
