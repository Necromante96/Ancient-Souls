# Plugins — AncientSouls

Este diretório contém plugins personalizados usados pelo projeto AncientSouls. Este README documenta o plugin

## AS_BattlePositions

- Arquivo: `js/plugins/AS_BattlePositions.js`
- Versão atual: 1.0.2
- Autor(es): Necromante96Official & GitHub Copilot
- Objetivo: ajustar a posição dos sprites de atores e inimigos em batalhas laterais (side-view) e fornecer presets
	que calculam posições relativas usando `Graphics.width`/`Graphics.height` (modo automático) ou permitir controle
	manual via parâmetros do plugin.

### Como instalar / usar

1. Coloque o plugin `AS_BattlePositions.js` em `js/plugins/`.
2. Ative o plugin no Gerenciador de Plugins do RPG Maker MZ.
3. Configurações importantes:
	 - `Preset`: escolha uma resolução pré-definida (1920x1080, 1366x768 ou 1280x720) para cálculo automático.
	 - Se `Preset` estiver vazio, o plugin usará os parâmetros manuais (`ActorBaseX`, `ActorBaseY`, `ActorSpacingX`, etc.).
	 - Nota: nesta versão, o plugin calcula posições em runtime baseado em `Graphics.width/height` quando `Preset` está definido.
		 Não há integração automática com o menu de Opções nem persistência em `ConfigManager` nesta versão; essas features
		 podem ser adicionadas em versões futuras.

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

