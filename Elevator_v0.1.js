a =
{
    init: function (elevators, floors) {
        class ElevatorControl {
            elevatorIdle(elevator) {
                // if (elevator.currentFloor() == 0) {
                //     this.elevatorMove(elevator, this.a_floors.length - 1);
                // } else {
                //     this.elevatorMove(elevator, 0);
                // }
                this.availableElevators.push(elevator);
                this.sendAvailable();
            }
            elevatorFloorButtonPressed(elevator, floorNum) {
                if (elevator.currentFloor() < floorNum) {
                    if (!this.upBucket.includes(floorNum)) this.upBucket.push(floorNum);
                }
                if (elevator.currentFloor() > floorNum) {
                    if (!this.downBucket.includes(floorNum)) this.downBucket.push(floorNum);
                }
            }
            elevatorPassingFloor(elevator, floorNum, direction) {
                if (elevator.loadFactor() <= 0.8 || elevator.getPressedFloors().includes(floorNum)) {
                    switch (direction) {
                        case 'up':
                            if (this.upBucket.includes(floorNum)) {
                                elevator.goingUpIndicator(true);
                                elevator.goingDownIndicator(false);
                                elevator.stop()
                                this.elevatorMove(elevator, floorNum);
                                this.upBucket.splice(this.upBucket.indexOf(floorNum), 1);
                            }
                            break;
                        case 'down':
                            if (this.downBucket.includes(floorNum)) {
                                elevator.goingUpIndicator(false);
                                elevator.goingDownIndicator(true);
                                elevator.stop()
                                this.elevatorMove(elevator, floorNum);
                                this.downBucket.splice(this.downBucket.indexOf(floorNum), 1);
                            }
                            break;
                    }
                }
            }
            elevatorStoppedAtFloor(elevator, floorNum) {
                if (floorNum == 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                }
                if (floorNum == this.a_floors.length - 1) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                }
            }
            elevatorMove(elevator, floorNum, endDestination = false) {
                if (endDestination) elevator.destination = floorNum;
                elevator.goToFloor(floorNum);
                if (elevator.destination != floorNum) elevator.goToFloor(elevator.destination);
            }
            floorUpButtonPressed(floor) {
                if (!this.upBucket.includes(floor.level)) this.upBucket.push(floor.level);
                this.sendAvailable('up');
            }
            floorDownButtonPressed(floor) {
                if (!this.downBucket.includes(floor.level)) this.downBucket.push(floor.level);
                this.sendAvailable('down');
            }
            sendAvailable(direction) {
                const elevator = this.availableElevators.pop();
                if (elevator) {
                    switch (direction) {
                        case 'down':
                            elevator.goingDownIndicator(true);
                            elevator.goingUpIndicator(false);
                            this.elevatorMove(elevator, this.downBucket.splice(0, 1), true);
                            break;
                        default:
                            if (this.upBucket.length > 0) {
                                elevator.goingDownIndicator(false);
                                elevator.goingUpIndicator(true);
                                this.elevatorMove(elevator, this.upBucket.splice(0, 1), true);
                            } else {
                                elevator.goingDownIndicator(true);
                                elevator.goingUpIndicator(false);
                                this.elevatorMove(elevator, this.downBucket.splice(0, 1), true);
                            }
                            break;
                    }
                }
            }
            constructor() {
                this.a_elevators = elevators;
                this.a_floors = floors;
                this.upBucket = [];
                this.downBucket = [];
                this.availableElevators = [];
            }
        }
        const control = new ElevatorControl();

        for (let i = 0; i < control.a_elevators.length; i++) {
            const elevator = control.a_elevators[i];
            elevator.on("idle", () => {
                control.elevatorIdle(elevator);
            });
            elevator.on("floor_button_pressed", (floorNum) => {
                control.elevatorFloorButtonPressed(elevator, floorNum);
            });
            elevator.on("passing_floor", (floorNum, direction) => {
                control.elevatorPassingFloor(elevator, floorNum, direction);
            });
            elevator.on("stopped_at_floor", (floorNum) => {
                control.elevatorStoppedAtFloor(elevator, floorNum);
            });
        }
        for (let i = 0; i < control.a_floors.length; i++) {
            const floor = control.a_floors[i];
            floor.on("up_button_pressed", () => {
                control.floorUpButtonPressed(floor);
            });
            floor.on("down_button_pressed", () => {
                control.floorDownButtonPressed(floor);
            });
        }
    },
    update: function (dt, elevators, floors) { }
}