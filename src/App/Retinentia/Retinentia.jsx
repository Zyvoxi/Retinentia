import * as React from 'react';
import { Box, alpha, Typography } from '@mui/material';
import PlayScreen from './Components/PlayScreen';

// Função para criar um atraso usando uma promessa
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function Retinentia() {
  // Estados do componente
  const [clickedButtons, setClickedButtons] = React.useState([]); // Botões clicados pelo usuário
  const [currentGame, setCurrentGame] = React.useState([]); // Sequência atual do jogo
  const [currentUserTry, setCurrentUserTry] = React.useState(null); // Tentativa atual do usuário
  const [GameOver, setGameOver] = React.useState(false); // Indica se o jogo terminou
  const [level, setLevel] = React.useState(1); // Nível atual do jogo
  const [isInSequence, setIsInSequence] = React.useState(false); // Indica se o jogo está exibindo uma sequência
  const [started, setStarted] = React.useState(false); // Indica se o jogo foi iniciado
  const [GOverPlay, setGOverPlay] = React.useState(false); // Indica se o efeito de game over está ativo

  // Definição das cores dos botões
  const Buttons = React.useMemo(
    () => [
      { color: '#f00' }, // Vermelho
      { color: '#0f0' }, // Verde
      { color: '#00f' }, // Azul
      { color: '#ff0' }, // Amarelo
    ],
    [],
  );

  const [audioCtx, setAudioCtx] = React.useState(null); // Contexto de áudio

  // Efeito para inicializar o contexto de áudio
  React.useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.error('AudioContext não é suportado neste navegador.');
      return;
    }
    setAudioCtx(new AudioContext());
  }, []);

  // Função para gerar um número aleatório seguro
  const secureRandom = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 0x100000000;
  };

  // Função para iniciar ou avançar o jogo para o próximo nível
  const startGame = React.useCallback(() => {
    if (GameOver) return;
    setCurrentUserTry(null);
    setCurrentGame((prevCGame) => {
      const newGame = [...prevCGame, Math.floor(secureRandom() * 4)];
      return newGame;
    });
  }, [GameOver]);

  // Função para tocar um tom de áudio
  const playTone = React.useCallback(
    (freq) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      const fadeTime = 0.05; // Aumenta o tempo de fade para 50ms

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.8, now + fadeTime);

      oscillator.start(now);

      gainNode.gain.linearRampToValueAtTime(0, now + 0.2 + fadeTime);
      oscillator.stop(now + 0.2 + fadeTime * 2);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    },
    [audioCtx],
  );

  // Função para adicionar um índice à lista de botões clicados e removê-lo após um tempo
  const addIndexWithTimeout = (index) => {
    setClickedButtons((prev) => [...prev, index]);
    setTimeout(() => {
      setClickedButtons((prev) => prev.filter((idx) => idx !== index));
    }, 200);
  };

  // Função para reproduzir a sequência de jogo atual
  const playSequence = React.useCallback(
    async (sequence) => {
      try {
        setIsInSequence(true);
        for (const element of sequence) {
          if (GameOver) break;
          addIndexWithTimeout(element);
          await delay(400); // Total de delay para cada elemento
        }
      } catch (error) {
        console.error('Error during sequence playback:', error);
      } finally {
        setIsInSequence(false);
      }
    },
    [GameOver],
  );

  // Função para iniciar o jogo após um atraso
  const handlePlay = async () => {
    setStarted(true);
    await delay(1000);
    startGame();
  };

  // Função para executar a sequência de game over
  const playGameOver = React.useCallback(async () => {
    setIsInSequence(true);
    for (let index = 0; index < 6; index++) {
      await delay(500);
      setGOverPlay((PrevGOverPlay) => !PrevGOverPlay);
      playTone(800);
    }

    await delay(500);

    setGameOver(false);
    setCurrentGame([]);
    setLevel(1);

    await delay(1000);

    startGame();
    setIsInSequence(false);
  }, [playTone, startGame]);

  // Função para verificar se a jogada atual do usuário está correta
  const verifyCurrentPlay = React.useCallback(
    async (index) => {
      const current = currentUserTry === null ? 0 : currentUserTry + 1;
      if (index === currentGame[current]) {
        if (current + 1 === currentGame.length) {
          setLevel((prevLevel) => prevLevel + 1);
          setCurrentUserTry(null);
          await delay(1000);
          startGame();
        } else {
          setCurrentUserTry(current);
        }
      } else {
        await delay(200);
        setGameOver(true);
        if (!GameOver) playGameOver();
        setCurrentUserTry(null);
      }
    },
    [currentUserTry, currentGame, GameOver, startGame, playGameOver],
  );

  // Função para lidar com cliques nos botões do jogo
  const handleClick = React.useCallback(
    (index) => {
      if (isInSequence || GameOver) return;

      addIndexWithTimeout(index);
      verifyCurrentPlay(index);
    },
    [isInSequence, GameOver, verifyCurrentPlay],
  );

  // Função para retornar a cor de fundo com base no estado do jogo
  const getBackgroundColor = (isGameOver, isGOverPlay, theme) => {
    /* eslint-disable prettier/prettier */
    return typeof isGameOver !== 'undefined' && isGameOver
      ? alpha(
        theme.palette.error.main,
        typeof isGOverPlay !== 'undefined' && isGOverPlay ? 1 : 0.5,
      )
      : null;
    /* eslint-enable prettier/prettier */
  };

  // Efeito para reproduzir a sequência de jogo quando ela muda
  React.useEffect(() => {
    if (currentGame.length > 0) {
      playSequence(currentGame);
    }
  }, [currentGame, playSequence]);

  // Efeito para tocar um tom quando um botão é clicado
  React.useEffect(() => {
    if (clickedButtons.length > 0) {
      const lastIndex = clickedButtons[clickedButtons.length - 1];
      playTone((lastIndex + 4) * 100);
    }
  }, [clickedButtons, playTone]);

  return (
    <>
      <Box
        display={'grid'}
        gridTemplateColumns={'repeat(2, 1fr)'}
        bgcolor={'#0e0e0e'}
        height={'100vh'}
        alignItems={'center'}
        justifyItems={'center'}
      >
        {Buttons.map((button, index) => (
          <Box
            key={index}
            onClick={() => handleClick(index)}
            sx={(theme) => ({
              display: 'flex',
              /* eslint-disable prettier/prettier */
              bgcolor: GameOver
                ? getBackgroundColor(GameOver, GOverPlay, theme)
                : alpha(
                  button.color,
                  clickedButtons.includes(index) ? 1.0 : 0.5,
                ),
              /* eslint-enable prettier/prettier */
              boxShadow: GOverPlay
                ? `0 0 15px ${alpha(theme.palette.error.main, 0.5)}`
                : clickedButtons.includes(index)
                  ? `0 0 15px ${alpha(button.color, 0.5)}`
                  : '',
              height: '97%',
              width: '98.5%',
              borderRadius: 4,
              transition: 'cubic-bezier(0.4, 0, 0.25, 0.6) 0.2s',
              '&:hover': {
                cursor: isInSequence ? 'auto' : 'pointer',
              },
            })}
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            bgcolor: '#0e0e0e',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            transform: 'translateX(-50%)',
            left: '50%',
            top: 0,
          }}
        >
          <Typography variant='subtitle1' color='white'>
            <b>Level: {level}</b>
          </Typography>
        </Box>
      </Box>
      <PlayScreen started={started} handlePlay={handlePlay} />
    </>
  );
}
