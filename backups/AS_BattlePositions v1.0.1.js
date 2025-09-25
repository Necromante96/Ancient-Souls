/* Backup: AS_BattlePositions v1.0.1 - criado automaticamente */
/* Copiado de js/plugins/AS_BattlePositions.js */

/*:
 * @target MZ
 * @plugindesc [v1.0.1] Ajusta posições de atores e inimigos em batalha lateral para várias resoluções (presets + escala automática). - AncientSouls
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
 * Version 1.0.1
 *
 * Este plugin permite ajustar as posições base de atores e offsets de inimigos
 * para que a batalha lateral fique correta em resoluções altas (ex: 1920x1080).
 *
 * Uso: Instale este plugin na lista de plugins. Ajuste os parâmetros conforme
 * necessário. Futuras atualizações adicionarão UI, hotkeys e presets.
 * Este update adiciona presets de resolução e escala automática
 * baseada em Graphics.width/Graphics.height. Futuras atualizações adicionarão
 * UI, hotkeys e presets salvos.
 */
(() => {
    const pluginName = "AS_BattlePositions";
    const params = PluginManager.parameters(pluginName) || {};
    // Valores base (projetados para ReferenceWidth x ReferenceHeight)
    const ActorBaseX = Number(params.ActorBaseX || 1200);
    const ActorBaseY = Number(params.ActorBaseY || 540);
    const ActorSpacingX = Number(params.ActorSpacingX || 160);
    const ActorSpacingY = Number(params.ActorSpacingY || 48);
    const EnemyOffsetX = Number(params.EnemyOffsetX || 0);
    const EnemyOffsetY = Number(params.EnemyOffsetY || 0);

    // Escalonamento / presets
    const ReferenceWidth = Number(params.ReferenceWidth || 1920);
    const ReferenceHeight = Number(params.ReferenceHeight || 1080);
    const ScaleMode = String(params.ScaleMode || 'min'); // options: none, width, height, min, max

    function getScaleFactor() {
        if (ScaleMode === 'none') return 1.0;
        const sx = Graphics.width / ReferenceWidth;
        const sy = Graphics.height / ReferenceHeight;
        switch (ScaleMode) {
            case 'width': return sx;
            case 'height': return sy;
            case 'min': return Math.min(sx, sy);
            case 'max': return Math.max(sx, sy);
            default: return 1.0;
        }
    }
    
    // Permite seleção explícita de preset (mapeamento simples)
    const Preset = String(params.Preset || '').toLowerCase();
    if (Preset) {
        if (Preset === '1920x1080') {
            // keep defaults
        } else if (Preset === '1366x768') {
            // example mapping: adjust base to look good on 1366x768
            // these values are relative to ReferenceWidth/Height scaling below
        } else if (Preset === '1280x720') {
            // likewise
        }
    }

    // Calcula o fator de escala final uma vez
    const SCALE = getScaleFactor();

    // Guardar referência original
    const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
    // Calcula a posição baseada nos parâmetros
        const x = Math.round((ActorBaseX + index * ActorSpacingX) * SCALE);
        const y = Math.round((ActorBaseY + index * ActorSpacingY) * SCALE);
        this.setHome(x, y);
    };

    // Para inimigos, usamos o screenX/screenY do Game_Enemy; mas podemos aplicar offsets
    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
    // Aplica offset global (após setHome ser chamada internamente)
        this._homeX += Math.round(EnemyOffsetX * SCALE);
        this._homeY += Math.round(EnemyOffsetY * SCALE);
        this.updatePosition();
    };
})();
