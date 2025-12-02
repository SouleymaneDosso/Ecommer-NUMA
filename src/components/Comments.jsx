import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 2rem;
`;

const Comment = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const UserName = styled.span`
  font-weight: 700;
  margin-right: 0.5rem;
`;

const Note = styled.span`
  font-weight: 600;
  color: #f59e0b;
`;

export default function Comments({ commentaires }) {
  return (
    <Wrapper>
      <h3>Commentaires ({commentaires?.length || 0})</h3>

      {commentaires?.map((c, i) => (
        <Comment key={i}>
          <UserName>{c.user} :</UserName>
          {c.texte} — <Note>{c.note}★</Note>
        </Comment>
      ))}
    </Wrapper>
  );
}
