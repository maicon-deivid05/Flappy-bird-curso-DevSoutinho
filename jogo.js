console.log('[DevSoutinho] Flappy Bird');

let frames = 0;
const somHit = new Audio();
const somcaiu = new Audio();
const sompulo = new Audio();
const somponto = new Audio();
const sombateu = new Audio();



somHit.src ='./efeitos/hit.wav';
somcaiu.src ='./efeitos/caiu.wav';
somponto.src ='./efeitos/ponto.wav';
sompulo.src ='./efeitos/pulo.wav';
sombateu.src ='./efeitos/bateu.wav';


const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//[Tela de inicio]
const mensangemFlappyBird ={
  sX:134,
  sY:0,
  w:174,
  h:152,
  x:(canvas.width / 2) - 174 / 2,
  y: 50,
  desenha(){
    contexto.drawImage(
      sprites,
      mensangemFlappyBird.sX,mensangemFlappyBird.sY,
      mensangemFlappyBird.w,mensangemFlappyBird.h,
      mensangemFlappyBird.x,mensangemFlappyBird.y,
      mensangemFlappyBird.w,mensangemFlappyBird.h
    );
  }

}

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};
// [Chao]
function criaChao(){
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza(){
      const movimentoDoChao = 1;
      const repeteChao = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao

      // console.log('[chao.x]', chao.x);
      // console.log('[repeteEm]',repeteChao);
      // console.log('[movimentacao]', movimentacao % repeteChao);
      
      chao.x = movimentacao % repeteChao;
      
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
  
    },
  };
  return chao
}



function fazColisao(flappyBird,chao){
   const flappyBirdY = flappyBird.y + flappyBird.altura;
   const chaoY = chao.y
    if(flappyBirdY >= chaoY){
      return true
    }
    return false
}

function criaFlappyBird(){
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
     //console.log('devo pular');
      //console.log('[antes]', flappyBird.velocidade);
      flappyBird.velocidade =  - flappyBird.pulo;
      sompulo.play();
      //console.log('[depois]', flappyBird.velocidade);
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if(fazColisao(flappyBird, globais.chao)) {
        console.log('Fez colisao');
        somcaiu.play();


        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);
        return;
        
      }
  
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 , }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio 
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {     
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      // console.log('passouOIntervalo', passouOIntervalo)

      if(passouOIntervalo
        ) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }
        // console.log('[incremento]', incremento);
        // console.log('[baseRepeticao]',baseRepeticao);
        // console.log('[frame]', incremento % baseRepeticao);
    },
    desenha() {
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;  
};

function criaCanos() {
  const canos = {
    largura : 52,
    altura: 420,
    chao:{
      spriteX: 0,
      spriteY: 169,
    },
    ceu:{
      spriteX:52,
      spriteY:169,
    },
    espaco: 80,

    desenha(){
      canos.pares.forEach(function(par){
        const yRand = par.y;
        const espacamentoEntreCanos = 90;
  
        const canoCeuX = par.x;
        const canoCeuY = yRand;

        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
  
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRand;
  
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })

    },
    temColisaoComOFlappyBirg(par){
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if(globais.flappyBird.x >= par.x){
        console.log('Flappy bateu');

        if(cabecaDoFlappy <= par.canoCeu.y){
          return true
        }
        
        if(peDoFlappy >= par.canoChao.y){
          return true
          
        }
      
        return false;
      }
    },
    pares: [],
    atualiza(){
      const passo100Frame = frames % 100 === 0 ;
      if(passo100Frame){
      //  console.log( 'Passou 100 frames');
        canos.pares.push({
            x: canvas.width ,
            y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function(par){
        par.x = par.x - 2;

        if(canos.temColisaoComOFlappyBirg(par)){
          console.log('Você perdeu')
          sombateu.play();

          mudaParaTela(Telas.INICIO);

          
        }

        if(par.x + canos.largura <= 0){
          canos.pares.shift();
        }
      });



    }
  }
  return canos;
}


// [telas]

const globais = {};

let telaAtiva = {};
function mudaParaTela(novaTela){
  telaAtiva = novaTela;

  if(telaAtiva.inicializa){

    telaAtiva.inicializa();
  }
};

const Telas ={
  INICIO:{
    inicializa(){
      globais.flappyBird= criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha(){
      planoDeFundo.desenha();
      globais.flappyBird.desenha();

      globais.chao.desenha();
      mensangemFlappyBird.desenha();
          
    },
    click(){
      mudaParaTela(Telas.Jogo)
    },
    atualiza(){
      globais.chao.atualiza();
    }
  }
};
  Telas.Jogo = {
  desenha(){
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click(){
    globais.flappyBird.pula();
  },
  atualiza(){
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
  }
};  

function loop(){

  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1; 
  requestAnimationFrame(loop);
}


window.addEventListener('click',function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
});


mudaParaTela(Telas.INICIO)
loop();