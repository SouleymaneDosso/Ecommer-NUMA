import styled, {keyframes}  from 'styled-components'

const rotate = keyframes`from{
transform: rotate(0deg);
}
 to{
 transform: rotate(360deg);
 }` 

 export const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
  margin: 20px auto;
`