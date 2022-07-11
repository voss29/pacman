export default class AnimationObject {
    
    
    #xPosition = 0;
    #yPosition = 0;
    #xDestination = 0;
    #yDestination = 0;
    #xDirection = 0;
    #yDirection = 0;
    #mainSprite = null;
    #alternateSprite = null;
    #useMainSprite = true;
    #alternationIntervalLength = 0;
    #alternationCounter = 0;


    constructor(alternationIntervalLength) {
        this.#alternationIntervalLength = alternationIntervalLength;
    }


    get xPosition() {
        return this.#xPosition;
    }


    get yPosition() {
        return this.#yPosition;
    }


    get sprite() {
        const currentSprite = (this.#useMainSprite) ? this.#mainSprite : this.#alternateSprite;
        return currentSprite;
    }


    move(distanceInPx) {
        if (!this.isAnimationComplete()) {
            this.#updateSpriteAlternation();
            let calculatedXPosition = this.#xPosition + this.#xDirection * distanceInPx;
            let calculatedYPosition = this.#yPosition + this.#yDirection * distanceInPx;
            this.#xPosition = this.#handleOverrunXDestination(calculatedXPosition);
            this.#yPosition = this.#handleOverrunYDestination(calculatedYPosition);
        }
    }


    load(movementRequest, mainSprite, alternateSprite, tileWidth, tileHeight) {
        this.#xPosition = movementRequest.xPositionStart * tileWidth;
        this.#yPosition = movementRequest.yPositionStart * tileHeight;
        this.#xDestination = movementRequest.xPositionDestination * tileWidth;
        this.#yDestination = movementRequest.yPositionDestination * tileHeight;
        this.#xDirection = movementRequest.xDirection;
        this.#yDirection = movementRequest.yDirection;
        this.#mainSprite = mainSprite;
        this.#alternateSprite = alternateSprite;
        this.#useMainSprite = true;
        this.#alternationCounter = 0;
    }


    #handleOverrunXDestination(calculatedXPosition) {
        const isMovingRight = this.#xDirection === 1;
        const isMovingLeft = this.#xDirection === -1;
        const isRightOverrun = isMovingRight && calculatedXPosition > this.#xDestination;
        const isLeftOverrun = isMovingLeft && calculatedXPosition < this.#xDestination;
        const result = (isLeftOverrun || isRightOverrun) ? this.#xDestination : calculatedXPosition;
        return result;
    }


    #handleOverrunYDestination(calculatedYPosition) {
        const isMovingTop = this.#yDirection === -1;
        const isMovingDown = this.#yDirection === 1;
        const isTopOverrun = isMovingTop && calculatedYPosition < this.#yDestination;
        const isDownOverrun = isMovingDown && calculatedYPosition > this.#yDestination;
        const result = (isTopOverrun || isDownOverrun) ? this.#yDestination : calculatedYPosition;
        return result;
    }


    isAnimationComplete() {
        const isXDestinationReached = this.#xPosition === this.#xDestination;
        const isYDestinationReached = this.#yPosition === this.#yDestination;
        return isXDestinationReached && isYDestinationReached;
    }


    #updateSpriteAlternation() {
        const isAlternationIntervalCompleted = this.#alternationCounter === this.#alternationIntervalLength;

        if (isAlternationIntervalCompleted) {
            this.#alternationCounter = 0;
            this.#useMainSprite = !this.#useMainSprite;
        } else {
            this.#alternationCounter++;
        }
    }


}