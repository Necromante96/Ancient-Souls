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
 * @param Preset
 * @text Preset de Resolução
 * @desc Preset de resolução (1920x1080, 1366x768, 1280x720). Se preenchido, ajusta valores base relativos.
 * @type select
 * @option 
 * @option 1920x1080
 * @option 1366x768
 * @option 1280x720
 * @default 
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
    let ActorBaseX = Number(params.ActorBaseX || 1200);
    let ActorBaseY = Number(params.ActorBaseY || 540);
    let ActorSpacingX = Number(params.ActorSpacingX || 160);
    let ActorSpacingY = Number(params.ActorSpacingY || 48);
    let EnemyOffsetX = Number(params.EnemyOffsetX || 0);
    let EnemyOffsetY = Number(params.EnemyOffsetY || 0);

    // Preset (se preenchido, ignora os parâmetros do gerenciador e usa valores de referência)
    let Preset = String(params.Preset || '').toLowerCase();

    // Função para calcular SCALE a partir dos parâmetros atuais
    // computeScale usa referência fixa 1920x1080 e modo 'min' para preservar proporção
    function computeScale() {
        const refW = 1920;
        const refH = 1080;
        const sx = Graphics.width / refW;
        const sy = Graphics.height / refH;
        return Math.min(sx, sy);
    }

    // Nota: se Preset estiver definido, usaremos valores de referência (1200/540/160/48)
    // escalados dinamicamente dentro das funções de posicionamento — assim o plugin
    // ignora os parâmetros ajustáveis exibidos na imagem e usa comportamento automático.

    // Guardar referência original
    const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        // Se Preset definido, usar valores de referência escalados automaticamente
        if (Preset) {
            // Use ratios relative to screen size (derived from 1920x1080 reference)
            const baseXRatio = 1200 / 1920; // 0.625
            const baseYRatio = 540 / 1080;  // 0.5
            const spacingXRatio = 160 / 1920; // ~0.08333
            const spacingYRatio = 48 / 1080;  // ~0.04444
            const x = Math.round(Graphics.width * baseXRatio + index * Graphics.width * spacingXRatio);
            const y = Math.round(Graphics.height * baseYRatio + index * Graphics.height * spacingYRatio);
            this.setHome(x, y);
            return;
        }
        // Caso contrário, usa os parâmetros definidos no Gerenciador de Plugins
        const x = Math.round((ActorBaseX + index * ActorSpacingX) * SCALE);
        const y = Math.round((ActorBaseY + index * ActorSpacingY) * SCALE);
        this.setHome(x, y);
    };

    // Para inimigos, usamos o screenX/screenY do Game_Enemy; mas podemos aplicar offsets
    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        // Aplica offset global (após setHome ser chamada internamente)
        const SCALE = computeScale();
        if (Preset) {
            // enemy offsets relative to screen ratios (defaults are zero)
            const enemyOffsetXRatio = EnemyOffsetX ? (EnemyOffsetX / 1920) : 0;
            const enemyOffsetYRatio = EnemyOffsetY ? (EnemyOffsetY / 1080) : 0;
            this._homeX += Math.round(Graphics.width * enemyOffsetXRatio);
            this._homeY += Math.round(Graphics.height * enemyOffsetYRatio);
        } else {
            this._homeX += Math.round(EnemyOffsetX * SCALE);
            this._homeY += Math.round(EnemyOffsetY * SCALE);
        }
        this.updatePosition();
    };
})();
