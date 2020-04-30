import { PhysicalObject2D, BaseTypes } from 'lance-gg';

let game = null;
let p2 = null;

export default class Ship extends PhysicalObject2D {

    static get netScheme() {
        return Object.assign({
            lives: { type: BaseTypes.TYPES.INT8 },
            won: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }

    // no position bending if difference is larger than 4.0 (i.e. wrap beyond bounds),
    // no angular velocity bending, no local angle bending
    get bending() {
        return {
            position: { max: 4.0 },
            angularVelocity: { percent: 0.0 },
            angleLocal: { percent: 0.0 }
        };
    }

    onAddToWorld(gameEngine) {
        game = gameEngine;
        p2 = gameEngine.physicsEngine.p2;

        // Add ship physics
        let shape = this.shape = new p2.Convex({
            vertices: [[game.shipSize*0.6, -game.shipSize], [0, game.shipSize], [-game.shipSize*0.6, -game.shipSize]],
            radius: game.shipSize,
            collisionGroup: game.SHIP, // Belongs to the SHIP group
            collisionMask: game.ASTEROID | game.FINISHLINE // Only collide with the ASTEROID group
        });
        this.physicsObj = new p2.Body({
            mass: 1,
            position: [this.position.x, this.position.y],
            angle: this.angle,
            damping: .7, angularDamping: .7 });
        this.physicsObj.addShape(shape);
        gameEngine.physicsEngine.world.addBody(this.physicsObj);
    }

    onRemoveFromWorld(gameEngine) {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    toString() {
        return `Ship::${super.toString()} lives=${this.lives}`;
    }

    syncTo(other) {
        super.syncTo(other);
        this.lives = other.lives;
        this.won = other.won;
    }
}
