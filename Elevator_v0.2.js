Elevatonator = {
    init: function (elevators, floors) {
        class ElevatorControl {
            elevatorIdle(elevator) {
                if (!elevator.idle) {
                    elevator.idle = true;
                    elevator.idleAt = new Date();
                    this.notifyElevators();
                }
            }
            elevatorFloorButtonPressed(elevator, floorNum) {
            }
            elevatorPassingFloor(elevator, floorNum, direction) {
            }
            elevatorStoppedAtFloor(elevator, floorNum) {
                const call = (elevator.direction === 1) ? 'upCall' : 'downCall';
                this.getFloorByNum(floorNum, (floor)=>{
                    floor[call] = false;
                })
                elevator.destinationBucket.splice(elevator.destinationBucket.indexOf(floorNum), 1);
                if (elevator.destinationBucket.length == 0) this.elevatorIdle(elevator);
            }
            elevatorMove(elevator, floorNum, endDestination = false) {
                elevator.goToFloor(floorNum);
            }
            floorUpButtonPressed(floor) {
                if (floor.upCall) floor.upAt = new Date();
                floor.upCall = true;
                this.notifyElevators();
            }
            floorDownButtonPressed(floor) {
                if (floor.downCall) floor.downAt = new Date();
                floor.downCall = true;
                this.notifyElevators();
            }
            getFloorByNum(floorNum, next) {
                const floors = this.floorBucket.filter((floor)=>{return floor.floorNum() == floorNum;});
                next(floors[0]);
            }
            idleElevators(next) {
                const a_elevators = this.elevatorBucket.filter((elevator) => {
                    return elevator.idle;
                });
                next(a_elevators);
            }
            waitingFloors(next) {
                const up_floors = this.floorBucket.filter((floor) => {
                    return floor.upCall;
                });
                const down_floors = this.floorBucket.filter((floor) => {
                    return floor.downCall;
                });
                next({ up_floors, down_floors });
            }
            checkPriority(a_elevators, a_floors, next) {
                if (a_floors.up_floors.length === 0 || a_floors.down_floors.length === 0) {
                    return (a_floors.down_floors.length === 0) ? 1 : -1;
                }
                // TODO: CHECK ELEVATOR PROXIMITY, TIME, ETC.
                // TODO: DEFINE THE ELEVATOR

                next({ direction: (a_floors.up_floors.length > a_floors.down_floors.length) ? 1 : -1 });
            }
            fetchElevator(elevator, direction) {
                elevator.idle = false;
                elevator.direction(direction);
                this.waitingFloors((o_floors) => {
                    let a_floors = (direction === 1) ? o_floors.up_floors : o_floors.down_floors;
                    a_floors = a_floors.sort((a, b) => { return (direction === 1) ? a.floorNum() - b.floorNum() : b.floorNum() - a.floorNum() });
                    this.elevatorMove(elevator, a_floors[0].floorNum(), true);
                });
            }
            notifyFloors(a_elevators) {
                this.waitingFloors((o_floors) => {
                    if (o_floors.up_floors.length > 0 || o_floors.down_floors > 0) {
                        this.checkPriority(a_elevators, o_floors, (priority) => {
                            this.fetchElevator(a_elevators[0], priority.direction);
                        });
                    }
                });
            }
            notifyElevators() {
                this.idleElevators((a_elevators) => {
                    if (a_elevators.length > 0) {
                        this.notifyFloors(a_elevators);
                    }
                });
            }
            constructor(elevators, floors) {
                this.elevatorBucket = [];
                this.floorBucket = [];

                for (let i = 0; i < elevators.length; i++) {
                    const elevator = elevators[i];
                    elevator.idle = true;
                    elevator.idleAt = new Date();
                    elevator.private_direction = 0;
                    elevator.direction = (direction) => {
                        if (!direction) return this.private_direction;
                        this.private_direction = direction;
                        const lvtr = elevator
                        lvtr.goingUpIndicator(true);
                        lvtr.goingDownIndicator(false);
                        return true;
                    };
                    elevator.break = false;
                    elevator.busy = false;
                    elevator.destinationBucket = [];
                    this.elevatorBucket.push(elevator);
                }
                for (let i = 0; i < floors.length; i++) {
                    const floor = floors[i];
                    floor.upCall = false;
                    floor.downCall = false;
                    floor.upAt = new Date();
                    floor.downAt = new Date();
                    this.floorBucket.push(floor);
                }
            }
        }
        const control = new ElevatorControl(elevators, floors);

        for (let i = 0; i < control.elevatorBucket.length; i++) {
            const elevator = control.elevatorBucket[i];
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
        for (let i = 0; i < control.floorBucket.length; i++) {
            const floor = control.floorBucket[i];
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