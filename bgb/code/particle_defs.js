import ParticleClass from '../../rpjs/engine/particle.js';

export default class ParticleDefsClass {
    
    static EXPLODE_RED_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:35,
        endSize:200,
        startAlpha:0.4,
        endAlpha:0.01,
        initialMoveX:8,
        initialMoveY:8,
        moveXFactor:0.3,
        moveYFactor:0.3,
        imageName:'particles/explode_red',
        count:16,
        rotateFactor:0.3,
        reverse:false,
        lifeTick:33
    };
    
    static EXPLODE_ORANGE_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:25,
        endSize:140,
        startAlpha:0.5,
        endAlpha:0.01,
        initialMoveX:6,
        initialMoveY:6,
        moveXFactor:0.15,
        moveYFactor:0.15,
        imageName:'particles/explode_orange',
        count:8,
        rotateFactor:0.25,
        reverse:false,
        lifeTick:31
    };
    
    static EXPLODE_YELLOW_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:15,
        endSize:50,
        startAlpha:0.6,
        endAlpha:0.01,
        initialMoveX:2,
        initialMoveY:2,
        moveXFactor:0.05,
        moveYFactor:0.05,
        imageName:'particles/explode_yellow',
        count:2,
        rotateFactor:0.2,
        reverse:false,
        lifeTick:29
    };
    
    static EXPLODE_SMOKE_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:1,
        endSize:300,
        startAlpha:0.4,
        endAlpha:0.01,
        initialMoveX:8,
        initialMoveY:8,
        moveXFactor:0.001,
        moveYFactor:0.001,
        imageName:'particles/smoke',
        count:8,
        rotateFactor:0.1,
        reverse:false,
        lifeTick:50
    };
    
    static BREAK_BLOCK_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:16,
        endSize:16,
        startAlpha:1.0,
        endAlpha:0.1,
        initialMoveX:5,
        initialMoveY:5,
        moveXFactor:1.3,
        moveYFactor:1.3,
        imageName:'particles/block',
        count:10,
        rotateFactor:0.5,
        reverse:false,
        lifeTick:48
    };
    
    static CLOUD_POP_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:64,
        endSize:96,
        startAlpha:0.6,
        endAlpha:0.001,
        initialMoveX:24,
        initialMoveY:24,
        moveXFactor:0.0,
        moveYFactor:0.0,
        imageName:'particles/smoke',
        count:8,
        rotateFactor:0.1,
        reverse:false,
        lifeTick:30
    };
    
    static WARP_OUT_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:8,
        endSize:8,
        startAlpha:1.0,
        endAlpha:0.01,
        initialMoveX:24,
        initialMoveY:10,
        moveXFactor:-0.005,
        moveYFactor:0.8,
        imageName:'particles/ball',
        count:200,
        rotateFactor:0.5,
        reverse:false,
        lifeTick:160
    };
    
    static BALL_BREAK_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:8,
        endSize:8,
        startAlpha:1.0,
        endAlpha:0.1,
        initialMoveX:4,
        initialMoveY:4,
        moveXFactor:0.5,
        moveYFactor:0.5,
        imageName:'particles/ball',
        count:16,
        rotateFactor:0.5,
        reverse:false,
        lifeTick:30
    };
    
    static BALL_REFORM_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:8,
        endSize:16,
        startAlpha:1.0,
        endAlpha:0.1,
        initialMoveX:6,
        initialMoveY:6,
        moveXFactor:0.5,
        moveYFactor:0.5,
        imageName:'particles/ball',
        count:16,
        rotateFactor:0.5,
        reverse:true,
        lifeTick:24
    };

    static DRAIN_PIPE_BREAK_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:16,
        endSize:16,
        startAlpha:1.0,
        endAlpha:0.1,
        initialMoveX:5,
        initialMoveY:5,
        moveXFactor:0.8,
        moveYFactor:0.8,
        imageName:'particles/pipe',
        count:10,
        rotateFactor:0.5,
        reverse:false,
        lifeTick:48
    };
    
    static FISH_KILL_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:8,
        endSize:8,
        startAlpha:1.0,
        endAlpha:0.1,
        initialMoveX:2,
        initialMoveY:2,
        moveXFactor:0.5,
        moveYFactor:0.5,
        imageName:'particles/fish',
        count:8,
        rotateFactor:0.5,
        reverse:false,
        lifeTick:30
    };
    static SHURIKIN_BREAK_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:8,
        endSize:2,
        startAlpha:1.0,
        endAlpha:0.1,
        initialMoveX:2,
        initialMoveY:2,
        moveXFactor:0.3,
        moveYFactor:0.3,
        imageName:'particles/ball',
        count:8,
        rotateFactor:0.7,
        reverse:false,
        lifeTick:30
    };
    
    static MONSTER_KILL_SMOKE_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:64,
        endSize:96,
        startAlpha:0.6,
        endAlpha:0.001,
        initialMoveX:24,
        initialMoveY:24,
        moveXFactor:0.0,
        moveYFactor:0.0,
        imageName:'particles/smoke',
        count:8,
        rotateFactor:0.1,
        reverse:false,
        lifeTick:36
    };
    
    static AXE_SHATTER_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:50,
        endSize:10,
        startAlpha:1.0,
        endAlpha:0.1,
        initialMoveX:8,
        initialMoveY:8,
        moveXFactor:0.8,
        moveYFactor:0.8,
        imageName:'particles/ball',
        count:24,
        rotateFactor:0.5,
        reverse:false,
        lifeTick:18
    };
    
    static JET_RED_PARTICLE={
        layer:ParticleClass.BEFORE_SPRITES_LAYER,
        startSize:100,
        endSize:35,
        startAlpha:0.6,
        endAlpha:0.01,
        initialMoveX:8,
        initialMoveY:8,
        moveXFactor:0.3,
        moveYFactor:0.3,
        imageName:'particles/explode_red',
        count:16,
        rotateFactor:0.3,
        reverse:false,
        lifeTick:30
    };
    
    static JET_ORANGE_PARTICLE={
        layer:ParticleClass.BEFORE_SPRITES_LAYER,
        startSize:90,
        endSize:25,
        startAlpha:0.6,
        endAlpha:0.01,
        initialMoveX:8,
        initialMoveY:8,
        moveXFactor:0.3,
        moveYFactor:0.3,
        imageName:'particles/explode_orange',
        count:16,
        rotateFactor:0.4,
        reverse:false,
        lifeTick:36
    };
    
    static JET_YELLOW_PARTICLE={
        layer:ParticleClass.BEFORE_SPRITES_LAYER,
        startSize:80,
        endSize:15,
        startAlpha:0.6,
        endAlpha:0.01,
        initialMoveX:8,
        initialMoveY:8,
        moveXFactor:0.3,
        moveYFactor:0.3,
        imageName:'particles/explode_yellow',
        count:16,
        rotateFactor:0.5,
        reverse:false,
        lifeTick:42
    };
    
    static BOSS_KILL_PARTICLE={
        layer:ParticleClass.AFTER_SPRITES_LAYER,
        startSize:10,
        endSize:220,
        startAlpha:1.0,
        endAlpha:0.5,
        initialMoveX:0.3,
        initialMoveY:0.3,
        moveXFactor:10,
        moveYFactor:10,
        imageName:'particles/skull',
        count:25,
        rotateFactor:0.1,
        reverse:false,
        lifeTick:160
    };


}
