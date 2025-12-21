import { FaHeart } from "react-icons/fa";
import styled from "styled-components";

const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#ef4444" : "#9ca3af")};
  font-size: 1.6rem;
  transition: transform 0.2s ease, color 0.2s;

  &:hover {
    transform: scale(1.15);
  }
`;

export default function FavoriteButton({ active, onClick }) {
  return (
    <Button $active={active} onClick={onClick}>
      <FaHeart />
    </Button>
  );
}
