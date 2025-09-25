# Plugins — AncientSouls

Este diretório contém plugins personalizados usados pelo projeto AncientSouls. Este README documenta o plugin

## AS_BattlePositions

- Arquivo: `js/plugins/AS_BattlePositions.js`
- Versão atual: 1.0.5
- Autor(es): Necromante96Official & GitHub Copilot
- Objetivo: ajustar a posição dos sprites de atores e inimigos em batalhas laterais (side-view) com sistema de layouts
	automáticos (diagonal, horizontal, vertical, escada, escadaInvertida, grid) e presets de resolução que calculam 
	posições usando `Graphics.width`/`Graphics.height` para escala automática.

### Como instalar / usar

1. Coloque o plugin `AS_BattlePositions.js` em `js/plugins/`.
2. Ative o plugin no Gerenciador de Plugins do RPG Maker MZ.
3. Configurações importantes (v1.0.5 - Simplificada):
	 - `Preset`: escolha uma resolução pré-definida (1920x1080, 1366x768 ou 1280x720) para escala automática.
	 - `ActorLayout`: formação dos atores (diagonal, horizontal, vertical, escada, escadaInvertida, grid).
	 - `EnemyLayout`: formação dos inimigos (diagonal, horizontal, vertical, escada, escadaInvertida, grid, troop).
	 - `EnableDebugOverlay`: ativa overlay visual para depuração (cruzes vermelhas=atores, verdes=inimigos).
	 - `ActorGridCols`/`EnemyGridCols`: número de colunas quando layout = grid.
	 - Nota: versão simplificada usa ratios fixos otimizados, sem necessidade de ajustes manuais complexos.

### Histórico de versões

- v1.0.0 — Criação inicial
	- Autor: Necromante96Official & GitHub Copilot
	- Introduziu parâmetros básicos para controlar posição de atores e offsets de inimigos.
	- Hooks usados: `Sprite_Actor.prototype.setActorHome`, `Sprite_Enemy.prototype.setBattler`.

- v1.0.1 — Escala automática e suporte a presets (estrutura)
	- Data (assumida): 25/09/2025
	- Autor: Necromante96Official & GitHub Copilot
	- Adicionou cálculo de fator de escala (ScaleMode: none/width/height/min/max) baseado em `Graphics.width`/`Graphics.height`.
	- Aplicou `SCALE` a ActorBaseX/ActorBaseY/ActorSpacing e a EnemyOffset para manter a composição em resoluções diferentes.
	- Observação: Preset é suportado como parâmetro, mas mapeamentos finos por preset ainda precisam ser ajustados manualmente.

 - v1.0.2 — Presets funcionais (cálculo relativo)
	- Data (assumida): 25/09/2025
	- Autor: Necromante96Official & GitHub Copilot
	- Adicionado parâmetro `Preset` com presets prontos (1920x1080, 1366x768, 1280x720).
	- `setActorHome` e `setBattler` atualizados para calcular posições relativas usando `Graphics.width`/`Graphics.height` quando `Preset` ativo.
	- Compatibilidade: quando `Preset` vazio, comportamento igual às versões anteriores (parâmetros manuais + cálculo de escala).
	- Observação: nesta versão ainda não há integração com menu de Opções nem persistência automática.

- v1.0.3 — Snap-to-grid, alinhamento e espaçamento uniforme
	- Data: 25/09/2025
	- Autor: Necromante96Official & GitHub Copilot
	- Novos parâmetros:
		- `EnableSnap` (boolean): ativa snap-to-grid ao posicionar sprites.
		- `GridSizeX`, `GridSizeY` (number): define o tamanho do grid para snap.
		- `AlignMode` (select: center/left/right): alinhamento horizontal para posicionamento.
		- `UniformSpacing` (boolean): distribui uniformemente os atores na largura disponível.
	- Implementadas funções auxiliares: `snapToGrid`, `computeUniformSpacing`, `applyAlignmentAndSnap`.

- v1.0.4 — Sistema de layouts de formação
	- Data: 25/09/2025
	- Autor: Necromante96Official & GitHub Copilot
	- Novos parâmetros: `ActorLayout`, `EnemyLayout`, `ActorGridCols`, `EnemyGridCols`.
	- Implementados layouts: diagonal, horizontal, vertical, escada, escadaInvertida, grid.
	- Layout 'troop' (inimigos): mantém posições originais do editor de tropas.
	- Adicionadas funções: `normalizeLayout()`, `computeActorPositions()`, `computeEnemyPositions()`.
	- Integração com `Scene_Battle` para aplicar layouts automaticamente.

- v1.0.5 — Versão simplificada (atual)
	- Data: 25/09/2025
	- Autor: Necromante96Official & GitHub Copilot
	- **REMOVIDOS** parâmetros complexos: ActorBaseX/Y, ActorSpacingX/Y, EnemyOffsetX/Y, EnableSnap, GridSizeX/Y, AlignMode, UniformSpacing.
	- **MANTIDOS** apenas essenciais: Preset, EnableDebugOverlay, ActorLayout, EnemyLayout, ActorGridCols, EnemyGridCols.
	- Posicionamento baseado em ratios fixos otimizados para diferentes resoluções.
	- Adicionado debug overlay visual (cruzes vermelhas=atores, verdes=inimigos).
	- Plugin plug-and-play: escolha preset e layout, sem ajustes manuais necessários.

### Chatlog completo

Consulte: `js/plugins/chatlogs/AS_BattlePositions_chatlog.txt`


