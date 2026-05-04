// One contact / blip on the marine radar scope.
export interface Blip {
  id: number;
  /** degrees, 0–360 */
  angle: number;
  /** distance from centre, percentage 0–100 */
  distance: number;
  /** performance.now() timestamp at spawn */
  bornAt: number;
}
