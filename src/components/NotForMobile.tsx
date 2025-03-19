import styled from "styled-components";
import Text from "./Text";

const Container = styled.div`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content; center;
`;

const Wrapper = styled.div`
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
`;

const NotForMobile = () => {
  return (
    <Container>
      <Wrapper>
        <Text
          as="h1"
          fontFamily="Space Grotesk"
          fontSize="font24"
          fontWeight={600}
          textAlign="center"
          style={{ marginBottom: 16 }}
        >
          Oops !
        </Text>
        <Text textAlign="center">
          Notre site n'est pas adapté pour ce format, veuillez agrandir la
          fenêtre.
        </Text>
      </Wrapper>
    </Container>
  );
};

export default NotForMobile;
