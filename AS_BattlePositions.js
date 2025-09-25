/*:
 * @target MZ
 * @plugindesc (v1.0.0) Ajusta posições de atores e inimigos em batalha lateral para resolução 1920x1080. - AncientSouls
 * @author Necromante96Official & GitHub Copilot
 *
 * @param ActorBaseX
 * @text Actor Base X
 * @desc Posição X base dos atores (quando em casa) em px (padrão 600 para MV). Ajuste para 1920x1080.
 * @type number
 * @default 1200
 *
 * @param ActorBaseY
 * @text Actor Base Y
 * @desc Posição Y base dos atores (quando em casa) em px (padrão 280). Ajuste para 1920x1080.
 * @type number
 * @default 540
 *
 * @param ActorSpacingX
 * @text Actor Spacing X
 * @desc Espaçamento X entre atores.
 * @type number
 * @default 160
 *
 * @param ActorSpacingY
 * @text Actor Spacing Y
 * @desc Espaçamento Y entre atores.
 * @type number
 * @default 48
 *
 * @param EnemyOffsetX
 * @text Enemy Offset X
 * @desc Offset global X para inimigos.
 * @type number
 * @default 0
 *
 * @param EnemyOffsetY
 * @text Enemy Offset Y
 * @desc Offset global Y para inimigos.
 * @type number
 * @default 0
 *
 * @help
 * AS_BattlePositions.js
 * Version 1.0.0
 *
 * Este plugin permite ajustar as posições base de atores e offsets de inimigos
 * para que a batalha lateral fique correta em resoluções altas (ex: 1920x1080).
 *
 * Uso: Instale este plugin na lista de plugins. Ajuste os parâmetros conforme
 * necessário. Futuras atualizações adicionarão UI, hotkeys e presets.
 */
(() => {
    const pluginName = "AS_BattlePositions";
    const params = PluginManager.parameters(pluginName) || {};
    const ActorBaseX = Number(params.ActorBaseX || 1200);
    const ActorBaseY = Number(params.ActorBaseY || 540);
    const ActorSpacingX = Number(params.ActorSpacingX || 160);
    const ActorSpacingY = Number(params.ActorSpacingY || 48);
    const EnemyOffsetX = Number(params.EnemyOffsetX || 0);
    const EnemyOffsetY = Number(params.EnemyOffsetY || 0);

    // Guardar referência original
    const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        // Calcular posição baseada nos parâmetros
        const x = ActorBaseX + index * ActorSpacingX;
        const y = ActorBaseY + index * ActorSpacingY;
        this.setHome(x, y);
    };

    // Para inimigos, usamos o screenX/screenY do Game_Enemy; mas podemos aplicar offsets
    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        // Aplica offset global (após setHome ser chamada internamente)
        this._homeX += EnemyOffsetX;
        this._homeY += EnemyOffsetY;
        this.updatePosition();
    };
})();
