import * as React from 'react';
import { Box, Typography, Button, Link, styled, alpha } from '@mui/material';
import PropTypes from 'prop-types';

const FooterText = styled(Typography)({
  fontSize: '1em',
  letterSpacing: '.15em', // Define o espaçamento entre as letras
  color: '#f0f0f0',
  animation: 'glow cubic-bezier(0.4, 0, 0.25, 0.6) 20s infinite',
  '@keyframes glow': {
    '0%': {},
    '12%': {
      textShadow: '0 0 8px #fffe',
    },
    '24%': {
      textShadow: '0 0 8px #fff0',
    },
    '100%': {},
  },
});

// Cria um componente de botão de texto estilizado para links
const TextButton = styled(Link)({
  color: '#f0f0ff', // Define a cor do texto com opacidade
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif', // Define a fonte
  fontWeight: 700, // Define o peso da fonte como negrito
  fontSize: '0.90em', // Define o tamanho da fonte
  whiteSpace: 'pre-wrap', // Mantém as quebras de linha e espaços em branco
  alignSelf: 'baseline', // Alinha-se à linha de base
  position: 'relative', // Necessário para o posicionamento dos pseudo-elementos
  overflow: 'hidden', // Oculta conteúdo que ultrapassa o tamanho do elemento
  textDecoration: 'none',
  '&:hover': {
    cursor: 'pointer', // Muda o cursor para indicar que é clicável ao passar o mouse
  },
  '&::after': {
    content: '""', // Cria um pseudo-elemento vazio
    position: 'absolute', // Posição absoluta para controlar a posição
    bottom: 0, // Alinha na parte inferior
    left: 0, // Alinha à esquerda
    width: '100%', // Largura total do elemento
    height: '0.05em', // Altura da linha inferior
    backgroundColor: '#d0d0e0', // Cor da linha com opacidade
    opacity: 1, // Opacidade total
    transform: 'translate3d(-101%, 0, 0)', // Move a linha para fora à esquerda
    transition: 'cubic-bezier(0.4, 0, 0.25, 0.6) 500ms', // Transição suave para o efeito hover
  },
  '&:hover::after': {
    transform: 'translate3d(0, 0, 0)', // Move a linha para a posição original ao passar o mouse ou focar
  },
});

export default function PlayScreen({ started, handlePlay }) {
  const [opacity, setOpacity] = React.useState(1);
  const [display, setDisplay] = React.useState('flex');

  React.useEffect(() => {
    if (started) {
      setOpacity(0);
      setTimeout(() => {
        setDisplay('none');
      }, 350);
    }
  }, [started]);

  return (
    <Box
      sx={{
        display: display,
        justifyContent: 'center',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        bgcolor: alpha('#505060', 0.1),
        backdropFilter: 'blur(20px)',
        opacity: opacity,
        transition: 'cubic-bezier(0.4, 0, 0.25, 0.6) all 0.35s',
      }}
    >
      <Typography
        variant='h1'
        // tamanho de fonte responsiva
        fontSize={{ xs: '3em', sm: '4em', md: '5em' }}
        fontWeight={700}
        letterSpacing={'.15em'}
        mt={10}
        color='#d0d0e0'
      >
        <b>Retinentia</b>
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      >
        <Button
          variant='contained'
          onClick={() => handlePlay()}
          sx={{
            color: '#007bff',
            height: 50,
            width: 150,
            borderRadius: 3,
          }}
        >
          <Typography
            color='white'
            fontWeight={700}
            letterSpacing={'.15em'}
            align='center'
          >
            Play
          </Typography>
        </Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          transform: 'translate(-50%, 50%)',
          left: '50%',
          bottom: { xs: '15%', md: '12%' },
        }}
      >
        <FooterText
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Feito por&nbsp;
          <TextButton
            href='https://github.com/Zyvoxi'
            target='_blank'
            rel='noopener noreferrer'
            sx={{
              transform: 'translateY(2px)',
            }}
          >
            Zyvoxi
          </TextButton>
        </FooterText>
      </Box>
    </Box>
  );
}

PlayScreen.propTypes = {
  started: PropTypes.bool.isRequired,
  handlePlay: PropTypes.func.isRequired,
};
