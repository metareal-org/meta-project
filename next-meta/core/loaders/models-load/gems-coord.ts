type Coord = [number, number];

const CircleCoords: Coord[] = [
  [51.33743254252278, 35.699804897021586],
  [51.33739374005914, 35.69979862910345],
  [51.33736084493489, 35.69978077958544],
  [51.33733886514116, 35.699754065901395],
  [51.337331146895636, 35.69972255497406],
  [51.3373388652152, 35.699691044059186],
  [51.337360845039605, 35.699664330405206],
  [51.33739374013318, 35.69964648091726],
  [51.33743254252278, 35.69964021301158],
  [51.33747134491237, 35.69964648091726],
  [51.33750424000595, 35.699664330405206],
  [51.337526219830345, 35.699691044059186],
  [51.337531989881406, 35.699738619103954],
  [51.33751684995393, 35.69976830175409],
  [51.33748887496334, 35.69979101987844],
  [51.33745232384836, 35.699803314841425],
];

function generatePoints(start: Coord, end: Coord, numPoints: number): Coord[] {
  const points: Coord[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = start[0] * (1 - t) + end[0] * t;
    const lon = start[1] * (1 - t) + end[1] * t;
    points.push([lat, lon]);
  }
  return points;
}

const start: Coord = [51.33721243067251, 35.699717423493595];
const end: Coord = [51.339621047507194, 35.69977988092249];
let points: Coord[] = generatePoints(start, end, 40);

const indicesToRemove: number[] = [2, 3, 4, 5];
points = points.filter((_, index) => !indicesToRemove.includes(index));

const result: Coord[] = [...CircleCoords, ...points];
export const GemCoords: Coord[] = result;