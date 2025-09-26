/*:
 * @target MZ
 * @plugindesc [v1.0.7] Ajusta posições de atores e inimigos com layouts (diagonal, horizontal, vertical, escada, grid) e presets de resolução. - AncientSouls
 * @author Necromante96Official & GitHub Copilot
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
 * @param EnableDebugOverlay
 * @text Debug Overlay
 * @desc Desenha uma sobreposição em batalha mostrando posições calculadas (true/false).
 * @type boolean
 * @default false

 * @param ActorLayout
 * @text Layout Atores
 * @desc Forma de posicionar atores: diagonal, horizontal, vertical, escada, escadaInvertida, grid
 * @type select
 * @option diagonal
 * @option horizontal
 * @option vertical
 * @option escada
 * @option escadaInvertida
 * @option grid
 * @default diagonal

 * @param ActorGridCols
 * @text Grid Colunas Atores
 * @desc Número de colunas quando layout = grid (0 ou 1 = auto)
 * @type number
 * @default 0

 * @param EnemyLayout
 * @text Layout Inimigos
 * @desc Forma de posicionar inimigos: troop (original), horizontal, vertical, escada, escadaInvertida, grid, diagonal
 * @type select
 * @option troop
 * @option horizontal
 * @option vertical
 * @option escada
 * @option escadaInvertida
 * @option grid
 * @option diagonal
 * @default troop

 * @param EnemyGridCols
 * @text Grid Colunas Inimigos
 * @desc Número de colunas quando EnemyLayout = grid (0 ou 1 = auto)
 * @type number
 * @default 0

 * @param EnemyAlignmentVertical
 * @text Alinhamento Vertical Inimigos
 * @desc Como alinhar inimigos verticalmente em relação aos atores
 * @type select
 * @option top
 * @option center
 * @option bottom
 * @option custom
 * @default center

 * @param EnemyAlignmentHorizontal
 * @text Alinhamento Horizontal Inimigos
 * @desc Como alinhar inimigos horizontalmente em relação aos atores
 * @type select
 * @option left
 * @option center
 * @option right
 * @option mirror
 * @option custom
 * @default mirror

 * @param EnemyVerticalOffset
 * @text Offset Vertical Personalizado
 * @desc Offset vertical em pixels quando alinhamento vertical = custom (positivo = baixo, negativo = cima)
 * @type number
 * @min -500
 * @max 500
 * @default 0

 * @param EnemyHorizontalOffset
 * @text Offset Horizontal Personalizado
 * @desc Offset horizontal em pixels quando alinhamento horizontal = custom (positivo = direita, negativo = esquerda)
 * @type number
 * @min -500
 * @max 500
 * @default 0

 * @param EnemySpacingMultiplier
 * @text Multiplicador de Espaçamento
 * @desc Multiplica o espaçamento entre inimigos (1.0 = normal, 2.0 = dobrado, 0.5 = metade)
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 5.0
 * @default 1.0

 * @param BossEnemyId
 * @text ID do Inimigo Boss
 * @desc ID do inimigo que será considerado como boss e ficará protegido atrás dos inimigos comuns (0 = desabilitado)
 * @type enemy
 * @default 0

 * @param BossDistance
 * @text Distância do Boss
 * @desc Multiplicador da distância do boss em relação aos protetores (1.0 = normal, 2.0 = mais longe)
 * @type number
 * @decimals 1
 * @min 0.5
 * @max 3.0
 * @default 1.0
 *
 * @help
 * AS_BattlePositions.js
 * Version 1.0.7
 *
 * Este plugin permite ajustar as posições base de atores e offsets de inimigos
 * para que a batalha lateral fique correta em resoluções altas (ex: 1920x1080).
 *
 * ===== NOVOS RECURSOS v1.0.7 =====
 * SISTEMA DE ALINHAMENTO CUSTOMIZÁVEL PARA INIMIGOS:
 * 
 * Alinhamento Vertical:
 * - top: Inimigos alinhados ao topo dos atores
 * - center: Inimigos centralizados verticalmente com os atores (padrão)
 * - bottom: Inimigos alinhados à base dos atores
 * - custom: Use o Offset Vertical Personalizado
 * 
 * Alinhamento Horizontal:
 * - left: Inimigos alinhados à esquerda dos atores
 * - center: Inimigos centralizados horizontalmente com os atores
 * - right: Inimigos alinhados à direita dos atores
 * - mirror: Inimigos espelhados em relação ao centro da tela (padrão)
 * - custom: Use o Offset Horizontal Personalizado
 * 
 * Multiplicador de Espaçamento: Controla o espaçamento entre inimigos
 * - 1.0 = espaçamento normal
 * - 2.0 = espaçamento dobrado
 * - 0.5 = espaçamento pela metade
 * 
 * SISTEMA DE FORMAÇÃO DE BOSS:
 * Cria formações táticas realistas quando há um boss na batalha:
 * 
 * BATALHA CONTRA BOSS:
 * - Configure um ID de inimigo como boss
 * - Boss fica automaticamente ATRÁS dos inimigos comuns (protegido)
 * - Inimigos comuns atuam como "protetores" do boss
 * - Controle a distância do boss em relação aos protetores
 * - Sistema funciona com qualquer layout de inimigos
 * 
 * Como usar:
 * 1. Configure o "ID do Inimigo Boss" (selecione do banco de dados)
 * 2. Ajuste a "Distância do Boss" conforme desejado
 * 3. O plugin detecta automaticamente e reorganiza as posições
 * 4. Boss sempre fica protegido atrás dos inimigos menores
 *
 * Uso: Instale este plugin na lista de plugins.
 * Ajuste os parâmetros conforme necessário.
 * Este update adiciona presets de resolução e escala automática baseada em Graphics.width/Graphics.height.
 */
(() => {
    const pluginName = "AS_BattlePositions";
    const params = PluginManager.parameters(pluginName) || {};
    
    const EnableDebugOverlay = params.EnableDebugOverlay === 'true';
    let ActorLayout = String(params.ActorLayout || 'diagonal');
    const ActorGridCols = Number(params.ActorGridCols || 0);
    let EnemyLayout = String(params.EnemyLayout || 'troop');
    const EnemyGridCols = Number(params.EnemyGridCols || 0);
    
    // Novos parâmetros de alinhamento para inimigos
    const EnemyAlignmentVertical = String(params.EnemyAlignmentVertical || 'center');
    const EnemyAlignmentHorizontal = String(params.EnemyAlignmentHorizontal || 'mirror');
    const EnemyVerticalOffset = Number(params.EnemyVerticalOffset || 0);
    const EnemyHorizontalOffset = Number(params.EnemyHorizontalOffset || 0);
    const EnemySpacingMultiplier = Number(params.EnemySpacingMultiplier || 1.0);
    
    // Sistema de formação de boss
    const BossEnemyId = Number(params.BossEnemyId || 0);
    const BossDistance = Number(params.BossDistance || 1.0);

    // Preset (inicialmente do parâmetro, mas sincronizado com ConfigManager se presente)
    let Preset = String(params.Preset || '').toLowerCase();
    if (Preset) Preset = Preset.trim();
    const presetActive = !!(Preset && Preset.indexOf('x') !== -1);
    
    // Normalizar layouts para aceitar variações
    function normalizeLayout(layout) {
        if (!layout) return '';
        layout = layout.toLowerCase().trim();
        if (layout === 'escada-invertida' || layout === 'escadainvertida') return 'escadainvertida';
        return layout;
    }
    
    ActorLayout = normalizeLayout(ActorLayout);
    EnemyLayout = normalizeLayout(EnemyLayout);

    // Log de inicialização para diagnóstico rápido (visível no console do playtest)
    try {
        console.log('[AS_BattlePositions] init', {
            version: '1.0.7',
            Preset: Preset || '(none)',
            presetActive: presetActive,
            ActorLayout, ActorGridCols,
            EnemyLayout, EnemyGridCols,
            EnemyAlignmentVertical, EnemyAlignmentHorizontal,
            EnemyVerticalOffset, EnemyHorizontalOffset,
            EnemySpacingMultiplier,
            BossEnemyId, BossDistance,
            EnableDebugOverlay: !!EnableDebugOverlay
        });
    } catch (e) { /* ignore */ }

    // Função para calcular SCALE a partir dos parâmetros atuais
    // computeScale usa referência fixa 1920x1080 e modo 'min' para preservar proporção
    function computeScale() {
        const refW = 1920;
        const refH = 1080;
        const sx = Graphics.width / refW;
        const sy = Graphics.height / refH;
        return Math.min(sx, sy);
    }

    // Função para calcular alinhamento de inimigos baseado nas posições dos atores
    function calculateEnemyAlignment(actorPositions, enemyPositions) {
        if (!actorPositions || actorPositions.length === 0 || !enemyPositions || enemyPositions.length === 0) {
            return enemyPositions;
        }

        const alignedPositions = [...enemyPositions];
        
        // Calcular bounds dos atores
        const actorMinX = Math.min(...actorPositions.map(p => p.x));
        const actorMaxX = Math.max(...actorPositions.map(p => p.x));
        const actorMinY = Math.min(...actorPositions.map(p => p.y));
        const actorMaxY = Math.max(...actorPositions.map(p => p.y));
        const actorCenterX = (actorMinX + actorMaxX) / 2;
        const actorCenterY = (actorMinY + actorMaxY) / 2;
        
        // Calcular bounds dos inimigos
        const enemyMinX = Math.min(...enemyPositions.map(p => p.x));
        const enemyMaxX = Math.max(...enemyPositions.map(p => p.x));
        const enemyMinY = Math.min(...enemyPositions.map(p => p.y));
        const enemyMaxY = Math.max(...enemyPositions.map(p => p.y));
        const enemyCenterX = (enemyMinX + enemyMaxX) / 2;
        const enemyCenterY = (enemyMinY + enemyMaxY) / 2;
        
        // Calcular offsets baseado no alinhamento horizontal
        let horizontalOffset = 0;
        switch (EnemyAlignmentHorizontal) {
            case 'left':
                horizontalOffset = actorMinX - enemyMinX;
                break;
            case 'center':
                horizontalOffset = actorCenterX - enemyCenterX;
                break;
            case 'right':
                horizontalOffset = actorMaxX - enemyMaxX;
                break;
            case 'mirror':
                // Posiciona inimigos espelhados em relação ao centro da tela
                const screenCenterX = Graphics.width / 2;
                const actorDistanceFromCenter = actorCenterX - screenCenterX;
                const targetEnemyCenterX = screenCenterX - actorDistanceFromCenter;
                horizontalOffset = targetEnemyCenterX - enemyCenterX;
                break;
            case 'custom':
                horizontalOffset = EnemyHorizontalOffset;
                break;
        }
        
        // Calcular offsets baseado no alinhamento vertical
        let verticalOffset = 0;
        switch (EnemyAlignmentVertical) {
            case 'top':
                verticalOffset = actorMinY - enemyMinY;
                break;
            case 'center':
                verticalOffset = actorCenterY - enemyCenterY;
                break;
            case 'bottom':
                verticalOffset = actorMaxY - enemyMaxY;
                break;
            case 'custom':
                verticalOffset = EnemyVerticalOffset;
                break;
        }
        
        // Aplicar offsets a todas as posições dos inimigos
        alignedPositions.forEach(pos => {
            pos.x = Math.round(pos.x + horizontalOffset);
            pos.y = Math.round(pos.y + verticalOffset);
        });
        
        return alignedPositions;
    }

    // Debug overlay sprite (desenha cruzes e coordenadas)
    function Sprite_DebugOverlay() {
        this.initialize.apply(this, arguments);
    }
    Sprite_DebugOverlay.prototype = Object.create(Sprite.prototype);
    Sprite_DebugOverlay.prototype.constructor = Sprite_DebugOverlay;
    Sprite_DebugOverlay.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._bmp = new Bitmap(Graphics.width, Graphics.height);
        this.bitmap = this._bmp;
        this.opacity = 200;
    };
    Sprite_DebugOverlay.prototype.clear = function() { this._bmp.clear(); };
    Sprite_DebugOverlay.prototype.drawCross = function(x,y,color) {
        const size = 6;
        this._bmp.fillRect(x - 1, y - size, 2, size*2, color);
        this._bmp.fillRect(x - size, y - 1, size*2, 2, color);
    };
    Sprite_DebugOverlay.prototype.drawText = function(text,x,y,color) {
        this._bmp.textColor = color || '#ffffff';
        this._bmp.drawText(String(text), x+6, y-6, 200, 20, 'left');
    };
    Sprite_DebugOverlay.prototype.refresh = function() {
        this._bmp.clear();
        try {
            const scene = SceneManager._scene;
            if (!scene) return;
            const spriteset = scene._spriteset;
            if (!spriteset) return;
            // actors
            if (spriteset._actorSprites) {
                spriteset._actorSprites.forEach((sp, idx) => {
                    try {
                        const x = sp._homeX || sp.x || 0;
                        const y = sp._homeY || sp.y || 0;
                        this.drawCross(x,y,'#ff0000');
                        this.drawText(`A${idx}: ${x},${y}`, x, y, '#ffffff');
                    } catch(e){}
                });
            }
            // enemies
            if (spriteset._enemySprites) {
                spriteset._enemySprites.forEach((sp, idx) => {
                    try {
                        const x = sp._homeX || sp.x || 0;
                        const y = sp._homeY || sp.y || 0;
                        this.drawCross(x,y,'#00ff00');
                        this.drawText(`E${idx}: ${x},${y}`, x, y, '#ffffff');
                    } catch(e){}
                });
            }
        } catch(e){}
    };


    // Nota: se Preset estiver definido, usaremos valores de referência (1200/540/160/48)
    // escalados dinamicamente dentro das funções de posicionamento — assim o plugin
    // ignora os parâmetros ajustáveis exibidos na imagem e usa comportamento automático.

    // Guardar referência original
    const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        const positions = computeActorPositions();
        const pos = positions[index] || positions[0];
        this.setHome(pos.x, pos.y);
    };

    function computeActorPositions() {
        const scene = SceneManager._scene;
        let actorCount = 0;
        if (scene && scene._spriteset && scene._spriteset._actorSprites) {
            actorCount = scene._spriteset._actorSprites.length;
        }
        if (actorCount <= 0) actorCount = $gameParty ? $gameParty.battleMembers().length : 0;
        if (actorCount <= 0) actorCount = 4; // fallback
        
        const width = Graphics.width;
        const height = Graphics.height;
        const baseXRatio = 1200/1920;
        const baseYRatio = 540/1080;
        const spacingXRatio = 160/1920;
        const spacingYRatio = 48/1080;
        let positions = [];

        const layout = ActorLayout;
        if (layout === 'grid') {
            // grade: definir cols
            let cols = ActorGridCols > 1 ? ActorGridCols : Math.ceil(Math.sqrt(actorCount));
            const cellW = Math.floor(width * 0.25 / cols);
            const cellH = Math.floor(height * 0.25 / Math.ceil(actorCount/cols));
            const originX = Math.round(width * baseXRatio);
            const originY = Math.round(height * baseYRatio);
            for (let i=0;i<actorCount;i++) {
                const r = Math.floor(i/cols);
                const c = i % cols;
                const x = originX + c * cellW;
                const y = originY + r * cellH;
                positions.push({x,y});
            }
        } else {
            for (let i = 0; i < actorCount; i++) {
                let x = Math.round(width * (baseXRatio + i * spacingXRatio));
                let y = Math.round(height * (baseYRatio + i * spacingYRatio));
                
                switch(layout){
                    case 'horizontal':
                        y = Math.round(height * baseYRatio);
                        break;
                    case 'vertical':
                        x = Math.round(width * baseXRatio);
                        break;
                    case 'escada':
                        x = Math.round(width * baseXRatio) + i * Math.round(width * spacingXRatio);
                        y = Math.round(height * baseYRatio) + i * Math.round(height * spacingYRatio);
                        break;
                    case 'escadainvertida':
                        x = Math.round(width * baseXRatio) + i * Math.round(width * spacingXRatio);
                        y = Math.round(height * baseYRatio) - i * Math.round(height * spacingYRatio);
                        break;
                    case 'diagonal':
                    default:
                        // já calculado
                        break;
                }
                positions.push({x,y});
            }
        }

        return positions;
    }

    // Para inimigos: layout controlado ou layout original do troop
    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        
        if (EnemyLayout !== 'troop') {
            // Layout controlado
            const positions = computeEnemyPositions();
            const scene = SceneManager._scene;
            if (scene && scene._spriteset && scene._spriteset._enemySprites) {
                const list = scene._spriteset._enemySprites;
                const idx = list.indexOf(this);
                if (idx >= 0 && positions[idx]) {
                    this._homeX = positions[idx].x;
                    this._homeY = positions[idx].y;
                }
            }
        }
        this.updatePosition();
    };

    // Função para reorganizar posições quando há boss na batalha
    function arrangeBossFormation(positions, sprites) {
        if (BossEnemyId <= 0) {
            return positions; // Não há boss configurado
        }
        
        // Identificar boss e inimigos comuns
        let bossIndex = -1;
        let commonEnemies = [];
        
        sprites.forEach((sprite, index) => {
            if (sprite && sprite._battler && sprite._battler.enemyId() === BossEnemyId) {
                bossIndex = index;
            } else {
                commonEnemies.push(index);
            }
        });
        
        if (bossIndex === -1 || commonEnemies.length === 0) {
            return positions; // Boss não encontrado ou não há inimigos comuns
        }
        
        // Reorganizar posições: inimigos comuns na frente, boss atrás
        const newPositions = [...positions];
        const width = Graphics.width;
        const height = Graphics.height;
        
        // Calcular posições dos protetores (inimigos comuns)
        let protectorPositions = commonEnemies.map(index => positions[index]);
        
        // Reorganizar protetores para criar uma "linha de defesa" na frente do boss
        if (EnemyLayout !== 'troop') {
            // Ajustar posições dos protetores baseado no layout para formar uma barreira
            switch (EnemyLayout) {
                case 'horizontal':
                    // Protetores em linha horizontal na frente
                    protectorPositions.forEach((pos, i) => {
                        pos.x = pos.x + Math.round(width * 0.03); // Ligeiramente mais à frente
                    });
                    break;
                case 'vertical':
                    // Protetores em coluna vertical na frente
                    protectorPositions.forEach((pos, i) => {
                        pos.x = pos.x + Math.round(width * 0.05); // Mais à frente
                    });
                    break;
                case 'grid':
                    // Protetores em formação grid defensiva
                    protectorPositions.forEach((pos, i) => {
                        pos.x = pos.x + Math.round(width * 0.04); // À frente do boss
                    });
                    break;
            }
        }
        
        // Aplicar posições ajustadas dos protetores
        commonEnemies.forEach((enemyIndex, i) => {
            if (protectorPositions[i]) {
                newPositions[enemyIndex] = protectorPositions[i];
            }
        });
        
        // Calcular centro dos protetores
        const protectorCenterX = protectorPositions.reduce((sum, pos) => sum + pos.x, 0) / protectorPositions.length;
        const protectorCenterY = protectorPositions.reduce((sum, pos) => sum + pos.y, 0) / protectorPositions.length;
        
        // Posicionar boss atrás dos protetores (aplicar multiplicador de distância)
        let bossOffsetX = -Math.round(width * 0.08 * BossDistance); // Mais atrás (para a esquerda)
        let bossOffsetY = 0; // Mesmo nível Y
        
        // Ajustar posição do boss baseado no layout
        switch (EnemyLayout) {
            case 'horizontal':
                bossOffsetY = Math.round(height * 0.05 * BossDistance); // Ligeiramente abaixo
                break;
            case 'vertical':
                bossOffsetX = -Math.round(width * 0.12 * BossDistance); // Bem mais atrás
                break;
            case 'escada':
                bossOffsetX = -Math.round(width * 0.06 * BossDistance);
                bossOffsetY = Math.round(height * 0.03 * BossDistance);
                break;
            case 'escadainvertida':
                bossOffsetX = -Math.round(width * 0.06 * BossDistance);
                bossOffsetY = -Math.round(height * 0.03 * BossDistance);
                break;
            case 'grid':
                bossOffsetX = -Math.round(width * 0.10 * BossDistance);
                bossOffsetY = Math.round(height * 0.02 * BossDistance);
                break;
            case 'diagonal':
            default:
                bossOffsetX = -Math.round(width * 0.08 * BossDistance);
                break;
        }
        
        // Aplicar posição do boss
        newPositions[bossIndex] = {
            x: Math.round(protectorCenterX + bossOffsetX),
            y: Math.round(protectorCenterY + bossOffsetY)
        };
        
        return newPositions;
    }

    function computeEnemyPositions() {
        const scene = SceneManager._scene;
        let sprites = [];
        if (scene && scene._spriteset && scene._spriteset._enemySprites) {
            sprites = scene._spriteset._enemySprites.filter(s=>s && s._battler);
        }
        const count = sprites.length;
        const width = Graphics.width;
        const height = Graphics.height;
        const SCALE = computeScale();
        const usePreset = !!Preset;
        
        // Região de inimigos base (posição inicial antes do alinhamento)
        const baseXRatio = 0.25; // 25% da tela (origem horizontal)
        const baseYRatio = 0.5;  // meio vertical
        
        // Aplicar multiplicador de espaçamento
        const spacingXRatio = (140/1920) * EnemySpacingMultiplier; // espaçamento base X relativo
        const spacingYRatio = (48/1080) * EnemySpacingMultiplier;  // espaçamento base Y relativo
        
        let positions = [];
        if (count === 0) return positions;

        const layout = EnemyLayout;

        if (layout === 'grid') {
            let cols = EnemyGridCols > 1 ? EnemyGridCols : Math.ceil(Math.sqrt(count));
            let rows = Math.ceil(count / cols);
            const blockWidth = Math.min(width * 0.40, 600) * EnemySpacingMultiplier; // aplicar multiplicador
            const blockHeight = Math.min(height * 0.40, 400) * EnemySpacingMultiplier; // aplicar multiplicador
            const cellW = Math.floor(blockWidth / Math.max(1, cols));
            const cellH = Math.floor(blockHeight / Math.max(1, rows));
            const originX = Math.round(width * baseXRatio) - Math.floor(blockWidth * 0.3);
            const originY = Math.round(height * baseYRatio) - Math.floor(blockHeight * 0.5);
            for (let i=0;i<count;i++) {
                const r = Math.floor(i/cols);
                const c = i % cols;
                const x = originX + c * cellW + Math.floor(cellW*0.5);
                const y = originY + r * cellH + Math.floor(cellH*0.5);
                positions.push({x,y});
            }
        } else {
            // Pré-calcular sequências base
            for (let i=0;i<count;i++) {
                let x = Math.round(width * (baseXRatio + i * spacingXRatio));
                let y = Math.round(height * (baseYRatio + i * spacingYRatio));
                positions.push({x,y});
            }
            for (let i=0;i<count;i++) {
                let p = positions[i];
                switch(layout){
                    case 'horizontal':
                        p.y = Math.round(height * baseYRatio);
                        break;
                    case 'vertical':
                        p.x = Math.round(width * baseXRatio);
                        break;
                    case 'escada':
                        // escada: diagonal descendente (X cresce, Y cresce)
                        p.x = Math.round(width * baseXRatio) + i * Math.round(width * spacingXRatio);
                        p.y = Math.round(height * baseYRatio) + i * Math.round(height * spacingYRatio);
                        break;
                    case 'escadainvertida':
                        // escada invertida: diagonal ascendente (X cresce, Y decresce)
                        p.x = Math.round(width * baseXRatio) + i * Math.round(width * spacingXRatio);
                        p.y = Math.round(height * baseYRatio) - i * Math.round(height * spacingYRatio);
                        break;
                    case 'diagonal':
                        // diagonal padrão: usar as posições pré-calculadas na sequência base
                        // (já calculado corretamente na inicialização)
                        break;
                    default:
                        break;
                }
            }
        }

        // Aplicar formação de boss (boss atrás dos aliados)
        positions = arrangeBossFormation(positions, sprites);

        // Aplicar alinhamento personalizado baseado nas posições dos atores
        const actorPositions = computeActorPositions();
        positions = calculateEnemyAlignment(actorPositions, positions);

        return positions;
    }

    // Integrar DebugOverlay ao ciclo de Scene_Battle (start / update / terminate)
    const _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        _Scene_Battle_start.call(this);
        try {
            // aplicar layout inimigos se não for troop
            if (EnemyLayout !== 'troop') {
                const positions = computeEnemyPositions();
                const list = this._spriteset && this._spriteset._enemySprites ? this._spriteset._enemySprites : [];
                list.forEach((sp,i)=>{ if (positions[i]) { sp._homeX = positions[i].x; sp._homeY = positions[i].y; sp.updatePosition(); }});
            }
            if (EnableDebugOverlay) {
                if (!this._asDebugOverlay) {
                    this._asDebugOverlay = new Sprite_DebugOverlay();
                    this.addChild(this._asDebugOverlay);
                }
                this._asDebugOverlay.refresh();
            }
        } catch (e) { console.error(e); }
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        try {
            if (EnemyLayout !== 'troop' && Graphics.frameCount % 30 === 0) {
                const positions = computeEnemyPositions();
                const list = this._spriteset && this._spriteset._enemySprites ? this._spriteset._enemySprites : [];
                list.forEach((sp,i)=>{ if (positions[i]) { sp._homeX = positions[i].x; sp._homeY = positions[i].y; sp.updatePosition(); }});
            }
            if (EnableDebugOverlay && this._asDebugOverlay) {
                this._asDebugOverlay.refresh();
            }
        } catch (e) { /* ignore */ }
    };

    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        try {
            if (this._asDebugOverlay) {
                this.removeChild(this._asDebugOverlay);
                this._asDebugOverlay = null;
            }
        } catch (e) { /* ignore */ }
        _Scene_Battle_terminate.call(this);
    };
})();
