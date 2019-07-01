import { fromEvent } from "rxjs";
import { filter, map, mergeMap, takeUntil } from "rxjs/operators";
import "./styles.css";

type Coords = { x: number; y: number };

const square: HTMLElement = document.querySelector("#square");

const mousedowns = fromEvent<MouseEvent>(square, "mousedown");
const mousemoves = fromEvent<MouseEvent>(document.body, "mousemove");
const mouseups = fromEvent<MouseEvent>(square, "mouseup");

// const dragEvents = mousemoves.pipe(
//   skipUntil(mousedowns),
//   takeUntil(mouseups),
//   repeat()
// );

const dragEvents = mousedowns.pipe(
  mergeMap(() => mousemoves.pipe(takeUntil(mouseups)))
);

const dragCoords = dragEvents.pipe(
  map(e => ({
    x: e.clientX,
    y: e.clientY
  })),
  filter(({ x, y }) => {
    if (x < 50 || x + 50 > window.innerWidth) {
      return false;
    }

    if (y < 50 || y + 50 > window.innerHeight) {
      return false;
    }

    return true;
  })
);

dragCoords.subscribe(moveSquare);

function moveSquare({ x, y }: Coords) {
  square.style.transform = `translate(${x - 50}px, ${y - 50}px)`;
}
