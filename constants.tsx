
import { Whisky } from './types';

export const DIAGEO_WHISKIES: Whisky[] = [
  { id: 'lag-16', name: 'Lagavulin 16 Year Old', distillery: 'Lagavulin', region: 'Islay', bottleSizeCl: 70 },
  { id: 'tal-10', name: 'Talisker 10 Year Old', distillery: 'Talisker', region: 'Isle of Skye', bottleSizeCl: 70 },
  { id: 'oban-14', name: 'Oban 14 Year Old', distillery: 'Oban', region: 'Highland', bottleSizeCl: 70 },
  { id: 'dal-15', name: 'Dalwhinnie 15 Year Old', distillery: 'Dalwhinnie', region: 'Highland', bottleSizeCl: 70 },
  { id: 'ci-12', name: 'Caol Ila 12 Year Old', distillery: 'Caol Ila', region: 'Islay', bottleSizeCl: 70 },
  { id: 'mort-16', name: 'Mortlach 16 Year Old', distillery: 'Mortlach', region: 'Speyside', bottleSizeCl: 70 },
  { id: 'sing-12', name: 'The Singleton of Dufftown 12', distillery: 'Dufftown', region: 'Speyside', bottleSizeCl: 70 },
  { id: 'jw-black', name: 'Johnnie Walker Black Label', distillery: 'Johnnie Walker', region: 'Blend', bottleSizeCl: 70 },
  { id: 'jw-blue', name: 'Johnnie Walker Blue Label', distillery: 'Johnnie Walker', region: 'Blend', bottleSizeCl: 70 },
  { id: 'cl-12', name: 'Clynelish 14 Year Old', distillery: 'Clynelish', region: 'Highland', bottleSizeCl: 70 },
  { id: 'crag-12', name: 'Cragganmore 12 Year Old', distillery: 'Cragganmore', region: 'Speyside', bottleSizeCl: 70 },
  { id: 'glend-12', name: 'Glendullan 12 Year Old', distillery: 'Glendullan', region: 'Speyside', bottleSizeCl: 70 },
];

export const BOTTLE_UNIT_CL = 70;
export const CL_STEP = 10;
