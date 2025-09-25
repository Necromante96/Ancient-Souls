# Plugins — AncientSouls

Este diretório contém plugins personalizados usados pelo projeto AncientSouls. Este README documenta o plugin

## AS_BattlePositions

- Arquivo: `js/plugins/AS_BattlePositions.js`
- Versão atual: 1.0.1
- Autor(es): Necromante96Official & GitHub Copilot
- Objetivo: ajustar a posição dos sprites de atores e inimigos em batalhas laterais (side-view) e fornecer um cálculo
	de escala automática para manter a composição relativa em resoluções diferentes da referência (1920x1080).

### Como instalar / usar

1. Coloque o plugin `AS_BattlePositions.js` em `js/plugins/`.
2. Ative o plugin no Gerenciador de Plugins do RPG Maker MZ.
3. Ajuste os parâmetros no gerenciador conforme necessário e teste em diferentes resoluções.

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

