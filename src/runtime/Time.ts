import Unit from "../nodes/Unit";
import Measurement from "./Measurement";
import Stream from "./Stream";

export default class Time extends Stream {

    times: number[] = [];
    timerID: NodeJS.Timer;

    constructor() {
        super({"eng": "⏱"}, new Measurement(Date.now(), new Unit(["ms"])));

        // Tick every 33 milliseconds, trying to achieve a 30 fps frame rate.
        this.timerID = setInterval(() => this.tick(), 33);

    }

    tick() {
        this.add(new Measurement(Date.now(), new Unit(["ms"])));
    }

    stop() {

        // Stop the timer.
        clearInterval(this.timerID);

    }

}