# Simulador Orbital 2D
 ## Simulador de orbitas baseado na mecânica newtoniana aplicado em duas dimensões feito em JavaScripit
 ***
 ### Tabela de Conteúdo
  - [Sobre](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#simulador-orbital-2d)
  - [Tabela de Conteúdo](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#tabela-de-conteudo)
  - [Status](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#status)
  - [Features](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#features)
  - [Como Usar](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#como-usar)
  - [Como Funciona](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#como-funciona)
  - [Autor](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#autor)
  - [Licença](https://github.com/ViniciusPerillo/Simulador-Orbital-2D-em-JavaScripit#licença)
 ***
 ### Status
  #### 🚧 Em contrução... 🚧
   - Completamente testável, entretanto não é possível apagar astros.
 ***
 ### Features
  - #### Interface
   - [x] Header e lugar das escalas
   - [x] Arrastar e zoom
   - [x] Criação de astros
   - [ ] Seleção e exclusão de astros
   - [ ] Rastro do astro
   - [ ] Box com dados do astro selecionado
  - #### Simulador
   - [x] Vetores 
   - [x] Astro
   - [x] Aplicação da Gravitação Universal
   - [x] Colisões
 ***
 ### Como usar
  #### Controles
  Teclas|Ações
  :---:|:---:
  ![Spacebar](https://user-images.githubusercontent.com/76188994/112848308-5027d980-907e-11eb-879d-884fcfb9055c.png) | Play/pause a simulação
  ![keys](https://user-images.githubusercontent.com/76188994/112862780-810f0b00-908c-11eb-9a6e-968c5e4c7bd7.png) | Aumentar escala de tempo </br></br></br> Diminuir escala de tempo </br></br></br> Aumentar unidade da escala de tempo <br/></br></br> Diminuir a unidade da escala de tempo
  ![escape](https://user-images.githubusercontent.com/76188994/112864481-3b534200-908e-11eb-8878-3f7ebca374c3.png) | Cancela ações e abre/fecha menu de configurações
  ![add](https://user-images.githubusercontent.com/76188994/112864765-866d5500-908e-11eb-93a1-d557e1c862db.png) | Abre o menu de adição de novo astro
  ![delete](https://user-images.githubusercontent.com/76188994/112864890-a43aba00-908e-11eb-97c6-4da8e13b9f6a.png) | Deleta astro selecionado </br> *Feature não adicionada*
  ![asterisco](https://user-images.githubusercontent.com/76188994/112865230-f085fa00-908e-11eb-930b-4df9fba61195.png) | Ativa/desativa rastro deixado pelo astro </br> *Feature não adicionada*

 #### Modos
 Modo| definicão
 :---:|:---:
 Modo Normal | O simulador funciona a uma taxa de 30 frames por segundo, assim, quando a escala de tempo muda, o tempo [em segundos] passado para as operações muda, podendo causa inprecisões
 Modo de Precisão | O tempo passado para as operações é fixo na escala escolhida, assim, quando a escala de tempo muda, a taxa de frames muda, podendo causar crashes se houver uma difereça muito grande entre a escala escolhida no modo de precisão e a escala de tempo. Ex: escala de precisão = __segundos__, escala de tempo = __horas__, taxa de fps = __3600__
 ***
### Como Funciona
Ao apertar a barra de espaço, o simulador inicia o processo para calcular a nova posição de cada astro que mudaram devido a interação gravitacional
#### 1. Cálculo da Aceleração resultante:
Analisando a Lei da gravitação de Newton F = G×M×m/d² podemos chegar em campo gravitacional g = G×M/d², dessa forma é possível calcular o campo que cada astro atua no astro alvo, obtendo uma aceleração resultante atuante no astro alvo. O processo é aplicado em todos os astros
#### 2. Componentes da Aceleração resultando
O movimento gerado por uma interação gravitacional é tanto retilíneo quanto circular, dessa forma é preciso decompor a aceleração resultando nas componentes centrípeta e tangencial, responsáveis pelo movimento circular e retilíneo, respectivamente. Para isso usa-se o vetor velocidade que atua no astro alvo, assim a aceleração centripeta tera o seu ângulo a 90° no sentido horário ou anti-horário em relação ao vetor velocidade e a aceleração tangencial terá o mesmo ângulo do vetor velocidade, contudo com módulo negativo se o movimento for retardado e positivo se for acelerado.
O problema disso é que há duas possibilidades para cada vetor:
##### 2.1. Aceleração Centrípeta
Para saber se a aceleração centrípeta está a 90° no sentido horário ou anti-horário é preciso descobrir o sentido da órbita, se está no sentido horário ou anti-horário, adicionando 90° no mesmo sentido da órbita. Para isso o código calcula o seno do [ângulo polar](https://pt.wikipedia.org/wiki/Coordenadas_polares) do vetor aceleração menos o [ângulo polar](https://pt.wikipedia.org/wiki/Coordenadas_polares) do vetor velocidade(sen(θa - θv)), caso seja positivo a órbita está no sentido anti-horário e se for negativo a órbita está no sentido horário
##### 2.2. Aceleração Tangencial
Com a aceleração centípeta o que resta é descobrir se o módulo do vetor aceleração tangencial será positivo ou negativo, para isso o código subtrai o [ângulo polar](https://pt.wikipedia.org/wiki/Coordenadas_polares) do vetor aceleração do [ângulo polar](https://pt.wikipedia.org/wiki/Coordenadas_polares) do vetor aceleração centrípeta(θa<sub>c</sub> - θa), na órbita horária, se a soma der positivo, o movimento é retardado, se der negativo o movimento é acelerado, na órbita anti-horária se a soma der positivo o movimento é acelerado e se der negativo o movimento é retardado. Em caso de movimento retardado o módulo da aceleração tangencial sera negativo.
#### 3. Movimento retilíneo
Com as duas componentes do vetor aceleração podemos calcular a nova posição X e Y no astro, já que a tela pode ser interpretada como um plano cartesiano. Utiliza-se a função horária da posição de segundo grau, que utiliza a aceleração tangencial, o código realiza a função duas vezes, uma utilizando a projeção dos vetores no eixo x e outra no eixo y, calculando assim a nova posição do astro. 
#### 4. Movimento circular
Com a nova posição encontrada podemos atualizar o vetor velocidade. Primeiro precisamos curvar o vetor velocidade, e quem é responsável por isso é a aceleração centrípeta. Através da função de aceleração centrípeta a<sub>c</sub> = v×ω podemos chegar em Δθ = Δt×a<sub>c</sub>/v e a partir disso calculamos o novo ângulo de nosso vetor velocidade, somando o Δθ caso a órbita seja anti-horária e subtraindo caso seja horária.
Após isso calculamos o novo módulo do vetor velocidade através da função horária da velocidade, usando a aceleração tangencial novamente.
Analisando esse processo pode-se ver que quanto menor for a escala temporal, mais preciso a simulação fica, pois como o movimento de órbita não é uniformemente variado e sim variado por completo, causando mais imprecisões quanto maior a escala 

  #### 🚧 Em contrução... 🚧
 ***
 ### Autor
  #### Feito por Vinícius Gonçalves Perillo
  [![Gmail Badge](https://img.shields.io/badge/-vinicius.perillo25@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:vinicius.perillo25@gmail.com)](mailto:vinicius.perillo25@gmail.com)
 ***
 ### Licença
  ![image](https://user-images.githubusercontent.com/76188994/110950964-40409380-8323-11eb-8e72-bb8ff54c6c79.png)
 ***
